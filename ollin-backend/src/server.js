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
  await redis.del('ollin:polling:paused')
  await redis.del('ollin:api:requests:today')
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
