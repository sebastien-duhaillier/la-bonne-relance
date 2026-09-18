"use client";

import Link from "next/link";

import type { ProspectStatus } from "@/data/prospects";

type ProspectFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  origin: string;
  status: ProspectStatus;
  nextFollowUp: string;
  notes: string;
};

type ProspectFormProps = {
  initialValues?: Partial<ProspectFormValues>;
  submitLabel: string;
  cancelHref: string;
action: (formData: FormData) => void | Promise<void>;
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

const statuses: ProspectStatus[] = [
  "Nouveau",
  "Contacté",
  "Qualifié",
  "Proposition",
  "Gagné",
  "Perdu",
];

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

export default function ProspectForm({
  initialValues,
  submitLabel,
  cancelHref,
  action,
}: ProspectFormProps) {
  return (
   <form action={action} className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <header className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            Coordonnées
          </h2>

          <p className="mt-1 text-sm text-muted">
            Informations permettant d’identifier et de contacter le prospect.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Nom complet
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={initialValues?.name ?? ""}
              placeholder="Claire Martin"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Entreprise
            </label>

            <input
              id="company"
              name="company"
              type="text"
              defaultValue={initialValues?.company ?? ""}
              placeholder="Atelier Nova"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Adresse e-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={initialValues?.email ?? ""}
              placeholder="contact@exemple.fr"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Téléphone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={initialValues?.phone ?? ""}
              placeholder="06 00 00 00 00"
              className={inputClassName}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <header className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            Suivi commercial
          </h2>

          <p className="mt-1 text-sm text-muted">
            Classement du prospect et prochaine action prévue.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="origin"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Origine
            </label>

            <select
              id="origin"
              name="origin"
              required
              defaultValue={initialValues?.origin ?? ""}
              className={inputClassName}
            >
              <option value="" disabled>
                Sélectionner une origine
              </option>

              {origins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Statut
            </label>

            <select
              id="status"
              name="status"
              defaultValue={initialValues?.status ?? "Nouveau"}
              className={inputClassName}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="nextFollowUp"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Prochaine relance
            </label>

            <input
              id="nextFollowUp"
              name="nextFollowUp"
              type="date"
              defaultValue={initialValues?.nextFollowUp ?? ""}
              className={inputClassName}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={6}
              defaultValue={initialValues?.notes ?? ""}
              placeholder="Informations utiles concernant le prospect…"
              className={`${inputClassName} resize-y`}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-5 py-3 font-semibold text-foreground hover:bg-surface-muted"
        >
          Annuler
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-sm hover:bg-primary-hover"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}