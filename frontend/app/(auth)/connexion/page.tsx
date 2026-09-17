export default function ConnexionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            La Bonne Relance
          </h1>

          <p className="mt-2 text-slate-600">
            Connectez-vous pour gérer vos prospects.
          </p>
        </header>

        <form className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Adresse e-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Mot de passe
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm text-blue-700">
          <span>Mot de passe oublié</span>
          <span>Créer un compte</span>
        </div>
      </section>
    </main>
  );
}