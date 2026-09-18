import { enrollProspect } from "@/app/(application)/prospects/actions";
import { createClient } from "@/lib/supabase/server";

type EnrollProspectFormProps = {
  prospectId: string;
};

export default async function EnrollProspectForm({
  prospectId,
}: EnrollProspectFormProps) {
  const supabase = await createClient();

  const { data: automations, error } = await supabase
    .from("automations")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  if (error) {
    throw new Error(
      `Impossible de récupérer les automatisations : ${error.message}`,
    );
  }

  const enrollProspectWithId = enrollProspect.bind(
    null,
    prospectId,
  );

  return (
    <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg font-bold text-foreground">
        Automatisation
      </h2>

      <p className="mt-1 text-sm text-muted">
        Inscrivez ce prospect à une séquence d’e-mails active.
      </p>

      {automations && automations.length > 0 ? (
        <form
          action={enrollProspectWithId}
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="automationId"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Séquence
            </label>

            <select
              id="automationId"
              name="automationId"
              required
              defaultValue=""
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="" disabled>
                Sélectionner une automatisation
              </option>

              {automations.map((automation) => (
                <option
                  key={automation.id}
                  value={automation.id}
                >
                  {automation.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-hover"
          >
            Ajouter à l’automatisation
          </button>
        </form>
      ) : (
        <p className="mt-5 rounded-xl bg-surface-muted p-4 text-sm text-muted">
          Aucune automatisation active n’est disponible.
        </p>
      )}
    </article>
  );
}