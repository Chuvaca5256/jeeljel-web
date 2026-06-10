const express = require('express')
const { getClient } = require('../lib/redis')
const { fetchPartido } = require('../services/partidoService')

const router = express.Router()

router.get('/partido/:id', async (req, res) => {
  const { id } = req.params
  if (!id || !/^\d+$/.test(String(id))) {
    return res.status(400).json({ error: 'ID de partido inválido' })
  }

  try {
    const redis = getClient()
    const data = await fetchPartido(id, redis)

    if (!data) {
      return res.status(404).json({ error: 'Partido no encontrado' })
    }

    res.json(data)
  } catch (err) {
    console.error('[ollin][route] /fixtures/partido/:id:', err.message)
    res.status(500).json({ error: 'Error obteniendo partido' })
  }
})

module.exports = router
