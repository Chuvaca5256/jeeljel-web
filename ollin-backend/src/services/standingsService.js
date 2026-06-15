const { STANDINGS_SEASON } = require('../config/leagues')
const { footballClient, apiGet } = require('./apiClient')
const { getJson, setJson } = require('../lib/redis')
const { sanitizeText, leagueDisplayName } = require('../lib/compliance')

const STANDINGS_TTL_MS = 60 * 60 * 1000
const SCORERS_TTL_MS = 60 * 60 * 1000

const GROUP_LABEL_ES = {
  'Ranking of third-placed teams': 'Clasificación de terceros',
  'Third-placed teams': 'Clasificación de terceros',
  'Ranking of the best third-placed teams': 'Clasificación de terceros',
  'Best third-placed teams': 'Clasificación de terceros',
  'Knockout stage': 'Fase eliminatoria',
}

function translateGroupLabel(label) {
  if (label == null || label === '') return label
  const str = String(label).trim()
  if (GROUP_LABEL_ES[str]) return GROUP_LABEL_ES[str]
  const groupMatch = str.match(/^Group\s+([A-Za-z0-9]+)$/i)
  if (groupMatch) return `Grupo ${groupMatch[1].toUpperCase()}`
  if (/^[A-H]$/i.test(str)) return `Grupo ${str.toUpperCase()}`
  return sanitizeText(str)
}

function standingsKey(ligaId) {
  return `ollin:standings:${ligaId}`
}

function scorersKey(ligaId) {
  return `ollin:scorers:${ligaId}`
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
  // Deduplicar grupos por nombre
  const seenGroups = new Set()
  const uniqueGroups = standingsNested.filter((groupRows) => {
    const rawLabel = groupRows[0]?.group || ''
    if (seenGroups.has(rawLabel)) return false
    seenGroups.add(rawLabel)
    return true
  })
  const groups = uniqueGroups.map((groupRows, index) => {
    const rawLabel = groupRows[0]?.group || String.fromCharCode(65 + index)
    const groupLabel = translateGroupLabel(rawLabel)
    const seenTeams = new Set()
    const uniqueRows = groupRows.filter((row) => {
      const teamId = row?.team?.id
      if (seenTeams.has(teamId)) return false
      seenTeams.add(teamId)
      return true
    })
    return {
      group: groupLabel,
      rows: uniqueRows.map((row) => ({
        ...sanitizeTeamRow(row),
        group: translateGroupLabel(row.group || rawLabel),
      })),
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

  const apiRows = result.data
  const standingsNested = apiRows?.[0]?.league?.standings
  const hasStandings =
    Array.isArray(standingsNested) &&
    standingsNested.length > 0 &&
    standingsNested.some((group) => Array.isArray(group) && group.length > 0)

  if (!hasStandings) {
    console.warn(
      `[standings] API-Sports devolvió standings vacíos — liga=${ligaId}, season=${STANDINGS_SEASON}. ` +
        'Nota: el plan FREE solo cubre temporadas 2021–2023; los datos reales llegarán con el upgrade PRO.'
    )
  }

  const sanitized = sanitizeStandingsResponse(apiRows, Number(ligaId))
  await setJson(key, sanitized, STANDINGS_TTL_MS)
  return sanitized
}

function sanitizeScorersResponse(apiRows, leagueId) {
  if (!Array.isArray(apiRows)) return { leagueId, season: STANDINGS_SEASON, scorers: [] }

  const scorers = apiRows.map((entry, index) => {
    const stats = entry.statistics?.[0] || {}
    const goals = stats.goals || {}
    return {
      rank: index + 1,
      playerName: sanitizeText(entry.player?.name || 'Jugador'),
      teamName: sanitizeText(stats.team?.name || '—'),
      goals: goals.total ?? 0,
      assists: goals.assists ?? 0,
    }
  })

  return {
    leagueId,
    season: STANDINGS_SEASON,
    scorers,
  }
}

async function fetchTopScorers(ligaId, redis) {
  const key = scorersKey(ligaId)
  const cached = await getJson(key)
  if (cached) return cached

  const result = await apiGet(
    footballClient,
    '/players/topscorers',
    { league: ligaId, season: STANDINGS_SEASON },
    redis
  )

  if (!result.ok) return null

  if (!Array.isArray(result.data) || result.data.length === 0) {
    console.warn(
      `[standings] API-Sports devolvió goleadores vacíos — liga=${ligaId}, season=${STANDINGS_SEASON}.`
    )
  }

  const sanitized = sanitizeScorersResponse(result.data, Number(ligaId))
  await setJson(key, sanitized, SCORERS_TTL_MS)
  return sanitized
}

module.exports = {
  fetchStandings,
  fetchTopScorers,
  standingsKey,
  scorersKey,
  STANDINGS_TTL_MS,
  SCORERS_TTL_MS,
}
