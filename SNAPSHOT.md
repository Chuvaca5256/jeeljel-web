# SNAPSHOT — JeelJel Kaanab
**Versión:** v14 — 14/06/2026
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
- **PRÓXIMOS** ✅ — normaliza con `normalizeFootballFixture`; Redis se puebla solo en ciclo IDLE — bug conocido: si el proceso arranca en modo LIVE, `ollin:futbol:proximos` queda vacío hasta el siguiente ciclo IDLE
- **PASADOS** ✅ — consume `json.data` de `/api/ollin/fixtures/pasados`; normaliza con `normalizeFootballFixture`
- **POSICIONES** ✅ — funciona, NO TOCAR

### Archivos clave — estado final
- `src/components/ollin/tabs/TabEnVivo.jsx` — `getMatchTime`, `toNormalizedMatch`, `EnVivoMatchCard`, `EnVivoMatchGroupList`
- `src/components/ollin/tabs/TabHoy.jsx` — import unificado `matchUtils`; normalización en extract; SIN `getMatchTime`
- `src/components/ollin/tabs/TabProximos.jsx` — normalización con `normalizeFootballFixture`; SIN `getMatchTime`
- `src/components/ollin/tabs/TabPasados.jsx` — consume `json.data`; normaliza con `normalizeFootballFixture`
- `src/components/ollin/MatchGroupList.jsx` — acepta prop opcional `getMatchTime`; solo `TabEnVivo` la usa
- `src/components/ollin/MatchCardCompact.jsx` — usa `getMatchTime` si se recibe, sino `formatMatchDateTime`
- `src/components/ollin/partido/PlayersTab.jsx` — reescrito con stats completas, rating badge, ordenamiento por columna
- `src/components/ollin/partido/ChatPartido.jsx` — placeholder de chat en vivo (conectar backend en próxima sesión)
- `src/pages/OllinPartido.jsx` — banner Ikan Naat IA + `ChatPartido` solo cuando `activeTab === 'live'` y partido LIVE

### Backend
- Entry point: `src/server.js` (NO `src/index.js`)
- PM2 id 3 — proceso estable; 87 reinicios anteriores causados por crash loop (caché PM2 antigua)
- Modo IDLE: 180,000ms — actualiza `futbolHoy`, `futbolProximos`, `pasados`
- Modo LIVE: 15,000ms — solo actualiza `futbolLive`; `futbolProximos` NO se refresca en LIVE
- **Bug conocido:** `pollFootballProximos` no se llama al arrancar — fix pendiente en `polling.js`
- `pasadosService.js` — solo en VPS, NO en GitHub (INFRA-3 pendiente)
- `sanitizeFootballFixture is not a function` — error en `/fixtures/partido/:id` (OLLIN-17 pendiente)

### API-Sports
- Plan PRO activo — fútbol únicamente, 7,500 req/día
- Reset diario: 00:00 UTC = 18:00 CDT
- Créditos agotados hoy por 87 crash loops de PM2 — mañana arrancan frescos
- Contador interno `apiRequestsToday` es informativo; no bloquea

## PENDIENTES (prioridad)
1. **BACKEND-1** 🔴 — `pollFootballProximos` no se llama al arrancar ni en modo LIVE; agregar llamada inicial en `polling.js` igual que `pollFootballHoy`
2. **INFRA-3** 🔴 — `pasadosService.js` solo en VPS; subir al repo
3. **OLLIN-17** 🔴 — `sanitizeFootballFixture is not a function` en página partido individual
4. **OLLIN-18** 🟡 — Standings post-partido: trigger `pollStandingsBatch` al detectar live→idle
5. **OLLIN-20** 🟡 — Navbar active link bug
6. **CHAT-1** 🟡 — Conectar `ChatPartido.jsx` a `POST /chat/messages` + `GET /chat/status`
7. **SEC** 🟡 — Re-habilitar RLS en tabla `users` post-torneo
8. **CANCHA-3D** 🔴 — Reemplazar `FootballFieldLive.jsx` con cancha 3D estilo Playdoit usando PixiJS: perspectiva isométrica, gradas, balón animado, jugadores posicionados con nombre y número, eventos flotantes (⚽ gol, 🟨 tarjeta, 🔄 sustitución), timeline superior con minuto y eventos, indicador de posesión animado. NO tocar ningún otro componente de partido.
