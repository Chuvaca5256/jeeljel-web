const express = require('express')
const { getClient } = require('../lib/redis')
const { sendChatMessage } = require('../services/chatService')

function createChatRouter(io) {
  const router = express.Router()

  router.post('/messages', async (req, res) => {
    const redis = getClient()
    const result = await sendChatMessage({ redis, req, body: req.body || {} })

    if (!result.ok) {
      return res.status(result.status || 400).json({
        ok: false,
        blocked: result.blocked || false,
        type: result.type,
        until: result.until,
        reason: result.reason,
        userMessage: result.userMessage,
        error: result.error,
        reincidence: result.reincidence,
      })
    }

    if (io && result.data) {
      io.emit('ollin:chat:message', result.data)
    }

    return res.status(201).json({ ok: true, message: result.data })
  })

  router.get('/status', async (req, res) => {
    const { getModerationStatus } = require('../lib/chatModeration')
    const { clientIp } = require('../services/chatService')
    const redis = getClient()
    const userId = req.query.userId || null
    const ip = clientIp(req)
    const status = await getModerationStatus(redis, userId, ip)
    res.json(status)
  })

  return router
}

module.exports = { createChatRouter }
