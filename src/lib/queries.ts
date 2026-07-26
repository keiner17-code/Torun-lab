import { sql } from "./db";
import { APP_TIMEZONE } from "./dates";

export interface Agente {
  id: number;
  slug: string;
  nombre: string;
  cliente: string;
  workspace_id: string | null;
  color: string;
  activo: boolean;
}

export async function getAgentes(): Promise<Agente[]> {
  const rows = await sql`
    SELECT id, slug, nombre, cliente, workspace_id, color, activo
    FROM agentes
    ORDER BY nombre
  `;
  return rows as unknown as Agente[];
}

export async function getAgentePorSlug(slug: string): Promise<Agente | null> {
  const rows = await sql`
    SELECT id, slug, nombre, cliente, workspace_id, color, activo
    FROM agentes
    WHERE slug = ${slug}
  `;
  return (rows[0] as Agente) ?? null;
}

export interface CardStats {
  mensajesHoy: number;
  clientesHoy: number;
  costoMes: number;
  sparkline: { fecha: string; mensajes: number }[];
}

export async function getCardStats(agenteId: number, hoy: string): Promise<CardStats> {
  const tz = APP_TIMEZONE;

  const [hoyRows, mesRows, sparkRows] = await Promise.all([
    sql`
      SELECT
        COUNT(*) FILTER (WHERE direccion = 'in' OR direccion = 'out') AS mensajes,
        COUNT(DISTINCT telefono) FILTER (WHERE direccion = 'in') AS clientes
      FROM mensajes
      WHERE agente_id = ${agenteId}
        AND (ts AT TIME ZONE ${tz})::date = ${hoy}::date
    `,
    sql`
      SELECT COALESCE(SUM(costo_usd), 0) AS costo
      FROM costo_diario
      WHERE agente_id = ${agenteId}
        AND date_trunc('month', fecha) = date_trunc('month', ${hoy}::date)
    `,
    sql`
      SELECT (ts AT TIME ZONE ${tz})::date AS fecha, COUNT(*) AS mensajes
      FROM mensajes
      WHERE agente_id = ${agenteId}
        AND (ts AT TIME ZONE ${tz})::date > ${hoy}::date - 7
        AND (ts AT TIME ZONE ${tz})::date <= ${hoy}::date
      GROUP BY 1
      ORDER BY 1
    `,
  ]);

  return {
    mensajesHoy: Number(hoyRows[0]?.mensajes ?? 0),
    clientesHoy: Number(hoyRows[0]?.clientes ?? 0),
    costoMes: Number(mesRows[0]?.costo ?? 0),
    sparkline: (sparkRows as any[]).map((r) => ({
      fecha: String(r.fecha),
      mensajes: Number(r.mensajes),
    })),
  };
}

export interface Kpis {
  clientesUnicos: number;
  mensajesIn: number;
  mensajesOut: number;
  tokensTotales: number;
  cacheHitPct: number;
  costoUsd: number;
  costoPromedioPorCliente: number;
}

export async function getKpis(agenteId: number, desde: string, hasta: string): Promise<Kpis> {
  const tz = APP_TIMEZONE;

  const [mensajesRows, tokensRows, costoRows] = await Promise.all([
    sql`
      SELECT
        COUNT(DISTINCT telefono) FILTER (WHERE direccion = 'in') AS clientes,
        COUNT(*) FILTER (WHERE direccion = 'in') AS msg_in,
        COUNT(*) FILTER (WHERE direccion = 'out') AS msg_out
      FROM mensajes
      WHERE agente_id = ${agenteId}
        AND (ts AT TIME ZONE ${tz})::date BETWEEN ${desde}::date AND ${hasta}::date
    `,
    sql`
      SELECT
        COALESCE(SUM(input_tokens), 0) AS input_tokens,
        COALESCE(SUM(cache_read_tokens), 0) AS cache_read_tokens,
        COALESCE(SUM(cache_creation_tokens), 0) AS cache_creation_tokens,
        COALESCE(SUM(output_tokens), 0) AS output_tokens
      FROM uso_llm
      WHERE agente_id = ${agenteId}
        AND (bucket_inicio AT TIME ZONE ${tz})::date BETWEEN ${desde}::date AND ${hasta}::date
    `,
    sql`
      SELECT COALESCE(SUM(costo_usd), 0) AS costo
      FROM costo_diario
      WHERE agente_id = ${agenteId}
        AND fecha BETWEEN ${desde}::date AND ${hasta}::date
    `,
  ]);

  const clientesUnicos = Number(mensajesRows[0]?.clientes ?? 0);
  const mensajesIn = Number(mensajesRows[0]?.msg_in ?? 0);
  const mensajesOut = Number(mensajesRows[0]?.msg_out ?? 0);

  const inputTokens = Number(tokensRows[0]?.input_tokens ?? 0);
  const cacheRead = Number(tokensRows[0]?.cache_read_tokens ?? 0);
  const cacheCreation = Number(tokensRows[0]?.cache_creation_tokens ?? 0);
  const outputTokens = Number(tokensRows[0]?.output_tokens ?? 0);
  const tokensTotales = inputTokens + cacheRead + cacheCreation + outputTokens;
  const inputTotal = inputTokens + cacheRead + cacheCreation;
  const cacheHitPct = inputTotal > 0 ? (cacheRead / inputTotal) * 100 : 0;

  const costoUsd = Number(costoRows[0]?.costo ?? 0);
  const costoPromedioPorCliente = clientesUnicos > 0 ? costoUsd / clientesUnicos : 0;

  return {
    clientesUnicos,
    mensajesIn,
    mensajesOut,
    tokensTotales,
    cacheHitPct,
    costoUsd,
    costoPromedioPorCliente,
  };
}

export interface MensajesPorDia {
  fecha: string;
  in: number;
  out: number;
}

export async function getMensajesPorDia(
  agenteId: number,
  desde: string,
  hasta: string
): Promise<MensajesPorDia[]> {
  const tz = APP_TIMEZONE;
  const rows = await sql`
    SELECT
      (ts AT TIME ZONE ${tz})::date AS fecha,
      COUNT(*) FILTER (WHERE direccion = 'in') AS msg_in,
      COUNT(*) FILTER (WHERE direccion = 'out') AS msg_out
    FROM mensajes
    WHERE agente_id = ${agenteId}
      AND (ts AT TIME ZONE ${tz})::date BETWEEN ${desde}::date AND ${hasta}::date
    GROUP BY 1
    ORDER BY 1
  `;
  return (rows as any[]).map((r) => ({
    fecha: String(r.fecha),
    in: Number(r.msg_in),
    out: Number(r.msg_out),
  }));
}

export interface ClientesPorDia {
  fecha: string;
  nuevos: number;
  recurrentes: number;
}

export async function getClientesPorDia(
  agenteId: number,
  desde: string,
  hasta: string
): Promise<ClientesPorDia[]> {
  const tz = APP_TIMEZONE;
  const rows = await sql`
    WITH primera AS (
      SELECT telefono, MIN(ts) AS primer_ts
      FROM mensajes
      WHERE agente_id = ${agenteId} AND direccion = 'in'
      GROUP BY telefono
    ),
    dias AS (
      SELECT DISTINCT (ts AT TIME ZONE ${tz})::date AS dia, telefono
      FROM mensajes
      WHERE agente_id = ${agenteId}
        AND direccion = 'in'
        AND (ts AT TIME ZONE ${tz})::date BETWEEN ${desde}::date AND ${hasta}::date
    )
    SELECT
      dias.dia AS fecha,
      COUNT(*) FILTER (WHERE (primera.primer_ts AT TIME ZONE ${tz})::date = dias.dia) AS nuevos,
      COUNT(*) FILTER (WHERE (primera.primer_ts AT TIME ZONE ${tz})::date <> dias.dia) AS recurrentes
    FROM dias
    JOIN primera ON primera.telefono = dias.telefono
    GROUP BY dias.dia
    ORDER BY dias.dia
  `;
  return (rows as any[]).map((r) => ({
    fecha: String(r.fecha),
    nuevos: Number(r.nuevos),
    recurrentes: Number(r.recurrentes),
  }));
}

export interface CostoPorDia {
  fecha: string;
  costoUsd: number;
}

export async function getCostoPorDia(
  agenteId: number,
  desde: string,
  hasta: string
): Promise<CostoPorDia[]> {
  const rows = await sql`
    SELECT fecha, costo_usd
    FROM costo_diario
    WHERE agente_id = ${agenteId}
      AND fecha BETWEEN ${desde}::date AND ${hasta}::date
    ORDER BY fecha
  `;
  return (rows as any[]).map((r) => ({
    fecha: String(r.fecha),
    costoUsd: Number(r.costo_usd),
  }));
}

export interface TokensPorDiaModelo {
  fecha: string;
  modelo: string;
  input: number;
  output: number;
  cacheRead: number;
  cacheCreation: number;
}

export async function getTokensPorDiaYModelo(
  agenteId: number,
  desde: string,
  hasta: string
): Promise<TokensPorDiaModelo[]> {
  const tz = APP_TIMEZONE;
  const rows = await sql`
    SELECT
      (bucket_inicio AT TIME ZONE ${tz})::date AS fecha,
      modelo,
      SUM(input_tokens) AS input_tokens,
      SUM(output_tokens) AS output_tokens,
      SUM(cache_read_tokens) AS cache_read_tokens,
      SUM(cache_creation_tokens) AS cache_creation_tokens
    FROM uso_llm
    WHERE agente_id = ${agenteId}
      AND (bucket_inicio AT TIME ZONE ${tz})::date BETWEEN ${desde}::date AND ${hasta}::date
    GROUP BY 1, 2
    ORDER BY 1, 2
  `;
  return (rows as any[]).map((r) => ({
    fecha: String(r.fecha),
    modelo: String(r.modelo),
    input: Number(r.input_tokens),
    output: Number(r.output_tokens),
    cacheRead: Number(r.cache_read_tokens),
    cacheCreation: Number(r.cache_creation_tokens),
  }));
}

export interface DistribucionHora {
  hora: number;
  mensajes: number;
}

export async function getDistribucionHoraria(
  agenteId: number,
  desde: string,
  hasta: string
): Promise<DistribucionHora[]> {
  const tz = APP_TIMEZONE;
  const rows = await sql`
    SELECT
      EXTRACT(HOUR FROM ts AT TIME ZONE ${tz})::int AS hora,
      COUNT(*) AS mensajes
    FROM mensajes
    WHERE agente_id = ${agenteId}
      AND direccion = 'in'
      AND (ts AT TIME ZONE ${tz})::date BETWEEN ${desde}::date AND ${hasta}::date
    GROUP BY 1
    ORDER BY 1
  `;
  const byHour = new Map<number, number>();
  for (const r of rows as any[]) byHour.set(Number(r.hora), Number(r.mensajes));
  return Array.from({ length: 24 }, (_, hora) => ({
    hora,
    mensajes: byHour.get(hora) ?? 0,
  }));
}

export interface ConversacionResumen {
  telefono: string;
  ultimoMensaje: string;
  ultimoTs: string;
  totalMensajes: number;
  tieneAudio: boolean;
}

export async function getConversaciones(
  agenteId: number,
  opts: { busqueda?: string; limit?: number; offset?: number } = {}
): Promise<{ items: ConversacionResumen[]; total: number }> {
  const busqueda = opts.busqueda?.trim() || "";
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;
  const patron = `%${busqueda.replace(/\D/g, "")}%`;

  const [rows, countRows] = await Promise.all([
    sql`
      SELECT DISTINCT ON (telefono)
        telefono,
        contenido AS ultimo_mensaje,
        ts AS ultimo_ts,
        COUNT(*) OVER (PARTITION BY telefono) AS total_mensajes,
        BOOL_OR(tipo <> 'texto') OVER (PARTITION BY telefono) AS tiene_audio
      FROM mensajes
      WHERE agente_id = ${agenteId}
        AND (${busqueda} = '' OR telefono LIKE ${patron})
      ORDER BY telefono, ts DESC
    `,
    sql`
      SELECT COUNT(DISTINCT telefono) AS total
      FROM mensajes
      WHERE agente_id = ${agenteId}
        AND (${busqueda} = '' OR telefono LIKE ${patron})
    `,
  ]);

  const items = (rows as any[])
    .sort((a, b) => new Date(b.ultimo_ts).getTime() - new Date(a.ultimo_ts).getTime())
    .slice(offset, offset + limit)
    .map((r) => ({
      telefono: String(r.telefono),
      ultimoMensaje: String(r.ultimo_mensaje),
      ultimoTs: String(r.ultimo_ts),
      totalMensajes: Number(r.total_mensajes),
      tieneAudio: Boolean(r.tiene_audio),
    }));

  return { items, total: Number(countRows[0]?.total ?? 0) };
}

export interface Mensaje {
  id: number;
  direccion: "in" | "out";
  contenido: string;
  tipo: string;
  ts: string;
}

export async function getTranscript(
  agenteId: number,
  telefono: string,
  opts: { limit?: number; before?: string } = {}
): Promise<{ items: Mensaje[]; hasMore: boolean }> {
  const limit = opts.limit ?? 50;
  const rows = opts.before
    ? await sql`
        SELECT id, direccion, contenido, tipo, ts
        FROM mensajes
        WHERE agente_id = ${agenteId} AND telefono = ${telefono}
          AND ts < ${opts.before}
        ORDER BY ts DESC
        LIMIT ${limit + 1}
      `
    : await sql`
        SELECT id, direccion, contenido, tipo, ts
        FROM mensajes
        WHERE agente_id = ${agenteId} AND telefono = ${telefono}
        ORDER BY ts DESC
        LIMIT ${limit + 1}
      `;

  const hasMore = rows.length > limit;
  const page = (rows as any[]).slice(0, limit).reverse();

  return {
    items: page.map((r) => ({
      id: Number(r.id),
      direccion: r.direccion,
      contenido: String(r.contenido),
      tipo: String(r.tipo),
      ts: String(r.ts),
    })),
    hasMore,
  };
}
