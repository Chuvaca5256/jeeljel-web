import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import useTabData from '../../../hooks/useTabData'
import useSocketUpdate from '../../../hooks/useSocketUpdate'
import TeamDisplay from '../TeamDisplay'
import {
  filterBySport,
  filterByLeague,
  filterBySearch,
  groupMatchesByLeague,
  normalizeFootballFixture,
  normalizeBaseballGame,
} from '../../../ollin/matchUtils'
import { translateTeamName } from '../../../ollin/teamDisplay'

const getMatchTime = (fixture) => {
  const status = fixture?.fixture?.status
  const elapsed = status?.elapsed
  const short = status?.short

  if (short === 'HT') return 'ET'
  if (short === 'FT' || short === 'AET' || short === 'PEN') return 'FT'
  if (elapsed !== null && elapsed !== undefined) return `${elapsed}'`

  const date = fixture?.fixture?.date
  if (!date) return '--'
  return new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function toNormalizedMatch(item) {
  if (item?.sport === 'futbol' || item?.sport === 'beisbol') {
    return { ...item, _raw: item._raw ?? item }
  }
  if (item?.fixture?.id != null) {
    return { ...normalizeFootballFixture(item), _raw: item }
  }
  return { ...normalizeBaseballGame(item), _raw: item }
}

function EnVivoMatchCard({ match }) {
  if (!match) return null

  const showScore = match.homeScore != null && match.awayScore != null
  const scoreText = showScore ? `${match.homeScore} - ${match.awayScore}` : 'vs'
  const matchTime = getMatchTime(match._raw ?? match)

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
          {matchTime && matchTime !== '--' && (
            <span className="ollin-compact-card__time">{matchTime}</span>
          )}
        </div>

        <div className="ollin-compact-card__side ollin-compact-card__side--away">
          <TeamDisplay team={match.awayTeam} size={22} />
          <span className="ollin-compact-card__name">{translateTeamName(match.awayTeam.name)}</span>
        </div>
      </div>
    </Link>
  )
}

function EnVivoMatchGroupList({ groups, loading, emptyIcon, emptyLabel }) {
  if (loading) {
    return (
      <div className="ollin-match-groups">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={`sk-${i}`} className="ollin-skeleton ollin-skeleton--compact" aria-hidden />
        ))}
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="ollin-empty">
        <span className="ollin-empty__icon" aria-hidden>
          {emptyIcon}
        </span>
        <p>{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className="ollin-match-groups">
      {groups.map((group) => (
        <section key={`${group.sport}-${group.leagueId}-${group.leagueName}`} className="ollin-match-group">
          <header className="ollin-match-group__header">
            <h3>{group.leagueName}</h3>
            {group.liveCount > 0 && (
              <span className="ollin-match-group__live">{group.liveCount} en vivo</span>
            )}
          </header>
          <div className="ollin-match-group__list">
            {group.matches.map((match) => (
              <EnVivoMatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default function TabEnVivo({ sport, selectedLeagueId, searchQuery, active }) {
  const { loading, data, refresh } = useTabData(
    '/api/ollin/fixtures/live',
    active,
    (json) => [...(json.futbol ?? []), ...(json.beisbol ?? [])]
  )
  useSocketUpdate(useCallback(() => { if (active) refresh() }, [active, refresh]))

  const matches = (Array.isArray(data) ? data : []).map(toNormalizedMatch)
  const filtered = filterBySearch(
    filterByLeague(filterBySport(matches, sport), selectedLeagueId, sport),
    searchQuery
  )
  const groups = groupMatchesByLeague(filtered).map((g) => ({
    ...g,
    liveCount: g.matches.filter((m) => m.status === 'live').length,
  }))

  return (
    <EnVivoMatchGroupList
      groups={groups}
      loading={loading}
      emptyIcon={sport === 'beisbol' ? '⚾' : '⚽'}
      emptyLabel="Sin partidos en vivo en este momento"
    />
  )
}
