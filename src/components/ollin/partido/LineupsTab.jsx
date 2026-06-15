// ─── LineupsTab.jsx ────────────────────────────────────────────────────────
// Diseño: campo vertical por equipo + iconos de evento sobre cada jugador + banca

function normalizeForMatch(name = '') {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function buildPlayerEventMap(events = [], teamId) {
  if (teamId == null) return {}
  const teamIdStr = String(teamId)
  const map = {}
  events
    .filter((ev) => String(ev.teamId) === teamIdStr)
    .forEach((ev) => {
      const key = normalizeForMatch(ev.player || '')
      if (!key) return
      if (!map[key]) map[key] = []
      const t = (ev.type || '').toLowerCase()
      const d = (ev.detail || '').toLowerCase()
      if (t === 'goal') {
        if (d.includes('own')) map[key].push({ icon: '⚽', label: 'Autogol', minute: ev.minute })
        else if (d.includes('penalty')) map[key].push({ icon: '⚽', label: 'Pen', minute: ev.minute })
        else map[key].push({ icon: '⚽', label: 'Gol', minute: ev.minute })
      } else if (t === 'card') {
        if (d.includes('red')) map[key].push({ icon: '🟥', label: 'Roja', minute: ev.minute })
        else map[key].push({ icon: '🟨', label: 'Amarilla', minute: ev.minute })
      } else if (t === 'subst') {
        map[key].push({ icon: '🔴', label: 'Sale', minute: ev.minute })
        const inKey = normalizeForMatch(ev.assist || '')
        if (inKey) {
          if (!map[inKey]) map[inKey] = []
          map[inKey].push({ icon: '🟢', label: 'Entra', minute: ev.minute })
        }
      }
      if (t === 'goal' && ev.assist) {
        const aKey = normalizeForMatch(ev.assist)
        if (aKey) {
          if (!map[aKey]) map[aKey] = []
          map[aKey].push({ icon: '🅰️', label: 'Asistencia', minute: ev.minute })
        }
      }
    })
  return map
}

function EventBadges({ badges }) {
  if (!badges || badges.length === 0) return null
  return (
    <span style={{ display: 'inline-flex', gap: '2px', marginLeft: '4px', flexWrap: 'wrap' }}>
      {badges.map((b, i) => (
        <span
          key={i}
          title={`${b.label}${b.minute != null ? ` ${b.minute}'` : ''}`}
          style={{ fontSize: '10px', lineHeight: 1, cursor: 'default' }}
        >
          {b.icon}
          {b.minute != null && (
            <sup style={{ fontSize: '8px', color: '#aaa' }}>{b.minute}'</sup>
          )}
        </span>
      ))}
    </span>
  )
}

function FormationPitch({ lineup, side, eventMap }) {
  const players = lineup?.startXI || []
  const subs = lineup?.substitutes || []
  const formation = lineup?.formation || ''

  if (players.length === 0) {
    return <p className="ollin-partido-empty">Sin alineación disponible</p>
  }

  const hasGrid = players.some((p) => p.grid)

  if (!hasGrid) {
    return (
      <div style={{ padding: '0 8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px', color: '#aaa', fontWeight: 600, width: '36px' }}>#</th>
              <th style={{ textAlign: 'left', padding: '6px 8px', color: '#aaa', fontWeight: 600 }}>Jugador</th>
              <th style={{ textAlign: 'right', padding: '6px 8px', color: '#aaa', fontWeight: 600, width: '36px' }}>Pos</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => {
              const badges = eventMap[normalizeForMatch(p.name)] || []
              return (
                <tr key={p.id || p.number} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                  <td style={{ padding: '7px 8px', color: '#f0c030', fontWeight: 700 }}>{p.number ?? '—'}</td>
                  <td style={{ padding: '7px 8px', color: '#fff' }}>
                    {p.name}<EventBadges badges={badges} />
                  </td>
                  <td style={{ padding: '7px 8px', color: '#aaa', textAlign: 'right' }}>{p.pos}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {subs.length > 0 && (
          <>
            <p style={{ color: '#aaa', fontSize: '0.78rem', fontWeight: 600, padding: '4px 8px 2px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '4px' }}>BANCA</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <tbody>
                {subs.map((p) => {
                  const badges = eventMap[normalizeForMatch(p.name)] || []
                  return (
                    <tr key={p.id || p.number} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.015)' }}>
                      <td style={{ padding: '5px 8px', color: '#f0c030', fontWeight: 700, width: '36px' }}>{p.number ?? '—'}</td>
                      <td style={{ padding: '5px 8px', color: '#c0c0c0' }}>
                        {p.name}<EventBadges badges={badges} />
                      </td>
                      <td style={{ padding: '5px 8px', color: '#666', textAlign: 'right', width: '36px' }}>{p.pos}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    )
  }

  const VW = 300
  const VH = 420
  const PAD = 16
  const isHome = side === 'home'

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
    <div>
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', maxWidth: '340px', display: 'block', margin: '0 auto' }}>
        <rect x="0" y="0" width={VW} height={VH} fill="#2d6a4f" rx="6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={PAD} y={PAD + i * ((VH - PAD * 2) / 6)} width={VW - PAD * 2} height={(VH - PAD * 2) / 12} fill="rgba(0,0,0,0.07)" />
        ))}
        <rect x={PAD} y={PAD} width={VW - PAD * 2} height={VH - PAD * 2} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        <line x1={PAD} y1={VH / 2} x2={VW - PAD} y2={VH / 2} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <circle cx={VW / 2} cy={VH / 2} r="30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <rect x={VW * 0.25} y={VH - PAD - 60} width={VW * 0.5} height={60} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <rect x={VW * 0.25} y={PAD} width={VW * 0.5} height={60} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        {positioned.map((p) => {
          const apellido = (p.name || '').split(' ').pop().slice(0, 9)
          const badges = eventMap[normalizeForMatch(p.name)] || []
          const shown = badges.slice(0, 3)
          return (
            <g key={p.id || p.number} transform={`translate(${p.cx}, ${p.cy})`}>
              {shown.map((b, bi) => {
                const offsetX = shown.length === 1 ? 0 : (bi - (shown.length - 1) / 2) * 13
                return (
                  <text key={bi} x={offsetX} y="-20" textAnchor="middle" fontSize="11">
                    {b.icon}
                  </text>
                )
              })}
              {shown.length > 0 && shown[0].minute != null && (
                <text x={0} y="-9" textAnchor="middle" fontSize="7" fill="#f0c030" fontWeight="700">
                  {shown[0].minute}'
                </text>
              )}
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

      {subs.length > 0 && (
        <div style={{ marginTop: '10px', padding: '0 8px' }}>
          <p style={{ color: '#aaa', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
            BANCA
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <tbody>
              {subs.map((p) => {
                const badges = eventMap[normalizeForMatch(p.name)] || []
                return (
                  <tr key={p.id || p.number} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '4px 6px', color: '#f0c030', fontWeight: 700, width: '32px' }}>{p.number ?? '—'}</td>
                    <td style={{ padding: '4px 6px', color: '#c0c0c0' }}>
                      {p.name}<EventBadges badges={badges} />
                    </td>
                    <td style={{ padding: '4px 6px', color: '#666', textAlign: 'right', width: '32px' }}>{p.pos}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function LineupsTab({ lineups, sport, summary, events = [] }) {
  if (sport !== 'futbol') {
    return <p className="ollin-partido-empty">Alineaciones no disponibles para este deporte</p>
  }

  const home = lineups?.home
  const away = lineups?.away

  if (!home && !away) {
    return <p className="ollin-partido-empty">Alineaciones no disponibles aún</p>
  }

  const homeTeamId = summary?.homeTeamId ?? summary?.homeTeam?.id ?? home?.team?.id ?? null
  const awayTeamId = summary?.awayTeamId ?? summary?.awayTeam?.id ?? away?.team?.id ?? null

  const homeEventMap = buildPlayerEventMap(events, homeTeamId)
  const awayEventMap = buildPlayerEventMap(events, awayTeamId)

  const homeName = summary?.homeTeam?.name || home?.team?.name || 'Local'
  const awayName = summary?.awayTeam?.name || away?.team?.name || 'Visitante'
  const homeFormation = home?.formation || ''
  const awayFormation = away?.formation || ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
      {home && (
        <div>
          <p style={{ textAlign: 'center', color: '#4ecdc4', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>
            {homeName}{homeFormation ? ` — ${homeFormation}` : ''}
          </p>
          <FormationPitch lineup={home} side="home" eventMap={homeEventMap} />
        </div>
      )}
      {away && (
        <div>
          <p style={{ textAlign: 'center', color: '#f0c030', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>
            {awayName}{awayFormation ? ` — ${awayFormation}` : ''}
          </p>
          <FormationPitch lineup={away} side="away" eventMap={awayEventMap} />
        </div>
      )}
    </div>
  )
}
