import { useEffect, useState } from 'react'

function formatStatus(summary) {
  if (!summary) return '—'
  if (summary.elapsed != null) return `${summary.elapsed}'`
  if (summary.statusLong) return summary.statusLong
  return summary.statusShort || '—'
}

function miniStatLine(summary, sport) {
  if (sport === 'beisbol') {
    const parts = []
    if (summary.inning) parts.push(summary.inning)
    if (summary.outs != null) parts.push(`${summary.outs} out${summary.outs === 1 ? '' : 's'}`)
    if (summary.balls != null && summary.strikes != null) {
      parts.push(`${summary.balls}-${summary.strikes}`)
    }
    return parts.join(' · ') || summary.statusLong
  }

  const h = summary.miniStats?.possessionHome
  const a = summary.miniStats?.possessionAway
  if (h && a) return `Posesión ${h} – ${a}`
  return summary.statusLong || ''
}

export default function PartidoHeader({ summary, sport }) {
  const isLive = ['1H','2H','ET','BT','P','LIVE'].includes(summary?.statusShort || '')
  const statusShort = summary?.statusShort || ''
  const [elapsed, setElapsed] = useState(summary?.elapsed ?? null)

  useEffect(() => {
    setElapsed(summary?.elapsed ?? null)
  }, [summary?.elapsed])

  useEffect(() => {
    if (!isLive) return
    const t = setInterval(() => {
      setElapsed(prev => (prev != null ? prev + 1 : prev))
    }, 60000)
    return () => clearInterval(t)
  }, [isLive])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        // Forzar re-render con el elapsed real del backend al volver a la pestaña
        setElapsed(summary?.elapsed ?? null)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [summary?.elapsed])

  if (!summary) return null

  const matchTime = (() => {
    if (['FT','AET','PEN'].includes(statusShort)) return 'FT'
    if (statusShort === 'HT') return 'HT'
    if (isLive && elapsed != null) return `${elapsed}'`
    return statusShort || '–'
  })()

  return (
    <div className="ollin-ph">
      {/* FILA PRINCIPAL: equipo local · marcador+tiempo · equipo visitante */}
      <div className="ollin-ph__row">

        {/* LOCAL */}
        <div className="ollin-ph__team ollin-ph__team--home">
          <div className="ollin-ph__badge">
            {summary?.homeTeam?.initials || 'LOC'}
          </div>
          <span className="ollin-ph__team-name">{summary?.homeTeam?.name || 'Local'}</span>
        </div>

        {/* MARCADOR */}
        <div className="ollin-ph__score-block">
          <div className="ollin-ph__score">
            <span>{summary?.homeScore ?? 0}</span>
            <span className="ollin-ph__score-sep">–</span>
            <span>{summary?.awayScore ?? 0}</span>
          </div>
          <div className={`ollin-ph__time${isLive ? ' ollin-ph__time--live' : ''}`}>
            {isLive && <span className="ollin-ph__live-dot" />}
            {matchTime}
          </div>
        </div>

        {/* VISITANTE */}
        <div className="ollin-ph__team ollin-ph__team--away">
          <div className="ollin-ph__badge ollin-ph__badge--away">
            {summary?.awayTeam?.initials || 'VIS'}
          </div>
          <span className="ollin-ph__team-name">{summary?.awayTeam?.name || 'Visitante'}</span>
        </div>

      </div>

      {/* POSESIÓN si está disponible */}
      {summary?.miniStats?.possessionHome != null && (
        <div className="ollin-ph__poss-bar-wrap">
          <span className="ollin-ph__poss-num" style={{color:'#f97316'}}>
            {summary.miniStats.possessionHome}%
          </span>
          <div className="ollin-ph__poss-track">
            <div className="ollin-ph__poss-fill" style={{width:`${summary.miniStats.possessionHome}%`}} />
          </div>
          <span className="ollin-ph__poss-num" style={{color:'#38bdf8'}}>
            {100 - parseInt(summary.miniStats.possessionHome)}%
          </span>
        </div>
      )}
    </div>
  )
}
