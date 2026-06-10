const express = require('express')
const { LIGAS_PERMITIDAS_SET } = require('../config/leagues')
const { getClient } = require('../lib/redis')
const { fetchStandings } = require('../services/standingsService')

const router = express.Router()

router.get('/:ligaId', async (req, res) => {
  try {
    const ligaId = Number(req.params.ligaId)
    if (!Number.isFinite(ligaId) || ligaId <= 0) {
      return res.status(400).json({ error: 'ligaId inválido' })
    }

    if (!LIGAS_PERMITIDAS_SET.has(ligaId)) {
      return res.status(404).json({ error: 'Liga no permitida' })
    }

    const redis = getClient()
    const data = await fetchStandings(ligaId, redis)

    if (!data) {
      return res.status(502).json({ error: 'No se pudieron obtener posiciones' })
    }

    res.json(data)
  } catch (err) {
    console.error('[ollin][route] /standings/:ligaId:', err.message)
    res.status(500).json({ error: 'Error leyendo posiciones' })
  }
})

module.exports = router
