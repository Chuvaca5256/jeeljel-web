const { LIGAS_PERMITIDAS_SET } = require('../config/leagues')
const { apiGet } = require('./apiClient')
const { footballClient } = require('./apiClient')
const { nextDates, todayKey } = require('../lib/dates')
const { sanitizeFootballFixtures } = require('../lib/sanitize')

/** Ligas del torneo de selecciones 2026 — solo columna PRÓXIMOS */
const TORNEO_SELECCIONES_LIGAS = [1, 2, 3, 4]
const TORNEO_SELECCIONES_SEASON = 2026

function filterAllowedLeagues(fixtures) {
  if (!Array.isArray(fixtures)) return []
  return fixtures.filter((f) => LIGAS_PERMITIDAS_SET.has(f?.league?.id))
}

async function fetchLiveFixtures(redis) {
  return apiGet(footballClient, '/fixtures', { live: 'all' }, redis)
}

async function fetchFixturesByDate(date, redis) {
  return apiGet(footballClient, '/fixtures', { date }, redis)
}

async function fetchProximosTorneoSelecciones(redis) {
  const collected = []

  for (const leagueId of TORNEO_SELECCIONES_LIGAS) {
    const result = await apiGet(
      footballClient,
      '/fixtures',
      { league: leagueId, season: TORNEO_SELECCIONES_SEASON, next: 10 },
      redis
    )
    if (!result.ok) continue
    collected.push(...sanitizeFootballFixtures(filterAllowedLeagues(result.data)))
  }

  return collected
}

function dedupeFixtures(fixtures) {
  const seen = new Set()
  return fixtures.filter((f) => {
    const id = f?.fixture?.id
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

function sortFixturesByDate(fixtures) {
  return [...fixtures].sort((a, b) => {
    const da = new Date(a?.fixture?.date || 0).getTime()
    const db = new Date(b?.fixture?.date || 0).getTime()
    return da - db
  })
}

// Partidos de hoy (programados + terminados) — solo ligas TORNEO_SELECCIONES_LIGAS [1,2,3,4].
async function pollFootballHoy(redis) {
  const date = todayKey()
  const collected = []

  for (const leagueId of TORNEO_SELECCIONES_LIGAS) {
    const result = await apiGet(
      footballClient,
      '/fixtures',
      { league: leagueId, season: TORNEO_SELECCIONES_SEASON, date, timezone: 'America/Mexico_City' },
      redis
    )
    if (!result.ok) continue
    collected.push(...sanitizeFootballFixtures(filterAllowedLeagues(result.data)))
  }

  return {
    hoy: collected.length ? dedupeFixtures(collected) : null,
  }
}

// Solo ligas TORNEO_SELECCIONES_LIGAS [1,2,3,4] — no ligas adicionales.
// Esta función es la única que debe usarse para próximos partidos durante el torneo.
async function pollFootballProximos(redis) {
  const torneoProximos = await fetchProximosTorneoSelecciones(redis)
  const combinedProximos = dedupeFixtures(torneoProximos)
  return {
    proximos: combinedProximos.length ? sortFixturesByDate(combinedProximos) : null,
  }
}

async function pollFootballLive(redis) {
  const liveResult = await apiGet(
    footballClient,
    '/fixtures',
    { live: 'all', timezone: 'America/Mexico_City' },
    redis
  )
  const liveFixtures = liveResult.ok
    ? sanitizeFootballFixtures(filterAllowedLeagues(liveResult.data))
    : null

  return { live: liveFixtures }
}

async function pollFootball(redis) {
  const dates = nextDates(4)
  const [today] = dates

  const liveResult = await fetchLiveFixtures(redis)
  const liveFixtures = liveResult.ok
    ? sanitizeFootballFixtures(filterAllowedLeagues(liveResult.data))
    : null

  const hoyFixtures = []
  // const proximosFixtures = []

  // DESACTIVADO durante torneo selecciones 2026 — evita consumir requests de API-Sports
  // en ligas fuera de TORNEO_SELECCIONES_LIGAS [1,2,3,4].
  // Solo pollFootballProximos debe usarse para próximos partidos.
  // for (const date of dates) {
  //   const result = await fetchFixturesByDate(date, redis)
  //   if (!result.ok) continue
  //   const filtered = sanitizeFootballFixtures(filterAllowedLeagues(result.data))
  //   if (date === today) {
  //     hoyFixtures.push(...filtered)
  //   } else {
  //     proximosFixtures.push(...filtered)
  //   }
  // }

  // Partidos de hoy: solo fecha de hoy (una request)
  const hoyResult = await fetchFixturesByDate(today, redis)
  if (hoyResult.ok) {
    hoyFixtures.push(...sanitizeFootballFixtures(filterAllowedLeagues(hoyResult.data)))
  }

  const torneoProximos = await fetchProximosTorneoSelecciones(redis)
  const combinedProximos = dedupeFixtures(torneoProximos)

  return {
    live: liveFixtures,
    hoy: hoyFixtures.length ? dedupeFixtures(hoyFixtures) : null,
    proximos: combinedProximos.length ? sortFixturesByDate(combinedProximos) : null,
  }
}

module.exports = {
  filterAllowedLeagues,
  fetchLiveFixtures,
  pollFootball,
  pollFootballLive,
  pollFootballHoy,
  pollFootballProximos,
  TORNEO_SELECCIONES_LIGAS,
}
