"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readText(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function readPassword(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string"
    ? value
    : "";
}

export async function signIn(formData: FormData) {
  const email = readText(formData, "email");
  const password = readPassword(formData, "password");

  if (!email || !password) {
    redirect(
      "/connexion?error=Veuillez renseigner votre adresse e-mail et votre mot de passe.",
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      "/connexion?error=Adresse e-mail ou mot de passe incorrect.",
    );
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(formData: FormData) {
  const name = readText(formData, "name");
  const email = readText(formData, "email");
  const password = readPassword(formData, "password");
  const passwordConfirmation = readPassword(
    formData,
    "passwordConfirmation",
  );
 const termsAccepted = formData.get("terms") === "on";

  if (!name || !email || !password || !termsAccepted) {
    redirect(
      "/inscription?error=Tous les champs obligatoires doivent être renseignés et les conditions doivent être acceptées.",
    );
  }

  if (password.length < 8) {
    redirect(
      "/inscription?error=Le mot de passe doit contenir au moins 8 caractères.",
    );
  }

  if (password !== passwordConfirmation) {
    redirect(
      "/inscription?error=Les deux mots de passe ne correspondent pas.",
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    redirect(
      "/inscription?error=Impossible de créer ce compte avec ces informations.",
    );
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  redirect(
    "/connexion?message=Compte créé. Consultez votre messagerie pour confirmer votre adresse e-mail.",
  );
}
export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/connexion");
}