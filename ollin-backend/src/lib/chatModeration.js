const { USER_BLOCK_MESSAGE } = require('./chatFilter')

const BLOCK_WINDOW_SEC = 10 * 60
const BLOCK_THRESHOLD = 3
const MUTE_DURATION_SEC = 15 * 60
const MUTE_DAY_THRESHOLD = 3
const BAN_DURATION_SEC = 24 * 60 * 60
const DUPLICATE_WINDOW_SEC = 60 * 60

function actorKey(userId, ip) {
  return userId ? `u:${userId}` : `ip:${ip || 'unknown'}`
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

async function getModerationStatus(redis, userId, ip) {
  const actor = actorKey(userId, ip)
  if (!redis) return { canSend: true }

  const banKey = `ollin:chat:ban:${actor}`
  const muteKey = `ollin:chat:mute:${actor}`

  const banUntil = await redis.get(banKey)
  if (banUntil && Date.now() < Number(banUntil)) {
    return {
      canSend: false,
      type: 'ban',
      until: new Date(Number(banUntil)).toISOString(),
      userMessage:
        'Has sido suspendido del chat por 24 horas por reincidencia. En Ollin Deportes fomentamos la convivencia sana.',
    }
  }

  const muteUntil = await redis.get(muteKey)
  if (muteUntil && Date.now() < Number(muteUntil)) {
    return {
      canSend: false,
      type: 'mute',
      until: new Date(Number(muteUntil)).toISOString(),
      userMessage:
        'Estás en silencio temporal en el chat. En Ollin Deportes fomentamos la convivencia sana — sin insultos ni discriminación.',
    }
  }

  return { canSend: true }
}

async function checkDuplicateSpam(redis, userId, ip, normalizedMessage) {
  if (!redis || !normalizedMessage) return { blocked: false }

  const actor = actorKey(userId, ip)
  const key = `ollin:chat:dup:${actor}`
  const recent = await redis.lrange(key, 0, 1)

  if (recent.length >= 2 && recent[0] === normalizedMessage && recent[1] === normalizedMessage) {
    return { blocked: true, reason: 'spam_duplicate' }
  }

  await redis.lpush(key, normalizedMessage)
  await redis.ltrim(key, 0, 2)
  await redis.expire(key, DUPLICATE_WINDOW_SEC)
  return { blocked: false }
}

async function recordBlockedAttempt(redis, userId, ip) {
  if (!redis) return { muted: false, banned: false }

  const actor = actorKey(userId, ip)
  const now = Date.now()
  const attemptsKey = `ollin:chat:blocks:${actor}`

  await redis.zadd(attemptsKey, now, String(now))
  await redis.zremrangebyscore(attemptsKey, 0, now - BLOCK_WINDOW_SEC * 1000)
  await redis.expire(attemptsKey, BLOCK_WINDOW_SEC)

  const count = await redis.zcard(attemptsKey)
  if (count < BLOCK_THRESHOLD) {
    return { muted: false, banned: false, blockCount: count }
  }

  const muteKey = `ollin:chat:mute:${actor}`
  const muteUntil = now + MUTE_DURATION_SEC * 1000
  await redis.set(muteKey, String(muteUntil), 'EX', MUTE_DURATION_SEC)
  await redis.del(attemptsKey)

  const mutesDayKey = `ollin:chat:mutes:${actor}:${todayKey()}`
  const mutesToday = await redis.incr(mutesDayKey)
  await redis.expire(mutesDayKey, 60 * 60 * 48)

  if (mutesToday >= MUTE_DAY_THRESHOLD) {
    const banKey = `ollin:chat:ban:${actor}`
    const banUntil = now + BAN_DURATION_SEC * 1000
    await redis.set(banKey, String(banUntil), 'EX', BAN_DURATION_SEC)
    return { muted: true, banned: true, muteUntil, banUntil, mutesToday }
  }

  return { muted: true, banned: false, muteUntil, mutesToday }
}

module.exports = {
  USER_BLOCK_MESSAGE,
  actorKey,
  getModerationStatus,
  checkDuplicateSpam,
  recordBlockedAttempt,
}
