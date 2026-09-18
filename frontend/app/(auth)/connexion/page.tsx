import Link from "next/link";
import { signIn } from "@/app/(auth)/actions";

type ConnexionPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function ConnexionPage({
  searchParams,
}: ConnexionPageProps) {
  const { error, message } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl shadow-primary/10">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold tracking-tight text-foreground">
            LBR
          </div>

          <h1 className="text-3xl font-bold text-foreground">
            La Bonne Relance
          </h1>

          <p className="mt-2 text-muted">
            Connectez-vous pour gérer vos prospects.
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

        {message && (
          <div className="mb-5 rounded-xl border border-success/30 bg-success/10 p-4 text-sm font-medium text-success">
            {message}
          </div>
        )}

        <form action={signIn} className="space-y-5">
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
              autoComplete="current-password"
              required
              placeholder="Votre mot de passe"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-sm hover:bg-primary-hover"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 flex justify-between gap-4 text-sm font-medium text-primary">
          <Link
            href="/mot-de-passe-oublie"
            className="hover:text-primary-hover"
          >
            Mot de passe oublié
          </Link>

          <Link
            href="/inscription"
            className="hover:text-primary-hover"
          >
            Créer un compte
          </Link>
        </div>
      </section>
    </main>
  );
}