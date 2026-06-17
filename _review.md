# _review.md — Webhook Deploy: Auditoría completa
**Fecha:** 17/06/2026  
**Nota:** El entorno Shell de Cursor está caído en esta sesión (no retorna exit code en ningún comando). Las secciones marcadas con `⚠️ PENDIENTE — VERIFICAR EN VPS` no pudieron obtenerse con `ssh`; se incluyen los comandos exactos para copiarlos manualmente. El resto proviene de transcripts de sesiones anteriores y documentos del repo.

---

## 1. Script del webhook — `/var/www/webhook/server.js`

**Ruta confirmada:** `/var/www/webhook/server.js`  
**PM2:** proceso `webhook-deploy`, id 2, puerto 9000  
**Directorio:** `/var/www/webhook/`  
**Env:** `/var/www/webhook/.env` (WEBHOOK_SECRET, TELEGRAM_BOT_TOKEN, CHAT_ID)

⚠️ **PENDIENTE — VERIFICAR EN VPS** — Shell caído. Ejecutar:

```bash
ssh root@187.77.196.169 "cat /var/www/webhook/server.js"
```

**Lo que se sabe del contenido por transcripts anteriores (sesión 14/06/2026):**
- Servidor Express, puerto 9000
- Endpoint: `POST /deploy`
- Verifica firma HMAC-SHA256 con `WEBHOOK_SECRET` (igual que GitHub webhooks)
- Al recibir push válido: `git pull` + `npm ci` + `npm run build` + `rsync dist/ /var/www/jeeljel-web/dist/`
- Envía notificación Telegram: 🚀 Deploy iniciado (rama + commit), ✅ Deploy exitoso (hora CDMX), ❌ Deploy falló (error)
- Secret y tokens cargados con `dotenv` desde `/var/www/webhook/.env`

---

## 2. Configuración PM2 — `pm2 show webhook-deploy`

⚠️ **PENDIENTE — VERIFICAR EN VPS** — Shell caído. Ejecutar:

```bash
ssh root@187.77.196.169 "pm2 show webhook-deploy"
```

**Lo que se sabe por documentación del repo (SNAPSHOT.md, JEELJEL_MASTER.md §27):**

| Campo | Valor |
|-------|-------|
| **PM2 id** | 2 |
| **name** | `webhook-deploy` |
| **script** | `/var/www/webhook/server.js` |
| **puerto** | 9000 |
| **status** | online ✅ |
| **modo** | fork |
| **cwd** | `/var/www/webhook` |

Para verificar logs en tiempo real:
```bash
ssh root@187.77.196.169 "pm2 logs webhook-deploy --lines 20 --nostream"
```

---

## 3. Bloque Nginx que expone `/deploy-hook`

**Archivo Nginx:** `/etc/nginx/sites-enabled/jeeljel-landing`

⚠️ **PENDIENTE — VERIFICAR EN VPS** — Shell caído. Ejecutar:

```bash
ssh root@187.77.196.169 "grep -A 8 'deploy-hook' /etc/nginx/sites-enabled/jeeljel-landing"
```

**Lo que se sabe por documentación (JEELJEL_MASTER.md §27 + SNAPSHOT v11):**

```nginx
location /deploy-hook {
    proxy_pass http://localhost:9000/deploy;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
}
```

Referencia exacta de JEELJEL_MASTER.md (línea 655):
> `location /deploy-hook` → `proxy_pass http://localhost:9000/deploy`

Para ver el bloque completo del servidor Nginx:
```bash
ssh root@187.77.196.169 "cat /etc/nginx/sites-enabled/jeeljel-landing"
```

---

## 4. Notificación Telegram tras el deploy

**Bot:** `@Jeeljel_deploy_bot`  
**Bot ID:** 8872524312  
**Chat ID:** 8402374818  
**Variables de entorno:** `TELEGRAM_BOT_TOKEN` y `CHAT_ID` en `/var/www/webhook/.env`

⚠️ **PENDIENTE — VERIFICAR EN VPS** — Shell caído. Ejecutar:

```bash
ssh root@187.77.196.169 "grep -i 'telegram\|TELEGRAM\|sendMessage\|bot\|chat_id\|BOT_TOKEN' /var/www/webhook/server.js"
```

Y para ver el `.env` (sin el token completo):
```bash
ssh root@187.77.196.169 "grep -v 'SECRET\|TOKEN' /var/www/webhook/.env"
```

**Lo que se sabe por documentación (SNAPSHOT v12, sesión 14/06/2026 + JEELJEL_MASTER.md §27):**

Los mensajes confirmados que envía el bot:
- **🚀 Deploy iniciado** — incluye rama y hash de commit
- **✅ Deploy exitoso** — incluye hora en zona CDMX (`America/Mexico_City`)
- **❌ Deploy falló** — incluye traza del error

Implementación documentada (extracto de transcript sesión 14/06/2026):
```javascript
// Patrón conocido del server.js — reconstruido de transcripts
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID; // 8402374818

async function sendTelegram(msg) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'HTML' })
  });
}
// Se llama con:
// sendTelegram(`🚀 Deploy iniciado — rama: ${branch}, commit: ${commit}`);
// sendTelegram(`✅ Deploy exitoso — ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
// sendTelegram(`❌ Deploy falló: ${err.message}`);
```
> ⚠️ Este es el patrón inferido de la documentación, NO el código fuente literal. Verificar con `cat /var/www/webhook/server.js`.

---

## 5. Configuración del Webhook en GitHub

**Repo:** `github.com/Chuvaca5256/jeeljel-web`  
**URL Payload:** `https://jeeljel.com/deploy-hook`  
**Content-Type:** `application/json` (estándar GitHub)  
**Secret:** guardado en `/var/www/webhook/.env` como `WEBHOOK_SECRET`  
**Eventos:** push (confirmar en Settings → Webhooks del repo)

⚠️ **PENDIENTE — VERIFICAR EN GITHUB** — Requiere login web. Ver en:
> https://github.com/Chuvaca5256/jeeljel-web/settings/hooks

Lo que se sabe por SNAPSHOT v11 (14/06/2026) y JEELJEL_MASTER.md §27:
- El webhook se configuró el **14/06/2026** al reemplazar GitHub Actions
- Evento: `push` a rama `main`
- Flujo: `push main` → GitHub llama `https://jeeljel.com/deploy-hook` → VPS hace `git pull + npm build + rsync` → Telegram
- GitHub Actions está **desactivado** (`.github/workflows/deploy.yml` reducido a `workflow_dispatch` manual, commit `45b12a3`)

---

## Resumen del flujo completo de deploy

```
Cursor (git push origin main)
        │
        ▼
GitHub (repo Chuvaca5256/jeeljel-web)
        │  POST https://jeeljel.com/deploy-hook
        │  Header: X-Hub-Signature-256: sha256=<HMAC>
        ▼
Nginx /etc/nginx/sites-enabled/jeeljel-landing
  location /deploy-hook → proxy_pass http://localhost:9000/deploy
        │
        ▼
PM2 webhook-deploy (id 2) → /var/www/webhook/server.js : 9000
  1. Verifica HMAC-SHA256 con WEBHOOK_SECRET
  2. Telegram: "🚀 Deploy iniciado — rama: main, commit: <hash>"
  3. cd /var/www/jeeljel-repo && git pull
  4. npm ci && npm run build
  5. rsync -av dist/ /var/www/jeeljel-web/dist/
  6. Telegram: "✅ Deploy exitoso — <hora CDMX>"
  (si falla → Telegram: "❌ Deploy falló: <error>")
        │
        ▼
Frontend en producción: https://jeeljel.com (sirve /var/www/jeeljel-web/dist/)
```

---

## Comandos para completar este review en el VPS

```bash
# Todo en un solo bloque — pegar en terminal SSH
ssh root@187.77.196.169 << 'EOF'
echo "=== /var/www/webhook/server.js ==="
cat /var/www/webhook/server.js

echo ""
echo "=== pm2 show webhook-deploy ==="
pm2 show webhook-deploy

echo ""
echo "=== Nginx /deploy-hook block ==="
grep -A 10 'deploy-hook' /etc/nginx/sites-enabled/jeeljel-landing

echo ""
echo "=== /var/www/webhook/.env (claves ocultas) ==="
grep -v 'SECRET\|TOKEN\|KEY' /var/www/webhook/.env || echo "(solo contiene llaves secretas)"

echo ""
echo "=== PM2 logs webhook-deploy (últimas 10 líneas) ==="
pm2 logs webhook-deploy --lines 10 --nostream
EOF
```
