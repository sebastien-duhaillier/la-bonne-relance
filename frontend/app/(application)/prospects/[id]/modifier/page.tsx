import Link from "next/link";
import { notFound } from "next/navigation";
import ProspectForm from "@/components/prospect-form";
import { prospects } from "@/data/prospects";

type EditProspectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProspectPage({
  params,
}: EditProspectPageProps) {
  const { id } = await params;

  const prospect = prospects.find(
    (currentProspect) => currentProspect.id === Number(id),
  );

  if (!prospect) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Link
        href={`/prospects/${prospect.id}`}
        className="inline-flex text-sm font-semibold text-primary hover:text-primary-hover"
      >
        ← Retour à la fiche
      </Link>

      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Modification
        </p>

        <h1 className="mt-1 text-3xl font-bold text-foreground">
          Modifier {prospect.name}
        </h1>

        <p className="mt-2 text-muted">
          Mettez à jour les coordonnées et le suivi commercial du prospect.
        </p>
      </header>

      <ProspectForm
        initialValues={{
          name: prospect.name,
          company: prospect.company,
          email: prospect.email,
          origin: prospect.origin,
          status: prospect.status,
          notes:
            "Le prospect souhaite recevoir une présentation des services proposés.",
        }}
        submitLabel="Enregistrer les modifications"
        cancelHref={`/prospects/${prospect.id}`}
      />
    </section>
  );
}