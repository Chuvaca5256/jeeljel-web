/**
 * FootballFieldLive.jsx — CANCHA v3
 * SVG top-down, sin dependencias externas.
 * - Sin media luna
 * - Eventos con color por equipo (naranja=local, azul=visitante)
 * - Label: equipo + jugador + tipo en campo
 * - Posesión más prominente
 * - Todos los tipos de evento visibles
 */

import { useEffect, useState } from 'react'

/* ─── TIPO DE EVENTO ─────────────────────────────────────── */
function getEventKind(ev) {
  const label  = (ev.label  || '').toLowerCase()
  const type   = (ev.type   || '').toLowerCase()
  const detail = (ev.detail || '').toLowerCase()
  if (label.includes('gol') || type === 'goal' || detail.includes('goal'))               return 'goal'
  if (label.includes('roja') || detail.includes('red card'))                              return 'red'
  if (label.includes('amarilla') || detail.includes('yellow card'))                       return 'yellow'
  if (type === 'subst' || label.includes('cambio') || label.includes('sustituc'))        return 'subst'
  if (detail.includes('corner') || label.includes('corner') || label.includes('esquina')) return 'corner'
  if (detail.includes('penalty') || label.includes('penal'))                              return 'penalty'
  if (detail.includes('var'))                                                             return 'var'
  if (label.includes('falta') || type === 'foul' || detail.includes('foul'))             return 'foul'
  return 'other'
}

const KIND_META = {
  goal:    { icon: '⚽', label: 'GOL'     },
  red:     { icon: '🟥', label: 'ROJA'    },
  yellow:  { icon: '🟨', label: 'AMARILLA'},
  subst:   { icon: '🔄', label: 'CAMBIO'  },
  corner:  { icon: '🚩', label: 'CORNER'  },
  penalty: { icon: '🎯', label: 'PENAL'   },
  var:     { icon: '📺', label: 'VAR'     },
  foul:    { icon: '⚠️', label: 'FALTA'   },
  other:   { icon: '📌', label: 'EVENTO'  },
}

/* Colores por equipo */
const HOME_COLOR  = '#f97316'  // naranja
const HOME_BG     = 'rgba(249,115,22,0.18)'
const AWAY_COLOR  = '#38bdf8'  // azul
const AWAY_BG     = 'rgba(56,189,248,0.18)'

/* ─── ZONA EN EL CAMPO ──────────────────────────────────── */
// cx/cy en porcentaje del área interior del SVG
// Local ataca hacia la derecha, visitante hacia la izquierda
function eventZone(ev, isHome) {
  const kind = getEventKind(ev)
  // Semilla determinista basada en minuto para no moverse en re-renders
  const seed = (ev.minute || 0) * 7 + (ev.player || '').length * 3
  const jx   = (seed % 9) / 9        // 0-1 jitter horizontal
  const jy   = ((seed * 3) % 11) / 11 // 0-1 jitter vertical

  // Franjas verticales del campo (% de ancho):
  // 0-16: área propia local / 84-100: área propia visitante
  // 16-50: campo propio local / 50-84: campo propio visitante

  if (kind === 'goal') {
    return isHome
      ? [85 + jx * 8,  32 + jy * 36]   // gol local → área derecha
      : [7  + jx * 8,  32 + jy * 36]   // gol visitante → área izquierda
  }
  if (kind === 'penalty') {
    return isHome
      ? [89, 46 + jy * 8]
      : [11, 46 + jy * 8]
  }
  if (kind === 'corner') {
    // Esquinas reales del campo
    const corners = [[2,5],[2,95],[98,5],[98,95]]
    const c = corners[(seed) % 4]
    return [c[0], c[1]]
  }
  if (kind === 'yellow' || kind === 'red' || kind === 'foul') {
    return isHome
      ? [20 + jx * 35, 15 + jy * 70]
      : [45 + jx * 35, 15 + jy * 70]
  }
  if (kind === 'subst') {
    return isHome
      ? [15 + jx * 15, 10 + jy * 80]
      : [70 + jx * 15, 10 + jy * 80]
  }
  return [25 + jx * 50, 15 + jy * 70]
}

/* ─── LADO DEL EVENTO ───────────────────────────────────── */
function isHomeEvent(ev, summary) {
  if (ev.teamId && summary?.homeTeamId) {
    return String(ev.teamId) === String(summary.homeTeamId)
  }
  // Fallback: busca nombre del equipo local en el texto del evento
  const homeName = (summary?.homeTeam?.name || '').toLowerCase().split(' ')[0]
  const text = `${ev.label || ''} ${ev.player || ''} ${ev.detail || ''}`.toLowerCase()
  if (homeName && homeName.length > 2 && text.includes(homeName)) return true
  // Si no hay info → asumimos local para goles del primer equipo
  return (ev.minute || 0) % 2 === 0
}

function shortName(name = '') {
  if (!name) return ''
  const parts = name.trim().split(' ')
  return parts[parts.length - 1].slice(0, 11)
}

/* ══════════════════════════════════════════════════════════
   COMPONENTE
══════════════════════════════════════════════════════════ */
export default function FootballFieldLive({
  summary    = null,
  events     = [],
  lineups    = null,
  statistics = null,
}) {
  const homeTeam    = summary?.homeTeam?.name || 'Local'
  const awayTeam    = summary?.awayTeam?.name || 'Visitante'
  const elapsed     = summary?.elapsed ?? null
  const statusShort = summary?.statusShort || ''
  const isLive      = ['1H','2H','HT','ET','BT','P'].includes(statusShort)

  /* Posesión */
  const rawPossH = parseInt(summary?.miniStats?.possessionHome) ||
    parseInt((statistics?.items || []).find(i => /posesión|possession/i.test(i.label))?.home) || 50
  const possHome = Math.min(Math.max(rawPossH, 0), 100)
  const possAway = 100 - possHome

  const formation = {
    home: lineups?.home?.formation || null,
    away: lineups?.away?.formation || null,
  }

  /* Procesar eventos */
  const processed = events.map(ev => {
    const home = isHomeEvent(ev, summary)
    return {
      ...ev,
      kind:   getEventKind(ev),
      isHome: home,
      zone:   eventZone(ev, home),
      color:  home ? HOME_COLOR : AWAY_COLOR,
      bg:     home ? HOME_BG    : AWAY_BG,
      team:   home ? homeTeam   : awayTeam,
    }
  })

  const timelineEvs = [...processed].slice(-10)
  // En campo: todos los eventos excepto cambios (no tienen ubicación táctica relevante)
  const fieldEvs = processed.filter(ev => ev.kind !== 'subst')

  /* Evento activo ciclado — muestra apellido + equipo del jugador activo */
  const [activeDot, setActiveDot] = useState(null)
  useEffect(() => {
    if (!fieldEvs.length) { setActiveDot(null); return }
    let i = fieldEvs.length - 1  // empieza por el más reciente
    setActiveDot(i)
    const interval = setInterval(() => {
      i = (i + 1) % fieldEvs.length
      setActiveDot(i)
    }, 2800)
    return () => clearInterval(interval)
  }, [events.length]) // eslint-disable-line

  /* ── SVG viewBox ── */
  const VW = 420, VH = 260

  return (
    <div className="ollin-field2">

      {/* ══ TIMELINE ══════════════════════════════════════════ */}
      <div className="ollin-field2__timeline">
        <div className="ollin-field2__tl-scroll">
          {timelineEvs.length === 0 ? (
            <span className="ollin-field2__tl-empty">Sin eventos registrados</span>
          ) : (
            timelineEvs.map((ev, i) => {
              const meta = KIND_META[ev.kind]
              return (
                <div
                  key={i}
                  className="ollin-field2__tl-chip"
                  style={{ borderColor: ev.color, background: ev.bg }}
                >
                  <span className="ollin-field2__tl-icon">{meta.icon}</span>
                  <div className="ollin-field2__tl-info">
                    <span className="ollin-field2__tl-min" style={{ color: ev.color }}>
                      {ev.minute != null ? `${ev.minute}'` : '—'}
                    </span>
                    <span className="ollin-field2__tl-player">
                      {shortName(ev.player)}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
        {isLive && elapsed != null && (
          <div className="ollin-field2__elapsed">
            <span className="ollin-field2__elapsed-dot" />
            <span>{elapsed}'</span>
          </div>
        )}
      </div>

      {/* ══ CAMPO SVG ════════════════════════════════════════ */}
      <div className="ollin-field2__pitch-wrap">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="ollin-field2__svg"
          role="img"
          aria-label="Campo de fútbol en vivo"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="f2-stripes" x="0" y="0" width="30" height={VH} patternUnits="userSpaceOnUse">
              <rect x="0"    y="0" width="15" height={VH} fill="#1e6b43" />
              <rect x="15"   y="0" width="15" height={VH} fill="#1a5c3a" />
            </pattern>
            <filter id="f2-glow-home" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="f2-glow-away" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="f2-glow-goal" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="7" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Fondo */}
          <rect x="0" y="0" width={VW} height={VH} fill="#0d1b2a" />

          {/* ── ZONA DE POSESIÓN (sombreado proporcional) ── */}
          {/* Mitad local */}
          <rect x="14" y="8" width={(VW - 28) * (possHome / 100)} height={VH - 16}
            fill="rgba(249,115,22,0.07)" rx="3" />
          {/* Mitad visitante — rellena el resto */}
          <rect x={14 + (VW - 28) * (possHome / 100)} y="8"
            width={(VW - 28) * (possAway / 100)} height={VH - 16}
            fill="rgba(56,189,248,0.07)" rx="3" />

          {/* Césped */}
          <rect x="14" y="8" width={VW - 28} height={VH - 16} rx="3" fill="url(#f2-stripes)" />

          {/* Borde */}
          <rect x="14" y="8" width={VW - 28} height={VH - 16} rx="3"
            fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1.5" />

          {/* Línea de medio */}
          <line x1={VW/2} y1="8" x2={VW/2} y2={VH-8}
            stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />

          {/* Círculo central */}
          <circle cx={VW/2} cy={VH/2} r="34"
            fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
          <circle cx={VW/2} cy={VH/2} r="2.5" fill="rgba(255,255,255,0.8)" />

          {/* ── ÁREA LOCAL (izquierda) ── */}
          {/* Área grande */}
          <rect x="14" y={VH * 0.19} width={VW * 0.157} height={VH * 0.62}
            fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1" />
          {/* Área chica */}
          <rect x="14" y={VH * 0.365} width={VW * 0.054} height={VH * 0.27}
            fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
          {/* Punto penal */}
          <circle cx={VW * 0.109} cy={VH/2} r="2" fill="rgba(255,255,255,0.7)" />
          {/* SIN media luna */}

          {/* ── ÁREA VISITANTE (derecha) ── */}
          <rect x={VW - 14 - VW * 0.157} y={VH * 0.19} width={VW * 0.157} height={VH * 0.62}
            fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1" />
          <rect x={VW - 14 - VW * 0.054} y={VH * 0.365} width={VW * 0.054} height={VH * 0.27}
            fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
          <circle cx={VW * 0.891} cy={VH/2} r="2" fill="rgba(255,255,255,0.7)" />

          {/* ── PORTERÍAS ── */}
          <rect x="5" y={VH/2 - 15} width="9" height="30"
            fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" />
          <rect x={VW - 14} y={VH/2 - 15} width="9" height="30"
            fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" />

          {/* ── EVENTOS EN CAMPO ── */}
          {fieldEvs.map((ev, i) => {
            const meta     = KIND_META[ev.kind]
            const [cpx, cpy] = ev.zone
            // Convertir % de zona interior a coordenadas SVG
            const svgX = 14 + (cpx / 100) * (VW - 28)
            const svgY = 8  + (cpy / 100) * (VH - 16)
            const isActive = activeDot === i
            const isGoal   = ev.kind === 'goal'
            const r        = isGoal ? 12 : 9

            return (
              <g key={i} transform={`translate(${svgX},${svgY})`}>
                {/* Pulso animado */}
                {(isActive || isGoal) && (
                  <circle r={r + 6} fill={ev.color} opacity="0.13">
                    <animate attributeName="r"
                      values={`${r+2};${r+10};${r+2}`} dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity"
                      values="0.18;0.04;0.18" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Círculo del evento */}
                <circle r={r} fill={ev.bg} stroke={ev.color}
                  strokeWidth={isGoal ? 2.2 : 1.6}
                  filter={isGoal ? 'url(#f2-glow-goal)' : ev.isHome ? 'url(#f2-glow-home)' : 'url(#f2-glow-away)'}
                />

                {/* Ícono */}
                <text textAnchor="middle" dominantBaseline="central"
                  fontSize={isGoal ? 10 : 8}
                  style={{ userSelect: 'none', pointerEvents: 'none' }}>
                  {meta.icon}
                </text>

                {/* Minuto */}
                <text y={r + 8} textAnchor="middle"
                  fill={ev.color} fontSize="7" fontWeight="700"
                  fontFamily="Inter, Arial, sans-serif"
                  style={{ userSelect: 'none' }}>
                  {ev.minute != null ? `${ev.minute}'` : ''}
                </text>

                {/* Equipo (siempre visible en goles, en activo para el resto) */}
                {(isGoal || isActive) && (
                  <text y={r + 17} textAnchor="middle"
                    fill={ev.color} fontSize="6.5" fontWeight="600"
                    fontFamily="Inter, Arial, sans-serif"
                    style={{ userSelect: 'none' }}>
                    {ev.team.slice(0, 12)}
                  </text>
                )}

                {/* Jugador (solo activo o goles) */}
                {(isGoal || isActive) && ev.player && (
                  <text y={r + 26} textAnchor="middle"
                    fill="rgba(255,255,255,0.78)" fontSize="6.5"
                    fontFamily="Inter, Arial, sans-serif"
                    style={{ userSelect: 'none' }}>
                    {shortName(ev.player)}
                  </text>
                )}
              </g>
            )
          })}

          {/* ── FORMACIONES ── */}
          {formation.home && (
            <text x="20" y="20" fill="rgba(249,115,22,0.65)" fontSize="8"
              fontWeight="600" fontFamily="Inter, Arial, sans-serif">
              {formation.home}
            </text>
          )}
          {formation.away && (
            <text x={VW - 20} y="20" textAnchor="end"
              fill="rgba(56,189,248,0.65)" fontSize="8"
              fontWeight="600" fontFamily="Inter, Arial, sans-serif">
              {formation.away}
            </text>
          )}

          {/* ── NOMBRES DE EQUIPO ── */}
          <text x="20" y={VH - 10} fill="rgba(249,115,22,0.6)" fontSize="8"
            fontFamily="Inter, Arial, sans-serif" fontWeight="500">
            {homeTeam.slice(0, 14)}
          </text>
          <text x={VW - 20} y={VH - 10} textAnchor="end"
            fill="rgba(56,189,248,0.6)" fontSize="8"
            fontFamily="Inter, Arial, sans-serif" fontWeight="500">
            {awayTeam.slice(0, 14)}
          </text>
        </svg>
      </div>

      {/* ══ BARRA DE POSESIÓN ═══════════════════════════════ */}
      <div className="ollin-field2__possession">
        <div className="ollin-field2__poss-left">
          <span className="ollin-field2__poss-name ollin-field2__poss-name--home">{homeTeam}</span>
          <span className="ollin-field2__poss-pct--inline" style={{ color: HOME_COLOR }}>{possHome}%</span>
        </div>

        <div className="ollin-field2__poss-track">
          <div className="ollin-field2__poss-bar ollin-field2__poss-bar--home"
            style={{ width: `${possHome}%` }} />
          <div className="ollin-field2__poss-bar ollin-field2__poss-bar--away"
            style={{ width: `${possAway}%` }} />
        </div>

        <div className="ollin-field2__poss-right">
          <span className="ollin-field2__poss-pct--inline" style={{ color: AWAY_COLOR }}>{possAway}%</span>
          <span className="ollin-field2__poss-name ollin-field2__poss-name--away">{awayTeam}</span>
        </div>
      </div>

    </div>
  )
}
