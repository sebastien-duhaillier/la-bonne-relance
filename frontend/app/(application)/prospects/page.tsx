import ProspectsList, {
  type ProspectListItem,
} from "@/components/prospects-list";
import type { ProspectStatus } from "@/data/prospects";
import { createClient } from "@/lib/supabase/server";

const prospectStatuses: ProspectStatus[] = [
  "Nouveau",
  "Contacté",
  "Qualifié",
  "Proposition",
  "Gagné",
  "Perdu",
];

function isProspectStatus(status: string): status is ProspectStatus {
  return prospectStatuses.includes(status as ProspectStatus);
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function formatDate(date: string | null, emptyText: string) {
  if (!date) {
    return emptyText;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(new Date(date));
}

export default async function ProspectsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prospects")
    .select(
      `
        id,
        name,
        company,
        email,
        source,
        status,
        last_contact_at,
        next_follow_up_at
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Impossible de récupérer les prospects : ${error.message}`,
    );
  }

  const prospects: ProspectListItem[] = (data ?? []).map(
    (prospect) => ({
      id: prospect.id,
      initials: getInitials(prospect.name),
      name: prospect.name,
      company: prospect.company ?? "",
      email: prospect.email ?? "",
      origin: prospect.source,
      status: isProspectStatus(prospect.status)
        ? prospect.status
        : "Nouveau",
      lastActivity: formatDate(
        prospect.last_contact_at,
        "Aucune activité",
      ),
      nextFollowUp: formatDate(
        prospect.next_follow_up_at,
        "Aucune",
      ),
    }),
  );

  return <ProspectsList prospects={prospects} />;
}