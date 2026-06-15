import { useMemo, useState } from 'react'

const FOOTBALL_COLS = [
  { key: 'minutes', label: 'MIN' },
  { key: 'rating', label: 'Rating' },
  { key: 'shotsTotal', label: 'Tiros' },
  { key: 'shotsOn', label: 'A puerta' },
  { key: 'passes', label: 'Pases' },
  { key: 'keyPasses', label: 'P.Clave' },
  { key: 'duelsWon', label: 'Duelos' },
  { key: 'fouls', label: 'Faltas' },
  { key: 'yellow', label: '🟨' },
  { key: 'red', label: '🟥' },
]

function RatingBadge({ value }) {
  if (!value || value === '—') return <span style={{ opacity: 0.4 }}>—</span>
  const num = parseFloat(value)
  const color = num >= 7.5 ? '#22c55e' : num >= 6 ? '#f0c030' : '#ef4444'
  return (
    <span style={{
      background: color,
      color: '#000',
      borderRadius: '4px',
      padding: '1px 6px',
      fontWeight: 700,
      fontSize: '0.78rem',
    }}>{num.toFixed(1)}</span>
  )
}

function sortRows(rows, key, dir) {
  return [...rows].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (typeof av === 'number' && typeof bv === 'number')
      return dir === 'asc' ? av - bv : bv - av
    return dir === 'asc'
      ? String(av ?? '').localeCompare(String(bv ?? ''), 'es')
      : String(bv ?? '').localeCompare(String(av ?? ''), 'es')
  })
}

function mapPlayer(p) {
  const didPlay = (p?.minutes ?? 0) > 0
  return {
    id: p?.id,
    name: p?.name ?? '—',
    minutes: p?.minutes ?? 0,
    rating: p?.rating ?? null,
    shotsTotal: p?.shots ?? 0,
    shotsOn: p?.shotsOn ?? 0,
    passes: p?.passes ?? 0,
    keyPasses: p?.keyPasses ?? 0,
    duelsWon: p?.duelsWon ?? 0,
    fouls: p?.fouls ?? 0,
    yellow: p?.yellow ?? 0,
    red: p?.red ?? 0,
    didPlay,
  }
}

function PlayersTable({ title, rawPlayers, columns }) {
  const [sortKey, setSortKey] = useState('minutes')
  const [sortDir, setSortDir] = useState('desc')

  const rows = useMemo(() => (rawPlayers ?? []).map(mapPlayer), [rawPlayers])
  const sorted = useMemo(() => sortRows(rows, sortKey, sortDir), [rows, sortKey, sortDir])

  const onSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  if (!rows.length) {
    return (
      <div className="ollin-players-block">
        <h3 style={{ color: '#f0c030', marginBottom: '8px' }}>{title}</h3>
        <p className="ollin-partido-empty">Sin datos de jugadores</p>
      </div>
    )
  }

  const playedRows = sorted.filter(r => r.didPlay)
  const notPlayedRows = sorted.filter(r => !r.didPlay)
  const allRows = [...playedRows, ...notPlayedRows]

  return (
    <div className="ollin-players-block" style={{ marginBottom: '24px' }}>
      <h3 style={{ color: '#f0c030', marginBottom: '8px', fontSize: '0.95rem', letterSpacing: '0.05em' }}>{title}</h3>
      {playedRows.length === 0 && (
        <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '8px' }}>Estadísticas completas disponibles al finalizar el partido</p>
      )}
      <div className="ollin-players-scroll" style={{ overflowX: 'auto' }}>
        <table className="ollin-players-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px', color: '#aaa', fontWeight: 600, minWidth: '130px' }}>Jugador</th>
              {columns.map((col) => (
                <th key={col.key} style={{ padding: '6px 8px', color: '#aaa', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <button type="button" onClick={() => onSort(col.key)}
                    style={{ background: 'none', border: 'none', color: sortKey === col.key ? '#f0c030' : '#aaa', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
                    {col.label}{sortKey === col.key ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, i) => (
              <tr key={row.id ?? i}
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                  opacity: row.didPlay ? 1 : 0.4,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                <td style={{ padding: '6px 8px', color: '#fff', fontWeight: 500 }}>
                  {row.name}
                  {!row.didPlay && <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#888' }}>No jugó</span>}
                </td>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '6px 8px', textAlign: 'center', color: '#ddd' }}>
                    {col.key === 'rating'
                      ? <RatingBadge value={row.rating} />
                      : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function PlayersTab({ players, sport, summary }) {
  const [selectedTeam, setSelectedTeam] = useState('home')
  if (sport === 'beisbol') {
    return (
      <div className="ollin-players-tab">
        <p className="ollin-partido-empty">Estadísticas detalladas de jugadores MLB disponibles próximamente.</p>
      </div>
    )
  }
  const homePlayers = players?.home ?? []
  const awayPlayers = players?.away ?? []
  const homeName = summary?.homeTeam?.name ?? 'Local'
  const awayName = summary?.awayTeam?.name ?? 'Visitante'
  const currentPlayers = selectedTeam === 'home' ? homePlayers : awayPlayers
  const currentTitle = selectedTeam === 'home' ? homeName : awayName
  return (
    <div className="ollin-players-tab" style={{ padding: '12px 0' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', padding: '0 8px' }}>
        <button
          type="button"
          onClick={() => setSelectedTeam('home')}
          style={{
            flex: 1,
            padding: '8px',
            background: selectedTeam === 'home' ? '#f97316' : 'rgba(255,255,255,0.08)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >{homeName}</button>
        <button
          type="button"
          onClick={() => setSelectedTeam('away')}
          style={{
            flex: 1,
            padding: '8px',
            background: selectedTeam === 'away' ? '#f97316' : 'rgba(255,255,255,0.08)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >{awayName}</button>
      </div>
      <PlayersTable
        title={currentTitle}
        rawPlayers={currentPlayers}
        columns={FOOTBALL_COLS}
      />
    </div>
  )
}
