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

## 🟡 Ollin Deportes — Fase 2 (post-lanzamiento página principal)

**Documento de referencia:** [`JEELJEL_MASTER.md`](./JEELJEL_MASTER.md) — DOC-JEL-2026-MASTER-001 (Parte II: Ollin Deportes)

| Área | Estado |
|------|--------|
| Página `/ollin-deportes` | ✅ **En producción** — layout 3 zonas, sidebar ligas, tabs, POSICIONES — https://jeeljel.com/ollin-deportes |
| Backend Node.js (puerto **10001**) | ✅ **Activo** — PM2 **`ollin-deportes`** · código `/var/www/jeeljel-repo/ollin-backend` |
| Polling API-Sports | ✅ **Inteligente** — **15 s** con en vivo · **3 min** idle (próximos + standings) |
| Plan API-Sports | ✅ **PRO activo** — $19 USD/mes · 7 500 req/día |
| Límites API (`env.js`) | ✅ **`apiDailyLimit` 7500** · **`apiDailyPauseAt` 7400** · fallback **180000 ms** |
| Tab POSICIONES (grupos + goleadores) | ✅ **Grupos A–L + Mejores terceros en ES** · goleadores endpoint activo (sin datos pre-torneo) · links Google por selección |
| Página `/ollin-deportes/partido/:id` | ✅ **En producción** — SVG + 5 tabs + API partido |
| SSO jeeljel.com/registro | ✅ **Completado** — tabla `users` + trigger `on_auth_user_created` (SNAPSHOT v9) |
| Modal registro en chat | ✅ **Completado** — input bloqueado + modal CTA (SNAPSHOT v9) |
| CTA tarjeta Ollin en `/apps` | ✅ **Completado** — enlace «¡Ingresa aquí!» activo (SNAPSHOT v9) |
| Chat en vivo UI (frontend) | ⏳ Pendiente — conectar frontend a backend (`POST /chat/messages`, `GET /chat/status`) |
| Bot Telaraña × Ollin | ⏳ Pendiente — worker picks min ~20/~45/~70; campo `tipo` en `ollin_chat`; API_SPORTS_KEY + ODDS_API_KEY disponibles |
| Workflow auto-deploy backend | ⏳ Pendiente — GitHub Actions `git pull` + `pm2 restart ollin-deportes` (SSH bloqueado Hostinger) |
| RLS tabla `users` | ⏳ Re-habilitar post-torneo con políticas correctas |
| Modelo premium post-torneo (`PREMIUM_ONLY`) | ⏳ Flag frontend listo; activación post-torneo |
| Campo 2D PixiJS + modo apostador | ⏳ Pendiente — fase Día 2+ (SVG básico en partido ✅) |

**Stack en producción:** React + Vite + Tailwind (frontend en `jeeljel-web`) · Node.js + Express + Redis + PM2 + Socket.io (backend `:10001`) · API-Sports · Supabase (chat)

**Deportes en producción:** Fútbol (polling próximos ligas 1/2/3/4 season 2026) · Béisbol (MLB en vivo)

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

- ✅ `jeeljel.com/registro` — Supabase Auth + tabla `users` + trigger `on_auth_user_created`
- ✅ Modal registro en chat Ollin Deportes — input bloqueado + modal CTA
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
| **SEC-2** | 🔴 | `express-rate-limit` en rutas de `ollin-backend` — evitar quema de API-Sports y ataques | ⏳ Pendiente |
| **SEC-3** | 🔴 | Habilitar RLS en tablas `users` y `ollin_chat` en Supabase antes de usuarios reales | ⏳ Pendiente |
| **SEC-4** | 🟡 | Confirmar que `vite.config.js` NO tiene `sourcemap: true` en producción | ⏳ Pendiente |
| **SEC-5** | 🟡 | Confirmar registro end-to-end jeeljel.com/registro (rate limit Supabase liberado) | ⏳ Pendiente |
| **SEC-6** | 🟡 | Agregar `helmet.js` y CORS explícito en `ollin-backend` | ⏳ Post-lanzamiento |
| **SEC-7** | 🟡 | Workflow GitHub Actions auto-deploy backend con `pm2 reload` (SSH bloqueado Hostinger) | ⏳ Post-lanzamiento |
| **SEC-8** | 🔴 | HOY/PASADOS — partidos históricos no se guardan en Redis; necesita key `ollin:futbol:pasados` con fixtures FT de días anteriores | ⏳ Pendiente |
| **SEC-9** | 🔴 | Página partido terminado — `/ollin-deportes/partido/:id` falla para partidos FT; necesita caché persistente por partido | ⏳ Pendiente |
| **SEC-10** | 🟡 | POSICIONES — actualizar standings inmediatamente después de cada transición live→idle además del timer de 6h | ⏳ Pendiente |
| **SEC-11** | 🟡 | Navbar — active link bug: todos los links quedan amarillos al navegar entre páginas | ⏳ Pendiente |

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

- **Frontend (automático):** workflow `.github/workflows/deploy.yml`
- Destino frontend: `root@187.77.196.169:/var/www/jeeljel-web/dist/`
- Re-disparar manualmente: GitHub → Actions → Deploy jeeljel.com → Run workflow

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
