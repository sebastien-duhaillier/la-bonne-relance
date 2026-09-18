"use client";

import { useState } from "react";

type AutomationStep = {
  delay: string;
  title: string;
  condition: string;
};

type Automation = {
  id: number;
  name: string;
  description: string;
  trigger: string;
  active: boolean;
  enrolledProspects: number;
  steps: AutomationStep[];
};

const initialAutomations: Automation[] = [
  {
    id: 1,
    name: "Présentation du service",
    description:
      "Envoie une présentation puis relance automatiquement le prospect en l’absence de réponse.",
    trigger: "Ajout manuel du prospect",
    active: true,
    enrolledProspects: 8,
    steps: [
      {
        delay: "Immédiatement",
        title: "E-mail de présentation",
        condition: "Après validation de l’ajout à la séquence",
      },
      {
        delay: "Après 3 jours",
        title: "Première relance",
        condition: "Uniquement si aucune réponse",
      },
      {
        delay: "Après 7 jours",
        title: "Dernière relance",
        condition: "Uniquement si aucune réponse",
      },
    ],
  },
  {
    id: 2,
    name: "Suivi après proposition",
    description:
      "Assure le suivi des prospects ayant reçu une proposition commerciale.",
    trigger: "Statut modifié en « Proposition »",
    active: true,
    enrolledProspects: 3,
    steps: [
      {
        delay: "Après 2 jours",
        title: "Confirmation de réception",
        condition: "Si le prospect n’a pas répondu",
      },
      {
        delay: "Après 5 jours",
        title: "Relance sur la proposition",
        condition: "Si le statut est toujours « Proposition »",
      },
    ],
  },
  {
    id: 3,
    name: "Réactivation d’un contact",
    description:
      "Recontacte les prospects sans activité récente avec un message personnalisé.",
    trigger: "Aucune activité depuis 30 jours",
    active: false,
    enrolledProspects: 0,
    steps: [
      {
        delay: "Après 30 jours",
        title: "Message de reprise de contact",
        condition: "Si le prospect n’est ni gagné ni perdu",
      },
    ],
  },
];

export default function AutomationsPage() {
  const [automations, setAutomations] =
    useState<Automation[]>(initialAutomations);

  function toggleAutomation(id: number) {
    setAutomations((currentAutomations) =>
      currentAutomations.map((automation) =>
        automation.id === id
          ? {
              ...automation,
              active: !automation.active,
            }
          : automation,
      ),
    );
  }

  const activeAutomations = automations.filter(
    (automation) => automation.active,
  ).length;

  const enrolledProspects = automations.reduce(
    (total, automation) => total + automation.enrolledProspects,
    0,
  );

  const plannedEmails = automations.reduce(
    (total, automation) =>
      total + automation.steps.length * automation.enrolledProspects,
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

        <button
          type="button"
          className="rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-sm hover:bg-primary-hover"
        >
          Nouvelle automatisation
        </button>
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
            {plannedEmails}
          </p>
        </article>
      </div>

      <div className="space-y-6">
        {automations.map((automation) => (
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
                      automation.active
                        ? "bg-success/10 text-success"
                        : "bg-surface-muted text-muted"
                    }`}
                  >
                    {automation.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  {automation.description}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-sm font-semibold text-primary hover:text-primary-hover"
                >
                  Modifier
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={automation.active}
                  aria-label={`${automation.active ? "Désactiver" : "Activer"} ${automation.name}`}
                  onClick={() => toggleAutomation(automation.id)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    automation.active
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform ${
                      automation.active
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </header>

            <div className="grid gap-6 p-6 lg:grid-cols-[260px_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Déclenchement
                </p>

                <p className="mt-2 font-semibold text-foreground">
                  {automation.trigger}
                </p>

                <p className="mt-5 text-sm text-muted">
                  {automation.enrolledProspects} prospect
                  {automation.enrolledProspects > 1 ? "s" : ""} inscrit
                  {automation.enrolledProspects > 1 ? "s" : ""}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Étapes de la séquence
                </p>

                <div className="mt-4 space-y-4">
                  {automation.steps.map((step, index) => (
                    <div
                      key={`${automation.id}-${step.title}`}
                      className="flex gap-4"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-primary-hover">
                        {index + 1}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-foreground">
                            {step.title}
                          </p>

                          <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted">
                            {step.delay}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-muted">
                          {step.condition}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="rounded-2xl border border-accent bg-accent-soft p-5">
        <p className="font-semibold text-foreground">
          Simulation du fonctionnement
        </p>

        <p className="mt-1 text-sm leading-6 text-muted">
          Les interrupteurs fonctionnent uniquement dans le navigateur. Aucun
          e-mail ne sera envoyé tant que les automatisations ne seront pas
          reliées à Supabase et au futur service d’envoi.
        </p>
      </aside>
    </section>
  );
}