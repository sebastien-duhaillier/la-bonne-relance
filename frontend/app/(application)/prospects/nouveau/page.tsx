import Link from "next/link";
import ProspectForm from "@/components/prospect-form";

export default function NewProspectPage() {
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

      <ProspectForm
        submitLabel="Ajouter le prospect"
        cancelHref="/prospects"
      />
    </section>
  );
}