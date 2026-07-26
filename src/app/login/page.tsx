export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const next = searchParams.next && searchParams.next.startsWith("/") ? searchParams.next : "/monitor";
  const error = searchParams.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-torun.svg" alt="Torún AI Partner" className="mx-auto h-14 w-auto sm:h-16" />
          <p className="mt-3 text-sm font-medium uppercase tracking-wide text-gold">Monitor</p>
          <p className="mt-1 text-sm text-slate-400">
            Ingresa el PIN de acceso al panel
          </p>
        </div>

        <form action="/api/login" method="POST" className="card space-y-4 p-6">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="pin" className="mb-1.5 block text-sm text-slate-300">
              PIN
            </label>
            <input
              id="pin"
              name="pin"
              type="password"
              inputMode="numeric"
              autoFocus
              required
              className="w-full rounded-lg border border-white/10 bg-navy-950 px-3.5 py-2.5 text-white outline-none ring-gold/40 placeholder:text-slate-500 focus:ring-2"
              placeholder="••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">PIN incorrecto. Intenta de nuevo.</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-gold px-3.5 py-2.5 font-medium text-navy-950 transition hover:bg-gold-400"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
