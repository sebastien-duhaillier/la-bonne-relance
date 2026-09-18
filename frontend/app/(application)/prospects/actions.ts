"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ProspectStatus } from "@/data/prospects";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses: ProspectStatus[] = [
  "Nouveau",
  "Contacté",
  "Qualifié",
  "Proposition",
  "Gagné",
  "Perdu",
];

function readText(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function readProspectForm(formData: FormData) {
  const requestedStatus = readText(formData, "status");

  const status: ProspectStatus = allowedStatuses.includes(
    requestedStatus as ProspectStatus,
  )
    ? (requestedStatus as ProspectStatus)
    : "Nouveau";

  return {
    name: readText(formData, "name"),
    company: readText(formData, "company"),
    email: readText(formData, "email"),
    phone: readText(formData, "phone"),
    origin: readText(formData, "origin"),
    status,
    nextFollowUp: readText(formData, "nextFollowUp"),
    notes: readText(formData, "notes"),
  };
}

export async function createProspect(formData: FormData) {
  const values = readProspectForm(formData);

  if (!values.name || !values.email || !values.origin) {
    const message =
      "Le nom, l’adresse e-mail et l’origine sont obligatoires";

    redirect(
      `/prospects/nouveau?error=${encodeURIComponent(message)}`,
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { error } = await supabase.from("prospects").insert({
    name: values.name,
    company: values.company || null,
    email: values.email,
    phone: values.phone || null,
    source: values.origin,
    status: values.status,
    next_follow_up_at: values.nextFollowUp || null,
    notes: values.notes || null,
  });

  if (error) {
    redirect(
      `/prospects/nouveau?error=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath("/prospects");
  redirect("/prospects");
}

export async function updateProspect(
  id: string,
  formData: FormData,
) {
  const values = readProspectForm(formData);

  if (!values.name || !values.email || !values.origin) {
    const message =
      "Le nom, l’adresse e-mail et l’origine sont obligatoires";

    redirect(
      `/prospects/${id}/modifier?error=${encodeURIComponent(message)}`,
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data, error } = await supabase
    .from("prospects")
    .update({
      name: values.name,
      company: values.company || null,
      email: values.email,
      phone: values.phone || null,
      source: values.origin,
      status: values.status,
      next_follow_up_at: values.nextFollowUp || null,
      notes: values.notes || null,
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    const message =
      error?.message ?? "Le prospect n’a pas pu être modifié";

    redirect(
      `/prospects/${id}/modifier?error=${encodeURIComponent(message)}`,
    );
  }

  revalidatePath("/prospects");
  revalidatePath(`/prospects/${id}`);

  redirect(`/prospects/${id}`);
}
export async function deleteProspect(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data, error } = await supabase
    .from("prospects")
    .delete()
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      error?.message ?? "Le prospect n’a pas pu être supprimé",
    );
  }

  revalidatePath("/prospects");
  redirect("/prospects");
}