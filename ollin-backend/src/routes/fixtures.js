const express = require('express')
const config = require('../config/env')
const { KEYS, getJson, getMeta, isRedisConnected } = require('../lib/redis')
const { getRequestCount, isPollingPaused } = require('../lib/requestCounter')
const { isBaseballLive } = require('../services/polling')

const router = express.Router()

async function readCache(key, defaultValue = []) {
  const data = await getJson(key, defaultValue)
  return data ?? defaultValue
}

router.get('/live', async (_req, res) => {
  try {
    const futbol = await readCache(KEYS.futbolLive, [])
    const beisbolAll = await readCache(KEYS.beisbolHoy, [])
    const beisbol = beisbolAll.filter(isBaseballLive)
    const meta = await getMeta()

    res.json({
      futbol,
      beisbol,
      updatedAt: meta.lastUpdate,
    })
  } catch (err) {
    console.error('[ollin][route] /fixtures/live:', err.message)
    res.status(500).json({ error: 'Error leyendo caché' })
  }
})

router.get('/hoy', async (_req, res) => {
  try {
    const futbol = await readCache(KEYS.futbolHoy, [])
    const beisbol = await readCache(KEYS.beisbolHoy, [])
    const meta = await getMeta()

    res.json({
      futbol,
      beisbol,
      updatedAt: meta.lastUpdate,
    })
  } catch (err) {
    console.error('[ollin][route] /fixtures/hoy:', err.message)
    res.status(500).json({ error: 'Error leyendo caché' })
  }
})

router.get('/proximos', async (_req, res) => {
  try {
    const futbol = await readCache(KEYS.futbolProximos, [])
    const meta = await getMeta()

    res.json({
      futbol,
      updatedAt: meta.lastUpdate,
    })
  } catch (err) {
    console.error('[ollin][route] /fixtures/proximos:', err.message)
    res.status(500).json({ error: 'Error leyendo caché' })
  }
})

async function healthHandler(_req, res) {
  try {
    const meta = await getMeta()
    const redis = require('../lib/redis').getClient()
    const requestCount = await getRequestCount(redis)
    const pause = await isPollingPaused(redis)

    res.json({
      status: 'ok',
      service: 'ollin-deportes',
      port: config.port,
      lastUpdate: meta.lastUpdate,
      deportesActivos: meta.deportesActivos,
      redis: isRedisConnected() ? 'connected' : 'disconnected',
      pollingIntervalMs: config.pollingIntervalMs,
      apiRequestsToday: requestCount,
      apiRequestsLimit: config.apiDailyLimit,
      pollingPaused: pause.paused,
      pollingPauseReason: pause.paused ? pause.reason : null,
    })
  } catch (err) {
    console.error('[ollin][route] /health:', err.message)
    res.status(500).json({ status: 'error', message: err.message })
  }
}

module.exports = { router, healthHandler }
