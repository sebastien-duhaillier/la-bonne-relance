export type ProspectStatus =
  | "Nouveau"
  | "Contacté"
  | "Qualifié"
  | "Proposition"
  | "Gagné"
  | "Perdu";

export type Prospect = {
  id: number;
  initials: string;
  name: string;
  company: string;
  email: string;
  origin: string;
  status: ProspectStatus;
  lastActivity: string;
  nextFollowUp: string;
};
export const prospects: Prospect[] = [
  {
    id: 1,
    initials: "CM",
    name: "Claire Martin",
    company: "Atelier Nova",
    email: "claire.martin@exemple.fr",
    origin: "Bouche-à-oreille",
    status: "Contacté",
    lastActivity: "16 septembre 2026",
    nextFollowUp: "18 septembre 2026",
  },
  {
    id: 2,
    initials: "TD",
    name: "Thomas Durand",
    company: "Studio Horizon",
    email: "thomas.durand@exemple.fr",
    origin: "LinkedIn",
    status: "Nouveau",
    lastActivity: "17 septembre 2026",
    nextFollowUp: "18 septembre 2026",
  },
  {
    id: 3,
    initials: "SL",
    name: "Sophie Laurent",
    company: "Élan Conseil",
    email: "sophie.laurent@exemple.fr",
    origin: "Site internet",
    status: "Qualifié",
    lastActivity: "15 septembre 2026",
    nextFollowUp: "19 septembre 2026",
  },
  {
    id: 4,
    initials: "MP",
    name: "Marc Petit",
    company: "Pixel & Co",
    email: "marc.petit@exemple.fr",
    origin: "Événement",
    status: "Proposition",
    lastActivity: "14 septembre 2026",
    nextFollowUp: "21 septembre 2026",
  },
  {
    id: 5,
    initials: "NB",
    name: "Nadia Benali",
    company: "Nova RH",
    email: "nadia.benali@exemple.fr",
    origin: "Bouche-à-oreille",
    status: "Gagné",
    lastActivity: "12 septembre 2026",
    nextFollowUp: "Aucune",
  },
  {
    id: 6,
    initials: "JR",
    name: "Julien Robert",
    company: "Indépendant",
    email: "julien.robert@exemple.fr",
    origin: "Appel entrant",
    status: "Perdu",
    lastActivity: "10 septembre 2026",
    nextFollowUp: "Aucune",
  },
];