const { STANDINGS_SEASON } = require('../config/leagues')
const { footballClient, apiGet } = require('./apiClient')
const { getJson, setJson } = require('./redis')
const { sanitizeText, leagueDisplayName } = require('./compliance')

const STANDINGS_TTL_MS = 60 * 60 * 1000

function standingsKey(ligaId) {
  return `ollin:standings:${ligaId}`
}

function sanitizeTeamRow(row) {
  if (!row?.team) return row
  return {
    rank: row.rank,
    points: row.points,
    goalsDiff: row.goalsDiff,
    group: row.group || null,
    all: row.all
      ? {
          played: row.all.played,
          win: row.all.win,
          draw: row.all.draw,
          lose: row.all.lose,
          goals: row.all.goals,
        }
      : null,
    team: {
      id: row.team.id,
      name: sanitizeText(row.team.name),
      national: Boolean(row.team.national),
    },
  }
}

function sanitizeStandingsResponse(apiRows, leagueId) {
  if (!Array.isArray(apiRows) || apiRows.length === 0) {
    return { leagueId, season: STANDINGS_SEASON, groups: [], flat: [] }
  }

  const entry = apiRows[0]
  const leagueName = leagueDisplayName(entry?.league || { id: leagueId })
  const standingsNested = entry?.league?.standings || []

  const groups = standingsNested.map((groupRows, index) => {
    const groupLabel =
      groupRows[0]?.group || String.fromCharCode(65 + index)
    return {
      group: groupLabel,
      rows: groupRows.map(sanitizeTeamRow),
    }
  })

  const flat = groups.length === 1 ? groups[0].rows : groups.flatMap((g) => g.rows)

  return {
    leagueId,
    leagueName,
    season: STANDINGS_SEASON,
    groups,
    flat,
  }
}

async function fetchStandings(ligaId, redis) {
  const key = standingsKey(ligaId)
  const cached = await getJson(key)
  if (cached) return cached

  const result = await apiGet(
    footballClient,
    '/standings',
    { league: ligaId, season: STANDINGS_SEASON },
    redis
  )

  if (!result.ok) return null

  const sanitized = sanitizeStandingsResponse(result.data, Number(ligaId))
  await setJson(key, sanitized, STANDINGS_TTL_MS)
  return sanitized
}

module.exports = {
  fetchStandings,
  standingsKey,
  STANDINGS_TTL_MS,
}
