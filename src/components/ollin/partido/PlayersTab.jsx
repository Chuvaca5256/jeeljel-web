import { useMemo, useState } from 'react'

const FOOTBALL_COLS = [
  { key: 'name', label: 'Jugador' },
  { key: 'goals', label: 'Goles' },
  { key: 'assists', label: 'Asist.' },
  { key: 'shots', label: 'Tiros' },
  { key: 'keyPasses', label: 'Pases clave' },
  { key: 'minutes', label: 'Min' },
]

function sortRows(rows, key, dir) {
  return [...rows].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (typeof av === 'number' && typeof bv === 'number') {
      return dir === 'asc' ? av - bv : bv - av
    }
    return dir === 'asc'
      ? String(av).localeCompare(String(bv), 'es')
      : String(bv).localeCompare(String(av), 'es')
  })
}

function PlayersTable({ title, rows, columns }) {
  const [sortKey, setSortKey] = useState('goals')
  const [sortDir, setSortDir] = useState('desc')

  const sorted = useMemo(
    () => sortRows(rows, sortKey, sortDir),
    [rows, sortKey, sortDir]
  )

  const onSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  if (!rows?.length) {
    return (
      <div className="ollin-players-block">
        <h3>{title}</h3>
        <p className="ollin-partido-empty">Sin datos de jugadores</p>
      </div>
    )
  }

  return (
    <div className="ollin-players-block">
      <h3>{title}</h3>
      <div className="ollin-players-scroll">
        <table className="ollin-players-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>
                  <button type="button" onClick={() => onSort(col.key)}>
                    {col.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.id || `${row.name}-${i}`}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key] ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function PlayersTab({ players, sport, summary, statistics }) {
  if (sport === 'beisbol') {
    return (
      <div className="ollin-players-tab">
        <p className="ollin-partido-empty">
          Estadísticas detalladas de jugadores MLB disponibles con el upgrade PRO de API-Sports.
        </p>
        {statistics?.meta?.pitcherHome && (
          <p className="ollin-stats-meta">Pitcher local: {statistics.meta.pitcherHome}</p>
        )}
      </div>
    )
  }

  return (
    <div className="ollin-players-tab">
      <PlayersTable title={summary?.homeTeam?.name || 'Local'} rows={players?.home || []} columns={FOOTBALL_COLS} />
      <PlayersTable title={summary?.awayTeam?.name || 'Visitante'} rows={players?.away || []} columns={FOOTBALL_COLS} />
    </div>
  )
}
