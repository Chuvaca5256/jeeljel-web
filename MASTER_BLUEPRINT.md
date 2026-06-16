# MASTER BLUEPRINT — Próximos pasos pendientes

## Completado

- ✅ Sitio construido con React + Vite + React Router
- ✅ Multi-página: Home, Apps, Ollin Deportes, Misión, Organizaciones, Contacto
- ✅ Subido a GitHub
- ✅ Desplegado en VPS con Nginx
- ✅ DNS configurado y propagado
- ✅ jeeljel.com en línea
- ✅ SSL instalado con Certbot para `jeeljel.com`
- ✅ jeeljel.com en línea con HTTPS
- ✅ Configurar deploy automático desde GitHub al VPS
- ✅ Deploy automático GitHub Actions configurado
- ✅ Navegación actualizada: Apps, Ollin Deportes, Misión, Organizaciones (4 items — sin Contacto en navbar)
- ✅ Quitar `/contacto` del navbar
- ✅ Agregar Aviso de Privacidad y Términos de Uso en footer (`/privacidad`, `/terminos`)
- ✅ Crear páginas `/privacidad` y `/terminos` (LFPDPPP v1.1 + Términos v1.1, mosaico Tlaloc)
- ✅ Fix Nginx SPA routing (`try_files`)
- ✅ Paleta Jade & Turquesa Maya aplicada en todo el sitio
- ✅ Divisor de secciones con patrón greca dorada implementado
- ✅ Bordes de tarjetas del ecosistema ajustados (`rgba(0, 168, 107, 0.25)`)
- ✅ **Fondo global:** rojo oscuro `#1a0400` + mosaico `Cuculcan.png` al 8% opacidad, cuadrícula 80×80 px
- ✅ **Hero:** logo estático `Logo_JeelJel_Kanaabcon_balon_sin_fondo.png` (reemplazó `ajolote_final.webm`)
- ✅ **Hero:** espaciado reducido en móvil y desktop (sin `min-h-screen` en móvil)
- ✅ **Renombre global:** Hub Biónico / Hub Biónico Deportivo → **Ollin Deportes** (UI, navbar, docs, metadata)
- ✅ **Stats:** franja descriptiva del ecosistema + botón «Contáctanos» → `mailto:proyectos@jeeljel.com`
- ✅ **El Ecosistema:** descripciones actualizadas en las 5 tarjetas + logos 36 px por app
- ✅ **Countdown Ollin Deportes:** sin segundos — solo días, horas y minutos en una fila
- ✅ **Deploy workflow corregido:** sin `ssh-keyscan`, validación de llave, reintentos rsync (5×), `workflow_dispatch`, Node 22
- ✅ Ruta `/hub-bionico` renombrada a `/ollin-deportes` con redirect 301 en Nginx
- ✅ Favicon actualizado con logo JeelJel Kaanab
- ✅ Fondo mosaico Dios Tupa en `/organizaciones`
- ✅ Fondo mosaico Macuilxochitl en `/ollin-deportes`
- ✅ Fondo mosaico Tlaloc en `/mision`
- ✅ Página `/organizaciones` con contenido completo: PETA, UNESCO, Cruz Roja, UNICEF, WWF
- ✅ Tarjetas de `/organizaciones` con fondo semitransparente
- ✅ Efecto typewriter con scroll trigger en subtítulos clave (Hero, WorldCup, Organizations, Mission, Stats)
- ✅ Fondo animado /apps — cuadrados turquesa + triángulos dorados + hexágonos azules, todos wireframe SVG
- ✅ Logo Ikan Naat reemplazado por quetzal neón (`Logo_Ika_Naat_sin_fondo_sin_letras.png`) — refs actualizadas en `Apps.jsx` y `AppsGrid.jsx`
- ✅ Figuras geométricas `/apps` reducidas a 58 elementos
- ✅ Página `/mision` responsiva — layout flex 100vh, contenido centrado en todas las pantallas
- ✅ **Ollin Deportes — página principal en producción** (`/ollin-deportes`) — selector deportes, panel colapsable, buscador, 4 columnas, Socket.io, cumplimiento legal
- ✅ **Ollin Deportes — backend** `ollin-backend/` — Node.js puerto **10001**, Redis, PM2, Socket.io, polling API-Sports
- ✅ **Ollin Deportes — béisbol MLB** en vivo + **fútbol próximos** ligas 1/2/3/4 season 2026
- ✅ **Ollin Deportes — moderación de chat** — chatFilter, chatModeration, reincidencia Redis, Supabase
- ✅ **Ollin Deportes — capa de cumplimiento legal** — sanitize + compliance + disclaimer; redirect `/mundial-2026`
- ✅ **Ruta `/ollin-deportes/partido/:id`** — vista completa en producción (SVG + 5 tabs + API partido)
- ✅ **Rediseño UI Ollin Deportes** — layout 3 zonas Sofascore/Bet365 (`77a556e`): sidebar ligas, tabs centrales, buscador, POSICIONES
- ✅ **Catálogo ligas Ollin** — `leagueCatalog.js` + backend `leagues.js` (~50 IDs), agrupadas por región
- ✅ **Standings API Ollin** — `GET /api/ollin/standings/:ligaId` + `StandingsView` + `useStandings`
- ✅ **Menú desplegable ligas por deporte** — flecha ↓/↑ parpadeante (`74b1d7a`)
- ✅ **Ajustes móvil Ollin** — tab TABLA en móvil; drawer sidebar con Fútbol visible (`dfd3550`)
- ✅ **Espaciado Ollin** — sin padding-top extra bajo navbar sticky (`3b161e5`)
- ✅ **Espaciado `/apps`** — padding superior 12px; sin `min-height: 100vh` ni hueco inferior (`0d04357`, `27594d1`)
- ✅ **Footer global** — enlace `proyectos@jeeljel.com` (`mailto:`) en todas las páginas (`2d85308`)
- ✅ **Polling inteligente Ollin** — 15 s live / 3 min idle, events por partido activo (`69a7174`)
- ✅ **API-Sports PRO activo** — $19 USD/mes, 7 500 req/día, season 2026
- ✅ **Página partido individual** — `/ollin-deportes/partido/:id` completa: SVG + tabs EN VIVO/ESTADÍSTICAS/JUGADORES/ALINEACIONES/H2H (`b563917`)
- ✅ **Standings grupos torneo** — tab POSICIONES con grupos funcionando (PRO)
- ✅ **Goleadores + traducciones ES** — backend deployado + frontend 48 selecciones (`15ce3c7`) · Grupos A–L + Mejores terceros
- ✅ **Links Google en standings** — nombres de selección enlazan búsqueda (`53aac09`)
- ✅ **Backend migrado a git en VPS** — `/var/www/jeeljel-repo/ollin-backend`; PM2 **`ollin-deportes`** (`fe09225`)
- ✅ **Límites API-Sports PRO** — `apiDailyLimit` 7500, `apiDailyPauseAt` 7400, fallback polling 180000 ms
- ✅ **SSO jeeljel.com/registro** — formulario completo (confirmar contraseña, mostrar/ocultar 👁) + tabla `users` + trigger `on_auth_user_created`
- ✅ **RLS tabla `users` deshabilitado temporalmente** — re-habilitar post-torneo con políticas correctas
- ✅ **Modal chat Ollin** — input bloqueado sin sesión + modal CTA a `/registro`
- ✅ **Badge Beta Ikan Naat** — landing, chat y header móvil
- ✅ **Enlace jeeljel.com/registro en Ikan Naat** — `login.html` y `register.html` actualizados
- ✅ **CTA tarjeta Ollin en `/apps` habilitado** — enlace «¡Ingresa aquí!» activo
- ✅ **Llave SSH VPS regenerada** + secret `VPS_SSH_KEY` actualizado en GitHub
- ✅ **Deploy manual jeeljel.com e Ikan Naat** — confirmados vía terminal VPS
- ✅ **Supabase unificado** — jeeljel.com y futuras apps usan proyecto `ikan-nat-prod`
- ✅ **Backend Ollin — solo liga 1 activa** — `LIGAS_PERMITIDAS` reducido a ID 1; resto comentado (`3f0dd1b`)
- ✅ **Béisbol desactivado temporalmente** — `pollBaseball` y `baseballClient` comentados en backend (`a3b6091`)
- ✅ **Timezone México en polling HOY** — `pollFootballHoy` + `todayKey()` con `America/Mexico_City` (`c65135e`, `09ea90a`)
- ✅ **`runIdleCycle` verifica live al inicio** — `pollFootballLive` → `KEYS.futbolLive` + `return true` → modo LIVE (`8331532`)
- ✅ **EN VIVO operativo** — Australia vs Türkiye visible en backend/Redis
- ✅ **Mensaje «limitación FREE» eliminado en repo** — tab PRÓXIMOS usa empty label normal (`3134998`); **pendiente deploy frontend**
- ✅ **Commit vacío deploy frontend** — `167695d` (`chore: forzar deploy frontend`)
- 🔴 **Revert timezone en `pollFootballLive`** — commit `cbb5a9f` (no aplica timezone en `/fixtures?live=all`)
- ✅ **Tabs Ollin refactorizados e independientes** — `TabEnVivo` · `TabHoy` · `TabProximos` · `TabPasados` + `useTabData` + `useSocketUpdate` (SNAPSHOT v10)
- ✅ **Columna DG en POSICIONES** — `StandingsView.jsx` muestra `row.goalsDiff` (SNAPSHOT v10)
- ✅ **Deploy webhook + Telegram** — PM2 `webhook-deploy` puerto 9000; bot `@Jeeljel_deploy_bot` activo (`INFRA-2`)
- ✅ **TabEnVivo — minuto elapsed** — `getMatchTime`, `EnVivoMatchCard`, `EnVivoMatchGroupList` en `TabEnVivo.jsx`
- ✅ **TabHoy normalizado** — `normalizeFootballFixture` en extract de `useTabData`; `getMatchTime` pasado a `MatchGroupList`
- ✅ **TabProximos normalizado** — `normalizeFootballFixture` en extract de `useTabData`
- ✅ **TabPasados normalizado** — consume `json.data` de `/api/ollin/fixtures/pasados`; normaliza con `normalizeFootballFixture`
- ✅ **MatchGroupList + MatchCardCompact** — prop `getMatchTime` opcional; fallback a `formatMatchDateTime`
- ✅ **Backend PM2 limpiado** — proceso id 3 arrancado desde `src/server.js`; crash loop por caché PM2 resuelto
- ✅ **pasadosService.js operativo en VPS** — 6 partidos FT guardados (2026-06-13, 2026-06-12, 2026-06-11)
- ✅ **OLLIN-21** — LineupsTab: selector Local/Visitante; portero abajo; banca debajo; iconos eventos
- ✅ **OLLIN-22** — Label dinámico RESUMEN/EN VIVO/PARTIDO en tab partido
- ✅ **OLLIN-23** — Timeline sin límite de eventos + scroll grab desktop
- ✅ **OLLIN-24** — Links Google en jugadores (Goleadores, Banca, Alineaciones, Jugadores)
- ✅ **OLLIN-25** — Tab TABLA + sub-selector Posiciones/Goleadores
- ✅ **CHAT-1** (15/06/2026) — ChatPartido conectado a backend real; socket, batch, modal SSO, pick pinned
- ✅ **OLLIN-19** (15/06/2026) — eventos completos en campo y backend; KIND_META con todos los iconos
- ✅ **OLLIN-20** (15/06/2026) — navbar active link corregido con NavLink style función
- ✅ **LiveTicker sintético por diff de estadísticas** — `ollin:ticker:{id}` ✅ 15/06/2026
- ✅ **Header partido horizontal compacto** ✅ 15/06/2026
- ✅ **Reloj partido sincronizado con visibilitychange** ✅ 15/06/2026

## 🟡 Ollin Deportes — Fase 2 (post-lanzamiento página principal)

**Documento de referencia:** [`JEELJEL_MASTER.md`](./JEELJEL_MASTER.md) — DOC-JEL-2026-MASTER-001 (Parte II: Ollin Deportes)

| Área | Estado |
|------|--------|
| Página `/ollin-deportes` | ✅ **En producción** — layout 3 zonas, sidebar ligas, **tabs refactorizados e independientes**, POSICIONES — https://jeeljel.com/ollin-deportes |
| Tabs EN VIVO · HOY · PRÓXIMOS · PASADOS | ✅ **Refactorizados e independientes** — cada tab con fetch propio vía `useTabData` + `extract`; EN VIVO con `useSocketUpdate` |
| Backend Node.js (puerto **10001**) | ✅ **Activo** — solo liga **1** · béisbol desactivado · PM2 **`ollin-deportes`** · `/var/www/jeeljel-repo/ollin-backend` |
| Polling API-Sports | ✅ **Inteligente** — **15 s** con en vivo · **3 min** idle · `runIdleCycle` verifica live al inicio |
| EN VIVO | ✅ **Operativo** — Australia vs Türkiye visible |
| Plan API-Sports | ✅ **PRO activo** — $19 USD/mes · 7 500 req/día |
| Deploy frontend | ✅ **Automático via webhook** en cada push a `main` — `https://jeeljel.com/deploy-hook` → PM2 `webhook-deploy` (puerto 9000) |
| Tab PRÓXIMOS | 🟡 Código OK en repo (`3134998`) · producción aún muestra mensaje FREE — frontend no desplegado |
| Límites API (`env.js`) | ✅ **`apiDailyLimit` 7500** · **`apiDailyPauseAt` 7400** · fallback **180000 ms** |
| Tab POSICIONES (grupos + goleadores) | ✅ **Grupos A–L + Mejores terceros en ES** · goleadores endpoint activo · links Google · **columna DG** · deduplicación por `team.id` · fix doble fetch `useStandings.js` |
| Página `/ollin-deportes/partido/:id` | ✅ **En producción** — layout 2 columnas 65/35 · chat sidebar solo tab EN VIVO · banner Ikan Naat rotativo · SVG + 5 tabs |
| SSO jeeljel.com/registro | ✅ **Completado** — tabla `users` + trigger `on_auth_user_created` (SNAPSHOT v9) |
| Modal registro en chat | ✅ **Completado** — input bloqueado + modal CTA (SNAPSHOT v9) |
| CTA tarjeta Ollin en `/apps` | ✅ **Completado** — enlace «¡Ingresa aquí!» activo (SNAPSHOT v9) |
| Chat en vivo UI (frontend) | ✅ **Conectado** — `ChatPartido.jsx` backend real; socket, batch 500ms, modal SSO, pick pinned (CHAT-1 ✅ 15/06/2026) |
| Bot Telaraña × Ollin | ⏳ Pendiente — worker picks min ~20/~45/~70; campo `tipo` en `ollin_chat`; API_SPORTS_KEY + ODDS_API_KEY disponibles |
| Workflow auto-deploy backend | ⏳ Pendiente — GitHub Actions `git pull` + `pm2 restart ollin-deportes` (SSH bloqueado Hostinger) |
| RLS tabla `users` | ⏳ Re-habilitar post-torneo con políticas correctas |
| Modelo premium post-torneo (`PREMIUM_ONLY`) | ⏳ Flag frontend listo; activación post-torneo |
| Campo 2D PixiJS + modo apostador | ⏳ Pendiente — fase Día 2+ (SVG básico en partido ✅) |

**Stack en producción:** React + Vite + Tailwind (frontend en `jeeljel-web`) · Node.js + Express + Redis + PM2 + Socket.io (backend `:10001`) · API-Sports · Supabase (chat)

**Deportes en producción:** Fútbol — **solo liga 1** activa · EN VIVO operativo · ~~Béisbol MLB~~ desactivado temporalmente

**Deportes próxima sesión:** catálogo completo fútbol internacional + clubes Europa/LATAM + béisbol LMB/NPB/LVBP/Cuba · Fase 2 futura: NBA, NFL, NHL, F1

### Plan API-Sports

| Plan | Requests/día | Polling | Límite pausa | Estado |
|------|--------------|---------|--------------|--------|
| ~~FREE~~ | 100 | 10 min | 95 | ❌ Reemplazado |
| **PRO** | **7,500** | **15 s live / 3 min idle** | **7400** (`apiDailyPauseAt`) | ✅ **Activo** — $19 USD/mes |
| Ultra | según plan | 15 s fijo | según plan | Opcional futuro |

### Decisión CEO — Modelo de acceso

- **Durante torneo selecciones 2026:** acceso público gratuito (adquisición SSO)
- **Post-torneo:** marcadores básicos libres; estadísticas completas, live detallado y ligas premium → suscriptores Pro de cualquier app JeelJel
- Flag `PREMIUM_ONLY` por liga preparado en arquitectura frontend

### Rediseño UI — en producción (SNAPSHOT v6)

- **Zona izquierda:** deportes + ligas por región + badges EN VIVO + panel colapsable ↓/↑ por deporte activo
- **Zona central:** tabs EN VIVO · HOY · PRÓXIMOS · PASADOS · POSICIONES (+ **TABLA** en móvil) + buscador global
- **Tab POSICIONES:** `StandingsView` + API standings; grupos torneo selecciones cuando haya datos
- **Móvil:** menú hamburguesa; drawer bajo navbar; Fútbol visible al abrir menú

### Ligas en catálogo — implementadas (frontend + backend IDs)

**Fútbol internacional:** Torneo selecciones (1), Eurocopa (3), Copa América (4), Copa Africana, Copa Asiática, Concacaf Centroamericana, amistosos selecciones/clubes.

**Clubes Europa:** Champions (2), Europa League, Mundial de Clubes, Premier + FA Cup, La Liga + Copa del Rey + Supercopa, Serie A + Copa Italia, Ligue 1 + Copa Francia, Bundesliga + Copa Alemania, Eredivisie + Copa Holanda, Portugal + Copa Portugal, Primeira Liga.

**Clubes LATAM:** Libertadores (11), Sudamericana (13), Liga MX + Copa MX (262, 9), Argentina, Serie A/B Brasil, Colombia, Chile, Perú, Ecuador, Venezuela, Uruguay, Bolivia, Paraguay, Honduras, Guatemala, Costa Rica, MLS + Leagues Cup.

**Béisbol:** MLB (1), LMB, NPB, LVBP, Serie Nacional Cuba.

**Fase 2 futura:** NBA, NFL, NHL, F1.

### SSO — estado actual

- ✅ `jeeljel.com/registro` — Supabase Auth + tabla `users` + trigger `handle_new_user` (`SECURITY DEFINER`, `ON CONFLICT DO NOTHING`)
- ✅ **SSO-5** — Registro end-to-end confirmado en producción (commit `e9223fc`); insert manual eliminado; trigger maneja perfil server-side
- ✅ **CHAT-MODAL** — Modal chat partido enlaza con contexto `/registro?origen=ollin_deportes&return=/ollin-deportes/partido/${id}` (commit `96e4cab`)
- ✅ **PANTALLA-ÉXITO** — UI bienvenida con rejilla ecosistema + botón condicional «Volver al partido» (commit `96e4cab`)
- ✅ **SESION-1** — `onAuthStateChange` en ChatPartido; Navbar con cerrar/iniciar sesión (commit `20c000f`)
- ✅ **OLLIN-CHAT-BACKEND** — Tablas `ollin_chat`/`ollin_chat_moderacion` en Supabase; fix `ws` transport (commit `152c4a9`); mensajes persisten en DB
- 🔴 **CHAT-WS-1** — Mensajes en Supabase pero UI invisible: Nginx WebSocket + carga histórica pendiente
- 🟡 **SSO-7** — `origenParam` capturado en `Registro.jsx`; falta pasar en `options.data` del signUp
- ⏳ Migración auth Ikan Naat → `jeeljel_users` post-torneo

**Reglas críticas:**
- Puerto **10001** — nunca 10000 (Ikan Naat)
- Ruta backend VPS: **`/var/www/jeeljel-repo/ollin-backend`** — NO `/var/www/ollin-backend` (obsoleta)
- Deploy manual backend: `cd /var/www/jeeljel-repo && git pull && pm2 restart ollin-deportes`
- PM2 process name: **`ollin-deportes`**
- Frontend **nunca** llama API-Sports directo — solo vía backend + Socket.io
- Nginx: modificar solo `jeeljel-landing`, **nunca** `ikannaat`
- Producto **independiente** de Ikan Naat IA

## 🔴 Producción segura — Pendientes críticos pre-lanzamiento

| ID | Prioridad | Descripción | Estado |
|----|-----------|-------------|--------|
| **SEC-1** | — | `pm2 reload` en lugar de `pm2 restart` en deploy backend — elimina downtime | ✅ Completado — confirmado en VPS |
| **SEC-2** | 🟡 | `express-rate-limit` en rutas de `ollin-backend` — evitar quema de API-Sports y ataques | ⏳ Pendiente |
| **SEC-3** | 🔴 | **SSO-6 — BLOQUEANTE PRE-LANZAMIENTO** — RLS desactivado en `public.users`; Security Advisor CRITICAL. Leer políticas con `pg_policies` ANTES de activar RLS | ⏳ Pendiente — crítico |
| **SEC-4** | 🟡 | Confirmar que `vite.config.js` NO tiene `sourcemap: true` en producción | ⏳ Pendiente |
| **SEC-5** | — | **SSO-5** — Registro end-to-end jeeljel.com/registro | ✅ Completado (15/06/2026) — commit `e9223fc` |
| **SEC-6** | 🟡 | Agregar `helmet.js` y CORS explícito en `ollin-backend` | ⏳ Post-lanzamiento |
| **SEC-7** | 🟡 | Workflow GitHub Actions auto-deploy backend con `pm2 reload` (SSH bloqueado Hostinger) | ⏳ Post-lanzamiento |
| **SEC-8** | 🟡 | PASADOS — backend ✅ en VPS (`pasadosService.js`, key `ollin:futbol:pasados`, **7 FT** en Redis); archivo **no en GitHub**; frontend ⏳ tab PASADOS no consume `/pasados` | 🟡 Backend VPS ✅ · Repo ⏳ · Frontend ⏳ |
| **SEC-9** | 🔴 | Página partido FT — `/ollin-deportes/partido/:id` falla FT; error `sanitizeFootballFixture is not a function`; minuto en vivo muestra «LIVE» en lugar de `elapsed` | ⏳ Pendiente |
| **SEC-10** | 🟡 | POSICIONES — actualizar standings inmediatamente después de cada transición live→idle además del timer de 6h | ⏳ Pendiente |
| **SEC-11** | 🟡 | Navbar — active link bug: todos los links quedan amarillos al navegar entre páginas | ⏳ Pendiente |
| **SEC-12** | 🟡 | PRÓXIMOS — mensaje «limitación FREE» eliminado en repo; **pendiente deploy frontend** | ⏳ Deploy manual |
| **SEC-13** | 🟡 | **SEC-2 (Supabase)** — Alertas rendimiento *Auth RLS Initialization Plan* en `subscriptions`, `planificaciones`, `vc_credits`, `chat_history`. Optimizar evaluación políticas RLS | ⏳ Post-lanzamiento |
| **SEC-14** | 🟡 | **SEC-3 (Supabase)** — Checklist seguridad pre-lanzamiento: rate limiting registro, validación inputs, RLS tablas sensibles | ⏳ Post-lanzamiento |
| **SMTP-1** | 🔴 | Conectar Resend SMTP en Supabase Auth — eliminar rate limit 4 correos/hora plan Free. Host `smtp.resend.com:465`, sender `noreply@jeeljel.com`; verificar dominio en Resend | ⏳ Pendiente — crítico |
| **CHAT-UI-1** | — | Modal `ChatPartido.jsx`: X separada del enlace; botón «Iniciar sesión» | ✅ Completado (15/06/2026) — commit `20c000f` |
| **SESION-1** | — | Persistencia sesión + `onAuthStateChange` + botón «Cerrar sesión» en navbar | ✅ Completado (15/06/2026) — commit `20c000f` |
| **CHAT-UI-2** | 🟢 | Modal chat no se cierra al detectar sesión — agregar `setShowModal(false)` en `onAuthStateChange` | ⏳ Pendiente — baja prioridad |
| **CHAT-UI-3** | 🟢 | `userMessage` spam duplicado usa texto genérico de moderación — corregir en `chatService.js` | ⏳ Pendiente — baja prioridad |
| **CHAT-WS-1** | 🔴 | Mensajes en Supabase OK pero UI vacía: Nginx proxy WebSocket `/socket.io/` + GET histórico al montar chat | ⏳ Pendiente — crítico |
| **OLLIN-CHAT-BACKEND** | — | Tablas chat Supabase + fix `ws` Node 20 en `supabaseClient.js` | ✅ Completado (15/06/2026) — commit `152c4a9` |
| **INFRA-3** | 🔴 | VPS ↔ GitHub desincronizados — `pasadosService.js` solo en VPS; usar siempre `git pull --rebase`; verificar código real antes de cambios | ⏳ Pendiente |
| **INFRA-4** | — | GitHub Actions deploy frontend | Infra | ❌ Desactivado — reemplazado por webhook (`webhook-deploy`, puerto 9000) |

### ⚠️ Alerta sesión 13/06/2026 — fuente de verdad

- **Backend en VPS** (`/var/www/jeeljel-repo/ollin-backend`): operativo — liga 1, béisbol off, EN VIVO OK, `pasadosService.js` con 7 FT en Redis
- **Frontend en producción** (`/var/www/jeeljel-web/dist`): **desactualizado** — GitHub Actions roto; mensaje PRÓXIMOS FREE aún visible hasta deploy manual
- **`pasadosService.js`**: existe en VPS pero **no está en GitHub** — no asumir paridad repo ↔ VPS
- Antes de cualquier fix: `git pull --rebase` en VPS, verificar diff, deploy manual frontend si aplica

## Decisiones CEO 10/06/2026 — Arquitectura chat Ollin + Ikan Naat picks

### Arquitectura del chat (definitiva)

- **Chat por partido, nunca global** — cada partido tiene su propio room de Socket.io `ollin:partido:{id}` con mensajes aislados. México vs Sudáfrica es un chat; Brasil vs Marruecos es otro. Los mensajes de un partido jamás se mezclan con otro.
- **Ver chat:** libre sin cuenta. **Escribir:** requiere cuenta JeelJel (modal de registro al intentar escribir).

#### Requisitos de UI para alto volumen
| Requisito | Detalle |
|-----------|---------|
| Lista virtualizada | Solo renderizar mensajes visibles en pantalla |
| Tope en memoria | ~200 mensajes en cliente; los más antiguos se descartan |
| Render en lotes | Agrupar mensajes nuevos ~500 ms en picos de volumen |
| Rate limit usuario | 1 mensaje cada 3–5 segundos |

### Ikan Naat en el chat (estrategia de adquisición)

**El Agente Deportivo de Ikan Naat (Telaraña)** publicará 2–3 picks automáticos con momios reales durante cada partido en vivo, visibles para todos los usuarios de Ollin.

**REGLA DE UI — Picks pinned:** los picks de Ikan Naat quedan **fijados en la parte superior del chat** — no se pierden entre la conversación. El pick más reciente permanece clavado hasta que llegue el siguiente, con estilo visual diferenciado del resto de mensajes.

#### Modelo de acceso por tiers
| Tier | Acceso | CTA |
|------|--------|-----|
| **Chat gratuito (sin cuenta)** | 2–3 picks/partido — visibles para todos | «Regístrate gratis en Ikan Naat para picks de los juegos de mañana» |
| **Registrado free** | Picks adicionales con límite en Ikan Naat | Upgrade a Pro |
| **Pro** | Picks ilimitados, parlays, Telaraña completa, gestión de bankroll | — |

#### Implementación técnica (pendiente)
- **Campo `tipo`** en tabla `ollin_chat` — valores: `'usuario'` / `'bot'`
- **Usuario especial** `Telaraña Bot` en Supabase — identificable por `tipo = 'bot'`
- **Scheduler in-play** — dispara picks en ventanas **~20 min**, **~45 min** y **~70 min** de cada partido en vivo
- **Soporte `pinned`** en UI del chat — campo o flag en el mensaje para distinguir picks clavados de mensajes normales
- **Variables en VPS** — `API_SPORTS_KEY` (estadísticas en vivo) + `ODDS_API_KEY` (momios) ya activas en Ikan Naat
- ⚠️ **El protocolo técnico del agente vive en el proyecto de Ikan Naat, no en jeeljel-web**

#### Objetivo estratégico
El funnel convierte espectadores de Ollin en usuarios registrados de Ikan Naat. Los picks gratuitos y visibles generan confianza; el pick pinned asegura visibilidad máxima; el CTA dirigido a los juegos del día siguiente impulsa el registro y el uso de Telaraña dentro de Ikan Naat.

## Infraestructura

### Acceso VPS

- **Usuario:** `root`
- **Autenticación:** contraseña (sin llave SSH local; deploy vía `VPS_SSH_KEY` en GitHub)
- **IP:** `187.77.196.169`

### Deploy

- **Deploy:** webhook activo + notificaciones Telegram en cada push
- **Bot Telegram:** `@Jeeljel_deploy_bot` · Chat ID: `8402374818`
- **GitHub Actions:** ❌ **Desactivado** — `.github/workflows/deploy.yml` reducido a `workflow_dispatch` manual
- **Deploy frontend:** ✅ **Automático via webhook** en cada push a `main`
  - Flujo: push → GitHub → `https://jeeljel.com/deploy-hook` → VPS (`git pull` + `npm build` + `rsync`) → Telegram (🚀 iniciado · ✅ exitoso · ❌ falló)
  - PM2: `webhook-deploy` (puerto **9000**) · script: `/var/www/webhook/server.js`
  - Nginx: `location /deploy-hook` → `proxy_pass http://localhost:9000/deploy`
  - Token y Chat ID: `/var/www/webhook/.env`
  - Verificar: `pm2 logs webhook-deploy --lines 5 --nostream` → buscar `[webhook] Deploy exitoso`
  - Tiempo estimado build: **2-3 minutos** desde el push
- Destino frontend: `/var/www/jeeljel-web/dist/`

- **Backend Ollin (manual):**
  ```bash
  cd /var/www/jeeljel-repo && git pull && pm2 restart ollin-deportes
  ```
- Código backend: `/var/www/jeeljel-repo/ollin-backend` — PM2 **`ollin-deportes`** — puerto **10001**
- ⏳ Workflow GitHub Actions auto-deploy backend: pendiente

### Página /apps — jeeljel.com

Sistema de tarjetas expandibles (Apps.jsx). Una fila por app:
- Colapsada: 80px altura, logo + nombre + preview en una línea
- Expandida: descripción + lista de capacidades + botón CTA
- Solo una fila abierta a la vez
- Fuente Cinzel para títulos
- REGLA: nunca mencionar motores externos de IA en el contenido
- Para agregar una app nueva: agregar objeto al array `APPS` en Apps.jsx siguiendo el patrón del SNAPSHOT
- **Fondo:** `CubeBackground` — 58 elementos wireframe SVG (cuadrados, triángulos, hexágonos), animación `cube-spin`
- **Catálogo (5 tarjetas):** 01 Ikan Naat IA · 02 Ollin Deportes · 03 VirtYou · 04 Izydra OS · 05 Inkógnito — todas con contenido completo ✅

**Tarjeta 02 — Ollin Deportes**
- Renombrada de «Agente Deportivo» a **Ollin Deportes** en el catálogo
- Tagline: Fútbol en vivo · Modo Apostador · IA en tiempo real
- Acento `#f97316` · Logo ajolote con balón
- Estado: **En línea** · URL: https://jeeljel.com/ollin-deportes
- CTA: **¡Ingresa aquí!** (pendiente habilitar enlace en tarjeta `/apps`)
- Features en producción: listado partidos fútbol/béisbol, Socket.io, buscador, moderación chat (backend)
- Features pendientes: campo 2D, stats por jugador, modo apostador, narrador comunitario, IA analista Ikan Naat
- Stack en producción: React + Vite + Tailwind + Socket.io + Node.js + Redis + PM2 + API-Sports
- **Aclaración:** Ollin Deportes es producto **independiente** de jeeljel.com — NO es un agente dentro de Ikan Naat IA. El Agente de Apuestas (slug `telarana`) permanece dentro de Ikan Naat sin cambios.

**Tarjeta 03 — VirtYou**
- Subtítulo: Tu identidad digital, siempre contigo · Acento `#b464ff` · Estado: Próximamente
- Logo: `Logo_virtyou_sin_fondo.png`
- Descripción: tarjeta digital QR/NFC, ficha médica gratis, módulos pago único (finanzas, salud, hogar, vehículo, mascotas, agenda, metas). Próximamente invitaciones digitales y NFC física. Sin suscripciones.
- Repo: https://github.com/Chuvaca5256/Virtyou
- Deploy provisional: https://virtyou.vercel.app (no enlazar en el sitio — desarrollo)
- CTA: deshabilitado

## Pendientes próxima sesión

- [x] ~~🔴 **SSO jeeljel.com/registro**~~ — ✅ formulario completo + tabla `users` + trigger `on_auth_user_created` (SNAPSHOT v9)
- [x] ~~🔴 **Modal registro en chat**~~ — ✅ input bloqueado + modal CTA a `/registro` (SNAPSHOT v9)
- [x] ~~**CTA tarjeta Ollin en `/apps`**~~ — ✅ enlace «¡Ingresa aquí!» habilitado (SNAPSHOT v9)
- [x] ~~**Badge Beta Ikan Naat**~~ — ✅ landing, chat y header móvil (SNAPSHOT v9)
- [x] ~~**Supabase unificado**~~ — ✅ proyecto `ikan-nat-prod` para jeeljel.com y futuras apps (SNAPSHOT v9)
- [ ] 🔴 **Confirmar registro end-to-end** — rate limit Supabase temporalmente activo; verificar cuando se libere
- [ ] 🔴 **Chat frontend** — conectar a backend (`POST /chat/messages`, `GET /chat/status`, tabla `ollin_chat`)
- [ ] 🟡 **Bot Telaraña × Ollin** — worker picks automáticos en min ~20/~45/~70; campo `tipo` en `ollin_chat`; ver decisión CEO abajo
- [ ] 🟡 **Workflow auto-deploy backend** — GitHub Actions: `cd /var/www/jeeljel-repo && git pull && pm2 restart ollin-deportes` (SSH bloqueado por Hostinger)
- [ ] 🟡 **RLS tabla `users`** — re-habilitar post-torneo con políticas correctas
- [ ] 🟡 **Modelo premium post-torneo** — activar flag `PREMIUM_ONLY` por liga post-torneo (decisión CEO documentada)
- [ ] 🟡 **Migración auth Ikan Naat** → `jeeljel_users` post-torneo
- [ ] 🟡 **Ollin Deportes — campo 2D PixiJS + modo apostador** — fase Día 2+ (SVG básico en partido ✅)
- [ ] 🟡 **Deportes Fase 2** — NBA, NFL, NHL, F1
- [ ] Habilitar CTA activo en tarjeta Ollin Deportes en `/apps` («¡Ingresa aquí!»)
- [ ] Registrarse en afiliados: 1xBet Partners, Bet365 Affiliates
- [x] **Polling inteligente Ollin** — 15 s live / 3 min idle
- [x] **API-Sports PRO activo** — $19 USD/mes
- [x] **Backend migrado a git VPS** — `/var/www/jeeljel-repo/ollin-backend` + PM2 `ollin-deportes` (`fe09225`)
- [x] **Límites API-Sports PRO** — `apiDailyLimit` 7500, `apiDailyPauseAt` 7400
- [x] **Página partido individual** — `/ollin-deportes/partido/:id` en producción
- [x] **Traducciones ES standings + goleadores** — `teamDisplay.js` 48 selecciones + grupos A–L (`15ce3c7`)
- [x] **Links Google en tabla POSICIONES** — `StandingsView.jsx` (`53aac09`)
- [x] **Rediseño UI Ollin Deportes** — layout 3 zonas Sofascore/Bet365
- [x] **Catálogo ligas/deportes** — leagueCatalog + backend leagues (~50 IDs)
- [x] **Tab POSICIONES UI + standings API** — StandingsView + useStandings
- [x] **Ajustes móvil Ollin** — TABLA + menú Fútbol visible
- [x] **Espaciado `/apps`** — superior e inferior corregido
- [x] **Contacto proyectos@jeeljel.com** — footer global + botón Contáctanos Home
- [x] Ruta `/mundial-2026` → redirect a `/ollin-deportes`
- [x] Página `/apps` — tarjetas 04 Izydra OS y 05 Inkógnito completadas
- [x] Página Ollin Deportes principal (`/ollin-deportes`) — en producción
- [x] Backend Ollin — `/var/www/jeeljel-repo/ollin-backend` · PM2 **`ollin-deportes`** · puerto 10001
- [x] **Deploy webhook + Telegram** — PM2 `webhook-deploy` puerto 9000; bot `@Jeeljel_deploy_bot` ✅
- [x] **Tabs Ollin normalizados** — TabHoy, TabProximos, TabPasados usan `normalizeFootballFixture`
- [x] **TabEnVivo — minuto elapsed** — `EnVivoMatchCard` + `EnVivoMatchGroupList` en `TabEnVivo.jsx`
- [x] **PlayersTab reescrito** — stats completas backend, rating badge, selector Local/Visitante, Goles y Asistencias
- [x] **ChatPartido placeholder** — sidebar solo tab EN VIVO; input/enviar; límite 50 palabras
- [x] **Banner Ikan Naat IA** — rotativo en página partido
- [x] **Layout partido 2 columnas** — 65/35 cancha + chat
- [x] **CANCHA-3D** — `FootballFieldLive.jsx` SVG top-down v3 (sin PixiJS, eventos por equipo, posesión prominente)
- [x] **OLLIN-17** — export `sanitizeFootballFixture` + `sanitizeBaseballGame` en `sanitize.js`
- [x] **OLLIN-18** — `pollFootballPasados()` en transición live→idle en `polling.js`
- [x] **INFRA-5** — `server.js` borra `ollin:polling:paused` + `requestsKey()` al arrancar
- [x] **BACKEND-1** — warm-up `pollFootballProximos` + `pollFootballPasados` al arrancar en `startPolling`
- [x] **POSICIONES dedup** — `standingsService.js` deduplica filas por `team.id` dentro de cada grupo
- [x] **JUGADORES tab** — formato backend plano; selector Local/Visitante; columnas Goles y Asistencias; stats completas backend
- [x] **Layout partido** — 2 columnas 65/35; banner rotativo Ikan Naat; chat sidebar altura completa solo tab EN VIVO
- [x] **ChatPartido placeholder** — input/enviar + validación 50 palabras
- [x] **useStandings fix** — evitar doble fetch al activar tab POSICIONES
- [x] **OLLIN-21** — LineupsTab: selector Local/Visitante; portero abajo; banca debajo; iconos eventos
- [x] **OLLIN-22** — Label dinámico RESUMEN/EN VIVO/PARTIDO en tab partido
- [x] **OLLIN-23** — Timeline sin límite de eventos + scroll grab desktop
- [x] **OLLIN-24** — Links Google en jugadores (Goleadores, Banca, Alineaciones, Jugadores)
- [x] **OLLIN-25** — Tab TABLA + sub-selector Posiciones/Goleadores
- [x] **CHAT-1** (15/06/2026) — ChatPartido conectado a backend real; socket, batch, modal SSO, pick pinned
- [x] **OLLIN-19** (15/06/2026) — eventos completos en campo y backend; KIND_META con todos los iconos
- [x] **OLLIN-20** (15/06/2026) — navbar active link corregido con NavLink style función
- [x] **INFRA-6** (15/06/2026) — TTL caché desacoplado del polling, fijo 1h (`CACHE_TTL_MS`), commit `7cd9348`
- [x] **SSO-5** (15/06/2026) — registro end-to-end en producción; insert manual eliminado, commit `e9223fc`
- [x] **CHAT-MODAL** (15/06/2026) — enlace modal con contexto partido, commit `96e4cab`
- [x] **PANTALLA-ÉXITO** (15/06/2026) — rejilla ecosistema + volver al partido, commit `96e4cab`
- [x] **CHAT-UI-1** (15/06/2026) — modal chat rediseñado (X separada, login + registro), commit `20c000f`
- [x] **SESION-1** (15/06/2026) — `onAuthStateChange` ChatPartido + cerrar sesión navbar, commit `20c000f`
- [x] **OLLIN-CHAT-BACKEND** (15/06/2026) — tablas Supabase + fix `ws` Node 20, commit `152c4a9`

## 🔴 MIGRACIÓN OLLIN A REPO PROPIO — Alta prioridad (15/06/2026)

**Repo nuevo:** https://github.com/Chuvaca5256/ollin-deportes
**Motivo:** desacoplar el frontend de Ollin de `jeeljel-web` para que cambios en Nginx o el deploy del sitio principal no rompan Ollin.
**URL pública:** sin cambio — `jeeljel.com/ollin-deportes` servido desde `/var/www/ollin-app/dist`.
**Lo que NO se mueve:** backend PM2 `:10001`, Supabase `ikan-nat-prod`, Redis, reglas de compliance.

| Fase | Descripción | Estado |
|------|-------------|--------|
| **Fase 0 — Auditoría** | Inventario archivos en `_review.md` | ✅ Completado (15/06/2026) |
| **Fase 1 — Scaffold** | `git init ollin-deportes` · Vite + React + Tailwind · `base: '/ollin-deportes/'` · proxy `/api/ollin` y `/socket.io` → `:10001` | ⏳ Pendiente |
| **Fase 2 — Migración código** | Copiar 25 componentes · 6 hooks · 8 utils · 2 assets · `OllinDeportes.css` · `supabaseClient.js` → migrar a `VITE_SUPABASE_*` | ⏳ Pendiente |
| **Fase 3 — Deploy VPS + Nginx** | `npm run build` en VPS · rsync a `/var/www/ollin-app/dist` · bloque Nginx `location /ollin-deportes` con `try_files` | ⏳ Pendiente |
| **Fase 4 — Retiro de jeeljel-web** | Eliminar Ollin de `jeeljel-web` **solo** cuando el nuevo repo sirva en producción — nunca dejar Ollin caído | ⏳ Pendiente — última fase |

**Diseño planeado para el repo separado:**
- Navbar propia: logo JeelJel + selector deportes (Fútbol / Béisbol / NBA / NFL / NHL / F1) + pestañas EN VIVO / HOY / PRÓXIMOS / PASADOS / TABLA
- Barra de posesión animada tipo llamas con color de cada equipo

---

## Pendientes activos — orden pre-lanzamiento

1. **MIGRACIÓN-OLLIN Fase 1–4** 🔴 — repo ollin-deportes separado (ver tabla arriba)
2. **CHAT-WS-1** 🔴 — Nginx WebSocket + carga histórica (sin esto chat invisible)
3. **SSO-7** 🟡 — `origenParam` en signUp (funnel torneo)
4. **CHAT-UI-2** / **CHAT-UI-3** 🟢 — pulido UX modal y mensaje spam duplicado
5. **SEC-2** 🟡 — optimización políticas RLS (post-lanzamiento)

- [x] **SMTP-1** (16/06/2026) — Resend SMTP activo; Site URL jeeljel.com; emailRedirectTo corregido commit 0643b08
- [x] **SSO-6** (16/06/2026) — RLS public.users activado; 4 políticas verificadas
- [ ] **CHAT-WS-1** 🔴 — Nginx WebSocket /socket.io/ + GET histórico ChatPartido
- [ ] **SSO-7** 🟡 — origenParam en signUp
- [ ] **CHAT-UI-2** / **CHAT-UI-3** 🟢 — pulido UX modal y spam duplicado
- [ ] **SEC-2** 🟡 — Post-lanzamiento
- [ ] Página Misión con contenido real
- [ ] Página Contacto con formulario a hola@jeeljel.com (footer ya tiene `mailto:` hola + proyectos)
- [x] Footer global: `proyectos@jeeljel.com` + botón Contáctanos → mailto proyectos
- [ ] Nombre latinoamericano para Virtyou
- [ ] Rebrandear Izydra OS bajo JeelJel Kaanab
- [ ] Pagar paquete 5 buzones en Hostinger y crear correos:
  - hola@jeeljel.com — quejas y sugerencias de clientes
  - proyectos@jeeljel.com — colaboraciones, desarrollo y negocios — **en footer y botón Home ✅**
  - compras@jeeljel.com — pagos y suscripciones (contador)
  - direccion@jeeljel.com — contacto personal y negocios de la empresa
  - equipo@jeeljel.com — comunicación interna y colaboradores
- [ ] Migrar correos a otro proveedor cuando expire plan Hostinger

## REGLA DE TRABAJO — NO ADIVINAR

Antes de ejecutar cualquier comando en el VPS o proponer un fix, Claude debe primero buscar en Cursor, en el código del repo, o pedir al Licenciado que consulte con la herramienta más eficiente disponible. Nunca ejecutar comandos a ciegas en Redis o PM2 sin entender primero la causa raíz desde el código.

**Reset créditos API-Sports:** 00:00 UTC = 18:00 CDT (hora Ciudad de México)
