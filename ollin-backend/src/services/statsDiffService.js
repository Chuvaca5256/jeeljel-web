/**
 * statsDiffService.js
 * Detecta cambios entre dos snapshots de estadísticas y genera eventos sintéticos.
 * Los eventos sintéticos se emiten por socket para el ticker en vivo del frontend.
 */

const DIFF_KEYS = [
  { stat: 'Shots on Goal',   type: 'shot',      icon: '🥅', label: 'Tiro a puerta'   },
  { stat: 'Total Shots',     type: 'shot_off',  icon: '💨', label: 'Tiro fuera'      },
  { stat: 'Corner Kicks',    type: 'corner',    icon: '🚩', label: 'Tiro de esquina' },
  { stat: 'Fouls',           type: 'foul',      icon: '⚠️', label: 'Falta'           },
  { stat: 'Blocked Shots',   type: 'blocked',   icon: '🛡️', label: 'Tiro bloqueado'  },
  { stat: 'Shots insidebox', type: 'insidebox', icon: '⚡', label: 'Tiro en el área'  },
  { stat: 'Total passes',    type: 'pass',      icon: '👟', label: 'Pase', isFrequent: true },
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

  for (const { stat, type, icon, label, isFrequent } of DIFF_KEYS) {
    const prevHome = prev.home[stat] ?? 0
    const nextHome = next.home[stat] ?? 0
    const prevAway = prev.away[stat] ?? 0
    const nextAway = next.away[stat] ?? 0

    const diffHome = nextHome - prevHome
    const diffAway = nextAway - prevAway

    if (diffHome <= 0 && diffAway <= 0) continue

    const base = (team, side) => {
      const ev = {
        type,
        icon,
        label,
        team,
        side,
        elapsed: elapsed ?? '—',
        at: new Date().toISOString(),
      }
      if (isFrequent) ev.isFrequent = true
      return ev
    }

    // Generar un evento por cada incremento detectado
    for (let i = 0; i < diffHome; i++) {
      synthetic.push(base(homeTeam, 'home'))
    }

    for (let i = 0; i < diffAway; i++) {
      synthetic.push(base(awayTeam, 'away'))
    }
  }

  return synthetic
}

module.exports = { parseStatMap, detectDiffs }
