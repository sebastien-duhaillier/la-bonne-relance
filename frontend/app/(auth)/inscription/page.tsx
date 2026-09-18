import Link from "next/link";
import { signUp } from "@/app/(auth)/actions";

type RegistrationPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function RegistrationPage({
  searchParams,
}: RegistrationPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl shadow-primary/10">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold tracking-tight text-foreground">
            LBR
          </div>

          <h1 className="text-3xl font-bold text-foreground">
            Créer un compte
          </h1>

          <p className="mt-2 text-muted">
            Commencez à organiser vos prospects et vos relances.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm font-medium text-danger"
          >
            {error}
          </div>
        )}

        <form action={signUp} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Nom complet
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Votre nom"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

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

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Mot de passe
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="8 caractères minimum"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label
              htmlFor="passwordConfirmation"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Confirmer le mot de passe
            </label>

            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Saisissez à nouveau le mot de passe"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              name="terms"
              required
              className="mt-1 size-4 accent-primary"
            />

            <span>
              J’accepte les conditions d’utilisation et la gestion des données
              nécessaires au fonctionnement du service.
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-sm hover:bg-primary-hover"
          >
            Créer mon compte
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Se connecter
          </Link>
        </p>
      </section>
    </main>
  );
}