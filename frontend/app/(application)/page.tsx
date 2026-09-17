import Link from "next/link";

const statistics = [
  {
    label: "Prospects actifs",
    value: "24",
    detail: "+5 ce mois-ci",
    color: "bg-primary",
  },
  {
    label: "Relances aujourd’hui",
    value: "4",
    detail: "2 prioritaires",
    color: "bg-accent",
  },
  {
    label: "Propositions envoyées",
    value: "7",
    detail: "3 en attente",
    color: "bg-secondary",
  },
  {
    label: "Prospects gagnés",
    value: "6",
    detail: "25 % de conversion",
    color: "bg-success",
  },
];

const reminders = [
  {
    initials: "CM",
    name: "Claire Martin",
    company: "Atelier Nova",
    schedule: "Aujourd’hui · 10 h 30",
    type: "Relance n°1",
  },
  {
    initials: "TD",
    name: "Thomas Durand",
    company: "Studio Horizon",
    schedule: "Aujourd’hui · 14 h 00",
    type: "Envoi d’informations",
  },
  {
    initials: "SL",
    name: "Sophie Laurent",
    company: "Élan Conseil",
    schedule: "Demain · 9 h 00",
    type: "Relance n°2",
  },
];

const sources = [
  {
    label: "Bouche-à-oreille",
    prospects: 10,
    percentage: 42,
    color: "bg-primary",
  },
  {
    label: "LinkedIn",
    prospects: 7,
    percentage: 29,
    color: "bg-secondary",
  },
  {
    label: "Site internet",
    prospects: 5,
    percentage: 21,
    color: "bg-dusty-rose",
  },
  {
    label: "Autres",
    prospects: 2,
    percentage: 8,
    color: "bg-accent",
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Vue d’ensemble
          </p>

          <h1 className="mt-1 text-3xl font-bold text-foreground">
            Tableau de bord
          </h1>

          <p className="mt-2 text-muted">
            Suivez vos prospects et les prochaines actions à effectuer.
          </p>
        </div>

        <Link
          href="/prospects/nouveau"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-sm hover:bg-primary-hover"
        >
          Ajouter un prospect
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => (
          <article
            key={statistic.label}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
          >
            <div className={`mb-4 h-1.5 w-12 rounded-full ${statistic.color}`} />

            <p className="text-sm font-medium text-muted">
              {statistic.label}
            </p>

            <p className="mt-2 text-3xl font-bold text-foreground">
              {statistic.value}
            </p>

            <p className="mt-2 text-sm text-muted">
              {statistic.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-border bg-surface shadow-sm">
          <header className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Prochaines relances
              </h2>

              <p className="mt-1 text-sm text-muted">
                Les actions commerciales à ne pas manquer.
              </p>
            </div>

            <Link
              href="/prospects"
              className="text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Voir les prospects
            </Link>
          </header>

          <div className="divide-y divide-border">
            {reminders.map((reminder) => (
              <div
                key={`${reminder.name}-${reminder.schedule}`}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-primary-hover">
                    {reminder.initials}
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      {reminder.name}
                    </p>

                    <p className="text-sm text-muted">
                      {reminder.company}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm font-medium text-foreground">
                    {reminder.type}
                  </p>

                  <p className="mt-1 text-sm text-muted">
                    {reminder.schedule}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">
            Origine des prospects
          </h2>

          <p className="mt-1 text-sm text-muted">
            Répartition des 24 prospects actifs.
          </p>

          <div className="mt-6 space-y-5">
            {sources.map((source) => (
              <div key={source.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {source.label}
                  </span>

                  <span className="text-muted">
                    {source.prospects}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className={`h-full rounded-full ${source.color}`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}