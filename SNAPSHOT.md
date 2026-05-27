# SNAPSHOT — Estado actual del proyecto

## Stack

- React + Vite + Tailwind + React Router

## Páginas

| Ruta | Estado |
|------|--------|
| `/` | Home (landing completa) |
| `/apps` | Stub — pendiente contenido |
| `/hub-bionico` | Stub — pendiente contenido |
| `/mision` | Stub — pendiente contenido |
| `/organizaciones` | Stub — pendiente contenido |
| `/contacto` | Stub — pendiente contenido |

**Navbar:** APPS · OLLIN DEPORTES · MISIÓN · ORGANIZACIONES · CONTACTO

## Fondo global

- **Fondo actual:** `fondo_pagina_web1.png` y `fondo_pagina_web2.png` en `public/` — mosaico de dioses prehispánicos (Kukulkán, Tláloc, Inti, Viracocha, Pachamama, Bochica, Mama Killa, Bachué) generados con Gemini
- **Overlay:** `rgba(10,5,8,0.35)` vía `body::after`
- Secciones grandes transparentes para que el fondo se vea en toda la página
- `public/bg-maya.svg` existe pero **no se usa**

## Divisor

- **Componente:** `src/components/Divider.jsx` — franja con patrón de grecas doradas en SVG `repeat-x`, altura 12px, color `#c9a84c`
- **Uso:** entre secciones en `Home.jsx` y antes del contenido en `Footer.jsx`
- **Bordes tarjetas:** clase `.tarjeta` — `1px solid rgba(0, 168, 107, 0.25)`

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
| **GitHub** | https://github.com/Chuvaca5256/jeeljel-web |
| **Deploy automático** | GitHub Actions — `.github/workflows/deploy.yml` — se activa en cada push a `main` |
| **Secret GitHub** | `VPS_SSH_KEY` — llave SSH ed25519 para deploy |

### Acceso VPS

- **Usuario:** `root`
- **Autenticación:** contraseña (sin llave SSH por ahora)
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
| `#4ecdc4` | Turquesa — títulos principales |
| `#00e5a0` | Jade brillante — títulos secundarios y separadores |
| `rgba(0,168,107,0.25)` | Bordes de tarjetas (ecosistema) |
| `#ffffff` | Blanco puro — textos de párrafo |
| `#c9a84c` | Dorado — navbar y «CREAR IMPERIOS» (sin cambiar) |
| `#0a0508` | Fondo base del body |

## 🏟️ OLLIN DEPORTES — DOC-JEL-2026-001

- **URL final:** `jeeljel.com/mundial-2026`
- **Deadline:** 11 de junio de 2026
- **Mascota:** Ajolote JeelJel con balón
- **Qué es:** Web app dentro de jeeljel.com para seguir partidos del Mundial 2026 en tiempo real con campo 2D isométrico (PixiJS, sin copyright), modo apostador, stats granulares por jugador (pases, faltas, tarjetas, tiros, corners, posesión), narrador comunitario con micrófono, chat en vivo (Supabase), IA analista Ikan Naat conectada a datos en vivo, y archivo post-partido.
- **Stack:** React + Vite + Tailwind + PixiJS + Socket.io + Node.js + Redis + Docker + Supabase + API-Football Ultra ($29/mes) + Cloudflare
- **Monetización:** Afiliados casas de apuestas (1xBet 40%, Bet365 30%) + AdSense. Estimado conservador: $3,000–3,500 USD por el Mundial.
- **Puerto backend Ollin Deportes:** 10001 (nunca 10000, ese es Ikan Naat)
