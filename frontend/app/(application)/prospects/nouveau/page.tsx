import Link from "next/link";

import { createProspect } from "@/app/(application)/prospects/actions";
import ProspectForm from "@/components/prospect-form";

type NewProspectPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewProspectPage({
  searchParams,
}: NewProspectPageProps) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/prospects"
        className="inline-flex text-sm font-semibold text-primary hover:text-primary-hover"
      >
        ← Retour aux prospects
      </Link>

      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Nouveau contact
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Ajouter un prospect
        </h1>

        <p className="mt-2 text-muted">
          Enregistrez ses coordonnées, son origine et la prochaine action à
          effectuer.
        </p>
      </header>

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      <ProspectForm
        action={createProspect}
        submitLabel="Ajouter le prospect"
        cancelHref="/prospects"
      />
    </section>
  );
}