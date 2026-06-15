# Review dump — partidoService

## ollin-backend/src/services/partidoService.js (completo)

`javascript
const { BASEBALL_LEAGUES } = require('../config/leagues')
const { KEYS, getJson, setJson } = require('../lib/redis')
const { sanitizeText } = require('../lib/compliance')
const {
  sanitizeFootballFixture,
  sanitizeBaseballGame,
} = require('../lib/sanitize')
const { footballClient, baseballClient, apiGet } = require('./apiClient')

const PARTIDO_TTL_MS = 60 * 1000

function partidoKey(id) {
  return `ollin:partido:${id}`
}

function fixtureIdFromRaw(raw, sport) {
  if (sport === 'beisbol') return String(raw?.id ?? raw?.game?.id ?? '')
  return String(raw?.fixture?.id ?? raw?.id ?? '')
}

async function findInLists(id) {
  const sources = [
    { key: KEYS.futbolLive, sport: 'futbol' },
    { key: KEYS.futbolHoy, sport: 'futbol' },
    { key: KEYS.futbolProximos, sport: 'futbol' },
    { key: KEYS.beisbolHoy, sport: 'beisbol' },
  ]

  for (const { key, sport } of sources) {
    const list = await getJson(key, [])
    if (!Array.isArray(list)) continue
    const found = list.find((item) => fixtureIdFromRaw(item, sport) === String(id))
    if (found) return { raw: found, sport }
  }
  return null
}

function sanitizePlayerName(name) {
  return sanitizeText(name || 'Jugador')
}

function parseFootballStatistics(apiRows) {
  if (!Array.isArray(apiRows) || apiRows.length === 0) {
    return { home: {}, away: {}, items: [] }
  }

  const mapStat = (teamBlock) => {
    const out = {}
    for (const row of teamBlock?.statistics || []) {
      out[row.type] = row.value
    }
    return out
  }

  const home = mapStat(apiRows[0])
  const away = mapStat(apiRows[1] || apiRows[0])

  const pick = (key, label, suffix = '') => ({
    key,
    label,
    home: home[key] ?? '—',
    away: away[key] ?? '—',
    suffix,
  })

  const items = [
    pick('Ball Possession', 'Posesión', '%'),
    pick('Total Shots', 'Tiros totales'),
    pick('Shots on Goal', 'Tiros a puerta'),
    pick('Corner Kicks', 'Corners'),
    pick('Fouls', 'Faltas'),
    pick('Yellow Cards', 'Tarjetas amarillas'),
    pick('Red Cards', 'Tarjetas rojas'),
  ]

  return { home, away, items }
}

function parseFootballEvents(apiRows) {
  if (!Array.isArray(apiRows)) return []
  return apiRows.map((ev) => ({
    minute: ev.time?.elapsed ?? ev.time?.extra ?? null,
    type: ev.type,
    detail: ev.detail,
    teamSide: ev.team?.id ? 'team' : null,
    teamId: ev.team?.id,
    player: sanitizePlayerName(ev.player?.name),
    assist: sanitizePlayerName(ev.assist?.name),
    label: formatEventLabel(ev),
  }))
}

function formatEventLabel(ev) {
  const detail = (ev.detail || '').toLowerCase()
  const type   = (ev.type   || '').toLowerCase()

  if (type === 'goal' || detail.includes('goal'))          return 'GOL ⚽'
  if (detail.includes('own goal'))                         return 'GOL EN PROPIA ⚽'
  if (detail.includes('penalty') && type === 'goal')       return 'GOL DE PENAL ⚽'
  if (detail.includes('red card') || detail.includes('red')) return 'TARJETA ROJA 🟥'
  if (detail.includes('yellow card') || detail.includes('yellow')) return 'TARJETA AMARILLA 🟨'
  if (type === 'subst')                                    return 'CAMBIO 🔄'
  if (detail.includes('corner'))                           return 'CORNER 🚩'
  if (detail.includes('penalty'))                          return 'PENAL 🎯'
  if (detail.includes('shot on target'))                   return 'TIRO A PUERTA 🥅'
  if (type === 'foul' || detail.includes('foul'))          return 'FALTA 🟨'
  if (detail.includes('free kick'))                        return 'TIRO LIBRE 🎯'
  if (detail.includes('throw in'))                         return 'SAQUE DE BANDA 🤚'
  if (detail.includes('injury'))                           return 'LESIÓN 🚑'
  if (detail.includes('var'))                              return 'VAR 📺'
  if (detail.includes('drink') || detail.includes('hydration')) return 'PAUSA HIDRATACIÓN 💧'
  if (detail.includes('delay') || detail.includes('interruption') ||
      detail.includes('lightning') || detail.includes('rain') ||
      detail.includes('pitch invasion') || detail.includes('suspended')) return 'PARTIDO DETENIDO ⚠️'
  if (detail.includes('extra time') || detail.includes('added time')) return 'TIEMPO AGREGADO ⏱️'
  return sanitizeText(ev.detail || ev.type || 'Evento')
}

function parseFootballLineups(apiRows, fixture) {
  if (!Array.isArray(apiRows) || apiRows.length === 0) {
    return { home: null, away: null }
  }

  const homeTeamId = fixture?.teams?.home?.id
  const mapLineup = (block) => ({
    formation: block.formation || null,
    coach: sanitizePlayerName(block.coach?.name),
    startXI: (block.startXI || []).map((row) => ({
      id: row.player?.id,
      name: sanitizePlayerName(row.player?.name),
      number: row.player?.number,
      pos: row.player?.pos,
      grid: row.player?.grid || null,
    })),
    substitutes: (block.substitutes || []).map((row) => ({
      id: row.player?.id,
      name: sanitizePlayerName(row.player?.name),
      number: row.player?.number,
      pos: row.player?.pos,
    })),
  })

  let home = null
  let away = null
  for (const block of apiRows) {
    if (block.team?.id === homeTeamId) home = mapLineup(block)
    else away = mapLineup(block)
  }
  if (!home && apiRows[0]) home = mapLineup(apiRows[0])
  if (!away && apiRows[1]) away = mapLineup(apiRows[1])

  return { home, away }
}

function parseFootballPlayers(apiRows) {
  if (!Array.isArray(apiRows) || apiRows.length === 0) {
    return { home: [], away: [] }
  }

  const mapPlayers = (block) =>
    (block.players || []).map((p) => {
      const st = p.statistics?.[0] || {}
      const games = st.games || {}
      const shots = st.shots || {}
      const goals = st.goals || {}
      const passes = st.passes || {}
      const duels = st.duels || {}
      const fouls = st.fouls || {}
      const cards = st.cards || {}
      return {
        id: p.player?.id,
        name: sanitizePlayerName(p.player?.name),
        minutes: games.minutes ?? 0,
        rating: games.rating ?? null,
        shots: shots.total ?? 0,
        shotsOn: shots.on ?? 0,
        passes: passes.total ?? 0,
        keyPasses: passes.key ?? 0,
        duelsWon: duels?.won ?? 0,
        fouls: fouls?.committed ?? 0,
        yellow: cards?.yellow ?? 0,
        red: cards?.red ?? 0,
        goals: goals.total ?? 0,
        assists: goals.assists ?? 0,
        position: games.position || p.player?.pos || '—',
      }
    })

  return {
    home: mapPlayers(apiRows[0] || {}),
    away: mapPlayers(apiRows[1] || {}),
  }
}

function parseFootballH2H(apiRows) {
  if (!Array.isArray(apiRows)) return []
  return apiRows.slice(0, 5).map((row) => ({
    id: row.fixture?.id,
    date: row.fixture?.date,
    leagueName: sanitizeText(row.league?.name),
    homeTeam: sanitizeText(row.teams?.home?.name),
    awayTeam: sanitizeText(row.teams?.away?.name),
    homeScore: row.goals?.home,
    awayScore: row.goals?.away,
    status: row.fixture?.status?.short,
  }))
}

function parseBaseballStatistics(game) {
  const home = game?.teams?.home || {}
  const away = game?.teams?.away || {}
  return {
    items: [
      {
        key: 'runs',
        label: 'Carreras',
        home: home.score ?? game?.scores?.home?.total ?? '—',
        away: away.score ?? game?.scores?.away?.total ?? '—',
      },
      {
        key: 'hits',
        label: 'Hits',
        home: game?.scores?.home?.hits ?? '—',
        away: game?.scores?.away?.hits ?? '—',
      },
      {
        key: 'errors',
        label: 'Errores',
        home: game?.scores?.home?.errors ?? '—',
        away: game?.scores?.away?.errors ?? '—',
      },
    ],
    meta: {
      inning: game?.status?.long || game?.status?.short || '—',
      pitcherHome: sanitizePlayerName(game?.pitchers?.home?.name),
      pitcherAway: sanitizePlayerName(game?.pitchers?.away?.name),
    },
  }
}

function parseBaseballLineup(game) {
  const mapSide = (side) =>
    (game?.lineups?.[side] || game?.[`${side}Lineup`] || []).map((p, index) => ({
      order: index + 1,
      name: sanitizePlayerName(p.name || p.player?.name),
      position: p.pos || p.position || '—',
    }))

  return {
    home: mapSide('home'),
    away: mapSide('away'),
  }
}

function buildSummary(raw, sport) {
  if (sport === 'beisbol') {
    const home = raw.teams?.home || {}
    const away = raw.teams?.away || {}
    return {
      id: String(raw.id ?? raw.game?.id),
      sport: 'beisbol',
      leagueId: raw.league?.id ?? 1,
      leagueName: sanitizeText(raw.league?.name || 'MLB'),
      homeTeam: {
        id: home.id,
        name: sanitizeText(home.name || 'Local'),
        national: false,
        display: home.display,
      },
      awayTeam: {
        id: away.id,
        name: sanitizeText(away.name || 'Visitante'),
        national: false,
        display: away.display,
      },
      homeScore: home.score ?? raw.scores?.home?.total ?? null,
      awayScore: away.score ?? raw.scores?.away?.total ?? null,
      statusShort: raw.status?.short || 'NS',
      statusLong: raw.status?.long || raw.status?.short || 'Programado',
      date: raw.date || raw.game?.date,
      possessionSide: null,
      inning: raw.status?.long || raw.status?.short,
      balls: raw.count?.balls ?? null,
      strikes: raw.count?.strikes ?? null,
      outs: raw.count?.outs ?? null,
    }
  }

  const status = raw.fixture?.status || {}
  const stats = raw.statistics || []
  let possessionSide = null
  if (stats.length >= 2) {
    const homePoss = stats[0]?.statistics?.find((s) => s.type === 'Ball Possession')?.value
    const awayPoss = stats[1]?.statistics?.find((s) => s.type === 'Ball Possession')?.value
    const h = parseInt(String(homePoss).replace('%', ''), 10)
    const a = parseInt(String(awayPoss).replace('%', ''), 10)
    if (!Number.isNaN(h) && !Number.isNaN(a)) {
      possessionSide = h >= a ? 'home' : 'away'
    }
  }

  return {
    id: String(raw.fixture?.id),
    sport: 'futbol',
    leagueId: raw.league?.id,
    leagueName: sanitizeText(raw.league?.name || 'Competición'),
    homeTeam: {
      id: raw.teams?.home?.id,
      name: sanitizeText(raw.teams?.home?.name || 'Local'),
      national: Boolean(raw.teams?.home?.national),
      country: raw.teams?.home?.country || raw.teams?.home?.code,
      display: raw.teams?.home?.display,
    },
    awayTeam: {
      id: raw.teams?.away?.id,
      name: sanitizeText(raw.teams?.away?.name || 'Visitante'),
      national: Boolean(raw.teams?.away?.national),
      country: raw.teams?.away?.country || raw.teams?.away?.code,
      display: raw.teams?.away?.display,
    },
    homeScore: raw.goals?.home ?? null,
    awayScore: raw.goals?.away ?? null,
    statusShort: status.short || 'NS',
    statusLong: status.long || status.short || 'Programado',
    elapsed: status.elapsed,
    date: raw.fixture?.date,
    possessionSide,
    miniStats: {
      possessionHome: stats[0]?.statistics?.find((s) => s.type === 'Ball Possession')?.value,
      possessionAway: stats[1]?.statistics?.find((s) => s.type === 'Ball Possession')?.value,
    },
  }
}

async function fetchFootballPartido(id, redis, seedRaw) {
  let fixtureRaw = seedRaw

  if (!fixtureRaw) {
    const fx = await apiGet(footballClient, '/fixtures', { id }, redis)
    if (!fx.ok || !fx.data?.length) return null
    fixtureRaw = sanitizeFootballFixture(fx.data[0])
  } else {
    fixtureRaw = sanitizeFootballFixture(fixtureRaw)
  }

  const homeId = fixtureRaw.teams?.home?.id
  const awayId = fixtureRaw.teams?.away?.id
  const fixtureId = fixtureRaw.fixture?.id

  const [statsRes, eventsRes, lineupsRes, playersRes, h2hRes] = await Promise.all([
    apiGet(footballClient, '/fixtures/statistics', { fixture: fixtureId }, redis),
    apiGet(footballClient, '/fixtures/events', { fixture: fixtureId }, redis),
    apiGet(footballClient, '/fixtures/lineups', { fixture: fixtureId }, redis),
    apiGet(footballClient, '/fixtures/players', { fixture: fixtureId }, redis),
    homeId && awayId
      ? apiGet(footballClient, '/fixtures/headtohead', { h2h: `${homeId}-${awayId}`, last: 5 }, redis)
      : Promise.resolve({ ok: true, data: [] }),
  ])

  const statistics = statsRes.ok ? parseFootballStatistics(statsRes.data) : { home: {}, away: {}, items: [] }
  const events = eventsRes.ok ? parseFootballEvents(eventsRes.data) : []
  const lineups = lineupsRes.ok ? parseFootballLineups(lineupsRes.data, fixtureRaw) : { home: null, away: null }
  const players = playersRes.ok ? parseFootballPlayers(playersRes.data) : { home: [], away: [] }
  const h2h = h2hRes.ok ? parseFootballH2H(h2hRes.data) : []

  const merged = { ...fixtureRaw, statistics: statsRes.ok ? statsRes.data : [] }

  return {
    sport: 'futbol',
    summary: buildSummary(merged, 'futbol'),
    statistics,
    events,
    lineups,
    players,
    h2h,
    updatedAt: new Date().toISOString(),
  }
}

async function fetchBaseballPartido(id, redis, seedRaw) {
  let gameRaw = seedRaw

  if (!gameRaw) {
    const gx = await apiGet(baseballClient, '/games', { id }, redis)
    if (!gx.ok || !gx.data?.length) return null
    gameRaw = sanitizeBaseballGame(gx.data[0])
  } else {
    gameRaw = sanitizeBaseballGame(gameRaw)
  }

  const statsRes = await apiGet(baseballClient, '/games/statistics', { game: gameRaw.id ?? id }, redis)

  const statistics = parseBaseballStatistics(gameRaw)
  if (statsRes.ok && statsRes.data?.length) {
    /* enrich if API returns extra team stats */
  }

  const lineups = parseBaseballLineup(gameRaw)

  return {
    sport: 'beisbol',
    summary: buildSummary(gameRaw, 'beisbol'),
    statistics,
    events: [],
    lineups: { home: { startXI: lineups.home }, away: { startXI: lineups.away } },
    players: { home: [], away: [] },
    h2h: [],
    updatedAt: new Date().toISOString(),
  }
}

function detectSportFromLeague(leagueId) {
  if (leagueId != null && BASEBALL_LEAGUES.includes(Number(leagueId))) return 'beisbol'
  return 'futbol'
}

async function fetchPartido(id, redis) {
  const cached = await getJson(partidoKey(id))
  if (cached) return cached

  const fromList = await findInLists(id)
  let sport = fromList?.sport || 'futbol'

  let payload = null

  if (sport === 'futbol' || !fromList) {
    payload = await fetchFootballPartido(id, redis, fromList?.sport === 'futbol' ? fromList.raw : null)
    if (payload) sport = 'futbol'
  }

  if (!payload) {
    payload = await fetchBaseballPartido(id, redis, fromList?.sport === 'beisbol' ? fromList.raw : null)
    if (payload) sport = 'beisbol'
  }

  if (!payload && fromList) {
    sport = fromList.sport
    payload =
      sport === 'beisbol'
        ? await fetchBaseballPartido(id, redis, fromList.raw)
        : await fetchFootballPartido(id, redis, fromList.raw)
  }

  if (!payload) return null

  if (!payload.summary?.sport) {
    payload.summary.sport = payload.sport || detectSportFromLeague(payload.summary?.leagueId)
  }

  await setJson(partidoKey(id), payload, PARTIDO_TTL_MS)
  return payload
}

module.exports = {
  fetchPartido,
  partidoKey,
  PARTIDO_TTL_MS,
}
`
