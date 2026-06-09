import { useCallback, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { MOCK_MATCHES } from '../ollin/mockData'
import { categorizeApiData } from '../ollin/matchUtils'

const ENDPOINTS = {
  live: '/api/ollin/fixtures/live',
  hoy: '/api/ollin/fixtures/hoy',
  proximos: '/api/ollin/fixtures/proximos',
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function useOllinData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [usingMock, setUsingMock] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [categorized, setCategorized] = useState({
    live: [],
    hoyScheduled: [],
    hoyFinished: [],
    proximos: [],
  })

  const loadData = useCallback(async () => {
    try {
      const [live, hoy, proximos] = await Promise.all([
        fetchJson(ENDPOINTS.live),
        fetchJson(ENDPOINTS.hoy),
        fetchJson(ENDPOINTS.proximos),
      ])
      setCategorized(categorizeApiData(live, hoy, proximos))
      setUpdatedAt(live.updatedAt || hoy.updatedAt || new Date().toISOString())
      setUsingMock(false)
      setError(false)
    } catch {
      setCategorized(MOCK_MATCHES)
      setUsingMock(true)
      setError(true)
      setUpdatedAt(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    let socket
    try {
      socket = io(window.location.origin, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
      })
      socket.on('ollin:update', () => {
        loadData()
      })
    } catch {
      /* Socket opcional en dev sin backend */
    }

    return () => {
      socket?.disconnect()
    }
  }, [loadData])

  const value = useMemo(
    () => ({
      loading,
      error,
      usingMock,
      updatedAt,
      categorized,
      refresh: loadData,
    }),
    [loading, error, usingMock, updatedAt, categorized, loadData]
  )

  return value
}
