"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CAT, CHART_AXIS, CHART_GRID, CHART_TEXT_MUTED, tooltipStyle } from "@/lib/chartTheme";
import type { DistribucionHora } from "@/lib/queries";

export function HoraChart({ data }: { data: DistribucionHora[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
        <XAxis
          dataKey="hora"
          tickFormatter={(h) => `${h}h`}
          interval={1}
          tick={{ fill: CHART_TEXT_MUTED, fontSize: 10 }}
          axisLine={{ stroke: CHART_AXIS }}
          tickLine={false}
        />
        <YAxis tick={{ fill: CHART_TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(h) => `${h}:00 – ${h}:59`}
          labelStyle={{ color: "#fff", marginBottom: 4 }}
          formatter={(v: number) => [v, "Mensajes"]}
        />
        <Bar dataKey="mensajes" fill={CAT.gold} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
