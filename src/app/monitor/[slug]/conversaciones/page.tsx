import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { getAgentePorSlug, getConversaciones } from "@/lib/queries";
import { formatTelefono } from "@/lib/format";
import { formatFechaHoraCorta } from "@/lib/dates";

export const revalidate = 30;

const PAGE_SIZE = 50;

export default async function ConversacionesPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { q?: string; pagina?: string };
}) {
  const agente = await getAgentePorSlug(params.slug);
  if (!agente) notFound();

  const pagina = Math.max(1, Number(searchParams.pagina ?? "1") || 1);
  const busqueda = searchParams.q ?? "";

  const { items, total } = await getConversaciones(agente.id, {
    busqueda,
    limit: PAGE_SIZE,
    offset: (pagina - 1) * PAGE_SIZE,
  });

  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const basePath = `/monitor/${agente.slug}/conversaciones`;

  return (
    <>
      <TopNav
        titulo="Conversaciones"
        migas={[
          { label: "Torun Monitor", href: "/monitor" },
          { label: agente.nombre, href: `/monitor/${agente.slug}` },
          { label: "Conversaciones" },
        ]}
      />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
        <form action={basePath} method="GET" className="mb-4">
          <input
            type="search"
            name="q"
            defaultValue={busqueda}
            placeholder="Buscar por número de teléfono..."
            className="w-full rounded-xl border border-white/10 bg-navy-900 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </form>

        {items.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-400">
            No hay conversaciones{busqueda ? ` que coincidan con "${busqueda}"` : ""} todavía.
          </div>
        ) : (
          <ul className="card divide-y divide-white/5">
            {items.map((c) => (
              <li key={c.telefono}>
                <Link
                  href={`${basePath}/${encodeURIComponent(c.telefono)}`}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{formatTelefono(c.telefono)}</p>
                      {c.tieneAudio && <span className="chip bg-violet-500/15 text-violet-300">🎙️ audio</span>}
                    </div>
                    <p className="truncate text-sm text-slate-400">{c.ultimoMensaje}</p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    <span className="text-xs text-slate-500">{formatFechaHoraCorta(c.ultimoTs)}</span>
                    <span className="chip bg-white/5 text-slate-400">{c.totalMensajes} msj</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {totalPaginas > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <Link
              href={`${basePath}?q=${encodeURIComponent(busqueda)}&pagina=${pagina - 1}`}
              aria-disabled={pagina <= 1}
              className={`rounded-lg border border-white/10 px-3 py-1.5 ${
                pagina <= 1 ? "pointer-events-none opacity-30" : "hover:border-white/25"
              }`}
            >
              ← Anterior
            </Link>
            <span>
              Página {pagina} de {totalPaginas}
            </span>
            <Link
              href={`${basePath}?q=${encodeURIComponent(busqueda)}&pagina=${pagina + 1}`}
              aria-disabled={pagina >= totalPaginas}
              className={`rounded-lg border border-white/10 px-3 py-1.5 ${
                pagina >= totalPaginas ? "pointer-events-none opacity-30" : "hover:border-white/25"
              }`}
            >
              Siguiente →
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
