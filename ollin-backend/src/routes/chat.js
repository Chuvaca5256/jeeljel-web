const express = require('express')
const { getClient } = require('../lib/redis')
const { sendChatMessage } = require('../services/chatService')
const { getSupabase } = require('../services/supabaseClient')

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

  router.get('/messages', async (req, res) => {
    try {
      const matchId = req.query.matchId
      if (!matchId) {
        return res.status(400).json({ ok: false, error: 'matchId requerido' })
      }
      const supabase = getSupabase()
      if (!supabase) {
        return res.status(503).json({ ok: false, error: 'Supabase no disponible' })
      }
      const { data, error } = await supabase
        .from('ollin_chat')
        .select('id, match_id, user_id, display_name, message, created_at')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })
        .limit(200)
      if (error) {
        return res.status(500).json({ ok: false, error: error.message })
      }
      return res.json({ ok: true, messages: data || [] })
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message })
    }
  })

  return router
}

module.exports = { createChatRouter }
