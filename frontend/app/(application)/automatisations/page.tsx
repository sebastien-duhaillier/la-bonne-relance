import Link from "next/link";

import { setAutomationActive } from "@/app/(application)/automatisations/actions";
import { createClient } from "@/lib/supabase/server";

type AutomationStepRow = {
  id: string;
  position: number;
  delay_value: number;
  delay_unit: string;
  subject: string;
};

type AutomationEnrollmentRow = {
  id: string;
  status: string;
};

type AutomationRow = {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  is_active: boolean;
  stop_on_reply: boolean;
  automation_steps: AutomationStepRow[];
  automation_enrollments: AutomationEnrollmentRow[];
};

const triggerLabels: Record<string, string> = {
  manual: "Ajout manuel du prospect",
  new_prospect: "Création d’un prospect",
  status_contacted: "Statut modifié en « Contacté »",
  status_proposal: "Statut modifié en « Proposition »",
  inactive_30_days: "Aucune activité depuis 30 jours",
};

function formatDelay(value: number, unit: string) {
  if (value === 0) {
    return "Immédiatement";
  }

  const unitLabels: Record<string, [string, string]> = {
    minutes: ["minute", "minutes"],
    hours: ["heure", "heures"],
    days: ["jour", "jours"],
  };

  const labels = unitLabels[unit] ?? [unit, unit];
  const label = value > 1 ? labels[1] : labels[0];

  return `Après ${value} ${label}`;
}

export default async function AutomationsPage() {
  const supabase = await createClient();

  const [
    { data, error },
    { count: plannedEmails, error: plannedEmailsError },
  ] = await Promise.all([
    supabase
      .from("automations")
      .select(
        `
          id,
          name,
          description,
          trigger_type,
          is_active,
          stop_on_reply,
          automation_steps (
            id,
            position,
            delay_value,
            delay_unit,
            subject
          ),
          automation_enrollments (
            id,
            status
          )
        `,
      )
      .order("created_at", { ascending: false })
      .order("position", {
        referencedTable: "automation_steps",
        ascending: true,
      }),

    supabase
      .from("scheduled_emails")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "pending"),
  ]);

  if (error) {
    throw new Error(
      `Impossible de récupérer les automatisations : ${error.message}`,
    );
  }

  if (plannedEmailsError) {
    throw new Error(
      `Impossible de compter les e-mails planifiés : ${plannedEmailsError.message}`,
    );
  }

  const automations = (data ?? []) as AutomationRow[];

  const activeAutomations = automations.filter(
    (automation) => automation.is_active,
  ).length;

  const enrolledProspects = automations.reduce(
    (total, automation) =>
      total +
      automation.automation_enrollments.filter(
        (enrollment) =>
          enrollment.status === "pending" ||
          enrollment.status === "active",
      ).length,
    0,
  );

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Communication
          </p>

          <h1 className="mt-1 text-3xl font-bold text-foreground">
            Automatisations
          </h1>

          <p className="mt-2 max-w-2xl text-muted">
            Préparez des séquences d’e-mails et définissez leurs conditions de
            déclenchement.
          </p>
        </div>

        <Link
          href="/automatisations/nouvelle"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-sm hover:bg-primary-hover"
        >
          Nouvelle automatisation
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-muted">
            Séquences actives
          </p>

          <p className="mt-2 text-3xl font-bold text-foreground">
            {activeAutomations}
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-muted">
            Prospects inscrits
          </p>

          <p className="mt-2 text-3xl font-bold text-foreground">
            {enrolledProspects}
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-muted">
            E-mails planifiés
          </p>

          <p className="mt-2 text-3xl font-bold text-foreground">
            {plannedEmails ?? 0}
          </p>
        </article>
      </div>

      {automations.length > 0 ? (
        <div className="space-y-6">
          {automations.map((automation) => {
            const enrolledCount =
              automation.automation_enrollments.filter(
                (enrollment) =>
                  enrollment.status === "pending" ||
                  enrollment.status === "active",
              ).length;

            const toggleAutomation = setAutomationActive.bind(
              null,
              automation.id,
              !automation.is_active,
            );

            return (
              <article
                key={automation.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
              >
                <header className="flex flex-col gap-5 border-b border-border p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-foreground">
                        {automation.name}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          automation.is_active
                            ? "bg-success/10 text-success"
                            : "bg-surface-muted text-muted"
                        }`}
                      >
                        {automation.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    {automation.description && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                        {automation.description}
                      </p>
                    )}
                  </div>

                  <form action={toggleAutomation}>
                    <button
                      type="submit"
                      role="switch"
                      aria-checked={automation.is_active}
                      aria-label={`${
                        automation.is_active
                          ? "Désactiver"
                          : "Activer"
                      } ${automation.name}`}
                      className={`relative h-7 w-12 rounded-full transition-colors ${
                        automation.is_active
                          ? "bg-primary"
                          : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${
                          automation.is_active
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </form>
                </header>

                <div className="grid gap-6 p-6 lg:grid-cols-[260px_1fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Déclenchement
                    </p>

                    <p className="mt-2 font-semibold text-foreground">
                      {triggerLabels[automation.trigger_type] ??
                        automation.trigger_type}
                    </p>

                    <p className="mt-5 text-sm text-muted">
                      {enrolledCount} prospect
                      {enrolledCount > 1 ? "s" : ""} inscrit
                      {enrolledCount > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Étapes de la séquence
                    </p>

                    <div className="mt-4 space-y-4">
                      {automation.automation_steps.map(
                        (step, index) => (
                          <div
                            key={step.id}
                            className="flex gap-4"
                          >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-primary-hover">
                              {index + 1}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-foreground">
                                  {step.subject}
                                </p>

                                <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted">
                                  {formatDelay(
                                    step.delay_value,
                                    step.delay_unit,
                                  )}
                                </span>
                              </div>

                              <p className="mt-1 text-sm text-muted">
                                {automation.stop_on_reply
                                  ? "La séquence s’arrêtera lorsqu’une réponse sera détectée."
                                  : "L’envoi continuera jusqu’à la fin de la séquence."}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center shadow-sm">
          <p className="font-semibold text-foreground">
            Aucune automatisation
          </p>

          <p className="mt-1 text-sm text-muted">
            Créez votre première séquence d’e-mails.
          </p>
        </div>
      )}

      <aside className="rounded-2xl border border-accent bg-accent-soft p-5">
        <p className="font-semibold text-foreground">
          Automatisations enregistrées
        </p>

        <p className="mt-1 text-sm leading-6 text-muted">
          Les séquences et leurs étapes sont maintenant enregistrées dans
          Supabase. Aucun e-mail ne sera envoyé avant la connexion du service
          Python.
        </p>
      </aside>
    </section>
  );
}