import PremiumLockNotice from './PremiumLockNotice'
import { formatStandingsGroupTitle } from '../../ollin/standingsLabels'
import { translateTeamName } from '../../ollin/teamDisplay'

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
            <td>{translateTeamName(row.team?.name)}</td>
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

function ScorersTable({ rows }) {
  if (!rows?.length) {
    return <p className="ollin-standings__empty-section">Sin datos de goleadores disponibles.</p>
  }

  return (
    <table className="ollin-standings-table ollin-scorers-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Jugador</th>
          <th>Equipo</th>
          <th>Goles</th>
          <th>Asist.</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.rank}-${row.playerName}`}>
            <td>{row.rank}</td>
            <td>{row.playerName}</td>
            <td>{translateTeamName(row.teamName)}</td>
            <td>{row.goals ?? '—'}</td>
            <td>{row.assists ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function StandingsView({ loading, data, scorers, usingMock, leagueMeta }) {
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
  const scorerRows = scorers?.scorers || []

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
            <h3 className="ollin-standings-group__title">{formatStandingsGroupTitle(group.group)}</h3>
            <StandingsTable rows={group.rows} />
          </section>
        ))
      ) : (
        <StandingsTable rows={data.flat?.length ? data.flat : data.groups?.[0]?.rows || []} />
      )}

      <section className="ollin-standings-group ollin-scorers-section">
        <h3 className="ollin-standings-group__title">Goleadores</h3>
        <ScorersTable rows={scorerRows} />
      </section>
    </div>
  )
}
