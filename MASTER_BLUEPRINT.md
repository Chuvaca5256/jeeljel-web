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
- ✅ **Stats:** franja descriptiva del ecosistema + botón «Contáctanos» con scroll al footer (`#contacto`)
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
- ✅ Ruta `/ollin-deportes/partido/:id` registrada (stub)

## 🟡 Ollin Deportes — Fase 2 (post-lanzamiento página principal)

**Documento de referencia:** [`CURSOR_OllinDeportes_v1.md`](./CURSOR_OllinDeportes_v1.md) — DOC-JEL-2026-OLLIN-001

| Área | Estado |
|------|--------|
| Página `/ollin-deportes` | ✅ **En producción** — https://jeeljel.com/ollin-deportes |
| Backend Node.js (puerto **10001**) | ✅ **Activo** — PM2 + Redis + Socket.io |
| Polling API-Sports (fútbol + béisbol MLB) | ✅ **Activo** — próximos ligas 1/2/3/4 season 2026 |
| Moderación chat | ✅ **Activo** — filtros + mute/ban reincidencia |
| Cumplimiento legal | ✅ **Implementado** — backend + frontend |
| Nginx `/api/ollin/` → `:10001` | ✅ Configurado en `jeeljel-landing` |
| Página `/ollin-deportes/partido/:id` | ⏳ **Stub** — pendiente desarrollo completo |
| Tablas de posiciones | ⏳ Pendiente |
| SSO jeeljel.com/registro | ⏳ Pendiente de implementar |
| Chat en vivo UI (frontend) | ⏳ Pendiente — backend y moderación listos |
| Rediseño UI 3 zonas (Sofascore/Bet365) | ⏳ **Próxima sesión** — sidebar ligas + tabs centrales + POSICIONES |
| Catálogo completo de ligas/deportes | ⏳ **Próxima sesión** — ver SNAPSHOT v5 |
| Upgrade API-Sports PRO/Ultra | ⏳ Al inicio torneo selecciones **11/06/2026** |
| Modelo premium post-torneo (`PREMIUM_ONLY`) | ⏳ Flag frontend listo; activación post-torneo |
| Campo 2D PixiJS + modo apostador | ⏳ Pendiente — fase Día 2+ |

**Stack en producción:** React + Vite + Tailwind (frontend en `jeeljel-web`) · Node.js + Express + Redis + PM2 + Socket.io (backend `:10001`) · API-Sports · Supabase (chat)

**Deportes en producción:** Fútbol (polling próximos ligas 1/2/3/4 season 2026) · Béisbol (MLB en vivo)

**Deportes próxima sesión:** catálogo completo fútbol internacional + clubes Europa/LATAM + béisbol LMB/NPB/LVBP/Cuba · Fase 2 futura: NBA, NFL, NHL, F1

### Plan API-Sports

| Plan | Requests/día | Polling | Cuándo |
|------|--------------|---------|--------|
| FREE (actual) | 100 | 10 min | Hasta 11/06/2026 |
| PRO | 7,500 | 60 s | Inicio torneo selecciones |
| Ultra | según plan | 15 s | Partidos activos del torneo |

### Decisión CEO — Modelo de acceso

- **Durante torneo selecciones 2026:** acceso público gratuito (adquisición SSO)
- **Post-torneo:** marcadores básicos libres; estadísticas completas, live detallado y ligas premium → suscriptores Pro de cualquier app JeelJel
- Flag `PREMIUM_ONLY` por liga preparado en arquitectura frontend

### Rediseño UI — próxima sesión

- **Zona izquierda:** navegador ligas por región + badges EN VIVO
- **Zona central:** tabs EN VIVO · HOY · PRÓXIMOS · PASADOS · POSICIONES + buscador global
- **Tab POSICIONES:** standings y grupos torneo selecciones
- **Móvil:** menú hamburguesa

### Ligas a implementar — próxima sesión

**Fútbol internacional:** Torneo selecciones (1), Eurocopa (3), Copa América (4), Copa Africana, Copa Asiática, Concacaf Centroamericana, amistosos selecciones/clubes.

**Clubes Europa:** Champions (2), Europa League, Mundial de Clubes, Premier + FA Cup, La Liga + Copa del Rey + Supercopa, Serie A + Copa Italia, Ligue 1 + Copa Francia, Bundesliga + Copa Alemania, Eredivisie + Copa Holanda, Portugal + Copa Portugal, Primeira Liga.

**Clubes LATAM:** Libertadores (11), Sudamericana (13), Liga MX + Copa MX (262, 9), Argentina, Serie A/B Brasil, Colombia, Chile, Perú, Ecuador, Venezuela, Uruguay, Bolivia, Paraguay, Honduras, Guatemala, Costa Rica, MLS + Leagues Cup.

**Béisbol:** MLB (1), LMB, NPB, LVBP, Serie Nacional Cuba.

**Fase 2 futura:** NBA, NFL, NHL, F1.

### SSO pendiente

- `jeeljel.com/registro` — Supabase Auth
- Modal registro en chat Ollin Deportes
- Migración auth Ikan Naat → `jeeljel_users` post-torneo

**Reglas críticas:**
- Puerto **10001** — nunca 10000 (Ikan Naat)
- Frontend **nunca** llama API-Sports directo — solo vía backend + Socket.io
- Nginx: modificar solo `jeeljel-landing`, **nunca** `ikannaat`
- Producto **independiente** de Ikan Naat IA

## Infraestructura

### Acceso VPS

- **Usuario:** `root`
- **Autenticación:** contraseña (sin llave SSH local; deploy vía `VPS_SSH_KEY` en GitHub)
- **IP:** `187.77.196.169`

### Deploy

- Workflow: `.github/workflows/deploy.yml`
- Destino: `root@187.77.196.169:/var/www/jeeljel-web/dist/`
- Re-disparar manualmente: GitHub → Actions → Deploy jeeljel.com → Run workflow

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

- [ ] 🔴 **Rediseño UI Ollin Deportes** — layout 3 zonas Sofascore/Bet365 (sidebar ligas + tabs + POSICIONES + hamburguesa móvil)
- [ ] 🔴 **Catálogo completo ligas/deportes** — fútbol internacional + clubes Europa/LATAM + béisbol (ver SNAPSHOT v5)
- [ ] 🔴 **Upgrade API-Sports PRO/Ultra** — al inicio torneo selecciones 11/06/2026 (FREE: 100 req/día 10 min → PRO: 7,500 req/día 60s → Ultra: 15s torneo)
- [ ] 🔴 **SSO jeeljel.com/registro** — Supabase Auth + modal chat Ollin (ver Coins v13 sección 0)
- [ ] 🔴 **Ollin Deportes — tab POSICIONES** — standings y grupos torneo selecciones
- [ ] 🔴 **Ollin Deportes — página de partido** (`/ollin-deportes/partido/:id`) — desarrollar vista completa (stub actual)
- [ ] 🟡 **Modelo premium post-torneo** — activar flag `PREMIUM_ONLY` por liga post-torneo (decisión CEO documentada)
- [ ] 🟡 **Ollin Deportes — chat UI frontend** — conectar a backend moderado ya activo
- [ ] 🟡 **Migración auth Ikan Naat** → `jeeljel_users` post-torneo
- [ ] 🟡 **Ollin Deportes — campo 2D PixiJS + modo apostador** — fase Día 2+
- [ ] 🟡 **Deportes Fase 2** — NBA, NFL, NHL, F1
- [ ] Habilitar CTA activo en tarjeta Ollin Deportes en `/apps`
- [ ] Registrarse en afiliados: 1xBet Partners, Bet365 Affiliates
- [x] Ruta `/mundial-2026` → redirect a `/ollin-deportes`
- [x] Página `/apps` — tarjetas 04 Izydra OS y 05 Inkógnito completadas
- [x] Página Ollin Deportes principal (`/ollin-deportes`) — en producción
- [x] Backend Ollin (`ollin-backend/`) — puerto 10001 + Redis + PM2 + Socket.io
- [ ] Página Misión con contenido real
- [ ] Página Contacto con formulario a hola@jeeljel.com (footer ya tiene `mailto:`)
- [ ] Footer global: ampliar sección de contacto si hace falta más allá del scroll desde Stats
- [ ] Nombre latinoamericano para Virtyou
- [ ] Rebrandear Izydra OS bajo JeelJel Kaanab
- [ ] Pagar paquete 5 buzones en Hostinger y crear correos:
  - hola@jeeljel.com — quejas y sugerencias de clientes
  - proyectos@jeeljel.com — colaboraciones, desarrollo y negocios
  - compras@jeeljel.com — pagos y suscripciones (contador)
  - direccion@jeeljel.com — contacto personal y negocios de la empresa
  - equipo@jeeljel.com — comunicación interna y colaboradores
- [ ] Migrar correos a otro proveedor cuando expire plan Hostinger
