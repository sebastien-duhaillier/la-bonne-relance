"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AutomationFormState = {
  error: string | null;
};

type SubmittedStep = {
  delayValue: string;
  delayUnit: string;
  subject: string;
  content: string;
};

const triggerTypes: Record<string, string> = {
  manual: "manual",
  "new-prospect": "new_prospect",
  contacted: "status_contacted",
  proposal: "status_proposal",
  inactive: "inactive_30_days",
};

const delayUnits: Record<string, string> = {
  minutes: "minutes",
  heures: "hours",
  jours: "days",
};

function readText(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function parseSteps(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      return null;
    }

    return parsedValue as SubmittedStep[];
  } catch {
    return null;
  }
}

export async function createAutomation(
  previousState: AutomationFormState,
  formData: FormData,
): Promise<AutomationFormState> {
  void previousState;

  const name = readText(formData, "name");
  const description = readText(formData, "description");
  const submittedTrigger = readText(formData, "trigger");
  const isActive = formData.get("active") === "on";
  const steps = parseSteps(formData.get("steps"));

  const triggerType = triggerTypes[submittedTrigger];

  if (!name || !triggerType) {
    return {
      error:
        "Le nom et le déclenchement de l’automatisation sont obligatoires.",
    };
  }

  if (!steps || steps.length === 0) {
    return {
      error: "L’automatisation doit contenir au moins un e-mail.",
    };
  }

  const invalidStep = steps.some((step) => {
    const delayValue = Number(step.delayValue);

    return (
      !Number.isInteger(delayValue) ||
      delayValue < 0 ||
      !delayUnits[step.delayUnit] ||
      !step.subject?.trim() ||
      !step.content?.trim()
    );
  });

  if (invalidStep) {
    return {
      error:
        "Chaque étape doit contenir un délai valide, un objet et un message.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: automation, error: automationError } = await supabase
    .from("automations")
    .insert({
      user_id: user.id,
      name,
      description: description || null,
      trigger_type: triggerType,
      is_active: isActive,
      stop_on_reply: true,
    })
    .select("id")
    .single();

  if (automationError || !automation) {
    return {
      error:
        automationError?.message ??
        "L’automatisation n’a pas pu être créée.",
    };
  }

  const stepsToInsert = steps.map((step, index) => ({
    automation_id: automation.id,
    position: index + 1,
    delay_value: Number(step.delayValue),
    delay_unit: delayUnits[step.delayUnit],
    subject: step.subject.trim(),
    body: step.content.trim(),
  }));

  const { error: stepsError } = await supabase
    .from("automation_steps")
    .insert(stepsToInsert);

  if (stepsError) {
    await supabase
      .from("automations")
      .delete()
      .eq("id", automation.id);

    return {
      error: stepsError.message,
    };
  }

  revalidatePath("/automatisations");
  redirect("/automatisations");
}
export async function setAutomationActive(
  id: string,
  isActive: boolean,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data, error } = await supabase
    .from("automations")
    .update({
      is_active: isActive,
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      error?.message ??
        "Le statut de l’automatisation n’a pas pu être modifié.",
    );
  }

  revalidatePath("/automatisations");
}