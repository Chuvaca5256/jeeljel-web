# Review dump — PartidoHeader

## `src/components/ollin/partido/PartidoHeader.jsx` (completo)

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

  const showScore = summary.homeScore != null && summary.awayScore != null
  const score = showScore ? `${summary.homeScore} - ${summary.awayScore}` : 'vs'

  return (
    <header className="ollin-partido-header">
      <Link to="/ollin-deportes" className="ollin-partido-back">
        ← Volver
      </Link>

      <p className="ollin-partido-league">{summary.leagueName}</p>

      <div className="ollin-partido-matchup">
        <div className="ollin-partido-team">
          <TeamDisplay team={summary.homeTeam} size={40} />
          <span className="ollin-partido-team__name">{summary.homeTeam.name}</span>
        </div>

        <div className="ollin-partido-scorebox">
          <span className="ollin-partido-scorebox__score">{score}</span>
          <span className="ollin-partido-scorebox__status">{formatStatus(summary)}</span>
          <span className="ollin-partido-scorebox__mini">{miniStatLine(summary, sport)}</span>
        </div>

        <div className="ollin-partido-team ollin-partido-team--away">
          <TeamDisplay team={summary.awayTeam} size={40} />
          <span className="ollin-partido-team__name">{summary.awayTeam.name}</span>
        </div>
      </div>
    </header>
  )
}
```
