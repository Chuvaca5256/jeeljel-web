# Review dump — `ollin-backend/src/services/chatService.js`

Archivo completo (145 líneas). Handler delegado desde `routes/chat.js` → `POST /messages`.

```javascript
const crypto = require('crypto')
const { evaluateChatMessage, USER_BLOCK_MESSAGE } = require('../lib/chatFilter')
const {
  getModerationStatus,
  checkDuplicateSpam,
  recordBlockedAttempt,
} = require('../lib/chatModeration')
const { getSupabase } = require('./supabaseClient')

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}

async function logModerationAttempt({ userId, ip, message, reason, term }) {
  const supabase = getSupabase()
  if (!supabase) {
    console.warn('[ollin][chat] Supabase no configurado — intento moderado no persistido')
    return
  }

  const { error } = await supabase.from('ollin_chat_moderacion').insert({
    user_id: userId || null,
    ip_address: ip,
    message,
    reason,
    matched_term: term || null,
  })

  if (error) {
    console.error('[ollin][chat] Error registrando moderación:', error.message)
  }
}

async function publishChatMessage({ matchId, userId, displayName, message, ip }) {
  const supabase = getSupabase()
  if (!supabase) {
    throw new Error('Supabase no configurado')
  }

  const payload = {
    match_id: matchId,
    user_id: userId || null,
    display_name: displayName || 'Aficionado',
    message: message.trim(),
    ip_address: ip,
  }

  const { data, error } = await supabase.from('ollin_chat').insert(payload).select().single()
  if (error) throw error
  return data
}

/**
 * Pipeline completo: moderación → filtro → anti-spam → Supabase
 */
async function sendChatMessage({ redis, req, body }) {
  const ip = clientIp(req)
  const userId = body.userId || body.user_id || null
  const message = body.message
  const matchId = body.matchId || body.match_id
  const displayName = body.displayName || body.display_name

  if (!matchId) {
    return { ok: false, status: 400, error: 'matchId requerido' }
  }

  const status = await getModerationStatus(redis, userId, ip)
  if (!status.canSend) {
    return {
      ok: false,
      status: 403,
      blocked: true,
      type: status.type,
      until: status.until,
      userMessage: status.userMessage,
    }
  }

  const filterResult = evaluateChatMessage(message)
  if (!filterResult.allowed) {
    await logModerationAttempt({
      userId,
      ip,
      message,
      reason: filterResult.reason,
      term: filterResult.term,
    })
    const reincidence = await recordBlockedAttempt(redis, userId, ip)
    return {
      ok: false,
      status: 422,
      blocked: true,
      reason: filterResult.reason,
      userMessage: filterResult.userMessage,
      reincidence,
    }
  }

  const duplicate = await checkDuplicateSpam(redis, userId, ip, filterResult.normalized)
  if (duplicate.blocked) {
    await logModerationAttempt({
      userId,
      ip,
      message,
      reason: duplicate.reason,
    })
    const reincidence = await recordBlockedAttempt(redis, userId, ip)
    return {
      ok: false,
      status: 422,
      blocked: true,
      reason: duplicate.reason,
      userMessage: USER_BLOCK_MESSAGE,
      reincidence,
    }
  }

  try {
    const published = await publishChatMessage({
      matchId,
      userId,
      displayName,
      message,
      ip,
    })
    return { ok: true, status: 201, data: published }
  } catch (err) {
    console.error('[ollin][chat] Error publicando mensaje:', err.message)
    return { ok: false, status: 503, error: 'No se pudo publicar el mensaje' }
  }
}

function hashMessage(text) {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16)
}

module.exports = {
  clientIp,
  sendChatMessage,
  hashMessage,
}
```

## Resumen pipeline `sendChatMessage`

| Paso | Condición | HTTP | Respuesta al frontend |
|------|-----------|------|------------------------|
| 1 | Sin `matchId` | 400 | `{ ok: false, error: 'matchId requerido' }` — **sin `userMessage`** |
| 2 | Usuario/IP bloqueado (Redis) | 403 | `{ ok: false, blocked: true, userMessage: status.userMessage }` |
| 3 | Filtro de contenido | 422 | `{ ok: false, blocked: true, userMessage: filterResult.userMessage }` |
| 4 | Spam duplicado | 422 | `{ ok: false, blocked: true, userMessage: USER_BLOCK_MESSAGE }` |
| 5 | Error Supabase insert | 503 | `{ ok: false, error: 'No se pudo publicar el mensaje' }` — **sin `userMessage`** |
| OK | Insert en `ollin_chat` | 201 | `{ ok: true, message: data }` → route emite socket |

**Gap con frontend:** casos 400 y 503 no incluyen `userMessage`; `ChatPartido.jsx` solo muestra error si `result.userMessage` existe.
