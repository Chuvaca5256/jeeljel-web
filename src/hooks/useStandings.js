import { useCallback, useEffect, useRef, useState } from 'react'
import { MOCK_STANDINGS, MOCK_SCORERS } from '../ollin/mockData'

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function useStandings(leagueId, enabled) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [scorers, setScorers] = useState(null)
  const [usingMock, setUsingMock] = useState(false)

  const leagueIdRef = useRef(leagueId)
  const enabledRef = useRef(enabled)
  leagueIdRef.current = leagueId
  enabledRef.current = enabled

  const load = useCallback(async () => {
    const leagueId = leagueIdRef.current
    const enabled = enabledRef.current
    if (!enabled || leagueId == null) {
      setData(null)
      setScorers(null)
      return
    }

    setLoading(true)
    try {
      const [standingsResult, scorersResult] = await Promise.allSettled([
        fetchJson(`/api/ollin/standings/${leagueId}`),
        fetchJson(`/api/ollin/standings/${leagueId}/scorers`),
      ])

      if (standingsResult.status === 'fulfilled') {
        setData(standingsResult.value)
        setUsingMock(false)
      } else if (leagueId === 1) {
        setData(MOCK_STANDINGS)
        setUsingMock(true)
      } else {
        setData(null)
        setUsingMock(false)
      }

      if (scorersResult.status === 'fulfilled') {
        setScorers(scorersResult.value)
      } else if (leagueId === 1 && standingsResult.status !== 'fulfilled') {
        setScorers(MOCK_SCORERS)
      } else {
        setScorers(scorersResult.status === 'fulfilled' ? scorersResult.value : { scorers: [] })
      }
    } catch {
      if (leagueId === 1) {
        setData(MOCK_STANDINGS)
        setScorers(MOCK_SCORERS)
        setUsingMock(true)
      } else {
        setData(null)
        setScorers(null)
        setUsingMock(false)
      }
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (enabled && leagueId != null) {
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueId, enabled ? 1 : 0])

  return { loading, data, scorers, usingMock, refresh: load }
}
