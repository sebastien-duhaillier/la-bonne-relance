from datetime import datetime, timedelta
from typing import Any

from supabase import Client

from app.database import get_supabase_client


def _parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _get_delay(delay_value: int, delay_unit: str) -> timedelta:
    if delay_unit == "minutes":
        return timedelta(minutes=delay_value)

    if delay_unit == "hours":
        return timedelta(hours=delay_value)

    return timedelta(days=delay_value)


def _render_template(
    template: str,
    prospect: dict[str, Any],
) -> str:
    full_name = str(prospect.get("name") or "").strip()
    company = str(prospect.get("company") or "").strip()

    name_parts = full_name.split(maxsplit=1)
    first_name = name_parts[0] if name_parts else ""
    last_name = name_parts[1] if len(name_parts) > 1 else ""

    variables = {
        "{{prenom}}": first_name,
        "{{nom}}": last_name,
        "{{nom_complet}}": full_name,
        "{{entreprise}}": company,
    }

    rendered_text = template

    for variable, replacement in variables.items():
        rendered_text = rendered_text.replace(
            variable,
            replacement,
        )

    return rendered_text


def _mark_enrollment_failed(
    supabase: Client,
    enrollment_id: str,
    reason: str,
) -> None:
    supabase.table("automation_enrollments").update(
        {
            "status": "failed",
            "stop_reason": reason[:1000],
        },
    ).eq("id", enrollment_id).execute()


def schedule_pending_enrollments() -> dict[str, int]:
    supabase = get_supabase_client()

    response = (
        supabase.table("automation_enrollments")
        .select(
            """
            id,
            user_id,
            enrolled_at,
            automations (
              id,
              name,
              is_active,
              automation_steps (
                id,
                position,
                delay_value,
                delay_unit,
                subject,
                body
              )
            ),
            prospects (
              id,
              name,
              company,
              email
            )
            """,
        )
        .eq("status", "pending")
        .execute()
    )

    enrollments = response.data or []

    result = {
        "processed": 0,
        "scheduled": 0,
        "failed": 0,
        "stopped": 0,
    }

    for enrollment in enrollments:
        enrollment_id = str(enrollment["id"])
        result["processed"] += 1

        try:
            automation = enrollment.get("automations")
            prospect = enrollment.get("prospects")

            if not isinstance(automation, dict):
                raise ValueError(
                    "Automatisation introuvable.",
                )

            if not isinstance(prospect, dict):
                raise ValueError(
                    "Prospect introuvable.",
                )

            if not automation.get("is_active"):
                supabase.table(
                    "automation_enrollments",
                ).update(
                    {
                        "status": "stopped",
                        "stop_reason":
                            "L’automatisation est inactive.",
                        "stopped_at":
                            datetime.now().astimezone().isoformat(),
                    },
                ).eq("id", enrollment_id).execute()

                result["stopped"] += 1
                continue

            recipient_email = str(
                prospect.get("email") or "",
            ).strip()

            if not recipient_email:
                raise ValueError(
                    "Le prospect ne possède pas d’adresse e-mail.",
                )

            steps = automation.get("automation_steps") or []

            if not isinstance(steps, list) or not steps:
                raise ValueError(
                    "L’automatisation ne possède aucune étape.",
                )

            ordered_steps = sorted(
                steps,
                key=lambda step: int(step["position"]),
            )

            enrolled_at = _parse_datetime(
                str(enrollment["enrolled_at"]),
            )

            scheduled_emails = []

            for step in ordered_steps:
                scheduled_for = enrolled_at + _get_delay(
                    int(step["delay_value"]),
                    str(step["delay_unit"]),
                )

                scheduled_emails.append(
                    {
                        "user_id": enrollment["user_id"],
                        "enrollment_id": enrollment_id,
                        "automation_step_id": step["id"],
                        "prospect_id": prospect["id"],
                        "recipient_email": recipient_email,
                        "subject": _render_template(
                            str(step["subject"]),
                            prospect,
                        ),
                        "body": _render_template(
                            str(step["body"]),
                            prospect,
                        ),
                        "scheduled_for":
                            scheduled_for.isoformat(),
                        "status": "pending",
                    },
                )

            (
                supabase.table("scheduled_emails")
                .upsert(
                    scheduled_emails,
                    on_conflict=(
                        "enrollment_id,automation_step_id"
                    ),
                    ignore_duplicates=True,
                )
                .execute()
            )

            (
                supabase.table("automation_enrollments")
                .update(
                    {
                        "status": "active",
                        "current_step_position": 1,
                    },
                )
                .eq("id", enrollment_id)
                .execute()
            )

            (
                supabase.table("activities")
                .insert(
                    {
                        "user_id": enrollment["user_id"],
                        "prospect_id": prospect["id"],
                        "automation_id": automation["id"],
                        "activity_type":
                            "automation_enrolled",
                        "title":
                            "Prospect inscrit à une automatisation",
                        "description": (
                            f"Inscription à la séquence "
                            f"« {automation['name']} »."
                        ),
                    },
                )
                .execute()
            )

            result["scheduled"] += len(scheduled_emails)

        except Exception as error:
            _mark_enrollment_failed(
                supabase,
                enrollment_id,
                str(error),
            )

            result["failed"] += 1

    return result