"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

type AutomationStep = {
  id: number;
  delayValue: string;
  delayUnit: string;
  subject: string;
  content: string;
};

type EditableStepField = Exclude<keyof AutomationStep, "id">;

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

const initialSteps: AutomationStep[] = [
  {
    id: 1,
    delayValue: "0",
    delayUnit: "jours",
    subject: "Présentation de nos services",
    content:
      "Bonjour {{prenom}},\n\nJe vous contacte afin de vous présenter nos services.",
  },
];

export default function NewAutomationPage() {
  const [steps, setSteps] =
    useState<AutomationStep[]>(initialSteps);

  function addStep() {
    setSteps((currentSteps) => [
      ...currentSteps,
      {
        id: Date.now(),
        delayValue: "3",
        delayUnit: "jours",
        subject: "",
        content: "",
      },
    ]);
  }

  function removeStep(id: number) {
    setSteps((currentSteps) =>
      currentSteps.filter((step) => step.id !== id),
    );
  }

  function updateStep(
    id: number,
    field: EditableStepField,
    value: string,
  ) {
    setSteps((currentSteps) =>
      currentSteps.map((step) =>
        step.id === id
          ? {
              ...step,
              [field]: value,
            }
          : step,
      ),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/automatisations"
        className="inline-flex text-sm font-semibold text-primary hover:text-primary-hover"
      >
        ← Retour aux automatisations
      </Link>

      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Nouvelle séquence
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Créer une automatisation
        </h1>

        <p className="mt-2 max-w-2xl text-muted">
          Définissez le déclenchement de la séquence et les messages envoyés
          aux prospects.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <header className="mb-6">
            <h2 className="text-lg font-bold text-foreground">
              Informations générales
            </h2>

            <p className="mt-1 text-sm text-muted">
              Identifiez la séquence et choisissez son déclenchement.
            </p>
          </header>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Nom de l’automatisation
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Présentation du service"
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="trigger"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Déclenchement
              </label>

              <select
                id="trigger"
                name="trigger"
                required
                defaultValue=""
                className={inputClassName}
              >
                <option value="" disabled>
                  Sélectionner un déclenchement
                </option>

                <option value="manual">
                  Ajout manuel du prospect
                </option>

                <option value="new-prospect">
                  Création d’un prospect
                </option>

                <option value="contacted">
                  Statut modifié en « Contacté »
                </option>

                <option value="proposal">
                  Statut modifié en « Proposition »
                </option>

                <option value="inactive">
                  Aucune activité depuis 30 jours
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Expliquez brièvement l’objectif de cette séquence."
                className={`${inputClassName} resize-y`}
              />
            </div>

            <label className="flex items-start gap-3 md:col-span-2">
              <input
                type="checkbox"
                name="active"
                defaultChecked
                className="mt-1 size-4 accent-primary"
              />

              <span>
                <span className="block font-semibold text-foreground">
                  Activer après l’enregistrement
                </span>

                <span className="mt-1 block text-sm text-muted">
                  La séquence pourra recevoir des prospects dès sa création.
                </span>
              </span>
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Étapes de la séquence
              </h2>

              <p className="mt-1 text-sm text-muted">
                Chaque étape correspond à un e-mail et à son délai d’attente.
              </p>
            </div>

            <button
              type="button"
              onClick={addStep}
              className="rounded-xl border border-primary px-4 py-2.5 font-semibold text-primary hover:bg-primary hover:text-white"
            >
              Ajouter une étape
            </button>
          </header>

          {steps.map((step, index) => (
            <article
              key={step.id}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <header className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-primary-hover">
                    {index + 1}
                  </div>

                  <h3 className="font-bold text-foreground">
                    E-mail n°{index + 1}
                  </h3>
                </div>

                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="text-sm font-semibold text-danger hover:opacity-70"
                  >
                    Supprimer
                  </button>
                )}
              </header>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor={`delay-${step.id}`}
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Délai avant l’envoi
                  </label>

                  <input
                    id={`delay-${step.id}`}
                    type="number"
                    min="0"
                    required
                    value={step.delayValue}
                    onChange={(event) =>
                      updateStep(
                        step.id,
                        "delayValue",
                        event.target.value,
                      )
                    }
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`unit-${step.id}`}
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Unité
                  </label>

                  <select
                    id={`unit-${step.id}`}
                    value={step.delayUnit}
                    onChange={(event) =>
                      updateStep(
                        step.id,
                        "delayUnit",
                        event.target.value,
                      )
                    }
                    className={inputClassName}
                  >
                    <option value="minutes">Minutes</option>
                    <option value="heures">Heures</option>
                    <option value="jours">Jours</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor={`subject-${step.id}`}
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Objet de l’e-mail
                  </label>

                  <input
                    id={`subject-${step.id}`}
                    type="text"
                    required
                    value={step.subject}
                    onChange={(event) =>
                      updateStep(
                        step.id,
                        "subject",
                        event.target.value,
                      )
                    }
                    placeholder="Objet du message"
                    className={inputClassName}
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor={`content-${step.id}`}
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Contenu
                  </label>

                  <textarea
                    id={`content-${step.id}`}
                    rows={8}
                    required
                    value={step.content}
                    onChange={(event) =>
                      updateStep(
                        step.id,
                        "content",
                        event.target.value,
                      )
                    }
                    placeholder="Rédigez le message envoyé au prospect."
                    className={`${inputClassName} resize-y`}
                  />
                </div>
              </div>

              <aside className="mt-5 rounded-xl bg-surface-muted p-4 text-sm text-muted">
                Variables disponibles :{" "}
                <code className="font-semibold text-foreground">
                  {"{{prenom}}"}
                </code>
                ,{" "}
                <code className="font-semibold text-foreground">
                  {"{{nom}}"}
                </code>
                ,{" "}
                <code className="font-semibold text-foreground">
                  {"{{entreprise}}"}
                </code>
                .
              </aside>
            </article>
          ))}
        </section>

        <aside className="rounded-2xl border border-accent bg-accent-soft p-5">
          <p className="font-semibold text-foreground">
            Sécurité de la séquence
          </p>

          <p className="mt-1 text-sm leading-6 text-muted">
            Les relances devront s’arrêter automatiquement lorsqu’un prospect
            répond ou se désabonne. Ce comportement sera ajouté avec le système
            d’envoi.
          </p>
        </aside>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/automatisations"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 font-semibold text-foreground hover:bg-surface-muted"
          >
            Annuler
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-sm hover:bg-primary-hover"
          >
            Créer l’automatisation
          </button>
        </div>
      </form>
    </section>
  );
}