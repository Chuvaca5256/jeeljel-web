/**
 * statsDiffService.js
 * Detecta cambios entre dos snapshots de estadísticas y genera eventos sintéticos.
 * Los eventos sintéticos se emiten por socket para el ticker en vivo del frontend.
 */

const DIFF_KEYS = [
  { stat: 'Shots on Goal',  type: 'shot',    icon: '🥅', label: 'Tiro a puerta' },
  { stat: 'Total Shots',    type: 'shot_off', icon: '💨', label: 'Tiro fuera'    },
  { stat: 'Corner Kicks',   type: 'corner',   icon: '🚩', label: 'Tiro de esquina' },
  { stat: 'Fouls',          type: 'foul',     icon: '⚠️', label: 'Falta'         },
]

/**
 * Convierte el array de estadísticas de la API a un mapa plano por equipo.
 * apiRows: array de dos bloques (home, away) tal como devuelve /fixtures/statistics
 */
function parseStatMap(apiRows) {
  if (!Array.isArray(apiRows) || apiRows.length === 0) return { home: {}, away: {} }
  const mapBlock = (block) => {
    const out = {}
    for (const row of block?.statistics || []) {
      const val = parseInt(String(row.value).replace('%',''), 10)
      out[row.type] = isNaN(val) ? 0 : val
    }
    return out
  }
  return {
    home: mapBlock(apiRows[0]),
    away: mapBlock(apiRows[1] || {}),
  }
}

/**
 * Compara dos snapshots y devuelve lista de eventos sintéticos detectados.
 * prev / next: objetos { home: {}, away: {} } con valores numéricos por stat
 * elapsed: minuto actual del partido
 * homeTeam / awayTeam: nombres de los equipos
 */
function detectDiffs(prev, next, elapsed, homeTeam, awayTeam) {
  const synthetic = []

  for (const { stat, type, icon, label } of DIFF_KEYS) {
    const prevHome = prev.home[stat] ?? 0
    const nextHome = next.home[stat] ?? 0
    const prevAway = prev.away[stat] ?? 0
    const nextAway = next.away[stat] ?? 0

    const diffHome = nextHome - prevHome
    const diffAway = nextAway - prevAway

    // Generar un evento por cada incremento detectado
    for (let i = 0; i < diffHome; i++) {
      synthetic.push({
        type,
        icon,
        label,
        team: homeTeam,
        side: 'home',
        elapsed: elapsed ?? '—',
        at: new Date().toISOString(),
      })
    }

    for (let i = 0; i < diffAway; i++) {
      synthetic.push({
        type,
        icon,
        label,
        team: awayTeam,
        side: 'away',
        elapsed: elapsed ?? '—',
        at: new Date().toISOString(),
      })
    }
  }

  return synthetic
}

module.exports = { parseStatMap, detectDiffs }
