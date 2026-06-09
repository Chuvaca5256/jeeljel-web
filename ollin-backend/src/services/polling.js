const config = require('../config/env')
const { KEYS, setJson, getJson, setMeta } = require('../lib/redis')
const { isPollingPaused, setPollingPaused, getRequestCount } = require('../lib/requestCounter')
const { pollFootball } = require('./footballPolling')
const { pollBaseball, isBaseballLive } = require('./baseballPolling')

let pollingTimer = null
let ioRef = null

function attachSocketIO(io) {
  ioRef = io
}

function computeDeportesActivos(futbolLive, futbolHoy, beisbolHoy) {
  const activos = []
  const hasFutbol =
    (Array.isArray(futbolLive) && futbolLive.length > 0) ||
    (Array.isArray(futbolHoy) && futbolHoy.length > 0)
  const hasBeisbol = Array.isArray(beisbolHoy) && beisbolHoy.length > 0
  if (hasFutbol) activos.push('futbol')
  if (hasBeisbol) activos.push('beisbol')
  return activos
}

async function emitUpdate(deporte, tipo, data) {
  if (!ioRef) return
  ioRef.emit('ollin:update', { deporte, tipo, data, at: new Date().toISOString() })
}

async function runPollingCycle(redis) {
  const pause = await isPollingPaused(redis)
  if (pause.paused) {
    console.warn(
      `[ollin][polling] Pausado (${pause.reason}) — requests hoy: ${pause.count}/${config.apiDailyLimit}`
    )
    return
  }

  const countBefore = await getRequestCount(redis)
  const maxNewRequests = 6
  if (countBefore + maxNewRequests > config.apiDailyPauseAt) {
    console.warn(
      `[ollin][polling] Ciclo omitido — ${countBefore} requests hoy, límite pausa en ${config.apiDailyPauseAt}`
    )
    await setPollingPaused(redis, true)
    return
  }

  console.log('[ollin][polling] Iniciando ciclo…')
  const ttl = config.cacheTtlMs
  const now = new Date().toISOString()

  const football = await pollFootball(redis)
  if (football.live !== null) {
    await setJson(KEYS.futbolLive, football.live, ttl)
    await emitUpdate('futbol', 'live', football.live)
  } else {
    console.warn('[ollin][polling] Fútbol live sin actualizar — conservando caché')
  }

  if (football.hoy !== null) {
    await setJson(KEYS.futbolHoy, football.hoy, ttl)
    await emitUpdate('futbol', 'hoy', football.hoy)
  }

  if (football.proximos !== null) {
    await setJson(KEYS.futbolProximos, football.proximos, ttl)
    await emitUpdate('futbol', 'proximos', football.proximos)
  }

  const baseball = await pollBaseball(redis)
  if (baseball.hoy !== null) {
    await setJson(KEYS.beisbolHoy, baseball.hoy, ttl)
    await emitUpdate('beisbol', 'hoy', baseball.hoy)
  } else {
    console.warn('[ollin][polling] Béisbol sin actualizar — conservando caché')
  }

  const cachedLive = football.live ?? (await getJson(KEYS.futbolLive, []))
  const cachedHoy = football.hoy ?? (await getJson(KEYS.futbolHoy, []))
  const cachedBeisbol = baseball.hoy ?? (await getJson(KEYS.beisbolHoy, []))
  const deportesActivos = computeDeportesActivos(cachedLive, cachedHoy, cachedBeisbol)
  await setMeta(now, deportesActivos)

  const countAfter = await getRequestCount(redis)
  console.log(`[ollin][polling] Ciclo OK — requests hoy: ${countAfter}/${config.apiDailyLimit}`)

  if (countAfter >= config.apiDailyPauseAt) {
    await setPollingPaused(redis, true)
    console.warn('[ollin][polling] Límite diario alcanzado — pausado hasta mañana')
  }
}

function startPolling(redis) {
  if (pollingTimer) clearInterval(pollingTimer)

  runPollingCycle(redis).catch((err) => {
    console.error('[ollin][polling] Error en ciclo inicial:', err.message)
  })

  pollingTimer = setInterval(() => {
    runPollingCycle(redis).catch((err) => {
      console.error('[ollin][polling] Error en ciclo:', err.message)
    })
  }, config.pollingIntervalMs)

  console.log(`[ollin][polling] Intervalo: ${config.pollingIntervalMs}ms`)
}

function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

module.exports = {
  attachSocketIO,
  runPollingCycle,
  startPolling,
  stopPolling,
  isBaseballLive,
}
