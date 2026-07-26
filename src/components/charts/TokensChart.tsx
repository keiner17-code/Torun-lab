"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CAT, CHART_AXIS, CHART_GRID, CHART_TEXT_MUTED, tooltipStyle } from "@/lib/chartTheme";
import { formatDiaCorto } from "@/lib/dates";
import { formatTokens } from "@/lib/format";
import type { TokensPorDiaModelo } from "@/lib/queries";

interface DiaAgregado {
  fecha: string;
  input: number;
  output: number;
  cacheRead: number;
  cacheCreation: number;
  porModelo: TokensPorDiaModelo[];
}

const NOMBRES: Record<string, string> = {
  input: "Input",
  output: "Output",
  cacheRead: "Cache read",
  cacheCreation: "Cache creation",
};

function agregarPorDia(data: TokensPorDiaModelo[]): DiaAgregado[] {
  const porDia = new Map<string, DiaAgregado>();
  for (const r of data) {
    let d = porDia.get(r.fecha);
    if (!d) {
      d = { fecha: r.fecha, input: 0, output: 0, cacheRead: 0, cacheCreation: 0, porModelo: [] };
      porDia.set(r.fecha, d);
    }
    d.input += r.input;
    d.output += r.output;
    d.cacheRead += r.cacheRead;
    d.cacheCreation += r.cacheCreation;
    d.porModelo.push(r);
  }
  return Array.from(porDia.values()).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function TokensTooltip({ active, payload, label, porDia }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const dia = (porDia as DiaAgregado[]).find((d) => d.fecha === label);

  return (
    <div style={tooltipStyle}>
      <p className="mb-1.5 font-medium text-white">{formatDiaCorto(String(label))}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center justify-between gap-4 text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {NOMBRES[p.dataKey] ?? p.dataKey}
          </span>
          <span className="font-medium text-white">{formatTokens(p.value)}</span>
        </p>
      ))}
      {dia && dia.porModelo.length > 1 && (
        <div className="mt-2 border-t border-white/10 pt-2">
          <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-500">Por modelo</p>
          {dia.porModelo.map((m) => {
            const total = m.input + m.output + m.cacheRead + m.cacheCreation;
            return (
              <p key={m.modelo} className="flex justify-between gap-4 text-[11px] text-slate-400">
                <span>{m.modelo}</span>
                <span>{formatTokens(total)}</span>
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TokensChart({ data }: { data: TokensPorDiaModelo[] }) {
  const chartData = useMemo(() => agregarPorDia(data), [data]);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
        <XAxis
          dataKey="fecha"
          tickFormatter={formatDiaCorto}
          tick={{ fill: CHART_TEXT_MUTED, fontSize: 11 }}
          axisLine={{ stroke: CHART_AXIS }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: CHART_TEXT_MUTED, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatTokens(v)}
        />
        <Tooltip content={<TokensTooltip porDia={chartData} />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: CHART_TEXT_MUTED }}
          formatter={(v) => NOMBRES[v] ?? v}
        />
        <Bar dataKey="input" name="input" stackId="t" fill={CAT.blue} />
        <Bar dataKey="output" name="output" stackId="t" fill={CAT.aqua} />
        <Bar dataKey="cacheRead" name="cacheRead" stackId="t" fill={CAT.gold} />
        <Bar dataKey="cacheCreation" name="cacheCreation" stackId="t" fill={CAT.green} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
