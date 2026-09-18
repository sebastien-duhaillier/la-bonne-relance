"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { ProspectStatus } from "@/data/prospects";

const statusStyles: Record<ProspectStatus, string> = {
  Nouveau: "bg-accent-soft text-primary-hover",
  Contacté: "bg-surface-muted text-foreground",
  Qualifié: "bg-success/10 text-success",
  Proposition: "bg-secondary/15 text-secondary",
  Gagné: "bg-success/10 text-success",
  Perdu: "bg-danger/10 text-danger",
};

export type ProspectListItem = {
  id: string;
  initials: string;
  name: string;
  company: string;
  email: string;
  origin: string;
  status: ProspectStatus;
  lastActivity: string;
  nextFollowUp: string;
};


type ProspectsListProps = {
  prospects: ProspectListItem[];
};

export default function ProspectsList({
  prospects,
}: ProspectsListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [originFilter, setOriginFilter] = useState("Toutes");

  const filteredProspects = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return prospects.filter((prospect) => {
      const matchesSearch =
        prospect.name.toLowerCase().includes(normalizedSearch) ||
        prospect.company.toLowerCase().includes(normalizedSearch) ||
        prospect.email.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Tous" || prospect.status === statusFilter;

      const matchesOrigin =
        originFilter === "Toutes" || prospect.origin === originFilter;

      return matchesSearch && matchesStatus && matchesOrigin;
    });
  }, [search, statusFilter, originFilter]);

  const origins = [...new Set(prospects.map((prospect) => prospect.origin))];

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Gestion commerciale
          </p>

          <h1 className="mt-1 text-3xl font-bold text-foreground">
            Prospects
          </h1>

          <p className="mt-2 text-muted">
            Recherchez, filtrez et suivez vos contacts commerciaux.
          </p>
        </div>

        <Link
          href="/prospects/nouveau"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-sm hover:bg-primary-hover"
        >
          Ajouter un prospect
        </Link>
      </header>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <div>
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Rechercher
            </label>

            <input
              id="search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nom, entreprise ou adresse e-mail"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
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
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Nouveau">Nouveau</option>
              <option value="Contacté">Contacté</option>
              <option value="Qualifié">Qualifié</option>
              <option value="Proposition">Proposition</option>
              <option value="Gagné">Gagné</option>
              <option value="Perdu">Perdu</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="origin"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Origine
            </label>

            <select
              id="origin"
              value={originFilter}
              onChange={(event) => setOriginFilter(event.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="Toutes">Toutes les origines</option>

              {origins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <p className="font-semibold text-foreground">
            {filteredProspects.length} prospect
            {filteredProspects.length > 1 ? "s" : ""}
          </p>

          <p className="text-sm text-muted">
            {prospects.length} au total
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead className="bg-surface-muted text-sm text-muted">
              <tr>
                <th className="px-6 py-4 font-semibold">
                  Prospect
                </th>

                <th className="px-6 py-4 font-semibold">
                  Origine
                </th>

                <th className="px-6 py-4 font-semibold">
                  Statut
                </th>

                <th className="px-6 py-4 font-semibold">
                  Dernière activité
                </th>

                <th className="px-6 py-4 font-semibold">
                  Prochaine relance
                </th>

                <th className="sticky right-0 z-10 border-l border-border bg-surface-muted px-6 py-4 font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredProspects.map((prospect) => (
                <tr
                  key={prospect.id}
                  className="hover:bg-surface-muted/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-primary-hover">
                        {prospect.initials}
                      </div>

                      <div>
                        <p className="font-semibold text-foreground">
                          {prospect.name}
                        </p>

                        <p className="text-sm text-muted">
                          {prospect.company} · {prospect.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-foreground">
                    {prospect.origin}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[prospect.status]}`}
                    >
                      {prospect.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-muted">
                    {prospect.lastActivity}
                  </td>

                  <td className="px-6 py-4 text-sm text-foreground">
                    {prospect.nextFollowUp}
                  </td>

                  <td className="sticky right-0 z-10 border-l border-border bg-surface px-6 py-4">
                    <Link
                      href={`/prospects/${prospect.id}`}
                      className="inline-flex items-center justify-center rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProspects.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="font-semibold text-foreground">
              Aucun prospect trouvé
            </p>

            <p className="mt-1 text-sm text-muted">
              Modifiez la recherche ou les filtres sélectionnés.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}