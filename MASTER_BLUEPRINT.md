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
- ✅ Navegación actualizada: Apps, Ollin Deportes, Misión, Organizaciones, Contacto
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

## Infraestructura

### Acceso VPS

- **Usuario:** `root`
- **Autenticación:** contraseña (sin llave SSH local; deploy vía `VPS_SSH_KEY` en GitHub)
- **IP:** `187.77.196.169`

### Deploy

- Workflow: `.github/workflows/deploy.yml`
- Destino: `root@187.77.196.169:/var/www/jeeljel-web/dist/`
- Re-disparar manualmente: GitHub → Actions → Deploy jeeljel.com → Run workflow

## Pendientes próxima sesión

- [ ] 🔴 **URGENTE** Ollin Deportes — deadline 11 junio 2026 — ver SNAPSHOT para detalle completo
- [ ] Registrarse en API-Football Ultra y obtener API key
- [ ] Registrarse en afiliados: 1xBet Partners, Bet365 Affiliates
- [ ] Crear ruta `/mundial-2026` en React dentro de jeeljel-web
- [ ] Página Apps con contenido completo (Home ya tiene grid con logos)
- [ ] Página Ollin Deportes (`/ollin-deportes`) completa con features y CTA
- [ ] Página Misión con contenido real
- [ ] Página Organizaciones mejorada
- [ ] Página Contacto con formulario a hola@jeeljel.com (footer ya tiene `mailto:`)
- [ ] Footer global: ampliar sección de contacto si hace falta más allá del scroll desde Stats
- [ ] Nombre latinoamericano para Virtyou
- [ ] Rebrandear Izydra OS bajo JeelJel Kaanab
- ✅ Ruta `/ollin-deportes` con redirect 301 desde `/hub-bionico` (Nginx)
