import { Link } from 'react-router-dom'
import { formatMatchDateTime } from '../../ollin/matchUtils'
import { translateTeamName } from '../../ollin/teamDisplay'
import TeamDisplay from './TeamDisplay'

export default function MatchCardCompact({ match }) {
  if (!match) return null

  const showScore = match.homeScore != null && match.awayScore != null
  const scoreText = showScore ? `${match.homeScore} - ${match.awayScore}` : 'vs'
  const dateTime = formatMatchDateTime(match.date)

  return (
    <Link to={`/ollin-deportes/partido/${match.id}`} className="ollin-compact-card">
      <div className="ollin-compact-card__teams">
        <div className="ollin-compact-card__side">
          <TeamDisplay team={match.homeTeam} size={22} />
          <span className="ollin-compact-card__name">{translateTeamName(match.homeTeam.name)}</span>
        </div>

        <div className="ollin-compact-card__center">
          <span className="ollin-compact-card__score">{scoreText}</span>
          <span className={`ollin-compact-card__status ollin-compact-card__status--${match.status}`}>
            {match.status === 'live' && <span className="ollin-live-dot" aria-hidden />}
            {match.status === 'live' ? 'LIVE' : match.statusLabel}
          </span>
          {dateTime && <span className="ollin-compact-card__time">{dateTime}</span>}
        </div>

        <div className="ollin-compact-card__side ollin-compact-card__side--away">
          <TeamDisplay team={match.awayTeam} size={22} />
          <span className="ollin-compact-card__name">{translateTeamName(match.awayTeam.name)}</span>
        </div>
      </div>
    </Link>
  )
}
