"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CAT, CHART_AXIS, CHART_GRID, CHART_TEXT_MUTED, tooltipStyle } from "@/lib/chartTheme";
import { formatDiaCorto } from "@/lib/dates";
import type { MensajesPorDia } from "@/lib/queries";

export function MensajesChart({ data }: { data: MensajesPorDia[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
          formatter={(v) => (v === "in" ? "Entrantes (cliente)" : "Salientes (agente)")}
        />
        <Line
          type="monotone"
          dataKey="in"
          name="in"
          stroke={CAT.blue}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="out"
          name="out"
          stroke={CAT.aqua}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
