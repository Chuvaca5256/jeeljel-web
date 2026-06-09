const { MLB_LEAGUE_ID } = require('../config/leagues')
const { apiGet, baseballClient } = require('./apiClient')
const { formatDateYMD } = require('../lib/dates')
const { sanitizeBaseballGames } = require('../lib/sanitize')

function filterMlbGames(games) {
  if (!Array.isArray(games)) return []
  return games.filter((g) => g?.league?.id === MLB_LEAGUE_ID)
}

function isBaseballLive(game) {
  const short = game?.status?.short || ''
  return short.startsWith('IN') || short === 'LIVE' || short === 'BT'
}

async function pollBaseball(redis) {
  const today = formatDateYMD(new Date())
  const result = await apiGet(baseballClient, '/games', { date: today }, redis)

  if (!result.ok) {
    return { hoy: null, error: result.error }
  }

  const hoy = sanitizeBaseballGames(filterMlbGames(result.data))
  return { hoy: hoy.length ? hoy : [], error: null }
}

module.exports = {
  filterMlbGames,
  isBaseballLive,
  pollBaseball,
}
