import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProspect } from "@/app/(application)/prospects/actions";
import ProspectForm from "@/components/prospect-form";
import type { ProspectStatus } from "@/types/prospect";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses: ProspectStatus[] = [
  "Nouveau",
  "Contacté",
  "Qualifié",
  "Proposition",
  "Gagné",
  "Perdu",
];

type EditProspectPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditProspectPage({
  params,
  searchParams,
}: EditProspectPageProps) {
  const { id } = await params;
  const { error: formError } = await searchParams;

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
        next_follow_up_at,
        notes
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !prospect) {
    notFound();
  }

  const status = allowedStatuses.includes(
    prospect.status as ProspectStatus,
  )
    ? (prospect.status as ProspectStatus)
    : "Nouveau";

  const updateProspectWithId = updateProspect.bind(
    null,
    prospect.id,
  );

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

      {formError && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {formError}
        </p>
      )}

      <ProspectForm
        action={updateProspectWithId}
        initialValues={{
          name: prospect.name,
          company: prospect.company ?? "",
          email: prospect.email ?? "",
          phone: prospect.phone ?? "",
          origin: prospect.source,
          status,
          nextFollowUp:
            prospect.next_follow_up_at?.slice(0, 10) ?? "",
          notes: prospect.notes ?? "",
        }}
        submitLabel="Enregistrer les modifications"
        cancelHref={`/prospects/${prospect.id}`}
      />
    </section>
  );
}