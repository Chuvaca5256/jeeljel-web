import PremiumLockNotice from './PremiumLockNotice'
import { formatStandingsGroupTitle } from '../../ollin/standingsLabels'
import { translateTeamName } from '../../ollin/teamDisplay'

function buildTeamGoogleSearchUrl(spanishName) {
  const name = String(spanishName || '').trim()
  if (!name) return null
  const q = `seleccion de futbol ${name}`.replace(/\s+/g, '+')
  return `https://www.google.com/search?q=${q}`
}

function StandingsTeamName({ name }) {
  const displayName = translateTeamName(name)
  const href = buildTeamGoogleSearchUrl(displayName)

  if (!displayName) return '—'
  if (!href) return displayName

  return (
    <a
      href={href}
      className="ollin-standings-team-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {displayName}
    </a>
  )
}

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
          <th>DG</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.team?.id}-${row.rank}`}>
            <td>{row.rank}</td>
            <td><StandingsTeamName name={row.team?.name} /></td>
            <td>{row.all?.played ?? '—'}</td>
            <td>{row.all?.win ?? '—'}</td>
            <td>{row.all?.draw ?? '—'}</td>
            <td>{row.all?.lose ?? '—'}</td>
            <td>{row.all?.goals?.for ?? '—'}</td>
            <td>{row.all?.goals?.against ?? '—'}</td>
            <td>{row.goalsDiff ?? '—'}</td>
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

  const groups = data.groups ?? data.standings ?? []
  const showGroups = groups.length > 0
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
        groups.map((group) => (
          <section key={group.group} className="ollin-standings-group">
            <h3 className="ollin-standings-group__title">{formatStandingsGroupTitle(group.group)}</h3>
            <StandingsTable rows={group.rows ?? group.standings ?? []} />
          </section>
        ))
      ) : (
        <StandingsTable rows={groups[0]?.rows ?? groups[0]?.standings ?? []} />
      )}

      <section className="ollin-standings-group ollin-scorers-section">
        <h3 className="ollin-standings-group__title">Goleadores</h3>
        <ScorersTable rows={scorerRows} />
      </section>
    </div>
  )
}
