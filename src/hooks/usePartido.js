import { useCallback, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

async function fetchPartido(id) {
  const res = await fetch(`/api/ollin/fixtures/partido/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!data?.summary) throw new Error('Sin datos')
  return data
}

export default function usePartido(id) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)
  const dataRef = useRef(null)

  const loadPartido = useCallback(async () => {
    if (!id) { setError(true); setLoading(false); return }
    try {
      const payload = await fetchPartido(id)
      dataRef.current = payload
      setData(payload)
      setError(false)
    } catch {
      setData(null)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    setLoading(true)
    loadPartido()

    let socket
    try {
      socket = io(window.location.origin, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
      })

      // Recibe eventos del partido en vivo — aplica directo al estado sin HTTP fetch
      socket.on(`ollin:partido:${id}`, (payload) => {
        if (!payload?.events) return
        setData(prev => {
          if (!prev) return prev
          return { ...prev, events: payload.events }
        })
      })

      // ollin:update trae datos generales — re-fetch completo para sincronizar marcador
      socket.on('ollin:update', loadPartido)
    } catch {
      /* Socket opcional */
    }

    return () => {
      socket?.off(`ollin:partido:${id}`)
      socket?.off('ollin:update', loadPartido)
      socket?.disconnect()
    }
  }, [id, loadPartido])

  return { loading, error, data, refresh: loadPartido }
}
