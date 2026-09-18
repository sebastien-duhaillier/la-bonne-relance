"use client";

import type { FormEventHandler } from "react";
import { useFormStatus } from "react-dom";

type DeleteProspectButtonProps = {
  action: () => void | Promise<void>;
  prospectName: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl border border-danger px-5 py-3 font-semibold text-danger transition hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Suppression…" : "Supprimer"}
    </button>
  );
}

export default function DeleteProspectButton({
  action,
  prospectName,
}: DeleteProspectButtonProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const confirmed = window.confirm(
      `Supprimer définitivement le prospect « ${prospectName} » ?`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <form action={action} onSubmit={handleSubmit}>
      <SubmitButton />
    </form>
  );
}