const axios = require('axios')
const config = require('../config/env')
const { getClient } = require('../lib/redis')
const { incrementRequestCount, isPollingPaused } = require('../lib/requestCounter')

const REDIS_KEY = 'ollin:futbol:pasados'
const TTL_SECONDS = 6 * 60 * 60 // 6 horas
const LIGAS_IDS = [1, 2, 3, 4, 11, 13, 262] // torneo selecciones + principales

async function fetchFixturesByDate(date, redis) {
  const responses = await Promise.all(
    LIGAS_IDS.map((ligaId) =>
      axios
        .get('https://v3.football.api-sports.io/fixtures', {
          headers: { 'x-apisports-key': config.apiSportsKey },
          params: { date, league: ligaId, season: 2026, timezone: 'America/Mexico_City' },
        })
        .catch(() => null)
    )
  )
  const fixtures = []
  for (const res of responses) {
    if (res && res.data && res.data.response) {
      fixtures.push(...res.data.response.filter((f) => f.fixture.status.short === 'FT'))
    }
  }
  if (redis) {
    await incrementRequestCount(redis, LIGAS_IDS.length)
  }
  return fixtures
}

async function pollFootballPasados(redisIn) {
  const redis = redisIn || getClient()
  if (!redis) {
    console.warn('[ollin][pasados] Redis no disponible — omitiendo')
    return
  }

  const pause = await isPollingPaused(redis)
  if (pause.paused) {
    console.log('[ollin][pasados] Límite diario alcanzado — omitiendo')
    return
  }

  const hoy = new Date()
  const fechas = []
  for (let i = 1; i <= 3; i++) {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() - i)
    fechas.push(d.toISOString().slice(0, 10))
  }

  const todos = []
  for (const fecha of fechas) {
    const fixtures = await fetchFixturesByDate(fecha, redis)
    todos.push(...fixtures)
  }

  todos.sort((a, b) => b.fixture.timestamp - a.fixture.timestamp)
  await redis.setex(REDIS_KEY, TTL_SECONDS, JSON.stringify(todos))
  console.log(`[ollin][pasados] ${todos.length} partidos FT guardados (${fechas.join(', ')})`)
}

module.exports = { pollFootballPasados, REDIS_KEY }
