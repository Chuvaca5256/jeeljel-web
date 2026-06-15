# SNAPSHOT — JeelJel Kaanab
**Versión:** v16 — 14/06/2026 (sesión completa)
**Autor:** Carlos García Anaya + Claude

## ESTADO ACTUAL DEL SISTEMA

### Infraestructura
- jeeljel.com — EN LÍNEA con HTTPS ✅
- ikannaat.jeeljel.com — EN LÍNEA con HTTPS ✅ — NO TOCAR
- VPS IP: 187.77.196.169 — PM2 proceso `ollin-deportes` id 3, puerto 10001
- Deploy frontend: webhook PM2 id 2 puerto 9000 + Telegram `@Jeeljel_deploy_bot` ✅
- GitHub: github.com/Chuvaca5256/jeeljel-web

### Ollin Deportes — Estado de tabs
- **EN VIVO** ✅ — muestra `elapsed` (`67'`) en lugar de hora de inicio; componentes propios `EnVivoMatchCard` + `EnVivoMatchGroupList` en `TabEnVivo.jsx`
- **HOY** ✅ — normaliza con `normalizeFootballFixture`; sin `getMatchTime` (usa `formatMatchDateTime` por defecto)
- **PRÓXIMOS** ✅ — normaliza con `normalizeFootballFixture`; warm-up `pollFootballProximos` al arrancar en `startPolling` (BACKEND-1 ✅)
- **PASADOS** ✅ — consume `json.data` de `/api/ollin/fixtures/pasados`; normaliza con `normalizeFootballFixture`; refresh post-live→idle implementado (OLLIN-18)
- **POSICIONES** ✅ — deduplicación por `team.id` en `standingsService.js`; fix doble fetch en `useStandings.js`

### Archivos clave — estado final
- `src/components/ollin/partido/FootballFieldLive.jsx` — **CANCHA v3** SVG top-down; `eventZone` con jitter mejorado para goles
- `src/components/ollin/tabs/TabEnVivo.jsx` — `getMatchTime`, `EnVivoMatchCard`, `EnVivoMatchGroupList`
- `src/components/ollin/tabs/TabHoy.jsx` — import unificado `matchUtils`; normalización en extract
- `src/components/ollin/tabs/TabProximos.jsx` — normalización con `normalizeFootballFixture`
- `src/components/ollin/tabs/TabPasados.jsx` — consume `json.data`; normaliza con `normalizeFootballFixture`
- `src/components/ollin/partido/PlayersTab.jsx` — formato plano backend (`p.name`); selector Local/Visitante; columnas Goles y Asistencias; rating, pases, duelos, tarjetas
- `src/components/ollin/partido/LineupsTab.jsx` — SVG campo por `grid` API-Sports; tabla fallback cuando no hay grid
- `src/components/ollin/partido/ChatPartido.jsx` — placeholder con input/enviar; validación 50 palabras; backend pendiente CHAT-1
- `src/pages/OllinPartido.jsx` — layout 2 columnas 65/35; chat sidebar solo tab EN VIVO; banner rotativo Ikan Naat
- `src/hooks/useStandings.js` — refs + fix doble fetch al activar tab POSICIONES
- `ollin-backend/src/server.js` — al arrancar borra `ollin:polling:paused` + llave `requestsKey()` (INFRA-5 ✅)
- `ollin-backend/src/lib/sanitize.js` — exporta `sanitizeFootballFixture` y `sanitizeBaseballGame` (OLLIN-17 ✅)
- `ollin-backend/src/services/polling.js` — warm-up `pollFootballProximos` + `pollFootballPasados` al arrancar (BACKEND-1 ✅); live→idle refresh pasados (OLLIN-18 ✅)
- `ollin-backend/src/services/partidoService.js` — `parseFootballPlayers` con rating, pases, duelos, faltas, tarjetas
- `ollin-backend/src/services/standingsService.js` — deduplica filas por `team.id` dentro de cada grupo
- `ollin-backend/src/services/pasadosService.js` — `pollFootballPasados(redisIn)` recibe redis; ✅ en GitHub; ⚠️ no llega al VPS con `git pull` (INFRA-4)

### Backend
- Entry point: `src/server.js` (NO `src/index.js`)
- PM2 id 3 — proceso estable
- Modo IDLE: 180,000ms — actualiza `futbolHoy`, `futbolProximos`, `pasados`
- Modo LIVE: 15,000ms — solo actualiza `futbolLive`
- **INFRA-5** ✅ — `server.js` limpia `ollin:polling:paused` y `requestsKey()` al arrancar
- **BACKEND-1** ✅ — warm-up `pollFootballProximos(redis)` + `pollFootballPasados(redis)` en `startPolling`
- **Bug conocido:** cada restart PM2 vacía Redis — tabs vacías hasta ciclo IDLE de 3 min (INFRA-6)

### REGLA CRÍTICA — Verificar créditos API-Sports

NUNCA concluir que se agotaron créditos por el log de PM2 o el contador Redis.
El contador `ollin:api:requests:today` en Redis se infla con reinicios de PM2 y NO refleja la realidad.

Para verificar créditos reales, ejecutar en VPS:

```bash
curl -s -H 'x-apisports-key: '$(grep API_SPORTS_KEY /var/www/jeeljel-repo/ollin-backend/.env | cut -d= -f2)'' 'https://v3.football.api-sports.io/status' | grep -o '"requests":{[^}]*}'
```

Resultado real hoy 14/06: current=260, limit_day=7500.

### API-Sports
- Plan PRO activo — fútbol únicamente, 7,500 req/día
- **Reset diario: 00:00 UTC = 18:00 CDT** (hora Ciudad de México)
- Contador interno `apiRequestsToday` es informativo; flag `ollin:polling:paused` en Redis SÍ bloquea polling

## SESIÓN 14/06/2026 — Lo que se hizo

### Backend
- **INFRA-5** ✅ — `server.js` borra llave dinámica `requestsKey()` al arrancar (+ `ollin:polling:paused`)
- **BACKEND-1** ✅ — warm-up de `pollFootballProximos` y `pollFootballPasados` al arrancar
- **POSICIONES** ✅ — `standingsService.js` deduplica filas duplicadas por `team.id` dentro de cada grupo
- **JUGADORES backend** ✅ — `parseFootballPlayers` expone rating, pases, duelos, faltas, tarjetas, goles, asistencias

### Página partido — layout y chat
- **Layout partido** ✅ — 2 columnas 65/35; columna izquierda tabs + cancha + banner Ikan Naat rotativo
- **CHAT sidebar** ✅ — 35% altura completa (`align-items: stretch`); solo visible en tab EN VIVO; límite 50 palabras por mensaje
- **ChatPartido.jsx** — placeholder con input/enviar; conexión backend pendiente CHAT-1

### Tabs partido
- **JUGADORES** ✅ — formato correcto backend (`p.name` no `p.player.name`); selector Local/Visitante; columnas Goles y Asistencias
- **ALINEACIONES** 🟡 — tabla fallback cuando no hay `grid`; campo SVG vertical cuando sí hay `grid`; **PENDIENTE:** rediseño campo horizontal estilo Sofascore con ambos equipos y suplentes
- **CANCHA v3** ✅ — `FootballFieldLive.jsx` SVG top-down; fix posicionamiento goles en `eventZone`

### Otros fixes sesión
- **OLLIN-17** ✅ — export `sanitizeFootballFixture` + `sanitizeBaseballGame`
- **OLLIN-18** ✅ — `pollFootballPasados(redis)` en transición live→idle
- **useStandings** ✅ — fix doble fetch al activar tab POSICIONES (refs + deps estables)
- Chat global removido de `OllinDeportes.jsx` (chat solo en página partido)

## PENDIENTES (prioridad)
1. **CHAT-1** 🔴🔴 MEGA URGENTE — Conectar `ChatPartido.jsx` a `POST /chat/messages` + `GET /chat/status` — sin esto la página del partido no tiene vida y el diferenciador de Ollin no existe
2. **ALINEACIONES** 🟡 — Rediseño campo horizontal estilo Sofascore: ambos equipos en un solo campo + suplentes + iconos gol/sustitución
3. **INFRA-4** 🔴 — `pasadosService.js` existe en el repo pero no llega al VPS con `git pull` — investigar con Cursor por qué, NO adivinar en terminal
4. **INFRA-6** 🟡 — Cada restart de PM2 vacía Redis (PASADOS, HOY, PRÓXIMOS) — necesita estrategia de warm-up al arrancar sin depender de ciclo de 3 minutos
5. **OLLIN-19** 🟡 — Goles no aparecen en eventos del campo — `formatEventLabel` no detecta `'Normal Goal'`, `'Own Goal'`, `'Penalty'` del campo `detail` de API-Sports
6. **OLLIN-20** 🟡 — Navbar active link bug
7. **SEC** 🟡 — Re-habilitar RLS en tabla `users` post-torneo

## REGLA DE TRABAJO — NO ADIVINAR
Antes de ejecutar cualquier comando en el VPS o proponer un fix, Claude debe primero buscar en Cursor, en el código del repo, o pedir al Licenciado que consulte con la herramienta más eficiente disponible. Nunca ejecutar comandos a ciegas en Redis o PM2 sin entender primero la causa raíz desde el código.
