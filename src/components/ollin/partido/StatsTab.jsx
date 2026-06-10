function parsePercent(val) {
  const n = parseInt(String(val).replace('%', ''), 10)
  return Number.isNaN(n) ? 50 : Math.min(100, Math.max(0, n))
}

function StatBar({ label, home, away, suffix = '' }) {
  const hNum = typeof home === 'string' && home.includes('%') ? parsePercent(home) : Number(home)
  const aNum = typeof away === 'string' && away.includes('%') ? parsePercent(away) : Number(away)
  const total = (Number.isFinite(hNum) ? hNum : 0) + (Number.isFinite(aNum) ? aNum : 0)
  const homePct = total > 0 && Number.isFinite(hNum) ? (hNum / total) * 100 : 50
  const awayPct = 100 - homePct

  return (
    <div className="ollin-stat-row">
      <div className="ollin-stat-row__values">
        <span>
          {home}
          {suffix}
        </span>
        <span className="ollin-stat-row__label">{label}</span>
        <span>
          {away}
          {suffix}
        </span>
      </div>
      <div className="ollin-stat-row__bar">
        <span style={{ width: `${homePct}%` }} className="ollin-stat-row__home" />
        <span style={{ width: `${awayPct}%` }} className="ollin-stat-row__away" />
      </div>
    </div>
  )
}

export default function StatsTab({ statistics, sport, summary }) {
  const items = statistics?.items || []

  if (items.length === 0) {
    return <p className="ollin-partido-empty">Estadísticas no disponibles</p>
  }

  return (
    <div className="ollin-stats-tab">
      {items.map((item) => (
        <StatBar
          key={item.key || item.label}
          label={item.label}
          home={item.home}
          away={item.away}
          suffix={item.suffix || ''}
        />
      ))}

      {sport === 'beisbol' && statistics?.meta && (
        <div className="ollin-stats-meta">
          <p>
            <strong>Inning:</strong> {statistics.meta.inning}
          </p>
          {statistics.meta.pitcherHome && (
            <p>
              <strong>Pitcher local:</strong> {statistics.meta.pitcherHome}
            </p>
          )}
          {statistics.meta.pitcherAway && (
            <p>
              <strong>Pitcher visitante:</strong> {statistics.meta.pitcherAway}
            </p>
          )}
        </div>
      )}

      {sport === 'futbol' && summary?.miniStats && (
        <p className="ollin-stats-meta">
          Posesión: {summary.miniStats.possessionHome || '—'} vs {summary.miniStats.possessionAway || '—'}
        </p>
      )}
    </div>
  )
}
