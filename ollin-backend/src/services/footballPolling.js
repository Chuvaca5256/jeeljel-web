const { LIGAS_PERMITIDAS_SET } = require('../config/leagues')
const { apiGet } = require('./apiClient')
const { footballClient } = require('./apiClient')
const { nextDates } = require('../lib/dates')
const { sanitizeFootballFixtures } = require('../lib/sanitize')

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

function dedupeFixtures(fixtures) {
  const seen = new Set()
  return fixtures.filter((f) => {
    const id = f?.fixture?.id
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

async function pollFootball(redis) {
  const dates = nextDates(4)
  const [today] = dates

  const liveResult = await fetchLiveFixtures(redis)
  const liveFixtures = liveResult.ok
    ? sanitizeFootballFixtures(filterAllowedLeagues(liveResult.data))
    : null

  const hoyFixtures = []
  const proximosFixtures = []

  for (const date of dates) {
    const result = await fetchFixturesByDate(date, redis)
    if (!result.ok) continue
    const filtered = sanitizeFootballFixtures(filterAllowedLeagues(result.data))
    if (date === today) {
      hoyFixtures.push(...filtered)
    } else {
      proximosFixtures.push(...filtered)
    }
  }

  return {
    live: liveFixtures,
    hoy: hoyFixtures.length ? dedupeFixtures(hoyFixtures) : null,
    proximos: proximosFixtures.length ? dedupeFixtures(proximosFixtures) : null,
  }
}

module.exports = {
  filterAllowedLeagues,
  pollFootball,
}
