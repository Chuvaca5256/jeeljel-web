# Review dump — ticker (detectDiffs + useTickerEvents)

## (A) `detectDiffs` — `ollin-backend/src/services/statsDiffService.js`

```javascript
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
```

**Contexto:** `DIFF_KEYS` (líneas 7–12 del mismo archivo):

```javascript
const DIFF_KEYS = [
  { stat: 'Shots on Goal',  type: 'shot',    icon: '🥅', label: 'Tiro a puerta' },
  { stat: 'Total Shots',    type: 'shot_off', icon: '💨', label: 'Tiro fuera'    },
  { stat: 'Corner Kicks',   type: 'corner',   icon: '🚩', label: 'Tiro de esquina' },
  { stat: 'Fouls',          type: 'foul',     icon: '⚠️', label: 'Falta'         },
]
```

---

## (B) `useTickerEvents.js` — completo

```javascript
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const TICKER_DURATION_MS = 8000

export default function useTickerEvents(partidoId) {
  const [tickerEvent, setTickerEvent] = useState(null)

  useEffect(() => {
    if (!partidoId) return

    let socket
    let clearTimer = null

    try {
      socket = io(window.location.origin, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
      })

      socket.on(`ollin:ticker:${partidoId}`, (payload) => {
        if (!payload?.events?.length) return

        // Mostrar eventos uno por uno en secuencia
        payload.events.forEach((ev, i) => {
          setTimeout(() => {
            setTickerEvent(ev)
            if (clearTimer) clearTimeout(clearTimer)
            clearTimer = setTimeout(() => setTickerEvent(null), TICKER_DURATION_MS)
          }, i * (TICKER_DURATION_MS + 500))
        })
      })
    } catch {
      /* Socket opcional */
    }

    return () => {
      socket?.off(`ollin:ticker:${partidoId}`)
      socket?.disconnect()
      if (clearTimer) clearTimeout(clearTimer)
    }
  }, [partidoId])

  return tickerEvent
}
```
