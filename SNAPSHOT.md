# SNAPSHOT — JeelJel Kaanab
**Versión:** v13 — 14/06/2026
**Autor:** Carlos García Anaya + Claude

## ESTADO ACTUAL DEL SISTEMA

### Infraestructura
- jeeljel.com — EN LÍNEA con HTTPS ✅
- ikannaat.jeeljel.com — EN LÍNEA con HTTPS ✅ — NO TOCAR
- VPS IP: 187.77.196.169 — PM2 proceso `ollin-deportes` id 3, puerto 10001
- Deploy frontend: webhook PM2 id 2 puerto 9000 + Telegram `@Jeeljel_deploy_bot` ✅
- GitHub: github.com/Chuvaca5256/jeeljel-web

### Ollin Deportes — Estado de tabs
- **EN VIVO** ✅ — muestra `elapsed` (`67'`) en lugar de hora de inicio
- **HOY** ✅ — normaliza con `normalizeFootballFixture`; muestra partidos correctamente
- **PRÓXIMOS** ✅ — normaliza con `normalizeFootballFixture`
- **PASADOS** ✅ — consume `json.data` de `/api/ollin/fixtures/pasados`; normaliza con `normalizeFootballFixture`
- **POSICIONES** ✅ — funciona, NO TOCAR

### Archivos clave modificados hoy
- `src/components/ollin/tabs/TabEnVivo.jsx` — `getMatchTime`, `toNormalizedMatch`, `EnVivoMatchCard`, `EnVivoMatchGroupList`
- `src/components/ollin/tabs/TabHoy.jsx` — normalización + `getMatchTime`
- `src/components/ollin/tabs/TabProximos.jsx` — normalización
- `src/components/ollin/tabs/TabPasados.jsx` — normalización desde `json.data`
- `src/components/ollin/MatchGroupList.jsx` — acepta y pasa prop `getMatchTime`
- `src/components/ollin/MatchCardCompact.jsx` — usa `getMatchTime` si se recibe, sino `formatMatchDateTime`

### Backend
- Entry point: `src/server.js` (NO `src/index.js`)
- PM2 id 3 — arrancado limpio tras limpiar caché de proceso anterior
- Modo IDLE: 180,000ms entre ciclos (sin partidos en vivo)
- Modo LIVE: 15,000ms entre ciclos
- `pasadosService.js` — solo en VPS, NO en GitHub (INFRA-3 pendiente)
- Crash loop anterior resuelto — era caché de PM2 con proceso antiguo

### API-Sports
- Plan PRO activo — fútbol únicamente
- Reset diario: 00:00 UTC = 18:00 CDT
- Contador interno `apiRequestsToday` se reinicia solo al reiniciar proceso (informativo)

## PENDIENTES (prioridad)
1. **INFRA-3** 🔴 — `pasadosService.js` solo en VPS; hacer `git pull --rebase` y subir al repo
2. **OLLIN-17** 🟡 — `sanitizeFootballFixture is not a function` en página partido individual
3. **OLLIN-18** 🟡 — Standings post-partido: trigger de `pollStandingsBatch` al detectar live→idle
4. **OLLIN-19** 🟡 — PRÓXIMOS: deploy del mensaje «limitación FREE» eliminado (commit 3134998)
5. **OLLIN-20** 🟡 — Navbar active link bug
6. Chat UI frontend — conectar a `POST /chat/messages` + `GET /chat/status`
7. Re-enabler RLS en tabla `users` post-torneo
