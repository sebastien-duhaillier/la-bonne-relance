from datetime import datetime, timezone
from typing import Any

import httpx
from supabase import Client

from app.config import get_settings
from app.database import get_supabase_client


BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email"
DEFAULT_BATCH_SIZE = 25


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _send_with_brevo(
    recipient_email: str,
    subject: str,
    body: str,
) -> str:
    settings = get_settings()

    payload = {
        "sender": {
            "name": settings.brevo_sender_name,
            "email": settings.brevo_sender_email,
        },
        "to": [
            {
                "email": recipient_email,
            },
        ],
        "subject": subject,
        "textContent": body,
    }

    headers = {
        "accept": "application/json",
        "api-key": settings.brevo_api_key.get_secret_value(),
        "content-type": "application/json",
    }

    with httpx.Client(timeout=20.0) as client:
        response = client.post(
            BREVO_EMAIL_URL,
            json=payload,
            headers=headers,
        )

    if not response.is_success:
        raise RuntimeError(
            f"Erreur Brevo {response.status_code}: "
            f"{response.text[:500]}"
        )

    response_data = response.json()
    message_id = response_data.get("messageId")

    if not message_id:
        raise RuntimeError(
            "Brevo n’a retourné aucun identifiant de message."
        )

    return str(message_id)


def _claim_email(
    supabase: Client,
    email: dict[str, Any],
) -> bool:
    email_id = str(email["id"])
    attempts = int(email.get("attempts") or 0)

    response = (
        supabase.table("scheduled_emails")
        .update(
            {
                "status": "processing",
                "attempts": attempts + 1,
                "last_error": None,
            }
        )
        .eq("id", email_id)
        .eq("status", "pending")
        .execute()
    )

    return bool(response.data)


def _mark_email_sent(
    supabase: Client,
    email_id: str,
    provider_message_id: str,
) -> None:
    (
        supabase.table("scheduled_emails")
        .update(
            {
                "status": "sent",
                "provider_message_id": provider_message_id,
                "sent_at": _utc_now().isoformat(),
                "last_error": None,
            }
        )
        .eq("id", email_id)
        .execute()
    )


def _mark_email_failed(
    supabase: Client,
    email_id: str,
    error: Exception,
) -> None:
    (
        supabase.table("scheduled_emails")
        .update(
            {
                "status": "failed",
                "last_error": str(error)[:1000],
            }
        )
        .eq("id", email_id)
        .execute()
    )


def send_due_emails(
    batch_size: int = DEFAULT_BATCH_SIZE,
) -> dict[str, int]:
    supabase = get_supabase_client()
    now = _utc_now().isoformat()

    response = (
        supabase.table("scheduled_emails")
        .select(
            """
            id,
            recipient_email,
            subject,
            body,
            attempts
            """
        )
        .eq("status", "pending")
        .lte("scheduled_for", now)
        .order("scheduled_for")
        .limit(batch_size)
        .execute()
    )

    scheduled_emails = response.data or []

    result = {
        "processed": 0,
        "sent": 0,
        "failed": 0,
        "skipped": 0,
    }

    for email in scheduled_emails:
        email_id = str(email["id"])

        if not _claim_email(supabase, email):
            result["skipped"] += 1
            continue

        result["processed"] += 1

        try:
            provider_message_id = _send_with_brevo(
                recipient_email=str(email["recipient_email"]),
                subject=str(email["subject"]),
                body=str(email["body"]),
            )

            _mark_email_sent(
                supabase,
                email_id,
                provider_message_id,
            )

            result["sent"] += 1

        except Exception as error:
            _mark_email_failed(
                supabase,
                email_id,
                error,
            )

            result["failed"] += 1

    return result