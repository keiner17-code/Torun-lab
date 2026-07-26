export const APP_TIMEZONE = process.env.APP_TIMEZONE || "America/Santo_Domingo";

export type RangeKey = "hoy" | "7d" | "30d" | "custom";

export function todayInTz(tz: string = APP_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export interface ResolvedRange {
  desde: string;
  hasta: string;
  rangeKey: RangeKey;
}

export function resolveRange(params: {
  range?: string;
  desde?: string;
  hasta?: string;
}): ResolvedRange {
  const hoy = todayInTz();
  const rangeKey = (params.range as RangeKey) || "7d";

  if (rangeKey === "custom" && params.desde && params.hasta) {
    return { desde: params.desde, hasta: params.hasta, rangeKey };
  }
  if (rangeKey === "hoy") {
    return { desde: hoy, hasta: hoy, rangeKey: "hoy" };
  }
  if (rangeKey === "30d") {
    return { desde: addDays(hoy, -29), hasta: hoy, rangeKey: "30d" };
  }
  return { desde: addDays(hoy, -6), hasta: hoy, rangeKey: "7d" };
}

const DAY_LABELS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export function formatDiaCorto(fecha: string): string {
  const d = new Date(`${fecha}T00:00:00Z`);
  return `${DAY_LABELS[d.getUTCDay()]} ${d.getUTCDate()}`;
}

export function formatFechaLarga(fecha: string, tz: string = APP_TIMEZONE): string {
  const d = new Date(`${fecha}T12:00:00Z`);
  return new Intl.DateTimeFormat("es-DO", {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatHora(ts: string | Date, tz: string = APP_TIMEZONE): string {
  const d = typeof ts === "string" ? new Date(ts) : ts;
  return new Intl.DateTimeFormat("es-DO", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export function formatFechaHoraCorta(ts: string | Date, tz: string = APP_TIMEZONE): string {
  const d = typeof ts === "string" ? new Date(ts) : ts;
  return new Intl.DateTimeFormat("es-DO", {
    timeZone: tz,
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}
