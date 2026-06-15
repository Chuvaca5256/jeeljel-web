# SNAPSHOT — JeelJel Kaanab
**Versión:** v18 — 15/06/2026
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
- **TABLA** ✅ — tab renombrada desde POSICIONES; sub-selector Posiciones/Goleadores; deduplicación por `team.id` en `standingsService.js`; fix doble fetch en `useStandings.js`

### Archivos clave — estado final
- `src/components/ollin/partido/FootballFieldLive.jsx` — OLLIN-19 ✅ `getEventKind` expandido + KIND_META completo con iconos para todos los tipos; timeline completa sin límite de 10 eventos; scroll visible con barra delgada y cursor grab; `eventZone` con jitter mejorado para goles
- `src/components/ollin/tabs/TabEnVivo.jsx` — `getMatchTime`, `EnVivoMatchCard`, `EnVivoMatchGroupList`
- `src/components/ollin/tabs/TabHoy.jsx` — import unificado `matchUtils`; normalización en extract
- `src/components/ollin/tabs/TabProximos.jsx` — normalización con `normalizeFootballFixture`
- `src/components/ollin/tabs/TabPasados.jsx` — consume `json.data`; normaliza con `normalizeFootballFixture`
- `src/components/ollin/partido/PlayersTab.jsx` — formato plano backend (`p.name`); selector Local/Visitante; columnas Goles y Asistencias; rating, pases, duelos, tarjetas; links Google en nombres de jugadores
- `src/components/ollin/partido/LineupsTab.jsx` — selector Local/Visitante; campo SVG corregido (portero abajo, delanteros arriba); banca debajo del campo; iconos de eventos sobre jugadores (⚽🟨🟥🔴🟢🅰️); links Google en tabla fallback y banca
- `src/components/ollin/StandingsView.jsx` — tab renombrada a TABLA; sub-selector Posiciones/Goleadores; links Google en nombres de jugadores goleadores
- `src/components/ollin/partido/ChatPartido.jsx` — CHAT-1 ✅ conectado a backend real; socket propio, batch 500ms, 200 msgs máx, cooldown 4s, modal SSO, pick pinned Telaraña
- `src/components/Navbar.jsx` — OLLIN-20 ✅ NavLink con `style` función `isActive`, sin handlers mouse
- `src/pages/OllinPartido.jsx` — layout 2 columnas 65/35; chat sidebar solo tab EN VIVO; banner rotativo Ikan Naat; label dinámico tab live: RESUMEN (FT/AET/PEN), EN VIVO (1H/2H/ET), PARTIDO (NS/HT)
- `src/hooks/useStandings.js` — refs + fix doble fetch al activar tab POSICIONES
- `ollin-backend/src/server.js` — al arrancar borra `ollin:polling:paused` + llave `requestsKey()` (INFRA-5 ✅)
- `ollin-backend/src/lib/sanitize.js` — exporta `sanitizeFootballFixture` y `sanitizeBaseballGame` (OLLIN-17 ✅)
- `ollin-backend/src/services/polling.js` — warm-up `pollFootballProximos` + `pollFootballPasados` al arrancar (BACKEND-1 ✅); live→idle refresh pasados (OLLIN-18 ✅)
- `ollin-backend/src/services/partidoService.js` — OLLIN-19 ✅ `formatEventLabel` expandido: gol, propia, penal, tarjetas, corner, tiro, falta, tiro libre, banda, lesión, VAR, hidratación, detenido, tiempo extra; `parseFootballPlayers` con rating, pases, duelos, faltas, tarjetas
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
- **ALINEACIONES** ✅ — `LineupsTab` con selector Local/Visitante, campo SVG corregido, banca, iconos evento, links Google (OLLIN-21 ✅)
- **CANCHA v3** ✅ — `FootballFieldLive.jsx` SVG top-down; fix posicionamiento goles en `eventZone`

### Otros fixes sesión
- **OLLIN-17** ✅ — export `sanitizeFootballFixture` + `sanitizeBaseballGame`
- **OLLIN-18** ✅ — `pollFootballPasados(redis)` en transición live→idle
- **useStandings** ✅ — fix doble fetch al activar tab POSICIONES (refs + deps estables)
- Chat global removido de `OllinDeportes.jsx` (chat solo en página partido)

## SESIÓN 14/06/2026 — Vespertina

### Página partido
- **OLLIN-21** ✅ — `LineupsTab`: selector Local/Visitante; portero abajo / delanteros arriba; banca + iconos evento; links Google en fallback y banca
- **OLLIN-22** ✅ — Label dinámico tab partido: RESUMEN / EN VIVO / PARTIDO según `statusShort`
- **OLLIN-23** ✅ — Timeline completa sin límite de 10 eventos + scroll arrastrable desktop (barra delgada, cursor grab)
- **OLLIN-24** ✅ — Links Google en jugadores: Goleadores, Banca, Alineaciones fallback, Jugadores
- **OLLIN-25** ✅ — Tab POSICIONES renombrada a TABLA + sub-selector Posiciones/Goleadores en `StandingsView`

## SESIÓN 15/06/2026

### Página partido y navegación
- **CHAT-1** ✅ — `ChatPartido.jsx` conectado a backend real (`POST /chat/messages`, `GET /chat/status`, socket `ollin:chat:message`)
- **OLLIN-19** ✅ — `formatEventLabel` + `getEventKind` + `KIND_META` expandidos (campo y backend)
- **OLLIN-19b** ✅ — `KIND_META` con iconos para shot, freekick, throwin, injury, hydration, stoppage, addedtime
- **OLLIN-20** ✅ — Navbar active link corregido (`NavLink` con `style={({ isActive }) => ...}`)

## PENDIENTES (prioridad)
1. **INFRA-4** 🔴 — `pasadosService.js` existe en el repo pero no llega al VPS con `git pull` — investigar con Cursor por qué, NO adivinar en terminal
2. **INFRA-6** 🟡 — Cada restart de PM2 vacía Redis (PASADOS, HOY, PRÓXIMOS) — necesita estrategia de warm-up al arrancar sin depender de ciclo de 3 minutos
3. **SEC** 🟡 — Re-habilitar RLS en tabla `users` post-torneo
4. **SSO-5** 🔴 — Confirmar registro end-to-end jeeljel.com/registro

### Completados sesión 15/06/2026
- **CHAT-1** ✅ Completado (15/06/2026) — ChatPartido conectado a backend real
- **OLLIN-19** ✅ Completado (15/06/2026) — eventos completos en campo y backend
- **OLLIN-20** ✅ Completado (15/06/2026) — navbar active link corregido

### Completados sesión vespertina (referencia)
- **OLLIN-21** ✅ Completado (14/06/2026) — LineupsTab rediseño alineaciones
- **OLLIN-22** ✅ Completado (14/06/2026) — Label dinámico tab partido
- **OLLIN-23** ✅ Completado (14/06/2026) — Timeline completa + scroll grab desktop
- **OLLIN-24** ✅ Completado (14/06/2026) — Links Google jugadores
- **OLLIN-25** ✅ Completado (14/06/2026) — Tab TABLA + sub-selector Posiciones/Goleadores

## PENDIENTES VERIFICAR EN PARTIDO VIVO — 15/06/2026 10:00am CDT

- Chat en vivo: mensajes se envían y aparecen en tiempo real
- Chat: modal de registro aparece si no hay sesión SSO
- Chat: pick pinned de Telaraña aparece en parte superior
- Chat: cooldown 4s entre mensajes funciona
- Eventos en campo: goles, tarjetas y demás aparecen con icono correcto
- Eventos en campo: timeline sin límite de 10 eventos funciona
- Créditos API-Sports: verificar consumo durante partido en vivo

## REGLA DE TRABAJO — NO ADIVINAR
Antes de ejecutar cualquier comando en el VPS o proponer un fix, Claude debe primero buscar en Cursor, en el código del repo, o pedir al Licenciado que consulte con la herramienta más eficiente disponible. Nunca ejecutar comandos a ciegas en Redis o PM2 sin entender primero la causa raíz desde el código.
