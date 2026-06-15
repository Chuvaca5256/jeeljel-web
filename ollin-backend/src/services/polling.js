const config = require('../config/env')
const { KEYS, setJson, getJson, setMeta } = require('../lib/redis')
const { isPollingPaused, setPollingPaused, getRequestCount } = require('../lib/requestCounter')
const { FOOTBALL_LIVE_STATUSES } = require('../config/leagues')
const { footballClient, apiGet } = require('./apiClient')
const {
  pollFootballLive,
  pollFootballHoy,
  pollFootballProximos,
  TORNEO_SELECCIONES_LIGAS,
} = require('./footballPolling')
// const { pollBaseball, isBaseballLive } = require('./baseballPolling')
// Béisbol desactivado temporalmente — stub para rutas que aún importan isBaseballLive
function isBaseballLive(_game) {
  return false
}
const { fetchStandings } = require('./standingsService')
const { pollFootballPasados } = require('./pasadosService')
const { parseStatMap, detectDiffs } = require('./statsDiffService')

const LIVE_INTERVAL_MS = 15000
const IDLE_INTERVAL_MS = 180000

let pollingTimer = null
let standingsTimer = null
let pasadosTimer = null
let liveTransitionTimer = null
let ioRef = null
// Mapa en memoria: fixtureId → último snapshot de stats { home: {}, away: {} }
const lastStatsSnapshot = {}
let currentIntervalMs = IDLE_INTERVAL_MS

function attachSocketIO(io) {
  ioRef = io
}

function eventsKey(fixtureId) {
  return `ollin:futbol:events:${fixtureId}`
}

function hasAnyLiveFixture(futbolLive, beisbolHoy) {
  const futbolActive =
    Array.isArray(futbolLive) &&
    futbolLive.some((f) => {
      const short = f?.fixture?.status?.short
      return short && FOOTBALL_LIVE_STATUSES.has(short)
    })
  // const beisbolActive =
  //   Array.isArray(beisbolHoy) && beisbolHoy.some((g) => isBaseballLive(g))
  return futbolActive // || beisbolActive
}

function computeDeportesActivos(futbolLive, futbolHoy, beisbolHoy) {
  const activos = []
  const hasFutbol =
    (Array.isArray(futbolLive) && futbolLive.length > 0) ||
    (Array.isArray(futbolHoy) && futbolHoy.length > 0)
  const hasBeisbol = Array.isArray(beisbolHoy) && beisbolHoy.length > 0
  if (hasFutbol) activos.push('futbol')
  // if (hasBeisbol) activos.push('beisbol')
  return activos
}

async function emitUpdate(deporte, tipo, data) {
  if (!ioRef) return
  ioRef.emit('ollin:update', { deporte, tipo, data, at: new Date().toISOString() })
}

async function pollLiveFixtureEvents(redis, liveFixtures, ttl) {
  if (!Array.isArray(liveFixtures) || liveFixtures.length === 0) return

  for (const fixture of liveFixtures) {
    const fixtureId = fixture?.fixture?.id
    if (!fixtureId) continue

    const result = await apiGet(
      footballClient,
      '/fixtures/events',
      { fixture: fixtureId },
      redis
    )

    if (!result.ok) {
      console.warn(`[ollin][polling] Events falló fixture=${fixtureId}`)
      continue
    }

    await setJson(eventsKey(fixtureId), result.data, ttl)

    // Detectar diffs de estadísticas y emitir eventos sintéticos
    const statsResult = await apiGet(
      footballClient,
      '/fixtures/statistics',
      { fixture: fixtureId },
      redis
    )
    if (statsResult.ok && Array.isArray(statsResult.data) && statsResult.data.length > 0) {
      const nextSnap = parseStatMap(statsResult.data)
      const prevSnap = lastStatsSnapshot[fixtureId] || { home: {}, away: {} }
      const elapsed  = fixture?.fixture?.status?.elapsed ?? null
      const homeTeam = fixture?.teams?.home?.name || 'Local'
      const awayTeam = fixture?.teams?.away?.name || 'Visitante'

      const synthetic = detectDiffs(prevSnap, nextSnap, elapsed, homeTeam, awayTeam)
      lastStatsSnapshot[fixtureId] = nextSnap

      if (synthetic.length > 0 && ioRef) {
        ioRef.emit(`ollin:ticker:${fixtureId}`, { events: synthetic, at: new Date().toISOString() })
      }
    }

    if (ioRef) {
      ioRef.emit(`ollin:partido:${fixtureId}`, {
        events: result.data,
        at: new Date().toISOString(),
      })
    }
  }
}

async function pollStandingsBatch(redis) {
  for (const ligaId of TORNEO_SELECCIONES_LIGAS) {
    try {
      await fetchStandings(ligaId, redis)
    } catch (err) {
      console.warn(`[ollin][polling] Standings falló liga=${ligaId}:`, err.message)
    }
  }
}

async function runLiveCycle(redis, ttl) {
  console.log('[ollin][polling] Modo LIVE — live + events')

  const football = await pollFootballLive(redis)
  if (football.live !== null) {
    await setJson(KEYS.futbolLive, football.live, ttl)
    await emitUpdate('futbol', 'live', football.live)
    await pollLiveFixtureEvents(redis, football.live, ttl)
  } else {
    console.warn('[ollin][polling] Fútbol live sin actualizar — conservando caché')
  }

  // const baseball = await pollBaseball(redis)
  // if (baseball.hoy !== null) {
  //   await setJson(KEYS.beisbolHoy, baseball.hoy, ttl)
  //   await emitUpdate('beisbol', 'hoy', baseball.hoy)
  // }
}

async function runIdleCycle(redis, ttl) {
  // Verificar live primero
  const football = await pollFootballLive(redis)
  if (football.live !== null && football.live.length > 0) {
    await setJson(KEYS.futbolLive, football.live, ttl)
    await emitUpdate('futbol', 'live', football.live)
    return true // hay live — el ciclo siguiente será LIVE
  }

  console.log('[ollin][polling] Modo IDLE — hoy + próximos')

  const proximos = await pollFootballProximos(redis)
  if (proximos.proximos !== null) {
    await setJson(KEYS.futbolProximos, proximos.proximos, ttl)
    await emitUpdate('futbol', 'proximos', proximos.proximos)
  }

  // pollStandingsBatch removido del ciclo idle — se ejecuta en timer de 6h (startPolling)

  pollFootballHoy(redis)
    .then((hoy) => {
      if (hoy && hoy.hoy !== null) return setJson(KEYS.futbolHoy, hoy.hoy, ttl)
    })
    .catch((err) => console.warn('[ollin][polling] pollFootballHoy idle falló:', err.message))

  return false
}

async function detectLiveTransition(redis, ttl) {
  const football = await pollFootballLive(redis)
  if (football.live !== null) {
    await setJson(KEYS.futbolLive, football.live, ttl)
  }

  // const baseball = await pollBaseball(redis)
  // if (baseball.hoy !== null) {
  //   await setJson(KEYS.beisbolHoy, baseball.hoy, ttl)
  // }
}

function scheduleNextCycle(redis, intervalMs) {
  if (pollingTimer) clearTimeout(pollingTimer)
  currentIntervalMs = intervalMs
  console.log(`[ollin][polling] Intervalo: ${intervalMs}ms`)
  pollingTimer = setTimeout(() => {
    runPollingCycle(redis).catch((err) => {
      console.error('[ollin][polling] Error en ciclo:', err.message)
      scheduleNextCycle(redis, currentIntervalMs)
    })
  }, intervalMs)
}

async function runPollingCycle(redis) {
  const pause = await isPollingPaused(redis)
  if (pause.paused) {
    console.warn(
      `[ollin][polling] Pausado (${pause.reason}) — requests hoy: ${pause.count}/${config.apiDailyLimit}`
    )
    scheduleNextCycle(redis, IDLE_INTERVAL_MS)
    return
  }

  const countBefore = await getRequestCount(redis)
  if (countBefore >= config.apiDailyPauseAt) {
    console.warn(
      `[ollin][polling] Ciclo omitido — ${countBefore} requests hoy, límite pausa en ${config.apiDailyPauseAt}`
    )
    await setPollingPaused(redis, true)
    scheduleNextCycle(redis, IDLE_INTERVAL_MS)
    return
  }

  console.log('[ollin][polling] Iniciando ciclo…')
  const ttl = config.cacheTtlMs
  const now = new Date().toISOString()

  const cachedLive = (await getJson(KEYS.futbolLive, [])) || []
  const cachedBeisbol = (await getJson(KEYS.beisbolHoy, [])) || []
  const cachedHoy = (await getJson(KEYS.futbolHoy, [])) || []
  const wasLive = hasAnyLiveFixture(cachedLive, cachedBeisbol)

  let idleFoundLive = false

  if (wasLive) {
    await runLiveCycle(redis, ttl)
  } else {
    idleFoundLive = await runIdleCycle(redis, ttl)
    // detectLiveTransition removido del ciclo normal — se ejecuta en timer de 10min (startPolling)
  }

  const liveAfter = (await getJson(KEYS.futbolLive, [])) || []
  const beisbolAfter = (await getJson(KEYS.beisbolHoy, [])) || []
  const nowLive = hasAnyLiveFixture(liveAfter, beisbolAfter)

  // Transición live→idle: uno o más partidos acaban de terminar — refrescar "hoy"
  if (wasLive && !nowLive) {
    console.log('[ollin][polling] Transición live→idle — refrescando futbolHoy + pasados')
    const hoy = await pollFootballHoy(redis)
    if (hoy.hoy !== null) {
      await setJson(KEYS.futbolHoy, hoy.hoy, ttl)
      await emitUpdate('futbol', 'hoy', hoy.hoy)
    }
    pollFootballPasados(redis).catch((err) =>
      console.warn('[ollin][polling] pollFootballPasados post-live falló:', err.message)
    )
  }

  const hoyAfter = (await getJson(KEYS.futbolHoy, [])) || []
  const deportesActivos = computeDeportesActivos(liveAfter, hoyAfter, beisbolAfter)
  await setMeta(now, deportesActivos)

  const countAfter = await getRequestCount(redis)
  const nextLive = idleFoundLive || hasAnyLiveFixture(liveAfter, beisbolAfter)
  const nextInterval = nextLive ? LIVE_INTERVAL_MS : IDLE_INTERVAL_MS

  console.log(
    `[ollin][polling] Ciclo OK — modo ${nextLive ? 'LIVE' : 'IDLE'} — requests hoy: ${countAfter}/${config.apiDailyLimit}`
  )

  if (countAfter >= config.apiDailyPauseAt) {
    await setPollingPaused(redis, true)
    console.warn('[ollin][polling] Límite diario alcanzado — pausado hasta mañana')
  }

  scheduleNextCycle(redis, nextInterval)
}

function startPolling(redis) {
  if (pollingTimer) clearTimeout(pollingTimer)
  if (standingsTimer) clearInterval(standingsTimer)
  if (pasadosTimer) clearInterval(pasadosTimer)
  if (liveTransitionTimer) clearInterval(liveTransitionTimer)

  // Poblar futbolHoy inmediatamente al arrancar
  const ttl = config.cacheTtlMs
  pollFootballHoy(redis)
    .then((hoy) => {
      if (hoy.hoy !== null) return setJson(KEYS.futbolHoy, hoy.hoy, ttl)
    })
    .catch((err) => console.warn('[ollin][polling] pollFootballHoy inicial falló:', err.message))

  pollFootballProximos(redis)
    .then((proximos) => {
      if (proximos !== null && proximos.proximos !== null) return setJson(KEYS.futbolProximos, proximos.proximos, ttl)
    })
    .catch((err) => console.warn('[ollin][polling] pollFootballProximos inicial falló:', err.message))

  // Pasados: llamada inmediata al arrancar + cada 6 horas
  pollFootballPasados(redis).catch((err) => {
    console.warn('[ollin][polling] pollFootballPasados inicial falló:', err.message)
  })
  pasadosTimer = setInterval(() => {
    pollFootballPasados(redis).catch((err) => {
      console.warn('[ollin][polling] pollFootballPasados falló:', err.message)
    })
  }, 6 * 60 * 60 * 1000)

  runPollingCycle(redis).catch((err) => {
    console.error('[ollin][polling] Error en ciclo inicial:', err.message)
    scheduleNextCycle(redis, IDLE_INTERVAL_MS)
  })

  // Standings: actualizar cada 6 horas (independiente del ciclo de polling)
  standingsTimer = setInterval(() => {
    console.log('[ollin][polling] Timer standings — actualizando cada 6h')
    pollStandingsBatch(redis).catch((err) => {
      console.warn('[ollin][polling] Standings batch falló:', err.message)
    })
  }, 6 * 60 * 60 * 1000)

  // Detección de transición live: verificar cada 10 minutos, solo si no hay partidos en vivo
  liveTransitionTimer = setInterval(async () => {
    try {
      const cachedLive = (await getJson(KEYS.futbolLive, [])) || []
      const cachedBeisbol = (await getJson(KEYS.beisbolHoy, [])) || []
      if (hasAnyLiveFixture(cachedLive, cachedBeisbol)) return
      const ttl = config.cacheTtlMs
      await detectLiveTransition(redis, ttl)
    } catch (err) {
      console.warn('[ollin][polling] detectLiveTransition falló:', err.message)
    }
  }, 10 * 60 * 1000)
}

function stopPolling() {
  if (pollingTimer) {
    clearTimeout(pollingTimer)
    pollingTimer = null
  }
  if (standingsTimer) {
    clearInterval(standingsTimer)
    standingsTimer = null
  }
  if (pasadosTimer) {
    clearInterval(pasadosTimer)
    pasadosTimer = null
  }
  if (liveTransitionTimer) {
    clearInterval(liveTransitionTimer)
    liveTransitionTimer = null
  }
}

module.exports = {
  attachSocketIO,
  runPollingCycle,
  startPolling,
  stopPolling,
  isBaseballLive,
  LIVE_INTERVAL_MS,
  IDLE_INTERVAL_MS,
}
