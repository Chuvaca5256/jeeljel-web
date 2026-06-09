import { Link } from 'react-router-dom'
import TeamDisplay from './TeamDisplay'

export default function MatchCard({ match }) {
  if (!match) return null

  const showScore = match.homeScore != null && match.awayScore != null
  const scoreText = showScore ? `${match.homeScore} - ${match.awayScore}` : 'vs'

  return (
    <Link
      to={`/ollin-deportes/partido/${match.id}`}
      className="ollin-match-card block no-underline w-full"
    >
      <div className="ollin-match-card__league">{match.leagueName}</div>

      <div className="ollin-match-card__teams">
        <div className="ollin-match-card__team">
          <TeamDisplay team={match.homeTeam} size={36} />
          <span className="ollin-match-card__name">{match.homeTeam.name}</span>
        </div>

        <div className="ollin-match-card__center">
          <span className="ollin-match-card__score">{scoreText}</span>
          <span
            className={`ollin-match-card__badge ollin-match-card__badge--${match.status}`}
          >
            {match.status === 'live' && <span className="ollin-live-dot" aria-hidden />}
            {match.status === 'live' ? 'LIVE' : match.statusLabel}
          </span>
        </div>

        <div className="ollin-match-card__team ollin-match-card__team--away">
          <TeamDisplay team={match.awayTeam} size={36} />
          <span className="ollin-match-card__name">{match.awayTeam.name}</span>
        </div>
      </div>
    </Link>
  )
}
