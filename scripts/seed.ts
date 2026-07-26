/**
 * Seed de datos de prueba para desarrollar la UI de /monitor sin depender de
 * n8n ni de la Admin API de Anthropic. Ejecuta el schema (idempotente) y
 * luego genera ~45 días de mensajes, uso de tokens y costos para rossy/ista.
 *
 * Uso: npm run seed   (requiere DATABASE_URL en .env.local o .env)
 */
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

function loadEnvFile(file: string) {
  const p = path.resolve(process.cwd(), file);
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL no está definida (agrégala a .env.local)");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// ---------- utilidades aleatorias ----------
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}
function chance(p: number): boolean {
  return Math.random() < p;
}

const DIAS_HISTORIA = 45;
const MODELOS = ["claude-sonnet-4-5", "claude-haiku-4-5"] as const;
const PRECIOS_POR_MTOKEN: Record<string, { input: number; output: number; cacheRead: number; cacheCreation: number }> = {
  "claude-sonnet-4-5": { input: 3, output: 15, cacheRead: 0.3, cacheCreation: 3.75 },
  "claude-haiku-4-5": { input: 0.8, output: 4, cacheRead: 0.08, cacheCreation: 1 },
};

const MENSAJES_ROSSY_CLIENTE = [
  "Hola, buenas tardes. Quisiera cotizar para un cumpleaños de 30 personas",
  "¿Manejan servicio de fotografía también?",
  "¿Cuánto sería el anticipo?",
  "Perfecto, ¿para el sábado 20 tienen disponibilidad?",
  "Me pueden enviar el catálogo de decoración",
  "¿Incluye mesa de dulces?",
  "Gracias, quedo pendiente de la propuesta",
  "¿Hacen eventos infantiles?",
  "¿Cuál es el tiempo mínimo de reserva?",
  "Buenas, vi su trabajo en Instagram y me encantó",
];
const MENSAJES_ROSSY_AGENTE = [
  "¡Hola! Con gusto te ayudo. Para 30 personas el paquete básico incluye decoración, mobiliario y coordinación.",
  "Sí, trabajamos con fotógrafos aliados, el costo se cotiza aparte según horas de cobertura.",
  "El anticipo es del 40% para reservar la fecha, el resto se paga una semana antes del evento.",
  "Déjame revisar la disponibilidad para esa fecha y te confirmo en unos minutos.",
  "Claro, te comparto el catálogo con las opciones de temática y colores.",
  "Sí, la mesa de dulces se puede agregar, tiene un costo adicional según la cantidad de invitados.",
  "¡Con gusto! Cualquier otra duda quedo atenta.",
  "Sí, tenemos paquetes especiales para cumpleaños infantiles con animación incluida.",
  "El tiempo mínimo de reserva es de 2 semanas antes del evento.",
  "Muchas gracias, nos encanta poder ayudarte a planear tu evento.",
];

const MENSAJES_ISTA_CLIENTE = [
  "Hola, ¿tienen mesa disponible para 4 personas hoy en la noche?",
  "¿Cuál es el horario de atención?",
  "¿Hacen reservas para eventos privados?",
  "¿Tienen opciones veganas en el menú?",
  "¿El parqueo es gratuito?",
  "Quisiera pedir un pastel para llevar",
  "¿Aceptan tarjetas de crédito?",
  "¿Tienen wifi?",
  "Gracias por la atención, todo estuvo delicioso",
  "¿Puedo hacer un pedido para delivery?",
];
const MENSAJES_ISTA_AGENTE = [
  "¡Hola! Sí, tenemos disponibilidad. ¿A qué hora te gustaría la reserva?",
  "Nuestro horario es de martes a domingo, de 8:00am a 10:00pm.",
  "Sí, contamos con un salón privado para eventos hasta 40 personas.",
  "Sí, tenemos varias opciones veganas y vegetarianas en el menú.",
  "Sí, el parqueo es gratuito para nuestros clientes.",
  "Claro, ¿qué tamaño de pastel te gustaría y para qué hora lo necesitas?",
  "Sí, aceptamos todas las tarjetas y también pagos móviles.",
  "Sí, tenemos wifi gratis para los clientes del café.",
  "¡Muchas gracias a ti por visitarnos! Te esperamos pronto.",
  "Sí, hacemos delivery dentro de la zona, ¿cuál es tu dirección?",
];

function generarTelefonos(cantidad: number): string[] {
  const areaCodes = ["809", "829", "849"];
  const telefonos = new Set<string>();
  while (telefonos.size < cantidad) {
    const numero = `1${pick(areaCodes)}${randInt(1000000, 9999999)}`;
    telefonos.add(numero);
  }
  return Array.from(telefonos);
}

function horaConSesgo(): number {
  // más tráfico entre 11am-2pm y 6pm-9pm
  const franjas = [
    ...Array(3).fill([9, 11]),
    ...Array(6).fill([11, 14]),
    ...Array(3).fill([14, 18]),
    ...Array(6).fill([18, 21]),
    ...Array(2).fill([21, 23]),
  ];
  const [ini, fin] = pick(franjas);
  return randInt(ini, fin - 1);
}

interface AgenteSeed {
  slug: string;
  id: number;
  clientesFrases: string[];
  agenteFrases: string[];
  clientesPool: string[];
  probActivoPorDia: number;
}

async function main() {
  console.log("Aplicando schema (idempotente)...");
  const schemaPath = path.resolve(process.cwd(), "db/schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");
  const sinComentarios = schemaSql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  const statements = sinComentarios
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await sql(stmt);
  }

  const agentesRows = (await sql`SELECT id, slug FROM agentes`) as { id: number; slug: string }[];
  const idPorSlug = new Map(agentesRows.map((a) => [a.slug, a.id]));

  const agentes: AgenteSeed[] = [
    {
      slug: "rossy",
      id: idPorSlug.get("rossy")!,
      clientesFrases: MENSAJES_ROSSY_CLIENTE,
      agenteFrases: MENSAJES_ROSSY_AGENTE,
      clientesPool: generarTelefonos(22),
      probActivoPorDia: 0.35,
    },
    {
      slug: "ista",
      id: idPorSlug.get("ista")!,
      clientesFrases: MENSAJES_ISTA_CLIENTE,
      agenteFrases: MENSAJES_ISTA_AGENTE,
      clientesPool: generarTelefonos(35),
      probActivoPorDia: 0.45,
    },
  ];

  for (const agente of agentes) {
    if (!agente.id) {
      console.warn(`Agente '${agente.slug}' no existe en la tabla agentes, se omite.`);
      continue;
    }
    console.log(`\nLimpiando datos previos de '${agente.slug}'...`);
    await sql`DELETE FROM mensajes WHERE agente_id = ${agente.id}`;
    await sql`DELETE FROM uso_llm WHERE agente_id = ${agente.id}`;
    await sql`DELETE FROM costo_diario WHERE agente_id = ${agente.id}`;

    console.log(`Generando ${DIAS_HISTORIA} días de historia para '${agente.slug}'...`);

    const mensajesBulk: { telefono: string; direccion: "in" | "out"; contenido: string; tipo: string; ts: Date }[] = [];
    const usoPorClave = new Map<
      string,
      { bucketInicio: Date; modelo: string; input: number; cacheRead: number; cacheCreation: number; output: number }
    >();
    const costoPorFecha = new Map<string, number>();

    // primer contacto de cada teléfono, para simular nuevos vs recurrentes
    const primerContacto = new Map<string, number>();
    const clientesOrdenados = [...agente.clientesPool];
    // reparte las "primeras veces" a lo largo del historial
    clientesOrdenados.forEach((tel, i) => {
      primerContacto.set(tel, Math.floor((i / clientesOrdenados.length) * (DIAS_HISTORIA - 3)));
    });

    for (let diaOffset = DIAS_HISTORIA - 1; diaOffset >= 0; diaOffset--) {
      const fecha = new Date();
      fecha.setUTCHours(12, 0, 0, 0);
      fecha.setUTCDate(fecha.getUTCDate() - diaOffset);
      const diaSemana = fecha.getUTCDay();
      const factorFinDeSemana = diaSemana === 0 || diaSemana === 6 ? 1.3 : 1;

      const diaIndex = DIAS_HISTORIA - 1 - diaOffset;
      const clientesDisponibles = agente.clientesPool.filter(
        (tel) => (primerContacto.get(tel) ?? 0) <= diaIndex
      );

      let costoDelDia = 0;

      for (const telefono of clientesDisponibles) {
        const prob = agente.probActivoPorDia * factorFinDeSemana;
        if (!chance(prob)) continue;

        const numIntercambios = randInt(1, 4);
        for (let k = 0; k < numIntercambios; k++) {
          const hora = horaConSesgo();
          const minuto = randInt(0, 59);
          const tsIn = new Date(fecha);
          tsIn.setUTCHours(hora, minuto, randInt(0, 59), 0);

          const tipo = chance(0.08) ? "audio" : chance(0.05) ? "imagen" : "texto";
          const contenidoIn = pick(agente.clientesFrases);
          mensajesBulk.push({ telefono, direccion: "in", contenido: contenidoIn, tipo, ts: tsIn });

          const tsOut = new Date(tsIn.getTime() + randInt(15, 240) * 1000);
          const contenidoOut = pick(agente.agenteFrases);
          mensajesBulk.push({ telefono, direccion: "out", contenido: contenidoOut, tipo: "texto", ts: tsOut });

          // uso de tokens por este intercambio
          const modelo = chance(0.75) ? MODELOS[0] : MODELOS[1];
          const bucketInicio = new Date(tsOut);
          bucketInicio.setUTCMinutes(0, 0, 0);
          const clave = `${bucketInicio.toISOString()}|${modelo}`;

          const inputTokens = randInt(250, 900);
          const cacheRead = chance(0.6) ? randInt(200, 1800) : 0;
          const cacheCreation = chance(0.15) ? randInt(300, 1200) : 0;
          const outputTokens = randInt(60, 260);

          const acc = usoPorClave.get(clave) ?? {
            bucketInicio,
            modelo,
            input: 0,
            cacheRead: 0,
            cacheCreation: 0,
            output: 0,
          };
          acc.input += inputTokens;
          acc.cacheRead += cacheRead;
          acc.cacheCreation += cacheCreation;
          acc.output += outputTokens;
          usoPorClave.set(clave, acc);

          const precios = PRECIOS_POR_MTOKEN[modelo];
          costoDelDia +=
            (inputTokens / 1_000_000) * precios.input +
            (cacheRead / 1_000_000) * precios.cacheRead +
            (cacheCreation / 1_000_000) * precios.cacheCreation +
            (outputTokens / 1_000_000) * precios.output;
        }
      }

      const fechaStr = fecha.toISOString().slice(0, 10);
      costoPorFecha.set(fechaStr, (costoPorFecha.get(fechaStr) ?? 0) + costoDelDia);
    }

    // ---- insertar mensajes en bloques ----
    console.log(`  Insertando ${mensajesBulk.length} mensajes...`);
    const CHUNK = 500;
    for (let i = 0; i < mensajesBulk.length; i += CHUNK) {
      const chunk = mensajesBulk.slice(i, i + CHUNK);
      await sql`
        INSERT INTO mensajes (agente_id, telefono, direccion, contenido, tipo, ts)
        SELECT ${agente.id}, * FROM unnest(
          ${chunk.map((m) => m.telefono)}::text[],
          ${chunk.map((m) => m.direccion)}::text[],
          ${chunk.map((m) => m.contenido)}::text[],
          ${chunk.map((m) => m.tipo)}::text[],
          ${chunk.map((m) => m.ts.toISOString())}::timestamptz[]
        ) AS t(telefono, direccion, contenido, tipo, ts)
      `;
    }

    // ---- insertar uso_llm ----
    const usoRows = Array.from(usoPorClave.values());
    console.log(`  Insertando ${usoRows.length} filas de uso_llm...`);
    if (usoRows.length > 0) {
      await sql`
        INSERT INTO uso_llm (agente_id, bucket_inicio, modelo, input_tokens, cache_read_tokens, cache_creation_tokens, output_tokens)
        SELECT ${agente.id}, * FROM unnest(
          ${usoRows.map((r) => r.bucketInicio.toISOString())}::timestamptz[],
          ${usoRows.map((r) => r.modelo)}::text[],
          ${usoRows.map((r) => r.input)}::bigint[],
          ${usoRows.map((r) => r.cacheRead)}::bigint[],
          ${usoRows.map((r) => r.cacheCreation)}::bigint[],
          ${usoRows.map((r) => r.output)}::bigint[]
        ) AS t(bucket_inicio, modelo, input_tokens, cache_read_tokens, cache_creation_tokens, output_tokens)
        ON CONFLICT (agente_id, bucket_inicio, modelo) DO UPDATE SET
          input_tokens = EXCLUDED.input_tokens,
          cache_read_tokens = EXCLUDED.cache_read_tokens,
          cache_creation_tokens = EXCLUDED.cache_creation_tokens,
          output_tokens = EXCLUDED.output_tokens
      `;
    }

    // ---- insertar costo_diario ----
    const costoRows = Array.from(costoPorFecha.entries());
    console.log(`  Insertando ${costoRows.length} filas de costo_diario...`);
    if (costoRows.length > 0) {
      await sql`
        INSERT INTO costo_diario (agente_id, fecha, costo_usd)
        SELECT ${agente.id}, * FROM unnest(
          ${costoRows.map(([fecha]) => fecha)}::date[],
          ${costoRows.map(([, costo]) => costo)}::numeric[]
        ) AS t(fecha, costo_usd)
        ON CONFLICT (agente_id, fecha) DO UPDATE SET costo_usd = EXCLUDED.costo_usd
      `;
    }
  }

  console.log("\nSeed completo.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed falló:", err);
    process.exit(1);
  });
