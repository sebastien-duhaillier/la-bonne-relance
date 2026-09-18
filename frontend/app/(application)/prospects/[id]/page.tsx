import Link from "next/link";
import { notFound } from "next/navigation";

import type { ProspectStatus } from "@/data/prospects";
import { createClient } from "@/lib/supabase/server";

type ProspectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusStyles: Record<ProspectStatus, string> = {
  Nouveau: "bg-accent-soft text-primary-hover",
  Contacté: "bg-surface-muted text-foreground",
  Qualifié: "bg-success/10 text-success",
  Proposition: "bg-secondary/15 text-secondary",
  Gagné: "bg-success/10 text-success",
  Perdu: "bg-danger/10 text-danger",
};

const allowedStatuses: ProspectStatus[] = [
  "Nouveau",
  "Contacté",
  "Qualifié",
  "Proposition",
  "Gagné",
  "Perdu",
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function formatDate(date: string | null) {
  if (!date) {
    return "Aucune";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(new Date(date));
}

export default async function ProspectPage({
  params,
}: ProspectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: prospect, error } = await supabase
    .from("prospects")
    .select(
      `
        id,
        name,
        company,
        email,
        phone,
        source,
        status,
        notes,
        last_contact_at,
        next_follow_up_at,
        created_at,
        updated_at
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Impossible de récupérer le prospect : ${error.message}`,
    );
  }

  if (!prospect) {
    notFound();
  }

  const status: ProspectStatus = allowedStatuses.includes(
    prospect.status as ProspectStatus,
  )
    ? (prospect.status as ProspectStatus)
    : "Nouveau";

  const initials = getInitials(prospect.name);

  const activities = [
    {
      title: "Prospect ajouté",
      description: `${prospect.name} a été ajouté depuis ${prospect.source.toLowerCase()}.`,
      date: formatDate(prospect.created_at),
    },
  ];

  if (prospect.next_follow_up_at) {
    activities.push({
      title: "Relance programmée",
      description: `Une prochaine relance est prévue pour ce prospect.`,
      date: formatDate(prospect.next_follow_up_at),
    });
  }

  return (
    <section className="space-y-6">
      <Link
        href="/prospects"
        className="inline-flex text-sm font-semibold text-primary hover:text-primary-hover"
      >
        ← Retour aux prospects
      </Link>

      <article className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-xl font-bold text-primary-hover">
            {initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {prospect.name}
              </h1>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
              >
                {status}
              </span>
            </div>

            <p className="mt-1 text-muted">
              {prospect.company || "Entreprise non renseignée"}
            </p>
          </div>
        </div>

        <Link
          href={`/prospects/${prospect.id}/modifier`}
          className="inline-flex items-center justify-center rounded-xl border border-primary px-5 py-3 font-semibold text-primary hover:bg-primary hover:text-white"
        >
          Modifier
        </Link>
      </article>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Coordonnées
            </h2>

            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-sm font-medium text-muted">
                  Adresse e-mail
                </dt>

                <dd className="mt-1">
                  {prospect.email ? (
                    <a
                      href={`mailto:${prospect.email}`}
                      className="font-semibold text-primary hover:text-primary-hover"
                    >
                      {prospect.email}
                    </a>
                  ) : (
                    <span className="font-semibold text-foreground">
                      Non renseignée
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted">
                  Téléphone
                </dt>

                <dd className="mt-1">
                  {prospect.phone ? (
                    <a
                      href={`tel:${prospect.phone}`}
                      className="font-semibold text-primary hover:text-primary-hover"
                    >
                      {prospect.phone}
                    </a>
                  ) : (
                    <span className="font-semibold text-foreground">
                      Non renseigné
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted">
                  Entreprise
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {prospect.company || "Non renseignée"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted">
                  Origine du contact
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {prospect.source}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Suivi commercial
            </h2>

            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted">
                  Dernier contact
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {formatDate(prospect.last_contact_at)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted">
                  Prochaine relance
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {formatDate(prospect.next_follow_up_at)}
                </dd>
              </div>
            </dl>

            <Link
              href={`/prospects/${prospect.id}/modifier`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-hover"
            >
              Modifier le suivi
            </Link>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Notes
            </h2>

            <p className="mt-4 whitespace-pre-wrap leading-7 text-muted">
              {prospect.notes || "Aucune note pour ce prospect."}
            </p>

            <Link
              href={`/prospects/${prospect.id}/modifier`}
              className="mt-5 inline-flex text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Modifier la note
            </Link>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Historique
            </h2>

            <div className="mt-6 space-y-6">
              {activities.map((activity, index) => (
                <div
                  key={`${activity.title}-${index}`}
                  className="flex gap-4"
                >
                  <div className="mt-1 flex flex-col items-center">
                    <div className="size-3 rounded-full bg-primary" />

                    {index < activities.length - 1 && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>

                  <div className="pb-2">
                    <p className="font-semibold text-foreground">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted">
                      {activity.description}
                    </p>

                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted">
                      {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}