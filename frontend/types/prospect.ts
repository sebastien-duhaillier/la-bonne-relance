export const prospectStatuses = [
  "Nouveau",
  "Contacté",
  "Qualifié",
  "Proposition",
  "Gagné",
  "Perdu",
] as const;

export type ProspectStatus =
  (typeof prospectStatuses)[number];