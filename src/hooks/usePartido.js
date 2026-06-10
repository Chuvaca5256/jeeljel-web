import { useCallback, useEffect, useState } from 'react'
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

  const loadPartido = useCallback(async () => {
    if (!id) {
      setError(true)
      setLoading(false)
      return
    }

    try {
      const payload = await fetchPartido(id)
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
      socket.on(`ollin:partido:${id}`, loadPartido)
      socket.on('ollin:update', loadPartido)
    } catch {
      /* Socket opcional */
    }

    return () => {
      socket?.off(`ollin:partido:${id}`, loadPartido)
      socket?.off('ollin:update', loadPartido)
      socket?.disconnect()
    }
  }, [id, loadPartido])

  return { loading, error, data, refresh: loadPartido }
}
