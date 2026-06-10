import PremiumLockNotice from './PremiumLockNotice'

function StandingsTable({ rows }) {
  return (
    <table className="ollin-standings-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Equipo</th>
          <th>PJ</th>
          <th>G</th>
          <th>E</th>
          <th>P</th>
          <th>GF</th>
          <th>GC</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.team?.id}-${row.rank}`}>
            <td>{row.rank}</td>
            <td>{row.team?.name}</td>
            <td>{row.all?.played ?? '—'}</td>
            <td>{row.all?.win ?? '—'}</td>
            <td>{row.all?.draw ?? '—'}</td>
            <td>{row.all?.lose ?? '—'}</td>
            <td>{row.all?.goals?.for ?? '—'}</td>
            <td>{row.all?.goals?.against ?? '—'}</td>
            <td>{row.points ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function StandingsView({ loading, data, usingMock, leagueMeta }) {
  if (loading) {
    return (
      <div className="ollin-standings">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="ollin-skeleton ollin-skeleton--table" aria-hidden />
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="ollin-empty">
        <p>Sin datos de posiciones para esta liga.</p>
      </div>
    )
  }

  const showGroups = data.groups?.length > 1

  return (
    <div className="ollin-standings">
      {usingMock && (
        <p className="ollin-standings__demo" role="status">
          Modo demo — posiciones de ejemplo
        </p>
      )}

      {leagueMeta?.premiumOnly && <PremiumLockNotice />}

      {showGroups ? (
        data.groups.map((group) => (
          <section key={group.group} className="ollin-standings-group">
            <h3 className="ollin-standings-group__title">Grupo {group.group}</h3>
            <StandingsTable rows={group.rows} />
          </section>
        ))
      ) : (
        <StandingsTable rows={data.flat?.length ? data.flat : data.groups?.[0]?.rows || []} />
      )}
    </div>
  )
}
