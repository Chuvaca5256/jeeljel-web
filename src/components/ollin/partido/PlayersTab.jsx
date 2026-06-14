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
  const s = p?.statistics?.[0] ?? {}
  const didPlay = s?.games?.minutes > 0
  return {
    id: p?.player?.id,
    name: p?.player?.name ?? '—',
    minutes: s?.games?.minutes ?? 0,
    rating: s?.games?.rating ?? null,
    shotsTotal: s?.shots?.total ?? 0,
    shotsOn: s?.shots?.on ?? 0,
    passes: s?.passes?.total ?? 0,
    keyPasses: s?.passes?.key ?? 0,
    duelsWon: s?.duels?.won ?? 0,
    fouls: s?.fouls?.committed ?? 0,
    yellow: s?.cards?.yellow ?? 0,
    red: s?.cards?.red ?? 0,
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

  return (
    <div className="ollin-players-block" style={{ marginBottom: '24px' }}>
      <h3 style={{ color: '#f0c030', marginBottom: '8px', fontSize: '0.95rem', letterSpacing: '0.05em' }}>{title}</h3>
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
            {sorted.map((row, i) => (
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
  if (sport === 'beisbol') {
    return (
      <div className="ollin-players-tab">
        <p className="ollin-partido-empty">Estadísticas detalladas de jugadores MLB disponibles próximamente.</p>
      </div>
    )
  }

  const homePlayers = players?.home ?? []
  const awayPlayers = players?.away ?? []

  return (
    <div className="ollin-players-tab" style={{ padding: '12px 0' }}>
      <PlayersTable
        title={summary?.homeTeam?.name ?? 'Local'}
        rawPlayers={homePlayers}
        columns={FOOTBALL_COLS}
      />
      <PlayersTable
        title={summary?.awayTeam?.name ?? 'Visitante'}
        rawPlayers={awayPlayers}
        columns={FOOTBALL_COLS}
      />
    </div>
  )
}
