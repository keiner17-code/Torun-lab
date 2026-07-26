-- Torun Monitor — esquema de base de datos (Neon PostgreSQL, DB: torun_monitor)
-- Ejecutar completo una sola vez contra una DB nueva y vacía.

-- Catálogo de agentes
CREATE TABLE IF NOT EXISTS agentes (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,            -- 'rossy', 'ista'
  nombre VARCHAR(100) NOT NULL,                -- 'Rossy — Rossanny Silva Eventos'
  cliente VARCHAR(100) NOT NULL,
  workspace_id VARCHAR(60),                    -- wrkspc_... de Anthropic
  color VARCHAR(7) DEFAULT '#D4A947',
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO agentes (slug, nombre, cliente) VALUES
  ('rossy', 'Rossy — Rossanny Silva Eventos', 'Rossanny Silva Eventos'),
  ('ista',  'Ista — Istana Café & Bistró',    'Istana Café & Bistró')
ON CONFLICT (slug) DO NOTHING;
-- workspace_id se actualiza cuando Keiner cree los workspaces en la Consola de Anthropic

-- Cada mensaje entrante o saliente
CREATE TABLE IF NOT EXISTS mensajes (
  id BIGSERIAL PRIMARY KEY,
  agente_id INT NOT NULL REFERENCES agentes(id),
  telefono VARCHAR(30) NOT NULL,               -- número del cliente (misma clave que session_id)
  direccion VARCHAR(3) NOT NULL CHECK (direccion IN ('in','out')),
  contenido TEXT NOT NULL,
  tipo VARCHAR(10) DEFAULT 'texto',            -- 'texto' | 'audio' | 'imagen'
  ejecucion_id VARCHAR(50),                    -- $execution.id de n8n (trazabilidad)
  ts TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mensajes_agente_ts ON mensajes (agente_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_mensajes_telefono ON mensajes (agente_id, telefono, ts);

-- Uso de tokens por bucket horario (viene de la Usage API)
CREATE TABLE IF NOT EXISTS uso_llm (
  id BIGSERIAL PRIMARY KEY,
  agente_id INT NOT NULL REFERENCES agentes(id),
  bucket_inicio TIMESTAMPTZ NOT NULL,          -- inicio del bucket (1h)
  modelo VARCHAR(80) NOT NULL,
  input_tokens BIGINT NOT NULL DEFAULT 0,      -- uncached input
  cache_read_tokens BIGINT NOT NULL DEFAULT 0,
  cache_creation_tokens BIGINT NOT NULL DEFAULT 0,
  output_tokens BIGINT NOT NULL DEFAULT 0,
  UNIQUE (agente_id, bucket_inicio, modelo)    -- permite UPSERT idempotente
);
CREATE INDEX IF NOT EXISTS idx_uso_llm_agente_bucket ON uso_llm (agente_id, bucket_inicio DESC);

-- Costo diario oficial (viene del Cost report)
CREATE TABLE IF NOT EXISTS costo_diario (
  id BIGSERIAL PRIMARY KEY,
  agente_id INT NOT NULL REFERENCES agentes(id),
  fecha DATE NOT NULL,
  costo_usd NUMERIC(12,6) NOT NULL DEFAULT 0,
  UNIQUE (agente_id, fecha)
);
CREATE INDEX IF NOT EXISTS idx_costo_diario_agente_fecha ON costo_diario (agente_id, fecha DESC);

-- Estado del sync (cursor)
CREATE TABLE IF NOT EXISTS sync_estado (
  clave VARCHAR(40) PRIMARY KEY,               -- 'uso_ultimo_bucket', 'costo_ultima_fecha', 'uso_lock'
  valor TEXT NOT NULL,
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);
