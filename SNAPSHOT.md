# SNAPSHOT — JeelJel Kaanab
**Versión:** v16 — 14/06/2026 (fin de sesión noche)
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
- **POSICIONES** ✅ — funciona, NO TOCAR

### Archivos clave — estado final
- `src/components/ollin/partido/FootballFieldLive.jsx` — **CANCHA v3** SVG top-down (sin PixiJS, sin media luna, eventos naranja/azul por equipo, posesión prominente)
- `src/components/ollin/tabs/TabEnVivo.jsx` — `getMatchTime`, `toNormalizedMatch`, `EnVivoMatchCard`, `EnVivoMatchGroupList`
- `src/components/ollin/tabs/TabHoy.jsx` — import unificado `matchUtils`; normalización en extract; SIN `getMatchTime`
- `src/components/ollin/tabs/TabProximos.jsx` — normalización con `normalizeFootballFixture`; SIN `getMatchTime`
- `src/components/ollin/tabs/TabPasados.jsx` — consume `json.data`; normaliza con `normalizeFootballFixture`
- `src/components/ollin/partido/PlayersTab.jsx` — stats completas, rating badge, ordenamiento por columna
- `src/components/ollin/partido/ChatPartido.jsx` — placeholder de chat en vivo (conectar backend pendiente)
- `src/pages/OllinPartido.jsx` — banner Ikan Naat IA + `ChatPartido` solo cuando `activeTab === 'live'` y partido LIVE
- `ollin-backend/src/server.js` — al arrancar borra `ollin:polling:paused` + llave `requestsKey()` de requestCounter (INFRA-5 ✅)
- `ollin-backend/src/lib/sanitize.js` — exporta `sanitizeFootballFixture` y `sanitizeBaseballGame` (OLLIN-17 ✅)
- `ollin-backend/src/services/polling.js` — warm-up `pollFootballProximos` al arrancar (BACKEND-1 ✅); `pollFootballPasados(redis)` en live→idle y en `startPolling` (OLLIN-18 ✅)
- `ollin-backend/src/services/pasadosService.js` — `pollFootballPasados(redisIn)` recibe redis como parámetro; ✅ en GitHub; ⚠️ no llega al VPS con `git pull` (INFRA-4)

### Backend
- Entry point: `src/server.js` (NO `src/index.js`)
- PM2 id 3 — proceso estable
- Modo IDLE: 180,000ms — actualiza `futbolHoy`, `futbolProximos`, `pasados`
- Modo LIVE: 15,000ms — solo actualiza `futbolLive`
- **INFRA-5** ✅ — `server.js` limpia `ollin:polling:paused` y `requestsKey()` al arrancar
- **BACKEND-1** ✅ — `pollFootballProximos(redis)` en warm-up de `startPolling`
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
- **CANCHA-3D completada** ✅ — `FootballFieldLive.jsx` reemplazado por SVG top-down v3 (sin PixiJS, sin media luna, eventos con color por equipo naranja/azul, posesión prominente, todos los tipos de evento)
- **OLLIN-17 fix** ✅ — exportadas `sanitizeFootballFixture` y `sanitizeBaseballGame` en `sanitize.js` → página partido + tab JUGADORES desbloqueados
- **OLLIN-18 fix** ✅ — `pollFootballPasados(redis)` en transición live→idle; `pasadosService.js` acepta redis como parámetro
- **INFRA-5 fix** ✅ — `server.js` borra flags Redis al arrancar (`ollin:polling:paused` + `requestsKey()`)
- **BACKEND-1 fix** ✅ — warm-up `pollFootballProximos(redis)` en `startPolling`
- PlayersTab reescrito, banner Ikan Naat IA, ChatPartido placeholder, chat global removido de `OllinDeportes.jsx`

## PENDIENTES (prioridad)
1. **INFRA-4** 🔴 — `pasadosService.js` existe en el repo pero no llega al VPS con `git pull` — investigar con Cursor por qué, NO adivinar en terminal
2. **INFRA-6** 🟡 — Cada restart de PM2 vacía Redis (PASADOS, HOY, PRÓXIMOS) — necesita estrategia de warm-up al arrancar sin depender de ciclo de 3 minutos
3. **OLLIN-19** 🟡 — Goles no aparecen en eventos del campo — `formatEventLabel` no detecta `'Normal Goal'`, `'Own Goal'`, `'Penalty'` del campo `detail` de API-Sports
4. **OLLIN-20** 🟡 — Navbar active link bug
5. **CHAT-1** 🟡 — Conectar `ChatPartido.jsx` a `POST /chat/messages` + `GET /chat/status`
6. **SEC** 🟡 — Re-habilitar RLS en tabla `users` post-torneo

## REGLA DE TRABAJO — NO ADIVINAR
Antes de ejecutar cualquier comando en el VPS o proponer un fix, Claude debe primero buscar en Cursor, en el código del repo, o pedir al Licenciado que consulte con la herramienta más eficiente disponible. Nunca ejecutar comandos a ciegas en Redis o PM2 sin entender primero la causa raíz desde el código.
