# SNAPSHOT — Estado actual del proyecto

## SNAPSHOT v5 — Ollin Deportes en producción (09/06/2026)

✅ **`/ollin-deportes` funcional en producción** — https://jeeljel.com/ollin-deportes
✅ **Frontend completo** — selector ⚽/⚾, panel colapsable «Ver partidos», buscador en tiempo real, 4 columnas (EN VIVO · HOY · PASADOS · PRÓXIMOS), `MatchCard` + `TeamDisplay`, skeletons, fallback mock offline
✅ **Backend `ollin-backend/`** — Node.js Express puerto **10001** + Redis + PM2 + Socket.io + polling API-Sports
✅ **Béisbol MLB** — partidos en vivo vía API-Baseball
✅ **Fútbol próximos** — ligas **1, 2, 3, 4** season 2026 (`next=10` por liga) combinadas en `ollin:futbol:proximos`
✅ **Hook `useOllinData`** — fetch `/api/ollin/fixtures/{live,hoy,proximos}` + evento Socket.io `ollin:update`
✅ **Moderación de chat activa** — homofobia, racismo, groserías, spam; `chatFilter` + `chatModeration` + reincidencia Redis + rutas `/chat/messages` y `/chat/status`
✅ **Cumplimiento legal** — `compliance.js` + `sanitize.js` (backend y frontend), `OllinLegalDisclaimer`, sin logos oficiales ni términos prohibidos en UI; redirect `/mundial-2026` → `/ollin-deportes`
✅ **Deploy manual VPS** — backend Ollin (`:10001`) + Redis + PM2 funcionando en VPS; frontend vía GitHub Actions → `/var/www/jeeljel-web/dist`
⏳ **Rediseño UI completo** — layout 3 zonas tipo Sofascore/Bet365 pendiente para **próxima sesión**
⏳ **SSO jeeljel.com/registro** — Supabase Auth + modal en chat Ollin; migración auth Ikan Naat post-torneo
⏳ **Tablas de posiciones** — tab POSICIONES con standings y grupos del torneo de selecciones
⏳ **`/ollin-deportes/partido/:id`** — stub en producción; vista de partido individual pendiente

### Plan API-Sports (09/06/2026)

| Plan | Requests/día | Polling | Cuándo |
|------|--------------|---------|--------|
| **FREE** (actual) | 100 req/día | cada **10 min** | Hasta inicio torneo selecciones |
| **PRO** | 7,500 req/día | cada **60 s** | Upgrade al inicio del torneo (**11/06/2026**) |
| **Ultra** | según plan | cada **15 s** | Partidos activos del torneo de selecciones |

### Decisión CEO — Modelo de acceso post-torneo

| Fase | Acceso |
|------|--------|
| **Durante torneo selecciones 2026** | Público y **gratuito** — estrategia de adquisición SSO |
| **Post-torneo** | Marcadores básicos: **libre**. Estadísticas completas, partidos en vivo detallados y ligas premium: **exclusivo suscriptores Pro** de cualquier app JeelJel (Ikan Naat, Izydra OS, Virtyou, Inkógnito) |
| **Arquitectura** | Flag `PREMIUM_ONLY` por liga ya preparado en frontend — activable sin rediseño |

### Ligas y deportes — próxima sesión

**Fútbol internacional:** Torneo selecciones (ID **1**), Eurocopa (ID **3**), Copa América (ID **4**), Copa Africana de Naciones, Copa Asiática, Copa Centroamericana Concacaf, amistosos selecciones y clubes.

**Clubes Europa:** Champions League (ID **2**), Europa League, Mundial de Clubes, Premier League + FA Cup, La Liga + Copa del Rey + Supercopa España, Serie A + Copa Italia, Ligue 1 + Copa Francia, Bundesliga + Copa Alemania, Eredivisie + Copa Holanda, Liga Portuguesa + Copa Portugal, Primeira Liga.

**Clubes LATAM:** Copa Libertadores (ID **11**), Copa Sudamericana (ID **13**), Liga MX + Copa MX (ID **262**, **9**), Liga Argentina, Serie A Brasil + Serie B Brasil, Liga Colombia, Liga Chile, Liga Perú, Liga Ecuador, Liga Venezuela, Liga Uruguay, Liga Bolivia, Liga Paraguay, Liga Honduras, Liga Guatemala, Liga Costa Rica, MLS + Leagues Cup.

**Béisbol:** MLB (ID **1**), Liga Mexicana de Béisbol, Liga Japonesa NPB, Liga Venezolana LVBP, Serie Nacional Cuba.

**Futuro Fase 2:** NBA, NFL, NHL, Fórmula 1.

### Rediseño UI — próxima sesión

Layout **3 zonas** tipo Sofascore/Bet365:

1. **Columna izquierda fija** — navegador de ligas agrupadas por región + badges EN VIVO
2. **Panel central** — tabs EN VIVO · HOY · PRÓXIMOS · PASADOS · **POSICIONES** + buscador global
3. **Tab POSICIONES** — standings y grupos del torneo de selecciones
4. **Móvil** — menú hamburguesa + una columna visible

### SSO pendiente

- Página **jeeljel.com/registro** con Supabase Auth
- Modal de registro al intentar chatear en Ollin Deportes
- Migración auth Ikan Naat → `jeeljel_users` **post-torneo**

## SNAPSHOT v4 — Ollin Deportes en arranque (09/06/2026) — SUPERSEDIDO por v5

~~⏳ Página `/ollin-deportes` — **pendiente de construir**~~ → **completada** (ver SNAPSHOT v5)
✅ Documento maestro unificado — [`JEELJEL_MASTER.md`](./JEELJEL_MASTER.md) (DOC-JEL-2026-MASTER-001; reemplaza Coins v13 + CURSOR Ollin)
✅ Deadline construcción página principal: **11 junio 2026** — página principal entregada; partido individual y tablas pendientes

## SNAPSHOT v3 — Actualización visual (09/06/2026)

✅ Logo Ikan Naat actualizado — nuevo quetzal neón turquesa (`Logo_Ika_Naat_sin_fondo_sin_letras.png`)
✅ `/apps` — figuras geométricas reducidas a 58 elementos (cuadrados, triángulos, hexágonos)
✅ `/mision` — layout flex 100vh: header natural + contenido centrado en espacio disponible, responsivo sin paddingTop fijo

## SNAPSHOT v2 — Footer legal + navbar limpio (27/05/2026)

✅ CONTACTO eliminado del navbar — quedan 4 items: APPS · OLLIN DEPORTES · MISIÓN · ORGANIZACIONES
✅ Footer actualizado con links: Aviso de Privacidad (`/privacidad`) y Términos de Uso (`/terminos`)
✅ Página `/privacidad` creada — contenido LFPDPPP completo v1.1
✅ Página `/terminos` creada — Términos de Uso v1.1 con mayoría de edad, afiliados y deslinde ecosistema
✅ Rutas `/privacidad` y `/terminos` registradas en `App.jsx`

## SNAPSHOT v1 — Apps página (27/05/2026)

✅ Página /apps completada con sistema de tarjetas expandibles

PATRÓN APRENDIDO — CÓMO SE CONSTRUYE UNA APP CARD EN jeeljel.com:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
El componente Apps.jsx usa un sistema de filas expandibles.
Cada app es un objeto en el array `apps[]` dentro de Apps.jsx con esta estructura exacta:

{
  id: '01',
  logo: logoIkanNaat,                    // import del asset en src/assets/
  name: 'IKAN NAAT IA',                  // mayúsculas, font Cinzel
  accentColor: '#4ecdc4',                // color único por app
  subtitulo: 'Ecosistema IA latinoamericano',
  preview: 'Texto corto siempre visible en fila colapsada — una línea',
  descripcion: 'Párrafo completo visible al expandir.',
  capacidades: [
    '🧠 Título corto — descripción en una línea sin mencionar motores externos (no poner Flux, Luma AI, GPT, Claude, Gemini, etc.)',
    // máximo 10 items
  ],
  ctaTexto: 'Entrar a Ikan Naat →',
  ctaUrl: 'https://ikannaat.jeeljel.com',  // null si es próximamente
}

REGLAS DE CONTENIDO:
- NUNCA mencionar motores de IA externos (Flux, Luma, GPT, Claude, Gemini, DeepSeek, etc.)
- Describir la funcionalidad, no la tecnología detrás
- Apps próximamente: CTA deshabilitado (`cta.disabled: true`), sin enlace activo
- **Ollin Deportes** (tarjeta 02 en `/apps`) es un **producto independiente** de jeeljel.com — NO es un agente dentro de Ikan Naat IA
- El **Agente de Apuestas** (slug `telarana` / capacidad dentro de Ikan Naat IA) sigue viviendo **dentro de Ikan Naat** sin cambios

APPS EN CATÁLOGO `/apps` (5 tarjetas — **Compañeros Virtuales eliminado** del catálogo):
✅ 01 — Ikan Naat IA (#4ecdc4) — en línea — https://ikannaat.jeeljel.com
✅ 02 — Ollin Deportes (#f97316) — **en línea** — https://jeeljel.com/ollin-deportes
⏳ 03 — VirtYou (#b464ff) — próximamente
⏳ 04 — Izydra OS (#c9a84c) — próximamente — gestión operativa seguridad privada
⏳ 05 — Inkógnito (#e05555) — próximamente — relatos adultos, tokens, swipe, live streaming

### Tarjeta 02 — Ollin Deportes (`/apps`)

- **Nombre:** Ollin Deportes (renombrada desde «Agente Deportivo» en el catálogo)
- **Tagline:** Fútbol en vivo · Modo Apostador · IA en tiempo real
- **Color acento:** `#f97316`
- **Estado:** **En línea** — producto independiente en producción
- **URL destino:** https://jeeljel.com/ollin-deportes
- **CTA texto:** ¡Ingresa aquí! (pendiente habilitar enlace en tarjeta `/apps`)
- **Logo:** ajolote con balón — `Logo_JeelJel_Kanaabcon_balon_sin_fondo.png`
- **Features:** Campo 2D isométrico en tiempo real · Estadísticas granulares por jugador · Modo Apostador con momios en vivo · Narrador comunitario con rating · IA analista (Ikan Naat) conectada al partido
- **Stack en producción:** React + Vite + Tailwind + Socket.io-client (frontend) · Node.js + Express + Redis + PM2 + Socket.io + API-Sports (backend `:10001`)

### Tarjeta 03 — VirtYou (`/apps`)

- **Subtítulo:** Tu identidad digital, siempre contigo
- **Color acento:** `#b464ff`
- **Estado:** Próximamente
- **Logo:** `Logo_virtyou_sin_fondo.png`
- **Descripción:** Tarjeta digital dinámica compartible por QR y NFC. Ficha Médica gratis incluida. Módulos de pago único para finanzas, salud, hogar, vehículo, mascotas, agenda familiar, metas y ahorro. Próximamente: invitaciones digitales también en tarjeta NFC física. Sin suscripciones.
- **Repo propio:** https://github.com/Chuvaca5256/Virtyou
- **Deploy provisional:** https://virtyou.vercel.app (solo documentación interna — **no publicar en jeeljel.com**)
- **CTA:** deshabilitado (`Próximamente →`, sin enlace externo)

### Tarjeta 04 — Izydra OS (`/apps`)

- **Nombre:** Izydra OS
- **Tagline:** Gestión operativa de élite
- **Color acento:** `#c9a84c`
- **Estado:** Próximamente
- **Logo:** `Logo_Izydra_OS_Sin_fondo.png`
- **Features:** Control de turnos, rondines QR, asistencias exportables, chat encriptado, radio táctica, acceso por roles, gestión de clientes, cierre de sesión instantáneo
- **CTA:** deshabilitado

### Tarjeta 05 — Inkógnito (`/apps`)

- **Nombre:** Inkógnito
- **Tagline:** Relatos sin censura
- **Color acento:** `#e05555`
- **Estado:** Próximamente
- **Logo:** `Logo_inkognito_sin_fondo.png`
- **Descripción:** Plataforma tipo Tinder + OnlyFans para adultos. Relatos narrativos sin censura, economía de tokens, swipe de contenido, confesionario anónimo, live streaming y mensajes premium entre lectores y creadores.
- **Repo:** github.com/Chuvaca5256/inkognito-app
- **CTA:** deshabilitado

ARCHIVOS CLAVE:
- Componente: src/pages/Apps.jsx
- Estilos: src/pages/Apps.css (o inline en el componente)
- Assets logos: src/assets/Logo_[NombreApp]_sin_fondo.png
- Fuente: Cinzel (Google Fonts, ya importada)

## Stack

- React + Vite + Tailwind + React Router

## Páginas

| Ruta | Estado |
|------|--------|
| `/` | Home (landing completa) |
| `/apps` | Catálogo expandible (5 apps) + fondo mosaico Viracoch + 90 formas wireframe SVG (cuadrados turquesa, triángulos dorados, hexágonos azules) |
| `/ollin-deportes` | **En producción** — selector deportes, panel colapsable, buscador, 4 columnas de partidos, Socket.io; disclaimer legal |
| `/ollin-deportes/partido/:id` | **Stub** — ruta registrada; vista de partido pendiente de desarrollar |
| `/mision` | Stub — pendiente contenido — fondo mosaico Tlaloc |
| `/organizaciones` | Completa — 5 causas: PETA, UNESCO, Cruz Roja, UNICEF, WWF — fondo mosaico Dios Tupa — tarjetas semitransparentes |
| `/contacto` | Stub — pendiente contenido |

**Navbar:** APPS · OLLIN DEPORTES · MISIÓN · ORGANIZACIONES · CONTACTO

## Home — orden de secciones

`Hero` → `Divider` (greca) → `Stats` → `Divider` → `AppsGrid` (El Ecosistema) → `Divider` → `WorldCup` (Ollin Deportes) → `Divider` → `Mission` → `Divider` → `Organizations` → `Footer` (con greca arriba)

## Fondo global

- **Color base del body:** `#1a0400` (rojo oscuro) en `src/index.css`
- **Mosaico:** solo `src/assets/mosaicos/Cuculcan.png` vía `body::before`
  - `background-repeat: repeat`
  - `background-size: 80px 80px` (`--mosaico-size`)
  - `opacity: 0.08` (`--mosaico-opacity`)
- **Sin** capas de `fondo_pagina_web1.png` / `fondo_pagina_web2.png` ni overlay `body::after`
- Secciones con fondo transparente para que el mosaico se vea en toda la página
- **Favicon:** `public/favicon.png` (logo `Logo_JeelJel_sin_fondo.png`)

## Mosaicos por página

| Archivo | Uso |
|---------|-----|
| `Cuculcan.png` | Home (`body::before` global) |
| `Dios_Tupa.png` | `/organizaciones` (padding 80px aplicado) |
| `Macuilxochitl.png` | `/ollin-deportes` (padding 80px aplicado) |
| `Tlaloc.png` | `/mision` (padding 80px aplicado) |
| `Viracoch.png` | `/apps` — capa fija en componente + `body.page-apps::before { display: none; }` |

Cada ruta dedicada oculta el mosaico global con clase `body.page-*::before { display: none; }` en `index.css`.

## Divisor

- **Componente:** `src/components/Divider.jsx` — franja con patrón de grecas doradas en SVG `repeat-x`, altura 12px, color `#c9a84c`
- **Uso:** entre secciones en `Home.jsx` y antes del contenido en `Footer.jsx`
- **Bordes tarjetas:** clase `.tarjeta` — `1px solid rgba(0, 168, 107, 0.25)`

## Hero (`src/components/Hero.jsx`)

- **Video:** `ajolote_final.webm` con `mix-blend-mode: screen`
- **Espaciado compacto:** sin `min-h-screen` en móvil; `pt-12 pb-6` móvil, `md:min-h-screen` con `md:pt-20 md:pb-16` en desktop
- **Título «NACIMOS PARA CREAR IMPERIOS»:** estático — dos líneas (turquesa + dorado `#c9a84c`), sin animación
- **Subtítulo:** typewriter vía `useTypewriter` (ver Animaciones globales)

## Animaciones globales

- **`useTypewriter`** en `src/hooks/useTypewriter.js` — efecto typewriter activado por **IntersectionObserver** (scroll trigger), speed **41 ms**, usado en: subtítulo Hero, descripción WorldCup, subtítulo Organizations, tarjetas Mission (descripciones de pilares), párrafos Stats
- **Fondo animado /apps:** 90 elementos aleatorios en cada carga
  - Cuadrados turquesa — wireframe SVG, solo contorno
  - Triángulos dorados — wireframe SVG, solo contorno
  - Hexágonos azules — wireframe SVG, solo contorno (reemplazaron estrellas)
  - Animación: cube-spin CSS, todos en loop infinito
- **Título NACIMOS PARA CREAR IMPERIOS** — estático (sin animación)

## Stats — franja descriptiva (`src/components/Stats.jsx`)

Reemplazó la cuadrícula «5 Plataformas · 30+ Agentes IA · …». Ahora muestra:

- Dos párrafos con typewriter (ecosistema + «¿Tienes una idea?»)
- Fila de **20 banderas** clickeables (flagcdn, sin nombre) que abren búsqueda Google en pestaña nueva
- CTA **Contáctanos** → scroll suave a `#contacto` (footer)

## El Ecosistema (`src/components/AppsGrid.jsx`)

- Logos 36×36 px en esquina superior izquierda de cada tarjeta (`top: 12px`, `left: 12px`)
- Assets en `src/assets/`:
  - Ikan Naat: `Logo_Ika_Naat_sin_fondo_sin_letras.png`
  - Ollin Deportes: `Logo_JeelJel_Kanaabcon_balon_sin_fondo.png`
  - Virtyou: `Logo_virtyou_sin_fondo.png`
  - Izydra OS: `Logo_Izydra_OS_Sin_fondo.png`
  - Inkógnito: `Logo_inkognito_sin_fondo.png`

**Descripciones actuales:**

| App | Descripción |
|-----|-------------|
| Ikan Naat | Inteligencia artificial que te escucha, mira, lee y sabe lo que sientes. |
| Ollin Deportes | Estadísticas deportivas en tiempo real — fútbol y béisbol |
| Virtyou | No solo es una tarjeta virtual, también es un organizador y ayuda para el día a día. |
| Izydra OS | Organiza, crea y olvídate del trabajo pesado. |
| Inkógnito | La red social para lo que nadie se atreve, pero en modo Inkógnito sin censura. |

## Ollin Deportes — sección Home (`src/components/WorldCup.jsx`)

- Título de sección: **Ollin Deportes** (antes «Hub Biónico Deportivo» en toda la app)
- Logo clicable → `/ollin-deportes`
- **Countdown:** solo Días, Horas y Minutos (sin Segundos); una fila con `flex-nowrap`
- Actualización cada 60 s; deadline: 11 junio 2026, 23:00 UTC

## Correos corporativos (pendiente configurar)

| Correo | Uso |
|--------|-----|
| hola@jeeljel.com | Quejas y sugerencias de clientes |
| proyectos@jeeljel.com | Colaboraciones, desarrollo y negocios |
| compras@jeeljel.com | Pagos y suscripciones — contador |
| direccion@jeeljel.com | Contacto personal y negocios de la empresa |
| equipo@jeeljel.com | Comunicación interna y colaboradores |

## Infraestructura

| Recurso | Detalle |
|---------|---------|
| **Servidor** | VPS Hostinger — IP `187.77.196.169` |
| **jeeljel.com** | EN LÍNEA con HTTPS ✅ |
| **ikannaat.jeeljel.com** | EN LÍNEA con HTTPS ✅ — NO TOCAR |
| **Nginx** | Dos archivos en `sites-enabled`: `ikannaat` y `jeeljel-landing` |
| **SSL jeeljel.com** | Certbot — `/etc/letsencrypt/live/jeeljel.com/` |
| **SSL ikannaat** | Certbot — `/etc/letsencrypt/live/ikannaat.jeeljel.com/` |
| **Deploy jeeljel.com** | `/var/www/jeeljel-web/dist` |
| **Ikan Naat** | Puerto 10000 — `proxy_pass http://localhost:10000` |
| **Ollin Deportes backend** | Puerto **10001** — PM2 + Redis + Socket.io; Nginx `location /api/ollin/` → `:10001` (jeeljel-landing) |
| **GitHub** | https://github.com/Chuvaca5256/jeeljel-web |
| **Deploy automático** | GitHub Actions — `.github/workflows/deploy.yml` — push a `main` o `workflow_dispatch` |
| **Secret GitHub** | `VPS_SSH_KEY` — llave SSH ed25519 para deploy |

### Deploy workflow (corregido)

- **Sin** `ssh-keyscan` — usa `StrictHostKeyChecking=no` y `UserKnownHostsFile=/dev/null`
- Validación de `VPS_SSH_KEY` con `ssh-keygen -y`
- Paso previo: verificar SSH y `mkdir -p` en el VPS
- **rsync** con hasta 5 reintentos, `--timeout=300`, keepalive SSH
- Node.js **22** en CI

### Acceso VPS

- **Usuario:** `root`
- **Autenticación:** contraseña (sin llave SSH local; deploy vía secret en GitHub)
- **IP:** `187.77.196.169`

## ⚠️ ARQUITECTURA CRÍTICA — LEER ANTES DE TOCAR NGINX

El servidor tiene **DOS sitios** corriendo simultáneamente:

### 1. jeeljel.com (sitio principal JeelJel Kaanab)

- Archivo Nginx: `/etc/nginx/sites-enabled/jeeljel-landing`
- Apunta a: `/var/www/jeeljel-web/dist` (React build)
- SPA: `try_files $uri $uri/ /index.html;` en `location /`
- SSL: `/etc/letsencrypt/live/jeeljel.com/`
- Redirige HTTP → HTTPS automáticamente

### 2. ikannaat.jeeljel.com (aplicación Ikan Naat IA)

- Archivo Nginx: `/etc/nginx/sites-enabled/ikannaat`
- Apunta a: `proxy_pass http://localhost:10000` (Node.js app)
- SSL: `/etc/letsencrypt/live/ikannaat.jeeljel.com/`
- **NUNCA modificar este archivo**

### REGLAS DE ORO

- Nunca tocar `/etc/nginx/sites-enabled/ikannaat`
- Nunca hacer `proxy_pass` a `localhost:10000` en `jeeljel-landing`
- Si `jeeljel.com` muestra Ikan Naat = el archivo `jeeljel-landing` apunta al puerto 10000 por error
- Si Nginx no arranca = hay error de sintaxis en `jeeljel-landing`, revisar con: `nginx -t`
- Para ver el sitio después de cambios: `systemctl reload nginx` + limpiar caché del navegador
- Siempre verificar con: `curl -I https://jeeljel.com --resolve jeeljel.com:443:127.0.0.1 -k`

## Paleta — Jade & Turquesa Maya

| Color | Uso |
|-------|-----|
| `#1a0400` | Fondo base del body (rojo oscuro) |
| `#4ecdc4` | Turquesa — títulos principales |
| `#00e5a0` | Jade brillante — títulos secundarios y separadores |
| `rgba(0,168,107,0.25)` | Bordes de tarjetas (ecosistema) |
| `#ffffff` | Blanco puro — textos de párrafo |
| `#c9a84c` | Dorado — navbar y «CREAR IMPERIOS» |

## 🏟️ OLLIN DEPORTES — DOC-JEL-2026-001

- **Nombre en app:** Ollin Deportes (renombrado desde Hub Biónico Deportivo)
- **URL final:** https://jeeljel.com/ollin-deportes — **EN PRODUCCIÓN**
- **Mascota:** Ajolote JeelJel con balón (`Logo_JeelJel_Kanaabcon_balon_sin_fondo.png`)
- **Qué es:** Web app dentro de jeeljel.com para seguir fútbol y béisbol (MLB) en tiempo real: columnas EN VIVO / HOY / PASADOS / PRÓXIMOS, chat en vivo moderado (Supabase), modo apostador y campo 2D isométrico (PixiJS) planeados en fases siguientes.
- **Stack en producción:** React + Vite + Tailwind + Socket.io (frontend) · Node.js + Express + Redis + PM2 + Socket.io + API-Sports (backend `:10001`) · Supabase (chat)
- **Backend Redis keys:** `ollin:futbol:live`, `ollin:futbol:hoy`, `ollin:futbol:proximos`, `ollin:beisbol:hoy`
- **Fútbol próximos:** polling adicional ligas API **1, 2, 3, 4** season **2026** (`next=10` c/u)
- **Cumplimiento legal:** capa `compliance.js` + `sanitize.js` + `OllinLegalDisclaimer`; sin logos oficiales ni términos FIFA/Mundial/World Cup en UI
- **Moderación chat:** homofobia, racismo, groserías, spam — filtros anti-evasión, mute/ban por reincidencia (Redis)
- **Deploy:** manual VPS backend + PM2; frontend GitHub Actions
- **API-Sports:** plan FREE (100 req/día, 10 min) → upgrade PRO/Ultra al **11/06/2026**
- **Modelo acceso:** gratuito durante torneo selecciones 2026; post-torneo marcadores básicos libres, premium para suscriptores Pro ecosistema; flag `PREMIUM_ONLY` por liga en frontend
- **Próxima sesión:** rediseño UI 3 zonas (Sofascore/Bet365), catálogo completo de ligas, tab POSICIONES, SSO
- **Pendiente:** jeeljel.com/registro · modal chat · migración Ikan Naat post-torneo · `/partido/:id` · campo 2D PixiJS · afiliados
- **Puerto backend Ollin Deportes:** 10001 (nunca 10000, ese es Ikan Naat)
