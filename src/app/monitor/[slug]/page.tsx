import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { RangeSelector } from "@/components/RangeSelector";
import { KpiCard } from "@/components/KpiCard";
import { ChartCard } from "@/components/ChartCard";
import { BadgeEstado } from "@/components/BadgeEstado";
import { MensajesChart } from "@/components/charts/MensajesChart";
import { ClientesChart } from "@/components/charts/ClientesChart";
import { CostoChart } from "@/components/charts/CostoChart";
import { TokensChart } from "@/components/charts/TokensChart";
import { HoraChart } from "@/components/charts/HoraChart";
import {
  getAgentePorSlug,
  getKpis,
  getMensajesPorDia,
  getClientesPorDia,
  getCostoPorDia,
  getTokensPorDiaYModelo,
  getDistribucionHoraria,
} from "@/lib/queries";
import { resolveRange } from "@/lib/dates";
import { formatNumero, formatTokens, formatUsd } from "@/lib/format";

export const revalidate = 60;

export default async function AgentePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { range?: string; desde?: string; hasta?: string };
}) {
  const agente = await getAgentePorSlug(params.slug);
  if (!agente) notFound();

  const { desde, hasta, rangeKey } = resolveRange(searchParams);

  const [kpis, mensajes, clientes, costo, tokens, horas] = await Promise.all([
    getKpis(agente.id, desde, hasta),
    getMensajesPorDia(agente.id, desde, hasta),
    getClientesPorDia(agente.id, desde, hasta),
    getCostoPorDia(agente.id, desde, hasta),
    getTokensPorDiaYModelo(agente.id, desde, hasta),
    getDistribucionHoraria(agente.id, desde, hasta),
  ]);

  const basePath = `/monitor/${agente.slug}`;

  return (
    <>
      <TopNav
        titulo={agente.nombre}
        migas={[{ label: "Torun Monitor", href: "/monitor" }, { label: agente.nombre }]}
      />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BadgeEstado activo={agente.activo} />
            <Link
              href={`${basePath}/conversaciones`}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-gold/40 hover:text-gold"
            >
              Ver conversaciones →
            </Link>
          </div>
          <RangeSelector basePath={basePath} rangeKey={rangeKey} desde={desde} hasta={hasta} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <KpiCard label="Clientes únicos" value={formatNumero(kpis.clientesUnicos)} />
          <KpiCard label="Mensajes entrantes" value={formatNumero(kpis.mensajesIn)} />
          <KpiCard label="Mensajes salientes" value={formatNumero(kpis.mensajesOut)} />
          <KpiCard label="Tokens totales" value={formatTokens(kpis.tokensTotales)} />
          <KpiCard label="Cache hit" value={`${kpis.cacheHitPct.toFixed(1)}%`} />
          <KpiCard
            label="Costo del período"
            value={formatUsd(kpis.costoUsd)}
            sub={`${formatUsd(kpis.costoPromedioPorCliente)} / cliente`}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Mensajes por día" subtitle="Entrantes (cliente) vs. salientes (agente)">
            <MensajesChart data={mensajes} />
          </ChartCard>
          <ChartCard title="Clientes únicos por día" subtitle="Nuevos vs. recurrentes">
            <ClientesChart data={clientes} />
          </ChartCard>
          <ChartCard title="Costo USD por día" subtitle="Dato oficial — Cost Report de Anthropic">
            <CostoChart data={costo} />
          </ChartCard>
          <ChartCard title="Tokens por día" subtitle="Input, output, cache read y cache creation">
            <TokensChart data={tokens} />
          </ChartCard>
          <ChartCard
            title="Distribución por hora del día"
            subtitle="Cuándo escriben los clientes"
          >
            <HoraChart data={horas} />
          </ChartCard>
        </div>
      </main>
    </>
  );
}
