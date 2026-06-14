import { useCallback, useEffect, useState } from 'react'

export default function useTabData(endpoint, enabled = true, extract = (json) => json) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const extracted = extract(json)
      setData(Array.isArray(extracted) ? extracted : [])
      setError(false)
    } catch {
      setData([])
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [endpoint, enabled])

  useEffect(() => { load() }, [load])

  return { loading, data, error, refresh: load }
}
