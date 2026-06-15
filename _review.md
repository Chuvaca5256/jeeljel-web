# Review dump — elapsed flow

## `src/components/ollin/partido/PartidoHeader.jsx` (primeras 60 líneas)

```jsx
import { Link } from 'react-router-dom'
import TeamDisplay from '../TeamDisplay'

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
  if (!summary) return null

  const isLive = ['1H','2H','ET','BT','P','LIVE'].includes(summary?.statusShort || '')
  const elapsed = summary?.elapsed ?? null
  const statusShort = summary?.statusShort || ''

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
```

---

## `src/pages/OllinPartido.jsx` (primeras 30 líneas)

```jsx
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import OllinLayout from '../components/ollin/OllinLayout'
import PartidoHeader from '../components/ollin/partido/PartidoHeader'
import PartidoSkeleton from '../components/ollin/partido/PartidoSkeleton'
import FootballFieldLive from '../components/ollin/partido/FootballFieldLive'
import BaseballDiamondLive from '../components/ollin/partido/BaseballDiamondLive'
import StatsTab from '../components/ollin/partido/StatsTab'
import PlayersTab from '../components/ollin/partido/PlayersTab'
import LineupsTab from '../components/ollin/partido/LineupsTab'
import H2HTab from '../components/ollin/partido/H2HTab'
import usePartido from '../hooks/usePartido'
import ChatPartido from '../components/ollin/partido/ChatPartido'
import { resolveSport } from '../ollin/partidoMock'
import mosaico from '../assets/mosaicos/Macuilxochitl.png'
import './OllinDeportes.css'

const PARTIDO_TABS = [
  { id: 'live', label: 'EN VIVO' },
  { id: 'stats', label: 'ESTADÍSTICAS' },
  { id: 'players', label: 'JUGADORES' },
  { id: 'lineups', label: 'ALINEACIONES' },
  { id: 'h2h', label: 'H2H' },
]

const BANNER_ITEMS = [
  {
    type: 'cta',
    text: '🤖 ¿Quieres picks con IA para este partido?',
    btnText: 'Probar Ikan Naat IA',
```
