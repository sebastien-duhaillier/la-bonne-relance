import Link from "next/link";
import { notFound } from "next/navigation";
import {
  prospects,
  type ProspectStatus,
} from "@/data/prospects";

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

export default async function ProspectPage({
  params,
}: ProspectPageProps) {
  const { id } = await params;

  const prospect = prospects.find(
    (currentProspect) => currentProspect.id === Number(id),
  );

  if (!prospect) {
    notFound();
  }

  const activities = [
    {
      title: "Prospect ajouté",
      description: `${prospect.name} a été ajouté depuis ${prospect.origin.toLowerCase()}.`,
      date: prospect.lastActivity,
    },
    {
      title: "E-mail d’information envoyé",
      description: `Un message de présentation a été envoyé à ${prospect.email}.`,
      date: prospect.lastActivity,
    },
    {
      title: "Relance programmée",
      description: `Prochaine action prévue : ${prospect.nextFollowUp}.`,
      date: prospect.nextFollowUp,
    },
  ];

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
            {prospect.initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {prospect.name}
              </h1>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[prospect.status]}`}
              >
                {prospect.status}
              </span>
            </div>

            <p className="mt-1 text-muted">
              {prospect.company}
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
                  <a
                    href={`mailto:${prospect.email}`}
                    className="font-semibold text-primary hover:text-primary-hover"
                  >
                    {prospect.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted">
                  Entreprise
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {prospect.company}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted">
                  Origine du contact
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {prospect.origin}
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
                  Dernière activité
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {prospect.lastActivity}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted">
                  Prochaine relance
                </dt>

                <dd className="mt-1 font-semibold text-foreground">
                  {prospect.nextFollowUp}
                </dd>
              </div>
            </dl>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                className="rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-hover"
              >
                Programmer une relance
              </button>

              <button
                type="button"
                className="rounded-xl border border-primary px-4 py-3 font-semibold text-primary hover:bg-primary hover:text-white"
              >
                Ajouter à une automatisation
              </button>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Notes
            </h2>

            <p className="mt-4 leading-7 text-muted">
              Le prospect souhaite recevoir une présentation des services
              proposés. Prévoir une relance après l’envoi du premier message
              afin de vérifier ses besoins et ses disponibilités.
            </p>

            <button
              type="button"
              className="mt-5 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Modifier la note
            </button>
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