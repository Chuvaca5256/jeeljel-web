function FormationPitch({ lineup, side, teamName }) {
  const players = lineup?.startXI || []
  const formation = lineup?.formation || ''

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

  const VW = 400
  const VH = 560

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', maxWidth: '420px', display: 'block', margin: '0 auto' }}>
      {/* Campo */}
      <rect x="0" y="0" width={VW} height={VH} fill="#2d6a4f" />
      {/* Franjas */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={0} y={i * 70} width={VW} height={35} fill="rgba(0,0,0,0.06)" />
      ))}
      {/* Líneas campo */}
      <rect x="10" y="10" width={VW - 20} height={VH - 20} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      {/* Círculo central */}
      <circle cx={VW / 2} cy={VH / 2} r="50" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <circle cx={VW / 2} cy={VH / 2} r="3" fill="rgba(255,255,255,0.7)" />
      {/* Línea media */}
      <line x1="10" y1={VH / 2} x2={VW - 10} y2={VH / 2} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      {/* Área grande local (abajo) */}
      <rect x={VW * 0.2} y={VH - 10 - 100} width={VW * 0.6} height={100} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      {/* Área chica local */}
      <rect x={VW * 0.35} y={VH - 10 - 50} width={VW * 0.3} height={50} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      {/* Área grande visitante (arriba) */}
      <rect x={VW * 0.2} y="10" width={VW * 0.6} height={100} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      {/* Área chica visitante */}
      <rect x={VW * 0.35} y="10" width={VW * 0.3} height={50} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

      {/* Jugadores */}
      {players.map((p) => {
        if (!p.grid) return null
        const [row, col] = String(p.grid).split(':').map(Number)
        const totalRows = formation ? formation.split('-').length + 1 : 5
        const totalCols = 4

        let x, y
        if (side === 'home') {
          x = 20 + ((col - 1) / (totalCols - 1)) * (VW - 40)
          y = VH - 40 - ((row - 1) / (totalRows - 1)) * (VH - 80)
        } else {
          x = VW - 20 - ((col - 1) / (totalCols - 1)) * (VW - 40)
          y = 40 + ((row - 1) / (totalRows - 1)) * (VH - 80)
        }

        const apellido = (p.name || '').split(' ').pop().slice(0, 10)
        const isHome = side === 'home'

        return (
          <g key={p.id || p.number} transform={`translate(${x}, ${y})`}>
            <circle r="18" fill={isHome ? '#fff' : '#1a1a2e'} stroke={isHome ? '#4ecdc4' : '#f0c030'} strokeWidth="2" />
            <text textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill={isHome ? '#1a1a2e' : '#fff'}>
              {p.number}
            </text>
            <text y="26" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="600"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
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
        <FormationPitch lineup={lineups?.home} side="home" teamName={homeName} />
      </div>
      <div>
        <h3 style={{ color: '#f0c030', fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
          {awayName} — {lineups?.away?.formation || ''}
        </h3>
        <FormationPitch lineup={lineups?.away} side="away" teamName={awayName} />
      </div>
    </div>
  )
}
