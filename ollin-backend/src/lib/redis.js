const Redis = require('ioredis')
const config = require('../config/env')

const KEYS = {
  futbolLive: 'ollin:futbol:live',
  futbolHoy: 'ollin:futbol:hoy',
  futbolProximos: 'ollin:futbol:proximos',
  beisbolHoy: 'ollin:beisbol:hoy',
  metaLastUpdate: 'ollin:meta:lastUpdate',
  metaDeportes: 'ollin:meta:deportesActivos',
  pollingPaused: 'ollin:polling:paused',
}

let client = null
let connected = false

function createClient() {
  if (client) return client

  client = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 500, 5000)
      console.warn(`[ollin][redis] Reintento ${times} en ${delay}ms`)
      return delay
    },
  })

  client.on('connect', () => {
    connected = true
    console.log('[ollin][redis] Conectado')
  })

  client.on('error', (err) => {
    connected = false
    console.error('[ollin][redis] Error:', err.message)
  })

  client.on('close', () => {
    connected = false
  })

  return client
}

async function connectRedis() {
  createClient()
  return client
}

function isRedisConnected() {
  return connected && client && client.status === 'ready'
}

async function setJson(key, value, ttlMs) {
  if (!client) return false
  try {
    const payload = JSON.stringify(value)
    await client.set(key, payload, 'PX', ttlMs)
    return true
  } catch (err) {
    console.error(`[ollin][redis] set ${key}:`, err.message)
    return false
  }
}

async function getJson(key, fallback = null) {
  if (!client) return fallback
  try {
    const raw = await client.get(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.error(`[ollin][redis] get ${key}:`, err.message)
    return fallback
  }
}

async function setMeta(lastUpdate, deportesActivos) {
  await setJson(KEYS.metaLastUpdate, { at: lastUpdate }, config.cacheTtlMs)
  await setJson(KEYS.metaDeportes, deportesActivos, config.cacheTtlMs)
}

async function getMeta() {
  const lastUpdate = await getJson(KEYS.metaLastUpdate, { at: null })
  const deportesActivos = await getJson(KEYS.metaDeportes, [])
  return { lastUpdate: lastUpdate.at, deportesActivos }
}

module.exports = {
  KEYS,
  connectRedis,
  isRedisConnected,
  setJson,
  getJson,
  setMeta,
  getMeta,
  getClient: () => client,
}
