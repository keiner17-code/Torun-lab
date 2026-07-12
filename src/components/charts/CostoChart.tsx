"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CAT, CHART_AXIS, CHART_GRID, CHART_TEXT_MUTED, tooltipStyle } from "@/lib/chartTheme";
import { formatDiaCorto } from "@/lib/dates";
import { formatUsd } from "@/lib/format";
import type { CostoPorDia } from "@/lib/queries";

export function CostoChart({ data }: { data: CostoPorDia[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="costoFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CAT.blue} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CAT.blue} stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(v) => formatDiaCorto(String(v))}
          labelStyle={{ color: "#fff", marginBottom: 4 }}
          formatter={(value: number) => [formatUsd(value), "Costo"]}
        />
        <Area
          type="monotone"
          dataKey="costoUsd"
          name="Costo"
          stroke={CAT.blue}
          strokeWidth={2}
          fill="url(#costoFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
