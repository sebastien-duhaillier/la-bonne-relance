"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

export default function ForgottenPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl shadow-primary/10">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold tracking-tight text-foreground">
            LBR
          </div>

          <h1 className="text-3xl font-bold text-foreground">
            Mot de passe oublié
          </h1>

          <p className="mt-2 text-muted">
            Indiquez votre adresse e-mail pour recevoir un lien de
            réinitialisation.
          </p>
        </header>

        {submitted ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-success/30 bg-success/10 p-4">
              <p className="font-semibold text-success">
                Demande enregistrée
              </p>

              <p className="mt-1 text-sm leading-6 text-muted">
                Si un compte correspond à cette adresse, un lien de
                réinitialisation sera envoyé.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="w-full rounded-xl border border-primary px-4 py-3 font-semibold text-primary hover:bg-primary hover:text-white"
            >
              Utiliser une autre adresse
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Adresse e-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="vous@exemple.fr"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-sm hover:bg-primary-hover"
            >
              Envoyer le lien
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link
            href="/connexion"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            ← Retour à la connexion
          </Link>
        </p>
      </section>
    </main>
  );
}