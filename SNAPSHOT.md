# SNAPSHOT — JeelJel Kaanab
**Versión:** v25 — 16/06/2026
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
- `src/components/ollin/partido/FootballFieldLive.jsx` — OLLIN-19 ✅ `getEventKind` expandido + KIND_META completo con iconos para todos los tipos; timeline completa sin límite de 10 eventos; scroll visible con barra delgada y cursor grab; `eventZone` con jitter mejorado para goles; LiveTicker integrado vía `useTickerEvents` + `partidoId` (commits `4dcc020`, `86b5ebb`); elapsed estático desde `summary` (sin timer local, commit `82afb84`)
- `src/components/ollin/partido/PartidoHeader.jsx` — header horizontal compacto ollin-ph; timer elapsed local con sync visibilitychange (commits `65df7f3`, `c61e602`, `9a1f6e9`)
- `src/hooks/usePartido.js` — socket `ollin:partido:{id}` aplica eventos directo sin re-fetch (commit `a112753`)
- `src/hooks/useTickerEvents.js` — hook socket `ollin:ticker:{id}`; eventos sintéticos efímeros (commit `43c2625`)
- `src/components/ollin/partido/LiveTicker.jsx` — banner efímero 8s por evento sintético (commit `2eb8fd3`)
- `ollin-backend/src/services/statsDiffService.js` — detector de diffs de estadísticas entre snapshots consecutivos (commit `9cfedca`)
- `src/components/ollin/tabs/TabEnVivo.jsx` — `getMatchTime`, `EnVivoMatchCard`, `EnVivoMatchGroupList`
- `src/components/ollin/tabs/TabHoy.jsx` — import unificado `matchUtils`; normalización en extract
- `src/components/ollin/tabs/TabProximos.jsx` — normalización con `normalizeFootballFixture`
- `src/components/ollin/tabs/TabPasados.jsx` — consume `json.data`; normaliza con `normalizeFootballFixture`
- `src/components/ollin/partido/PlayersTab.jsx` — formato plano backend (`p.name`); selector Local/Visitante; columnas Goles y Asistencias; rating, pases, duelos, tarjetas; links Google en nombres de jugadores
- `src/components/ollin/partido/LineupsTab.jsx` — selector Local/Visitante; campo SVG corregido (portero abajo, delanteros arriba); banca debajo del campo; iconos de eventos sobre jugadores (⚽🟨🟥🔴🟢🅰️); links Google en tabla fallback y banca
- `src/components/ollin/StandingsView.jsx` — tab renombrada a TABLA; sub-selector Posiciones/Goleadores; links Google en nombres de jugadores goleadores
- `src/components/ollin/partido/ChatPartido.jsx` — CHAT-1 ✅ + modal rediseñado (X, login, registro con `return`/`origen`) + `onAuthStateChange` (commits `96e4cab`, `20c000f`); socket batch 500ms; **UI en vivo pendiente CHAT-WS-1**
- `src/components/Navbar.jsx` + `Navbar.css` — SESION-1 ✅ cerrar sesión / iniciar sesión según sesión (commit `20c000f`)
- `src/pages/Registro.jsx` — SSO-5 ✅ + PANTALLA-ÉXITO ✅ (commits `e9223fc`, `96e4cab`)
- `ollin-backend/src/services/supabaseClient.js` — OLLIN-CHAT-BACKEND ✅ `ws` como transport Realtime Node 20 (commit `152c4a9`)
- `ollin-backend/src/services/chatService.js` — pipeline moderación → Supabase `ollin_chat`; mensajes persisten con `user_id`, `display_name`, `match_id`, `ip_address`
- `ollin-backend/docs/chat-schema.sql` — tablas `ollin_chat` + `ollin_chat_moderacion` en ikan-nat-prod; RLS + lectura pública chat
- `src/pages/OllinPartido.jsx` — layout 2 columnas 65/35; chat sidebar solo tab EN VIVO; banner rotativo Ikan Naat; label dinámico tab live: RESUMEN (FT/AET/PEN), EN VIVO (1H/2H/ET), PARTIDO (NS/HT)
- `src/hooks/useStandings.js` — refs + fix doble fetch al activar tab POSICIONES
- `ollin-backend/src/server.js` — al arrancar borra `ollin:polling:paused` + llave `requestsKey()` (INFRA-5 ✅)
- `ollin-backend/src/lib/sanitize.js` — exporta `sanitizeFootballFixture` y `sanitizeBaseballGame` (OLLIN-17 ✅)
- `ollin-backend/src/services/polling.js` — warm-up `pollFootballProximos` + `pollFootballPasados` al arrancar (BACKEND-1 ✅); live→idle refresh pasados (OLLIN-18 ✅); emisión `ollin:ticker:{id}` vía `statsDiffService` en `pollLiveFixtureEvents` (commit `e7506df`)
- `ollin-backend/src/services/partidoService.js` — OLLIN-19 ✅ `formatEventLabel` expandido: gol, propia, penal, tarjetas, corner, tiro, falta, tiro libre, banda, lesión, VAR, hidratación, detenido, tiempo extra; `parseFootballPlayers` con rating, pases, duelos, faltas, tarjetas
- `ollin-backend/src/services/standingsService.js` — deduplica filas por `team.id` dentro de cada grupo
- `ollin-backend/src/services/pasadosService.js` — `pollFootballPasados(redisIn)` recibe redis; ✅ sincronizado VPS con `origin/main` (INFRA-4 ✅)

### Backend
- Entry point: `src/server.js` (NO `src/index.js`)
- PM2 id 3 — proceso estable
- Modo IDLE: 180,000ms — actualiza `futbolHoy`, `futbolProximos`, `pasados`
- Modo LIVE: 15,000ms — solo actualiza `futbolLive`
- **INFRA-5** ✅ — `server.js` limpia `ollin:polling:paused` y `requestsKey()` al arrancar
- **BACKEND-1** ✅ — warm-up `pollFootballProximos(redis)` + `pollFootballPasados(redis)` en `startPolling`
- **INFRA-6** ✅ — TTL caché desacoplado del polling; `CACHE_TTL_MS` default 1h (commit `7cd9348`)

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

## SESIÓN 15/06/2026 — Vespertina

### Infraestructura
- **INFRA-4** ✅ RESUELTO — Diagnóstico vía SSH confirmó que `pasadosService.js` en el VPS coincide con `origin/main` (MD5 `1a6f2974cd17043211b8e81cae893979`) y la rama está `up to date`. La desincronización reportada en SNAPSHOT v11 ya no aplica. Se eliminaron dos archivos vacíos basura (`0` y `1`, 0 bytes) de la raíz del repo en el VPS; `git status` quedó `working tree clean`.
- **INFRA-6** ✅ RESUELTO — Diagnóstico confirmó que Redis NO se vacía con restart de PM2; el problema real era el TTL de caché corto (`cacheTtlMs = pollingIntervalMs * 2` = 6 min). Se desacopló el TTL del intervalo de polling: ahora `cacheTtlMs` lee la nueva env `CACHE_TTL_MS` con default fijo de 1h (3,600,000 ms). Verificado en VPS: TTL de `hoy`/`proximos` pasó de ~322s a ~3,590s. Sin consumo extra de API (el TTL es independiente del polling). Commit `7cd9348`.

### SSO, registro y chat — cierre final sesión 15/06/2026

**Cerrados hoy:**
- **SSO-5** ✅ — Registro end-to-end funcionando. Insert manual duplicado eliminado de `Registro.jsx` (commit `e9223fc`). Trigger `handle_new_user` maneja perfil server-side. Confirmado en producción.
- **CHAT-MODAL** ✅ — Modal `ChatPartido.jsx` rediseñado: X en esquina separada, botón «Crear cuenta gratis» y «Ya tengo cuenta — Iniciar sesión», ambos con query params `return` y `origen` (commit `96e4cab`).
- **PANTALLA-ÉXITO** ✅ — Nueva UI de bienvenida post-registro: botón Ikan Naat con logo fénix difuminado (Opción A), botón Ollin Deportes, tres apps próximas (Izydra OS, Virtyou, Inkógnito), botón condicional «Volver al partido» con `returnTo` exacto (commit `96e4cab`).
- **SESION-1** ✅ — `onAuthStateChange` agregado a `ChatPartido.jsx`, sesión persiste al recargar. Navbar con botón «Cerrar sesión» / enlace «Iniciar sesión» según estado de sesión. Archivo `Navbar.css` creado (commit `20c000f`).
- **OLLIN-CHAT-BACKEND** ✅ — Tablas `ollin_chat` y `ollin_chat_moderacion` creadas en Supabase (ikan-nat-prod) con RLS activado y policy de lectura pública. Fix Node.js 20: paquete `ws` instalado en `ollin-backend` y configurado como realtime transport en `supabaseClient.js` (commit `152c4a9`). Mensajes se guardan correctamente en Supabase con `user_id`, `display_name`, `match_id`, `ip_address` y timestamp.

**Pendientes identificados:**
- **SMTP-1** 🔴 BLOQUEANTE PRE-LANZAMIENTO — Conectar Resend como SMTP personalizado en Supabase (rate limit 4 correos/hora plan Free). Cuenta Resend activa. Supabase → Auth → SMTP: `smtp.resend.com:465`, user `resend`, password API Key Resend, sender `noreply@jeeljel.com`. Verificar dominio `jeeljel.com` en Resend.
- **SSO-6** 🔴 BLOQUEANTE PRE-LANZAMIENTO — RLS desactivado en `public.users`. Dos alertas CRITICAL en Security Advisor. Políticas ya escritas — leer `pg_policies` ANTES de activar. Protege datos personales de todo el ecosistema.
- **CHAT-WS-1** 🔴 — Mensajes se guardan en Supabase pero NO aparecen en la UI. (1) Socket.io WebSocket no conecta — `wss://jeeljel.com/socket.io/` falla; Nginx sin proxy WebSocket en `jeeljel-landing`. (2) Falta GET de mensajes históricos al montar `ChatPartido`. Chat invisible para el usuario aunque backend opere.
- **LiveTicker sintético** 🟡 — Código correcto y verificado en aislamiento (`detectDiffs` funciona). Pendiente confirmar emisión `ollin:ticker:{id}` en partido en vivo real — Spain vs Cape Verde terminó antes de poder probarlo.
- **Reloj duplicado en campo** 🔴 — `FootballFieldLive` muestra `elapsed` en esquina superior derecha duplicando el del header. Pendiente quitar.
- **Evento fijo en campo** 🔴 — Tarjeta amarilla del min 16 se queda permanentemente en el campo SVG. Pendiente hacer efímeros los eventos del campo igual que el ticker.
- **Errores chat Supabase** 🔴 — `ollin_chat` y `ollin_chat_moderacion` no encontradas en schema cache. Pendiente investigar.
- **SSO-7** 🟡 — `origenParam` declarado en `Registro.jsx` pero no se pasa en `options.data` del signUp; todos caen a default `jeeljel_com` en el trigger. Afecta funnel del torneo.
- **CHAT-UI-2** 🟢 — Modal no se cierra al detectar sesión en `onAuthStateChange`. Agregar `if (session) setShowModal(false)` como `OllinChat.jsx`.
- **CHAT-UI-3** 🟢 — `userMessage` del caso `spam_duplicate` usa texto genérico de moderación en lugar de mensaje específico de duplicado. Corregir en `chatService.js`.
- **SEC-2** 🟡 POST-LANZAMIENTO — Security Advisor: alertas *Auth RLS Initialization Plan* en `subscriptions`, `planificaciones`, `vc_credits`, `chat_history`.

## SESIÓN 15/06/2026 — CIERRE: SEPARACIÓN OLLIN A REPO PROPIO

### Decisión arquitectónica — 15/06/2026

**Ollin Deportes migra a repositorio independiente.**

- **Repo nuevo:** https://github.com/Chuvaca5256/ollin-deportes
- **Motivo:** el acoplamiento dentro de `jeeljel-web` causaba que cada cambio en Nginx o en el deploy del frontend rompiera toda la web. Separar Ollin elimina ese riesgo.
- **URL pública:** sin cambio — `https://jeeljel.com/ollin-deportes` (Nginx sirve la subruta desde el nuevo build)
- **Build nuevo:** `/var/www/ollin-app/dist` (en lugar de incluirse en `/var/www/jeeljel-web/dist`)
- **Backend:** PM2 `ollin-deportes` puerto 10001 — **no se mueve**, la app nueva lo consume igual vía `/api/ollin/`
- **Supabase:** proyecto `ikan-nat-prod` — **no se mueve**
- **Base de datos:** tablas `ollin_chat`, `ollin_chat_moderacion`, `users` — **sin cambios**
- **Reglas de compliance y sanitize:** se copian al repo nuevo, no se modifican

**Fases de la migración:**

| Fase | Descripción | Estado |
|------|-------------|--------|
| **0 — Auditoría** | Inventario completo de archivos Ollin en `jeeljel-web` (`_review.md`) | ✅ Completado (15/06/2026) |
| **1 — Scaffold** | Vite + React + Tailwind con `base: '/ollin-deportes/'` en `vite.config.js` | ⏳ Pendiente |
| **2 — Migración de código** | Copiar 25 componentes, 6 hooks, 8 utils, 2 assets, CSS según inventario | ⏳ Pendiente |
| **3 — Deploy VPS + Nginx** | Build en `/var/www/ollin-app/dist`; bloque Nginx `location /ollin-deportes` | ⏳ Pendiente |
| **4 — Retiro de jeeljel-web** | Eliminar Ollin de `jeeljel-web` solo cuando el repo nuevo sirva en producción; nunca dejar Ollin caído | ⏳ Pendiente — última fase |

**Diseño nuevo planeado para el repo separado:**
- Barra de navegación propia: logo JeelJel de regreso + selector de deportes Fútbol / Béisbol / NBA / NFL / NHL / F1 + pestañas EN VIVO / HOY / PRÓXIMOS / PASADOS / TABLA
- Barra de posesión de balón animada tipo llamas con el color de cada equipo

---

## SESIÓN 16/06/2026

### Infraestructura y SSO
- **SMTP-1** ✅ — Resend conectado como SMTP custom en Supabase Auth. Dominio jeeljel.com verificado en Resend. Site URL corregida a https://jeeljel.com. Redirect URLs: eliminadas las de varionix-ia.onrender.com, solo queda https://jeeljel.com/**. emailRedirectTo corregido a https://jeeljel.com/registro?confirmed=true (commit 0643b08). Correo de confirmación llega y redirige correctamente a jeeljel.com.
- **SSO-6** ✅ — RLS activado en public.users. 4 políticas verificadas antes de activar: Allow insert on register (INSERT public), users_own (ALL auth.uid()=id), users_select_own (SELECT auth.uid()=id), users_update_own (UPDATE auth.uid()=id). Registro end-to-end confirmado con RLS activo.
- **Pantalla éxito** 🟡 — Ajustes visuales solicitados: logo Ikan Naat con opacity:1 y brightness, botones uniformes, logos apps próximas. Pendiente verificar en producción.

### Pendientes activos
- **CHAT-WS-1** 🔴 — Siguiente prioridad. Mensajes no aparecen en UI. Dos causas: (1) Nginx sin proxy WebSocket /socket.io/ en jeeljel-landing, (2) falta GET histórico al montar ChatPartido.
- **SSO-7** 🟡 — origenParam en signUp
- **CHAT-UI-2** / **CHAT-UI-3** 🟢 — pulido UX
- **SEC-2** 🟡 — Post-lanzamiento

## PENDIENTES (prioridad pre-lanzamiento)
1. **SMTP-1** 🔴 — Resend SMTP — sin esto no hay registro en volumen
2. **SSO-6** 🔴 — RLS `public.users` — sin esto datos personales sin candado
3. **CHAT-WS-1** 🔴 — Socket.io Nginx + carga histórica — sin esto el chat es invisible
4. **LiveTicker sintético** 🟡 — `detectDiffs` OK en aislamiento; pendiente confirmar `ollin:ticker:{id}` en vivo (Spain vs Cape Verde terminó antes)
5. **Reloj duplicado en campo** 🔴 — Quitar `elapsed` de esquina en `FootballFieldLive`
6. **Evento fijo en campo** 🔴 — Eventos SVG permanentes; hacer efímeros como ticker
7. **Errores chat Supabase** 🔴 — Tablas no en schema cache; investigar
8. **SSO-7** 🟡 — `origenParam` en signUp — funnel del torneo
9. **CHAT-UI-2** / **CHAT-UI-3** 🟢 — pulido UX modal y mensaje spam duplicado
10. **SEC-2** 🟡 — optimización políticas RLS (post-lanzamiento)

### Completados sesión 15/06/2026
- **INFRA-4** ✅ Completado (15/06/2026) — VPS sincronizado con main, MD5 verificado, archivos basura eliminados
- **CHAT-1** ✅ Completado (15/06/2026) — ChatPartido conectado a backend real
- **OLLIN-19** ✅ Completado (15/06/2026) — eventos completos en campo y backend
- **INFRA-6** ✅ Completado (15/06/2026) — TTL caché desacoplado, fijo 1h, commit `7cd9348`
- **SSO-5** ✅ Completado (15/06/2026) — registro end-to-end en producción; insert manual eliminado, commit `e9223fc`
- **CHAT-MODAL** ✅ Completado (15/06/2026) — enlace modal con contexto partido, commit `96e4cab`
- **PANTALLA-ÉXITO** ✅ Completado (15/06/2026) — rejilla ecosistema + volver al partido, commit `96e4cab`
- **CHAT-UI-1** ✅ Completado (15/06/2026) — modal chat rediseñado (X separada, login + registro), commit `20c000f`
- **SESION-1** ✅ Completado (15/06/2026) — `onAuthStateChange` ChatPartido + cerrar sesión navbar, commit `20c000f`
- **OLLIN-CHAT-BACKEND** ✅ Completado (15/06/2026) — tablas Supabase + fix `ws` Node 20, commit `152c4a9`
- **OLLIN-20** ✅ Completado (15/06/2026) — navbar active link corregido
- **LiveTicker sintético** 🟡 — Código correcto y verificado en aislamiento (`detectDiffs` funciona). Pendiente confirmar emisión `ollin:ticker:{id}` en partido en vivo real — Spain vs Cape Verde terminó antes de poder probarlo.
- **Header partido compacto** ✅ — `ollin-ph` layout horizontal operativo (15/06/2026)
- **Reloj duplicado en campo** 🔴 — `FootballFieldLive` muestra `elapsed` en esquina superior derecha duplicando el del header. Pendiente quitar.
- **Evento fijo en campo** 🔴 — Tarjeta amarilla del min 16 se queda permanentemente en el campo SVG. Pendiente hacer efímeros los eventos del campo igual que el ticker.
- **Errores chat Supabase** 🔴 — `ollin_chat` y `ollin_chat_moderacion` no encontradas en schema cache. Pendiente investigar.

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
