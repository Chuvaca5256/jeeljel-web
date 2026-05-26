# SNAPSHOT — Estado actual del proyecto

## Stack

- React + Vite + Tailwind + React Router

## Páginas

- Home
- Apps
- Mundial
- Misión
- Organizaciones

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

### Acceso VPS

- **Usuario:** `root`
- **Autenticación:** contraseña (sin llave SSH por ahora)
- **IP:** `187.77.196.169`

## ⚠️ ARQUITECTURA CRÍTICA — LEER ANTES DE TOCAR NGINX

El servidor tiene **DOS sitios** corriendo simultáneamente:

### 1. jeeljel.com (sitio principal JeelJel Kaanab)

- Archivo Nginx: `/etc/nginx/sites-enabled/jeeljel-landing`
- Apunta a: `/var/www/jeeljel-web/dist` (React build)
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

## Paleta — Obsidiana Imperial

| Color | Uso |
|-------|-----|
| `#0a0508` | Fondo base |
| `#c9a84c` | Dorado |
| `#7b2d8b` | Púrpura |
| `#e85d26` | Naranja |
| `#f5f0e8` | Texto claro |

## 🏟️ HUB BIÓNICO DEPORTIVO — DOC-JEL-2026-001

- **URL final:** `jeeljel.com/mundial-2026`
- **Deadline:** 11 de junio de 2026
- **Mascota:** Ajolote JeelJel con balón
- **Qué es:** Web app dentro de jeeljel.com para seguir partidos del Mundial 2026 en tiempo real con campo 2D isométrico (PixiJS, sin copyright), modo apostador, stats granulares por jugador (pases, faltas, tarjetas, tiros, corners, posesión), narrador comunitario con micrófono, chat en vivo (Supabase), IA analista Ikan Naat conectada a datos en vivo, y archivo post-partido.
- **Stack:** React + Vite + Tailwind + PixiJS + Socket.io + Node.js + Redis + Docker + Supabase + API-Football Ultra ($29/mes) + Cloudflare
- **Monetización:** Afiliados casas de apuestas (1xBet 40%, Bet365 30%) + AdSense. Estimado conservador: $3,000–3,500 USD por el Mundial.
- **Puerto backend Hub:** 10001 (nunca 10000, ese es Ikan Naat)
