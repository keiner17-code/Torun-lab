import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { ChatBubble, SeparadorDia } from "@/components/ChatBubble";
import { getAgentePorSlug, getTranscript } from "@/lib/queries";
import { formatTelefono } from "@/lib/format";
import { formatFechaLarga, APP_TIMEZONE } from "@/lib/dates";

export const dynamic = "force-dynamic";

function fechaLocal(ts: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ts));
}

export default async function TranscriptPage({
  params,
  searchParams,
}: {
  params: { slug: string; telefono: string };
  searchParams: { antes?: string };
}) {
  const agente = await getAgentePorSlug(params.slug);
  if (!agente) notFound();

  const telefono = decodeURIComponent(params.telefono);
  const { items, hasMore } = await getTranscript(agente.id, telefono, {
    limit: 50,
    before: searchParams.antes,
  });

  const basePath = `/monitor/${agente.slug}/conversaciones/${encodeURIComponent(telefono)}`;
  const oldestTs = items[0]?.ts;

  return (
    <>
      <TopNav
        titulo={formatTelefono(telefono)}
        migas={[
          { label: "Torun Monitor", href: "/monitor" },
          { label: agente.nombre, href: `/monitor/${agente.slug}` },
          { label: "Conversaciones", href: `/monitor/${agente.slug}/conversaciones` },
          { label: formatTelefono(telefono) },
        ]}
      />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:px-6">
        {searchParams.antes && (
          <div className="mb-3 text-center">
            <Link
              href={basePath}
              className="text-xs text-gold hover:underline"
            >
              Ver mensajes más recientes
            </Link>
          </div>
        )}

        {hasMore && oldestTs && (
          <div className="mb-3 text-center">
            <Link
              href={`${basePath}?antes=${encodeURIComponent(oldestTs)}`}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-white/25"
            >
              Ver 50 mensajes anteriores
            </Link>
          </div>
        )}

        {items.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-400">
            No hay mensajes en esta conversación.
          </div>
        ) : (
          <div className="space-y-1.5">
            {items.map((m, i) => {
              const diaActual = fechaLocal(m.ts);
              const diaAnterior = i > 0 ? fechaLocal(items[i - 1].ts) : null;
              const mostrarSeparador = diaActual !== diaAnterior;
              return (
                <div key={m.id}>
                  {mostrarSeparador && <SeparadorDia fecha={formatFechaLarga(diaActual)} />}
                  <ChatBubble mensaje={m} />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
