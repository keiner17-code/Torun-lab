import Link from "next/link";

export function TopNav({
  titulo,
  migas,
}: {
  titulo: string;
  migas?: { label: string; href?: string }[];
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-navy-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          {migas && migas.length > 0 && (
            <nav className="mb-0.5 flex items-center gap-1 text-xs text-slate-500">
              {migas.map((m, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span>/</span>}
                  {m.href ? (
                    <Link href={m.href} className="hover:text-gold">
                      {m.label}
                    </Link>
                  ) : (
                    <span className="text-slate-400">{m.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="truncate text-lg font-semibold text-white sm:text-xl">
            {titulo}
          </h1>
        </div>
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
