require('dotenv').config()

const POLLING_INTERVAL_MS = parseInt(process.env.POLLING_INTERVAL_MS || '180000', 10)
const rawPort = parseInt(process.env.OLLIN_PORT || '10001', 10)

if (rawPort === 10000) {
  console.error('[ollin] OLLIN_PORT 10000 está reservado para Ikan Naat. Usa 10001.')
  process.exit(1)
}

const config = {
  apiSportsKey: process.env.API_SPORTS_KEY || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  pollingIntervalMs: Number.isFinite(POLLING_INTERVAL_MS) ? POLLING_INTERVAL_MS : 600000,
  port: Number.isFinite(rawPort) ? rawPort : 10001,
  cacheTtlMs: parseInt(process.env.CACHE_TTL_MS || '3600000', 10),
  apiDailyLimit: 7500,
  apiDailyPauseAt: 7400,
  footballBaseUrl: 'https://v3.football.api-sports.io',
  // baseballBaseUrl: 'https://v1.baseball.api-sports.io',
  corsOrigins: ['https://jeeljel.com', 'http://localhost:5173'],
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
}

if (!config.apiSportsKey) {
  console.warn('[ollin] API_SPORTS_KEY no definida — el polling a API-Sports fallará hasta configurar .env')
}

if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.warn('[ollin] SUPABASE_URL / SUPABASE_SERVICE_KEY no definidas — el chat no persistirá mensajes')
}

module.exports = config
