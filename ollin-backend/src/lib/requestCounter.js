const { todayKey } = require('./dates')
const config = require('../config/env')

function requestsKey(date = todayKey()) {
  return `ollin:api:requests:${date}`
}

async function getRequestCount(redis) {
  if (!redis) return 0
  try {
    const val = await redis.get(requestsKey())
    return parseInt(val || '0', 10) || 0
  } catch {
    return 0
  }
}

async function incrementRequestCount(redis, amount = 1) {
  if (!redis) return 0
  const key = requestsKey()
  try {
    const total = await redis.incrby(key, amount)
    const ttlSeconds = 60 * 60 * 48
    await redis.expire(key, ttlSeconds)
    return total
  } catch (err) {
    console.error('[ollin] Error incrementando contador API:', err.message)
    return 0
  }
}

async function isPollingPaused(redis) {
  const count = await getRequestCount(redis)
  if (count >= config.apiDailyPauseAt) {
    return { paused: true, reason: 'daily_limit', count }
  }
  try {
    const flag = await redis.get('ollin:polling:paused')
    if (flag === '1') {
      return { paused: true, reason: 'manual', count }
    }
  } catch {
    /* ignore */
  }
  return { paused: false, count }
}

async function setPollingPaused(redis, paused) {
  if (!redis) return
  const key = 'ollin:polling:paused'
  try {
    if (paused) {
      const secondsUntilMidnight = secondsToNextUtcDay()
      await redis.set(key, '1', 'EX', secondsUntilMidnight)
    } else {
      await redis.del(key)
    }
  } catch (err) {
    console.error('[ollin] Error seteando pause flag:', err.message)
  }
}

function secondsToNextUtcDay() {
  const now = new Date()
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return Math.max(60, Math.floor((next - now) / 1000))
}

module.exports = {
  getRequestCount,
  incrementRequestCount,
  isPollingPaused,
  setPollingPaused,
  requestsKey,
}
