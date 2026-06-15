# Review dump — INFRA-6: server.js + polling.js

## Resumen

### (a) Llaves Redis que borra `server.js` al arrancar

Tras `connectRedis()`, líneas 67–69:

```js
const { requestsKey } = require('./lib/requestCounter')
await redis.del('ollin:polling:paused')
await redis.del(requestsKey())
```

Solo **2 llaves**:

| Llave | Propósito |
|-------|-----------|
| `ollin:polling:paused` | Flag que pausa el polling cuando se alcanza el límite diario de API |
| `requestsKey()` | Contador dinámico de requests API del día (definido en `requestCounter.js`, típicamente `ollin:api:requests:today` o similar con fecha) |

**No borra** las cachés de datos: `ollin:futbol:live`, `ollin:futbol:hoy`, `ollin:futbol:proximos`, `ollin:futbol:pasados`, standings, events, etc. Por eso tras un `pm2 restart` las tabs pueden quedar vacías hasta que `startPolling` repoble Redis (warm-up + primer ciclo).

---

### (b) `startPolling` y warm-up al iniciar

`startPolling(redis)` (polling.js L252–307):

1. **Limpia timers previos** — `pollingTimer`, `standingsTimer`, `pasadosTimer`, `liveTransitionTimer`.

2. **Warm-up inmediato (fire-and-forget, no await):**
   - `pollFootballHoy(redis)` → escribe `KEYS.futbolHoy` si OK
   - `pollFootballProximos(redis)` → escribe `KEYS.futbolProximos` si OK
   - `pollFootballPasados(redis)` → escribe caché pasados (sin await en el arranque principal)

3. **Timer pasados** — `pollFootballPasados` cada **6 h**.

4. **Primer ciclo de polling** — `runPollingCycle(redis)`:
   - Si pausado o límite API → reprograma IDLE 180s
   - Lee caché live; si `wasLive` → `runLiveCycle` (15s live + events)
   - Si no → `runIdleCycle` (verifica live primero; si no hay, proximos + hoy async)
   - Transición live→idle → refresca hoy + pasados
   - Programa siguiente ciclo: **15s LIVE** o **180s IDLE**

5. **Standings timer** — `pollStandingsBatch` cada **6 h**.

6. **Live transition timer** — `detectLiveTransition` cada **10 min** (solo si no hay live en caché).

**Gap INFRA-6:** el warm-up no espera (`await`) antes de servir requests; si Redis quedó vacío por restart, hay ventana hasta que terminen las promesas iniciales o el primer `runPollingCycle`. No hay warm-up explícito de `pollFootballLive` al arrancar (solo dentro del ciclo).

---

## ollin-backend/src/server.js

```js
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')
const config = require('./config/env')
const { connectRedis, getClient } = require('./lib/redis')
const { router: fixturesRouter, healthHandler } = require('./routes/fixtures')
const partidoRouter = require('./routes/partido')
const standingsRouter = require('./routes/standings')
const { attachSocketIO, startPolling, stopPolling } = require('./services/polling')
const { createChatRouter } = require('./routes/chat')

async function main() {
  const app = express()

  app.use(express.json())

  app.use((req, res, next) => {
    const origin = req.headers.origin
    if (origin && config.corsOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin)
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') return res.sendStatus(204)
    next()
  })

  // Rutas internas — Nginx: /api/ollin/* → http://localhost:OLLIN_PORT/*
  app.use('/fixtures', fixturesRouter)
  app.use('/fixtures', partidoRouter)
  app.use('/standings', standingsRouter)
  app.get('/health', healthHandler)

  // Alias desarrollo local
  app.use('/api/ollin/fixtures', fixturesRouter)
  app.use('/api/ollin/fixtures', partidoRouter)
  app.use('/api/ollin/standings', standingsRouter)
  app.get('/api/ollin/health', healthHandler)

  app.get('/', (_req, res) => {
    res.json({ service: 'ollin-deportes', version: '1.0.0' })
  })

  const server = http.createServer(app)

  const io = new Server(server, {
    cors: {
      origin: config.corsOrigins,
      methods: ['GET', 'POST'],
    },
  })

  app.use('/chat', createChatRouter(io))
  app.use('/api/ollin/chat', createChatRouter(io))

  io.on('connection', (socket) => {
    console.log(`[ollin][socket] Cliente conectado: ${socket.id}`)
    socket.on('disconnect', () => {
      console.log(`[ollin][socket] Cliente desconectado: ${socket.id}`)
    })
  })

  attachSocketIO(io)

  await connectRedis()
  const redis = getClient()
  const { requestsKey } = require('./lib/requestCounter')
  await redis.del('ollin:polling:paused')
  await redis.del(requestsKey())
  startPolling(redis)

  server.listen(config.port, () => {
    console.log(`[ollin] Servidor en puerto ${config.port}`)
    console.log(`[ollin] Health: http://localhost:${config.port}/health`)
    console.log(`[ollin] Live:   http://localhost:${config.port}/fixtures/live`)
  })

  const shutdown = () => {
    console.log('[ollin] Apagando…')
    stopPolling()
    server.close()
    if (redis) redis.disconnect()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

main().catch((err) => {
  console.error('[ollin] Error fatal:', err.message)
  process.exit(1)
})
```

---

## ollin-backend/src/services/polling.js

```js
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

const LIVE_INTERVAL_MS = 15000
const IDLE_INTERVAL_MS = 180000

let pollingTimer = null
let standingsTimer = null
let pasadosTimer = null
let liveTransitionTimer = null
let ioRef = null
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
```
