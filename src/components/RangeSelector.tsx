import Link from "next/link";
import type { RangeKey } from "@/lib/dates";

const OPCIONES: { key: RangeKey; label: string }[] = [
  { key: "hoy", label: "Hoy" },
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
];

export function RangeSelector({
  basePath,
  rangeKey,
  desde,
  hasta,
}: {
  basePath: string;
  rangeKey: RangeKey;
  desde: string;
  hasta: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {OPCIONES.map((o) => (
        <Link
          key={o.key}
          href={`${basePath}?range=${o.key}`}
          className={`rounded-full px-3 py-1.5 text-sm transition ${
            rangeKey === o.key
              ? "bg-gold text-navy-950 font-medium"
              : "border border-white/10 text-slate-300 hover:border-white/25"
          }`}
        >
          {o.label}
        </Link>
      ))}

      <details className="relative">
        <summary
          className={`cursor-pointer list-none rounded-full px-3 py-1.5 text-sm transition ${
            rangeKey === "custom"
              ? "bg-gold text-navy-950 font-medium"
              : "border border-white/10 text-slate-300 hover:border-white/25"
          }`}
        >
          Personalizado
        </summary>
        <form
          action={basePath}
          method="GET"
          className="card absolute right-0 z-20 mt-2 flex flex-col gap-3 p-4"
          style={{ width: 260 }}
        >
          <input type="hidden" name="range" value="custom" />
          <label className="text-xs text-slate-400">
            Desde
            <input
              type="date"
              name="desde"
              defaultValue={desde}
              className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-2.5 py-1.5 text-sm text-white"
            />
          </label>
          <label className="text-xs text-slate-400">
            Hasta
            <input
              type="date"
              name="hasta"
              defaultValue={hasta}
              className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-2.5 py-1.5 text-sm text-white"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-navy-950"
          >
            Aplicar
          </button>
        </form>
      </details>
    </div>
  );
}
