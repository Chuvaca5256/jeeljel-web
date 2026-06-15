function FormationPitch({ lineup, side }) {
  const players = lineup?.startXI || []
  const formation = lineup?.formation || ''

  if (players.length === 0) {
    return <p className="ollin-partido-empty">Sin alineación disponible</p>
  }

  const hasGrid = players.some((p) => p.grid)
  if (!hasGrid) {
    return (
      <div style={{ padding: '0 8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px', color: '#aaa', fontWeight: 600, width: '40px' }}>#</th>
              <th style={{ textAlign: 'left', padding: '6px 8px', color: '#aaa', fontWeight: 600 }}>Jugador</th>
              <th style={{ textAlign: 'right', padding: '6px 8px', color: '#aaa', fontWeight: 600, width: '40px' }}>Pos</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr key={p.id || p.number} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                <td style={{ padding: '7px 8px', color: '#f0c030', fontWeight: 700 }}>{p.number ?? '—'}</td>
                <td style={{ padding: '7px 8px', color: '#fff' }}>{p.name}</td>
                <td style={{ padding: '7px 8px', color: '#aaa', textAlign: 'right' }}>{p.pos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const VW = 300
  const VH = 420
  const PAD = 16
  const isHome = side === 'home'

  // Agrupar por fila para centrar columnas
  const byRow = {}
  players.forEach((p) => {
    if (!p.grid) return
    const [row, col] = String(p.grid).split(':').map(Number)
    if (!byRow[row]) byRow[row] = []
    byRow[row].push({ ...p, _row: row, _col: col })
  })

  const rows = Object.keys(byRow).map(Number).sort((a, b) => a - b)
  const totalRows = rows.length

  const positioned = []
  rows.forEach((row, rowIdx) => {
    const playersInRow = byRow[row].sort((a, b) => a._col - b._col)
    const count = playersInRow.length
    playersInRow.forEach((p, colIdx) => {
      const rawY = rowIdx / (totalRows - 1)
      const y = isHome
        ? PAD + 20 + rawY * (VH - PAD * 2 - 40)
        : VH - PAD - 20 - rawY * (VH - PAD * 2 - 40)
      const x = PAD + 20 + (colIdx / Math.max(count - 1, 1)) * (VW - PAD * 2 - 40)
      const xCentered = count === 1 ? VW / 2 : x
      positioned.push({ ...p, cx: xCentered, cy: y })
    })
  })

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', maxWidth: '340px', display: 'block', margin: '0 auto' }}>
      {/* Fondo campo */}
      <rect x="0" y="0" width={VW} height={VH} fill="#2d6a4f" rx="6" />
      {/* Franjas */}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={PAD} y={PAD + i * ((VH - PAD * 2) / 6)} width={VW - PAD * 2} height={(VH - PAD * 2) / 12} fill="rgba(0,0,0,0.07)" />
      ))}
      {/* Borde campo */}
      <rect x={PAD} y={PAD} width={VW - PAD * 2} height={VH - PAD * 2} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      {/* Línea media */}
      <line x1={PAD} y1={VH / 2} x2={VW - PAD} y2={VH / 2} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      {/* Círculo central */}
      <circle cx={VW / 2} cy={VH / 2} r="30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      {/* Área local (abajo) */}
      <rect x={VW * 0.25} y={VH - PAD - 60} width={VW * 0.5} height={60} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      {/* Área visitante (arriba) */}
      <rect x={VW * 0.25} y={PAD} width={VW * 0.5} height={60} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

      {/* Jugadores */}
      {positioned.map((p) => {
        const apellido = (p.name || '').split(' ').pop().slice(0, 9)
        return (
          <g key={p.id || p.number} transform={`translate(${p.cx}, ${p.cy})`}>
            <circle r="16" fill={isHome ? '#fff' : '#1a1a2e'} stroke={isHome ? '#4ecdc4' : '#f0c030'} strokeWidth="2" />
            <text textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="800" fill={isHome ? '#1a1a2e' : '#fff'}>
              {p.number}
            </text>
            <text y="24" textAnchor="middle" fontSize="8.5" fill="#fff" fontWeight="600" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.9))' }}>
              {apellido}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function BaseballLineup({ rows, title }) {
  if (!rows?.length) {
    return (
      <div className="ollin-lineup-block">
        <h3>{title}</h3>
        <p className="ollin-partido-empty">Sin lineup disponible</p>
      </div>
    )
  }
  return (
    <div className="ollin-lineup-block">
      <h3>{title}</h3>
      <ol className="ollin-lineup-list">
        {rows.map((p) => (
          <li key={`${p.order}-${p.name}`}>
            <span className="ollin-lineup-list__num">{p.order}</span>
            <span>{p.name}</span>
            <span className="ollin-lineup-list__pos">{p.position}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function LineupsTab({ lineups, sport, summary }) {
  if (sport === 'beisbol') {
    return (
      <div className="ollin-lineups-tab">
        <BaseballLineup title={summary?.homeTeam?.name || 'Local'} rows={lineups?.home?.startXI} />
        <BaseballLineup title={summary?.awayTeam?.name || 'Visitante'} rows={lineups?.away?.startXI} />
      </div>
    )
  }

  const homeName = summary?.homeTeam?.name || 'Local'
  const awayName = summary?.awayTeam?.name || 'Visitante'

  return (
    <div className="ollin-lineups-tab" style={{ padding: '12px 8px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: '#4ecdc4', fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
          {homeName} — {lineups?.home?.formation || ''}
        </h3>
        <FormationPitch lineup={lineups?.home} side="home" />
      </div>
      <div>
        <h3 style={{ color: '#f0c030', fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
          {awayName} — {lineups?.away?.formation || ''}
        </h3>
        <FormationPitch lineup={lineups?.away} side="away" />
      </div>
    </div>
  )
}
