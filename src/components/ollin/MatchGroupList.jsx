import MatchCardCompact from './MatchCardCompact'

function SkeletonRow() {
  return <div className="ollin-skeleton ollin-skeleton--compact" aria-hidden />
}

export default function MatchGroupList({ groups, loading, emptyIcon, emptyLabel, getMatchTime }) {
  if (loading) {
    return (
      <div className="ollin-match-groups">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonRow key={`sk-${i}`} />
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
              <MatchCardCompact key={match.id} match={match} getMatchTime={getMatchTime} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
