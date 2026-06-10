import { getLeagueDisplayName } from './compliance'
import { translateTeamName } from './teamDisplay'

const FOOTBALL_LIVE = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE', 'INT'])
const FOOTBALL_FINISHED = new Set(['FT', 'AET', 'PEN', 'AWD', 'WO'])
const BASEBALL_LIVE = /^IN|^LIVE|^BT/i
const BASEBALL_FINISHED = /^(FT|POST|CANC|COMP)/i

function formatTime(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function normalizeFootballFixture(raw) {
  if (!raw) return null
  const statusShort = raw.fixture?.status?.short || 'NS'
  const elapsed = raw.fixture?.status?.elapsed
  let status = 'scheduled'
  let statusLabel = formatTime(raw.fixture?.date)

  if (FOOTBALL_LIVE.has(statusShort)) {
    status = 'live'
    statusLabel = elapsed != null ? `${elapsed}'` : 'LIVE'
  } else if (FOOTBALL_FINISHED.has(statusShort)) {
    status = 'finished'
    statusLabel = 'FT'
  }

  const home = raw.teams?.home || {}
  const away = raw.teams?.away || {}
  const leagueId = raw.league?.id ?? null

  return {
    id: String(raw.fixture?.id ?? raw.id),
    sport: 'futbol',
    leagueId,
    homeTeam: {
      name: translateTeamName(home.name || 'Local'),
      national: Boolean(home.national),
      country: home.country || home.code,
    },
    awayTeam: {
      name: translateTeamName(away.name || 'Visitante'),
      national: Boolean(away.national),
      country: away.country || away.code,
    },
    homeScore: raw.goals?.home ?? null,
    awayScore: raw.goals?.away ?? null,
    status,
    statusLabel,
    leagueName: getLeagueDisplayName(leagueId, raw.league?.name, 'futbol'),
    date: raw.fixture?.date,
  }
}

export function normalizeBaseballGame(raw) {
  if (!raw) return null
  const statusShort = raw.status?.short || raw.game?.status?.short || 'NS'
  let status = 'scheduled'
  let statusLabel = formatTime(raw.date || raw.game?.date)

  if (BASEBALL_LIVE.test(statusShort)) {
    status = 'live'
    statusLabel = raw.status?.long || statusShort
  } else if (BASEBALL_FINISHED.test(statusShort)) {
    status = 'finished'
    statusLabel = 'FT'
  }

  const home = raw.teams?.home || {}
  const away = raw.teams?.away || {}
  const leagueId = raw.league?.id ?? 1

  return {
    id: String(raw.id ?? raw.game?.id),
    sport: 'beisbol',
    leagueId,
    homeTeam: { name: home.name || 'Local', national: false },
    awayTeam: { name: away.name || 'Visitante', national: false },
    homeScore: home.score ?? raw.scores?.home?.total ?? null,
    awayScore: away.score ?? raw.scores?.away?.total ?? null,
    status,
    statusLabel,
    leagueName: getLeagueDisplayName(leagueId, raw.league?.name, 'beisbol'),
    date: raw.date || raw.game?.date,
  }
}

export function categorizeApiData(livePayload, hoyPayload, proximosPayload) {
  const liveFutbol = (livePayload?.futbol || []).map(normalizeFootballFixture).filter(Boolean)
  const liveBeisbol = (livePayload?.beisbol || []).map(normalizeBaseballGame).filter(Boolean)

  const hoyFutbol = (hoyPayload?.futbol || []).map(normalizeFootballFixture).filter(Boolean)
  const hoyBeisbol = (hoyPayload?.beisbol || []).map(normalizeBaseballGame).filter(Boolean)

  const proxFutbol = (proximosPayload?.futbol || []).map(normalizeFootballFixture).filter(Boolean)

  const liveIds = new Set([
    ...liveFutbol.map((m) => m.id),
    ...liveBeisbol.map((m) => m.id),
  ])

  const hoyScheduled = [...hoyFutbol, ...hoyBeisbol].filter(
    (m) => m.status === 'scheduled' && !liveIds.has(m.id)
  )
  const hoyFinished = [...hoyFutbol, ...hoyBeisbol].filter((m) => m.status === 'finished')

  return {
    live: [...liveFutbol, ...liveBeisbol],
    hoyScheduled,
    hoyFinished,
    proximos: proxFutbol,
  }
}

export function filterBySport(matches, sport) {
  return matches.filter((m) => m.sport === sport)
}

export function filterByLeague(matches, leagueId, sport) {
  if (leagueId == null) return matches
  return matches.filter((m) => m.sport === sport && m.leagueId === leagueId)
}

export function countLiveByLeague(matches, sport) {
  const counts = {}
  for (const m of matches) {
    if (m.sport !== sport || m.status !== 'live' || m.leagueId == null) continue
    counts[m.leagueId] = (counts[m.leagueId] || 0) + 1
  }
  return counts
}

export function groupMatchesByLeague(matches) {
  const map = new Map()
  for (const m of matches) {
    const key = `${m.sport}-${m.leagueId ?? m.leagueName}`
    if (!map.has(key)) {
      map.set(key, {
        leagueId: m.leagueId,
        leagueName: m.leagueName,
        sport: m.sport,
        matches: [],
      })
    }
    map.get(key).matches.push(m)
  }
  return Array.from(map.values()).sort((a, b) =>
    a.leagueName.localeCompare(b.leagueName, 'es')
  )
}

export function sportHasMatches(categorized, sport) {
  return (
    filterBySport(categorized.live, sport).length > 0 ||
    filterBySport(categorized.hoyScheduled, sport).length > 0 ||
    filterBySport(categorized.hoyFinished, sport).length > 0 ||
    filterBySport(categorized.proximos, sport).length > 0
  )
}

export function filterBySearch(matches, query) {
  const q = query.trim().toLowerCase()
  if (!q) return matches
  return matches.filter(
    (m) =>
      m.homeTeam.name.toLowerCase().includes(q) ||
      m.awayTeam.name.toLowerCase().includes(q) ||
      m.leagueName.toLowerCase().includes(q)
  )
}

export function formatMatchDateTime(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null

  const now = new Date()
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()

  const time = d.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  if (isToday) return time

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month} · ${time}`
}

export function getMatchesForTab(categorized, tabId) {
  switch (tabId) {
    case 'live':
      return categorized.live
    case 'hoy':
      return categorized.hoyScheduled
    case 'proximos':
      return categorized.proximos
    case 'pasados':
      return categorized.hoyFinished
    default:
      return []
  }
}
