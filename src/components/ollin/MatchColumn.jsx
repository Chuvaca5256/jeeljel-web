import MatchCard from './MatchCard'

function SkeletonCard() {
  return <div className="ollin-skeleton" aria-hidden />
}

function EmptyColumn({ icon, label }) {
  return (
    <div className="ollin-column__empty">
      <span className="ollin-column__empty-icon" aria-hidden>
        {icon}
      </span>
      <p>{label}</p>
    </div>
  )
}

export default function MatchColumn({ title, badge, matches, loading, emptyIcon, emptyLabel }) {
  return (
    <section className="ollin-column">
      <header className="ollin-column__header">
        <h2>{title}</h2>
        {badge === 'live' && (
          <span className="ollin-column__live-badge">
            <span className="ollin-live-dot" aria-hidden /> LIVE
          </span>
        )}
      </header>

      <div className="ollin-column__list">
        {loading &&
          Array.from({ length: 2 }, (_, i) => <SkeletonCard key={`sk-${i}`} />)}

        {!loading && matches.length === 0 && (
          <EmptyColumn icon={emptyIcon} label={emptyLabel} />
        )}

        {!loading && matches.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>
    </section>
  )
}
