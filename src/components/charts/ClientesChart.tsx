"use client";

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
import type { ClientesPorDia } from "@/lib/queries";

export function ClientesChart({ data }: { data: ClientesPorDia[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
        <XAxis
          dataKey="fecha"
          tickFormatter={formatDiaCorto}
          tick={{ fill: CHART_TEXT_MUTED, fontSize: 11 }}
          axisLine={{ stroke: CHART_AXIS }}
          tickLine={false}
        />
        <YAxis tick={{ fill: CHART_TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(v) => formatDiaCorto(String(v))}
          labelStyle={{ color: "#fff", marginBottom: 4 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: CHART_TEXT_MUTED }}
          formatter={(v) => (v === "nuevos" ? "Nuevos" : "Recurrentes")}
        />
        <Bar dataKey="nuevos" name="nuevos" stackId="c" fill={CAT.blue} radius={[0, 0, 0, 0]} />
        <Bar dataKey="recurrentes" name="recurrentes" stackId="c" fill={CAT.aqua} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
