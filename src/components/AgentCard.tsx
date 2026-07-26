import Link from "next/link";
import { BadgeEstado } from "./BadgeEstado";
import { Sparkline } from "./Sparkline";
import { formatNumero, formatUsd } from "@/lib/format";
import type { Agente, CardStats } from "@/lib/queries";

export function AgentCard({ agente, stats }: { agente: Agente; stats: CardStats }) {
  return (
    <Link
      href={`/monitor/${agente.slug}`}
      className="card group block p-5 transition hover:border-gold/40"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-white group-hover:text-gold">
            {agente.nombre}
          </h3>
          <p className="text-xs text-slate-500">{agente.cliente}</p>
        </div>
        <BadgeEstado activo={agente.activo} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-slate-400">Mensajes hoy</p>
          <p className="text-lg font-semibold text-white">
            {formatNumero(stats.mensajesHoy)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Clientes hoy</p>
          <p className="text-lg font-semibold text-white">
            {formatNumero(stats.clientesHoy)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-3">
        <div>
          <p className="text-xs text-slate-400">Costo del mes</p>
          <p className="text-lg font-semibold text-gold">{formatUsd(stats.costoMes)}</p>
        </div>
        <Sparkline data={stats.sparkline.map((s) => s.mensajes)} color={agente.color} />
      </div>
    </Link>
  );
}
