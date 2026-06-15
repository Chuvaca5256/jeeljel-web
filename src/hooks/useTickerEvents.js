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
