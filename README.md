# Torun Monitor

Módulo de monitoreo y observabilidad de agentes IA, dentro de **Torun Lab**.
Next.js 14 (App Router) + Tailwind + Recharts + Neon PostgreSQL + Vercel.

Permite, por agente (Rossy / Ista / los que se agreguen después):

- Ver cuántos clientes escribieron (únicos, nuevos vs. recurrentes) por día.
- Leer conversaciones completas en una vista estilo chat de WhatsApp.
- Medir tokens y costo real en USD por agente — datos oficiales de la Usage &
  Cost Admin API de Anthropic, no estimados.
- Gráficas: mensajes/día, clientes/día, tokens/día, costo/día, distribución
  horaria.

Dos flujos de datos independientes:

| Dato | Fuente | Mecanismo |
|---|---|---|
| Mensajes y conversaciones | n8n (nodos de logging) | INSERT directo a Neon en cada mensaje |
| Tokens y costos | Anthropic Usage & Cost Admin API | Vercel Cron hace UPSERT en Neon cada hora/día |

---

## 1. Puesta en marcha

### 1.1 Base de datos

Crea una base de datos nueva `torun_monitor` en Neon y ejecuta el schema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

Es idempotente (`CREATE TABLE IF NOT EXISTS`), se puede correr varias veces sin
problema. Inserta automáticamente las filas de `rossy` e `ista` en `agentes`.

### 1.2 Variables de entorno

Copia `.env.example` a `.env.local` y complétalo:

```
DATABASE_URL=postgres://usuario:password@ep-xxxx.neon.tech/torun_monitor?sslmode=require
ANTHROPIC_ADMIN_KEY=sk-ant-admin-...
CRON_SECRET=un-secreto-largo-aleatorio
MONITOR_PIN=el-pin-de-acceso-al-panel
SESSION_SECRET=otro-secreto-largo-aleatorio
APP_TIMEZONE=America/Santo_Domingo
```

En Vercel, estas mismas variables se configuran en **Project Settings → Environment
Variables** (nunca en el repo). Si defines `CRON_SECRET` ahí, Vercel Cron lo
envía automáticamente como `Authorization: Bearer $CRON_SECRET` en cada
invocación programada.

### 1.3 Datos de prueba (desarrollo)

Para trabajar en la UI sin depender de n8n ni de Anthropic:

```bash
npm install
npm run seed
```

`scripts/seed.ts` aplica el schema y genera ~45 días de mensajes, uso de
tokens y costos para `rossy` e `ista`. Se puede correr varias veces: borra los
datos previos de esos dos agentes antes de regenerar.

### 1.4 Desarrollo local

```bash
npm run dev
```

Abre `http://localhost:3000`, te redirige a `/login` y pide el `MONITOR_PIN`.
La sesión queda en una cookie httpOnly de 30 días.

### 1.5 Deploy

Push a `main` → Vercel hace auto-deploy (sin PRs, flujo solo). `vercel.json`
registra los dos cron jobs (`sync-uso` cada hora, `sync-costo` una vez al
día). Si tu plan de Vercel no permite cron horario, no pasa nada: `/monitor`
dispara el sync de uso on-demand si el cursor tiene más de 1h de antigüedad
(con un lock simple para evitar corridas dobles).

---

## 2. Checklist manual para Keiner (Consola de Anthropic + n8n)

Estos pasos **no los hace Claude Code** — se hacen a mano, una sola vez por
agente, en [platform.claude.com](https://platform.claude.com).

#### Paso 1 — Organización (solo si no existe todavía)

La Admin API **no funciona con cuenta individual**, necesitas una organización
en la Claude Console:

1. Entra a [platform.claude.com](https://platform.claude.com).
2. Si tu cuenta es individual, verás un aviso para crear una organización (o
   ve directo a [platform.claude.com/create](https://platform.claude.com/create)).
3. Completa el formulario: nombre de la organización, tipo de entidad, país y
   uso previsto → **Complete setup**.
4. Se crea la organización con un **Default Workspace**, y quedas como
   miembro con rol **admin** (necesario para todo lo que sigue).

Si la organización ya existe, sigues con el paso 2 usando tu cuenta admin.

#### Paso 2 — Crear un workspace por agente

Un workspace por agente (`Rossy`, `Ista`, y uno por cada agente futuro) es lo
que permite que tokens y costo queden atribuidos al agente correcto sin
cálculos propios — el endpoint de costos de Anthropic agrupa por workspace.

1. En la Console, ve a **Settings → Workspaces**.
2. Clic en **Add Workspace** (o **Create workspace**).
3. Nombre: `Rossy` (color libre, es solo para identificarlo visualmente en la
   Console). Clic en **Create**.
4. Repite para `Ista`.

#### Paso 3 — Crear la API key de cada agente (dentro de su workspace)

Las API keys quedan atadas al workspace en el que se crean — **no se pueden
mover después** — así que hay que crearlas desde dentro del workspace
correcto, no desde una pantalla genérica:

1. Ve a **Settings → Workspaces** y entra al workspace `Rossy`.
2. En la página de detalle del workspace, pestaña **API Keys**.
3. Clic en **Create Key**, dale un nombre descriptivo (ej. `n8n-rossy-prod`),
   elige expiración (`Never` si la vas a guardar en el gestor de credenciales
   de n8n y rotarla tú mismo) → **Create Key**.
4. Copia el secreto (`sk-ant-api...`) — solo se muestra una vez. Pégalo en la
   credencial de Anthropic/Claude del workflow de **Rossy** en n8n.
5. Repite todo el paso 3 dentro del workspace `Ista`, y pega esa key en la
   credencial del workflow de **Ista**.

Cada workflow de n8n debe quedar usando SU propia key (nunca la misma para
los dos agentes).

#### Paso 4 — Crear la Admin API key (para el cron del panel)

Esta key es distinta a las de los agentes: da acceso de solo-lectura a
uso/costo de **toda** la organización, y la necesita `/api/cron/*` para
consultar la Usage & Cost Admin API.

1. Ve a **Settings → Admin keys** (necesitas rol **admin** de la
   organización).
2. Clic en **Create key**, nómbrala (ej. `torun-monitor-cron`), elige
   expiración → **Create**.
3. Copia el secreto (`sk-ant-admin01-...`) — solo se muestra una vez.
4. Guárdalo **únicamente** en Vercel: Project Settings → Environment
   Variables → `ANTHROPIC_ADMIN_KEY`. Nunca en el repo, nunca en n8n.

#### Paso 5 — Copiar el `workspace_id` de cada workspace

El `workspace_id` (formato `wrkspc_...`) es lo que conecta cada workspace con
su fila en la tabla `agentes`. Dos formas de obtenerlo:

- **Desde la Console:** entra al workspace (`Settings → Workspaces →
  Rossy`/`Ista`) y revisa la página de detalle o la URL del navegador — el ID
  suele aparecer ahí.
- **Con la Admin key (más confiable):**
  ```bash
  curl "https://api.anthropic.com/v1/organizations/workspaces?limit=20" \
    --header "anthropic-version: 2023-06-01" \
    --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
  ```
  La respuesta trae `name` e `id` (`wrkspc_...`) de cada workspace.

Con esos IDs, actualiza la tabla `agentes`:

```sql
UPDATE agentes SET workspace_id = 'wrkspc_...' WHERE slug = 'rossy';
UPDATE agentes SET workspace_id = 'wrkspc_...' WHERE slug = 'ista';
```

A partir de ahí, el cron horario/diario ya puede mapear el uso y costo de
Anthropic a cada agente en el panel.

#### Paso 6 — Agregar los 2 nodos de logging en n8n

Último paso, en n8n (no en la Consola de Anthropic): agregar los 2 nodos
Postgres por workflow (Rossy e Ista) — ver instrucciones exactas copy-paste
en la sección 3 de este README.

### Agente nuevo (checklist rápida)

Cada vez que se lance un agente nuevo:

- [ ] 1 fila nueva en `agentes` (`slug`, `nombre`, `cliente`)
- [ ] 1 workspace nuevo en la Consola de Anthropic + su API key propia
- [ ] `workspace_id` actualizado en la fila de `agentes`
- [ ] Los 2 nodos de logging (sección 3) agregados al workflow de n8n

---

## 3. Integración en n8n — 2 nodos por workflow

Cambios mínimos por agente, en n8n 2.4.8. Nombres de nodo en Title Case.

### 3.1 Nodo "Log Mensaje Entrante" (Postgres, Execute Query)

Conectado **en paralelo** justo después del nodo que unifica el mensaje
(post-Switch texto/audio), para no agregar latencia al flujo principal.

```sql
INSERT INTO mensajes (agente_id, telefono, direccion, contenido, tipo, ejecucion_id)
VALUES ((SELECT id FROM agentes WHERE slug = $1), $2, 'in', $3, $4, $5)
```

Query Parameters (expresión de array en n8n):

```
={{ ['rossy', $json.telefono, $json.mensaje, $json.tipo_mensaje || 'texto', $execution.id] }}
```

Ajusta `'rossy'` / `'ista'` y las rutas de `$json` a los campos reales de cada
flujo. Si el valor se lee de otro nodo, usa `.first()` — nunca `.item`.

### 3.2 Nodo "Log Mensaje Saliente" (Postgres, Execute Query)

En paralelo a la salida por Wasender:

```sql
INSERT INTO mensajes (agente_id, telefono, direccion, contenido, tipo, ejecucion_id)
VALUES ((SELECT id FROM agentes WHERE slug = $1), $2, 'out', $3, $4, $5)
```

```
={{ ['rossy', $('Mapear Mensaje').first().json.telefono, $('AI Agent').first().json.output, 'texto', $execution.id] }}
```

### 3.3 Configuración de ambos nodos

- `Retry On Fail`: activado, `Max Tries: 2`, `Wait Between Tries: 1000ms`.
- **On Error: Continue** — si Neon falla, el cliente nunca se queda sin
  respuesta. El logging jamás bloquea el flujo principal.
- Credencial de Neon en el credential store de n8n (nunca en texto plano).

No se toca ningún workflow productivo por API — estos nodos los agrega Keiner
manualmente en n8n.

---

## 4. Estructura del proyecto

```
db/schema.sql                          Schema de torun_monitor (Neon)
scripts/seed.ts                        Datos de prueba (npm run seed)
src/lib/db.ts                          Cliente Neon (@neondatabase/serverless)
src/lib/queries.ts                     Agregaciones SQL para el panel
src/lib/anthropic.ts                   Cliente de la Usage & Cost Admin API
src/lib/sync.ts                        Lógica de sync (uso + costo, UPSERT idempotente)
src/lib/auth.ts                        PIN + cookie httpOnly de sesión (30 días)
src/middleware.ts                      Protege /monitor/*
src/app/login/                         Pantalla de PIN
src/app/api/cron/sync-uso/             Cron horario — Usage Report
src/app/api/cron/sync-costo/           Cron diario — Cost Report
src/app/monitor/                       Dashboard, detalle de agente, conversaciones, transcript
```

## 5. Notas de diseño

- Cero infraestructura nueva en el VPS: no hay proxy, no hay contenedores
  adicionales. n8n solo agrega 2 nodos Postgres por workflow.
- Tokens y costo son datos **oficiales** de Anthropic (Usage & Cost Admin
  API), no estimados — por eso un workspace por agente es obligatorio.
- Todas las queries están parametrizadas (tagged templates de
  `@neondatabase/serverless`), nunca interpolación de strings.
- `torun_monitor` es una base de datos aditiva: no toca `rossanny_memoria` ni
  ninguna otra base existente de los agentes.
