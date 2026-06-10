function gridToPosition(grid, formation) {
  if (!grid) return null
  const [row, col] = String(grid).split(':').map(Number)
  if (!row || !col) return null
  const rows = formation ? parseInt(String(formation).split('-')[0], 10) + 1 : 5
  const x = 10 + ((col - 1) / 3) * 80
  const y = 85 - ((row - 1) / Math.max(rows, 4)) * 70
  return { x, y }
}

function FormationPitch({ lineup, side }) {
  const players = lineup?.startXI || []
  const formation = lineup?.formation || '4-3-3'

  if (players.length === 0) {
    return <p className="ollin-partido-empty">Sin alineación disponible</p>
  }

  const hasGrid = players.some((p) => p.grid)

  if (!hasGrid) {
    return (
      <ol className="ollin-lineup-list">
        {players.map((p) => (
          <li key={p.id || p.number}>
            <span className="ollin-lineup-list__num">{p.number ?? '—'}</span>
            <span>{p.name}</span>
            <span className="ollin-lineup-list__pos">{p.pos}</span>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <svg viewBox="0 0 100 100" className="ollin-formation-svg" role="img" aria-label={`Formación ${formation}`}>
      <rect x="2" y="2" width="96" height="96" rx="4" fill="rgba(26,92,66,0.5)" stroke="#4ecdc4" strokeWidth="0.5" />
      {players.map((p) => {
        const pos = gridToPosition(p.grid, formation) || { x: 50, y: 50 }
        const flipX = side === 'away' ? 100 - pos.x : pos.x
        return (
          <g key={p.id || p.number} transform={`translate(${flipX}, ${pos.y})`}>
            <circle r="4" fill={side === 'home' ? '#4ecdc4' : '#f0c030'} />
            <text y="8" textAnchor="middle" fontSize="3" fill="#fff">
              {p.number}
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

  return (
    <div className="ollin-lineups-tab">
      <div className="ollin-lineup-block">
        <h3>
          {summary?.homeTeam?.name} — {lineups?.home?.formation || 'Formación'}
        </h3>
        <FormationPitch lineup={lineups?.home} side="home" />
      </div>
      <div className="ollin-lineup-block">
        <h3>
          {summary?.awayTeam?.name} — {lineups?.away?.formation || 'Formación'}
        </h3>
        <FormationPitch lineup={lineups?.away} side="away" />
      </div>
    </div>
  )
}
