import { useCallback, useEffect, useState } from 'react'
import { MOCK_STANDINGS } from '../ollin/mockData'

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function useStandings(leagueId, enabled) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [usingMock, setUsingMock] = useState(false)

  const load = useCallback(async () => {
    if (!enabled || leagueId == null) {
      setData(null)
      return
    }

    setLoading(true)
    try {
      const result = await fetchJson(`/api/ollin/standings/${leagueId}`)
      setData(result)
      setUsingMock(false)
    } catch {
      if (leagueId === 1) {
        setData(MOCK_STANDINGS)
        setUsingMock(true)
      } else {
        setData(null)
        setUsingMock(false)
      }
    } finally {
      setLoading(false)
    }
  }, [leagueId, enabled])

  useEffect(() => {
    load()
  }, [load])

  return { loading, data, usingMock, refresh: load }
}
