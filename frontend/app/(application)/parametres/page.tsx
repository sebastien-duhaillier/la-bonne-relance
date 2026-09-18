"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type ToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
};

const origins = [
  "Bouche-à-oreille",
  "LinkedIn",
  "Site internet",
  "Événement",
  "Appel entrant",
  "Import CSV",
  "Autre",
];

const statuses = [
  "Nouveau",
  "Contacté",
  "Qualifié",
  "Proposition",
  "Gagné",
  "Perdu",
];

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

function Toggle({
  label,
  description,
  checked,
  onToggle,
}: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div>
        <p className="font-semibold text-foreground">
          {label}
        </p>

        <p className="mt-1 text-sm leading-6 text-muted">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onToggle}
        className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [confirmFirstEmail, setConfirmFirstEmail] = useState(true);
  const [stopOnReply, setStopOnReply] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Configuration
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Paramètres
        </h1>

        <p className="mt-2 max-w-2xl text-muted">
          Configurez l’identité d’envoi et le comportement général de
          l’application.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <header className="mb-6">
            <h2 className="text-lg font-bold text-foreground">
              Identité de l’expéditeur
            </h2>

            <p className="mt-1 text-sm text-muted">
              Ces informations apparaîtront dans les e-mails envoyés aux
              prospects.
            </p>
          </header>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="senderName"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Nom de l’expéditeur
              </label>

              <input
                id="senderName"
                name="senderName"
                type="text"
                defaultValue="La Bonne Relance"
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="senderEmail"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Adresse d’envoi
              </label>

              <input
                id="senderEmail"
                name="senderEmail"
                type="email"
                placeholder="contact@exemple.fr"
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="replyTo"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Adresse de réponse
              </label>

              <input
                id="replyTo"
                name="replyTo"
                type="email"
                placeholder="reponse@exemple.fr"
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="dailyLimit"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Limite quotidienne d’e-mails
              </label>

              <input
                id="dailyLimit"
                name="dailyLimit"
                type="number"
                min="1"
                max="500"
                defaultValue="20"
                className={inputClassName}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <header>
            <h2 className="text-lg font-bold text-foreground">
              Sécurité des envois
            </h2>

            <p className="mt-1 text-sm text-muted">
              Contrôlez le fonctionnement des séquences automatiques.
            </p>
          </header>

          <div className="mt-4 divide-y divide-border">
            <Toggle
              label="Confirmer le premier e-mail"
              description="Demander une validation manuelle avant d’inscrire un prospect dans une séquence."
              checked={confirmFirstEmail}
              onToggle={() => setConfirmFirstEmail((value) => !value)}
            />

            <Toggle
              label="Arrêter la séquence après une réponse"
              description="Ne plus envoyer de relances automatiques lorsqu’un prospect répond."
              checked={stopOnReply}
              onToggle={() => setStopOnReply((value) => !value)}
            />

            <Toggle
              label="Recevoir un résumé quotidien"
              description="Afficher chaque jour un résumé des envois et des relances prévues."
              checked={dailySummary}
              onToggle={() => setDailySummary((value) => !value)}
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-foreground">
                Origines
              </h2>

              <button
                type="button"
                className="text-sm font-semibold text-primary hover:text-primary-hover"
              >
                Gérer
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {origins.map((origin) => (
                <span
                  key={origin}
                  className="rounded-full bg-accent-soft px-3 py-1.5 text-sm font-medium text-primary-hover"
                >
                  {origin}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-foreground">
                Statuts
              </h2>

              <button
                type="button"
                className="text-sm font-semibold text-primary hover:text-primary-hover"
              >
                Gérer
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <span
                  key={status}
                  className="rounded-full bg-surface-muted px-3 py-1.5 text-sm font-medium text-foreground"
                >
                  {status}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-sm hover:bg-primary-hover"
          >
            Enregistrer les paramètres
          </button>

          {saved && (
            <p className="text-sm font-medium text-success">
              Simulation enregistrée localement.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}