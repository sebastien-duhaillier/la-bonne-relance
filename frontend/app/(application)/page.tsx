import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

const sourceColors = [
  "bg-primary",
  "bg-secondary",
  "bg-dusty-rose",
  "bg-accent",
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

function getDateKey(date: string | Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

function formatReminderDate(date: string, todayKey: string) {
  const dateKey = getDateKey(date);

  if (dateKey < todayKey) {
    return `En retard · ${new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      timeZone: "Europe/Paris",
    }).format(new Date(date))}`;
  }

  if (dateKey === todayKey) {
    return "Aujourd’hui";
  }

  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  if (dateKey === getDateKey(tomorrow)) {
    return "Demain";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(date));
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prospects")
    .select(
      `
        id,
        name,
        company,
        source,
        status,
        next_follow_up_at,
        created_at
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Impossible de charger le tableau de bord : ${error.message}`,
    );
  }

  const prospects = data ?? [];
  const todayKey = getDateKey(new Date());
  const currentMonth = todayKey.slice(0, 7);

  const activeProspects = prospects.filter(
    (prospect) =>
      prospect.status !== "Gagné" &&
      prospect.status !== "Perdu",
  );

  const prospectsCreatedThisMonth = prospects.filter(
    (prospect) =>
      getDateKey(prospect.created_at).slice(0, 7) === currentMonth,
  ).length;

  const remindersToday = prospects.filter(
    (prospect) =>
      prospect.next_follow_up_at &&
      getDateKey(prospect.next_follow_up_at) === todayKey,
  ).length;

  const overdueReminders = prospects.filter(
    (prospect) =>
      prospect.next_follow_up_at &&
      getDateKey(prospect.next_follow_up_at) < todayKey,
  ).length;

  const proposals = prospects.filter(
    (prospect) => prospect.status === "Proposition",
  ).length;

  const wonProspects = prospects.filter(
    (prospect) => prospect.status === "Gagné",
  ).length;

  const conversionRate =
    prospects.length > 0
      ? Math.round((wonProspects / prospects.length) * 100)
      : 0;

  const statistics = [
    {
      label: "Prospects actifs",
      value: activeProspects.length.toString(),
      detail: `${prospectsCreatedThisMonth} ajouté${
        prospectsCreatedThisMonth > 1 ? "s" : ""
      } ce mois-ci`,
      color: "bg-primary",
    },
    {
      label: "Relances aujourd’hui",
      value: remindersToday.toString(),
      detail: `${overdueReminders} en retard`,
      color: "bg-accent",
    },
    {
      label: "Propositions en cours",
      value: proposals.toString(),
      detail: "Prospects à suivre",
      color: "bg-secondary",
    },
    {
      label: "Prospects gagnés",
      value: wonProspects.toString(),
      detail: `${conversionRate} % de conversion`,
      color: "bg-success",
    },
  ];

  const reminders = prospects
    .filter((prospect) => prospect.next_follow_up_at)
    .sort((firstProspect, secondProspect) =>
      firstProspect.next_follow_up_at!.localeCompare(
        secondProspect.next_follow_up_at!,
      ),
    )
    .slice(0, 5)
    .map((prospect) => ({
      id: prospect.id,
      initials: getInitials(prospect.name),
      name: prospect.name,
      company: prospect.company || "Entreprise non renseignée",
      schedule: formatReminderDate(
        prospect.next_follow_up_at!,
        todayKey,
      ),
      type: "Relance programmée",
    }));

  const sourceCounts = prospects.reduce<Record<string, number>>(
    (counts, prospect) => {
      counts[prospect.source] =
        (counts[prospect.source] ?? 0) + 1;

      return counts;
    },
    {},
  );

  const sources = Object.entries(sourceCounts)
    .sort(([, firstCount], [, secondCount]) => {
      return secondCount - firstCount;
    })
    .map(([label, count], index) => ({
      label,
      prospects: count,
      percentage:
        prospects.length > 0
          ? Math.round((count / prospects.length) * 100)
          : 0,
      color: sourceColors[index % sourceColors.length],
    }));

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
            <div
              className={`mb-4 h-1.5 w-12 rounded-full ${statistic.color}`}
            />

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

          {reminders.length > 0 ? (
            <div className="divide-y divide-border">
              {reminders.map((reminder) => (
                <Link
                  key={reminder.id}
                  href={`/prospects/${reminder.id}`}
                  className="flex flex-col gap-3 px-6 py-4 transition hover:bg-surface-muted sm:flex-row sm:items-center sm:justify-between"
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
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-6 py-10 text-center text-sm text-muted">
              Aucune relance programmée.
            </p>
          )}
        </article>

        <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">
            Origine des prospects
          </h2>

          <p className="mt-1 text-sm text-muted">
            Répartition des {prospects.length} prospect
            {prospects.length > 1 ? "s" : ""}.
          </p>

          {sources.length > 0 ? (
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
          ) : (
            <p className="mt-6 text-sm text-muted">
              Aucune origine à afficher.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}