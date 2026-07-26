import { sql } from "./db";
import { fetchUsageReport, fetchCostReport } from "./anthropic";

async function getSyncEstado(clave: string): Promise<string | null> {
  const rows = await sql`SELECT valor FROM sync_estado WHERE clave = ${clave}`;
  return (rows[0]?.valor as string) ?? null;
}

async function setSyncEstado(clave: string, valor: string): Promise<void> {
  await sql`
    INSERT INTO sync_estado (clave, valor, actualizado_en)
    VALUES (${clave}, ${valor}, NOW())
    ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor, actualizado_en = NOW()
  `;
}

async function getWorkspaceMap(): Promise<Map<string, number>> {
  const rows = await sql`
    SELECT id, workspace_id FROM agentes WHERE workspace_id IS NOT NULL
  `;
  const map = new Map<string, number>();
  for (const r of rows as any[]) map.set(String(r.workspace_id), Number(r.id));
  return map;
}

const TREINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;
const VEINTICUATRO_HORAS_MS = 24 * 60 * 60 * 1000;
const TRES_DIAS_MS = 3 * 24 * 60 * 60 * 1000;
const LOCK_TTL_MS = 5 * 60 * 1000;

export async function syncUso(): Promise<{ buckets: number; filas: number; agentesMapeados: number }> {
  const now = new Date();
  const cursorRaw = await getSyncEstado("uso_ultimo_bucket");
  const treintaDiasAtras = new Date(now.getTime() - TREINTA_DIAS_MS);
  const veinticuatroHorasAtras = new Date(now.getTime() - VEINTICUATRO_HORAS_MS);

  let startingAt = cursorRaw ? new Date(cursorRaw) : treintaDiasAtras;
  // Siempre re-sincroniza las últimas 24h: los datos de Anthropic pueden tardar
  // unos minutos en consolidarse. El UPSERT en uso_llm lo hace idempotente.
  if (startingAt > veinticuatroHorasAtras) startingAt = veinticuatroHorasAtras;
  if (startingAt < treintaDiasAtras) startingAt = treintaDiasAtras;

  const workspaceMap = await getWorkspaceMap();
  if (workspaceMap.size === 0) {
    return { buckets: 0, filas: 0, agentesMapeados: 0 };
  }

  const buckets = await fetchUsageReport({
    startingAt: startingAt.toISOString(),
    endingAt: now.toISOString(),
    bucketWidth: "1h",
    groupBy: ["workspace_id", "model"],
  });

  let filas = 0;
  for (const bucket of buckets) {
    for (const r of bucket.results) {
      if (!r.workspace_id) continue;
      const agenteId = workspaceMap.get(r.workspace_id);
      if (!agenteId) continue;

      const cacheCreation =
        (r.cache_creation?.ephemeral_1h_input_tokens ?? 0) +
        (r.cache_creation?.ephemeral_5m_input_tokens ?? 0);

      await sql`
        INSERT INTO uso_llm (
          agente_id, bucket_inicio, modelo,
          input_tokens, cache_read_tokens, cache_creation_tokens, output_tokens
        )
        VALUES (
          ${agenteId}, ${bucket.starting_at}, ${r.model ?? "desconocido"},
          ${r.uncached_input_tokens ?? 0}, ${r.cache_read_input_tokens ?? 0},
          ${cacheCreation}, ${r.output_tokens ?? 0}
        )
        ON CONFLICT (agente_id, bucket_inicio, modelo) DO UPDATE SET
          input_tokens = EXCLUDED.input_tokens,
          cache_read_tokens = EXCLUDED.cache_read_tokens,
          cache_creation_tokens = EXCLUDED.cache_creation_tokens,
          output_tokens = EXCLUDED.output_tokens
      `;
      filas++;
    }
  }

  await setSyncEstado("uso_ultimo_bucket", now.toISOString());
  return { buckets: buckets.length, filas, agentesMapeados: workspaceMap.size };
}

export async function syncCosto(): Promise<{ buckets: number; filas: number; agentesMapeados: number }> {
  const now = new Date();
  const tresDiasAtras = new Date(now.getTime() - TRES_DIAS_MS);

  const workspaceMap = await getWorkspaceMap();
  if (workspaceMap.size === 0) {
    return { buckets: 0, filas: 0, agentesMapeados: 0 };
  }

  const buckets = await fetchCostReport({
    startingAt: tresDiasAtras.toISOString(),
    endingAt: now.toISOString(),
    groupBy: ["workspace_id"],
  });

  let filas = 0;
  for (const bucket of buckets) {
    const fecha = bucket.starting_at.slice(0, 10);
    const totalesPorAgente = new Map<number, number>();

    for (const r of bucket.results) {
      if (!r.workspace_id) continue;
      const agenteId = workspaceMap.get(r.workspace_id);
      if (!agenteId) continue;
      const monto = Number(r.amount) / 100;
      totalesPorAgente.set(agenteId, (totalesPorAgente.get(agenteId) ?? 0) + monto);
    }

    for (const [agenteId, costoUsd] of totalesPorAgente) {
      await sql`
        INSERT INTO costo_diario (agente_id, fecha, costo_usd)
        VALUES (${agenteId}, ${fecha}, ${costoUsd})
        ON CONFLICT (agente_id, fecha) DO UPDATE SET costo_usd = EXCLUDED.costo_usd
      `;
      filas++;
    }
  }

  await setSyncEstado("costo_ultima_fecha", now.toISOString());
  return { buckets: buckets.length, filas, agentesMapeados: workspaceMap.size };
}

/**
 * Fallback para planes sin cron horario: se invoca al cargar /monitor.
 * Solo corre si el cursor tiene más de 1h de antigüedad, con un lock simple
 * en sync_estado para evitar corridas dobles.
 */
export async function syncUsoSiNecesario(): Promise<void> {
  try {
    const cursorRaw = await getSyncEstado("uso_ultimo_bucket");
    const cursor = cursorRaw ? new Date(cursorRaw).getTime() : 0;
    if (Date.now() - cursor < 60 * 60 * 1000) return;

    const lockRaw = await getSyncEstado("uso_lock");
    const lock = lockRaw ? new Date(lockRaw).getTime() : 0;
    if (Date.now() - lock < LOCK_TTL_MS) return;

    await setSyncEstado("uso_lock", new Date().toISOString());
    await syncUso();
  } catch (err) {
    console.error("syncUsoSiNecesario falló:", err);
  }
}
