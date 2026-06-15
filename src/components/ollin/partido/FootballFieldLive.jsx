/**
 * FootballFieldLive.jsx — CANCHA-3D v2
 * Vista cenital (top-down) estilo Sofascore/WhoScored.
 * SVG puro, sin dependencias externas.
 *
 * Props:
 *   summary    — datos del partido
 *   events     — [{minute, label, type, detail, teamId, player}]
 *   lineups    — { home: { startXI, formation }, away: { startXI, formation } }
 *   statistics — { items: [{label, home, away}] }
 */

import { useEffect, useRef, useState } from 'react'

/* ─── HELPERS DE TIPO DE EVENTO ─────────────────────────── */
function getEventKind(ev) {
  const label  = (ev.label  || '').toLowerCase()
  const type   = (ev.type   || '').toLowerCase()
  const detail = (ev.detail || '').toLowerCase()
  if (label.includes('gol') || type === 'goal' || detail.includes('goal'))          return 'goal'
  if (label.includes('roja') || detail.includes('red'))                              return 'red'
  if (label.includes('amarilla') || label.includes('falta') || detail.includes('yellow')) return 'yellow'
  if (type === 'subst' || label.includes('cambio') || label.includes('sustituc'))   return 'subst'
  if (detail.includes('var'))                                                        return 'var'
  return 'other'
}

const KIND_META = {
  goal:   { icon: '⚽', color: '#f97316', bg: 'rgba(249,115,22,0.15)', label: 'GOL'       },
  red:    { icon: '🟥', color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  label: 'TARJETA'   },
  yellow: { icon: '🟨', color: '#facc15', bg: 'rgba(250,204,21,0.12)', label: 'AMARILLA'  },
  subst:  { icon: '🔄', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', label: 'CAMBIO'    },
  var:    { icon: '📺', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', label: 'VAR'      },
  other:  { icon: '📌', color: '#94a3b8', bg: 'rgba(148,163,184,0.10)', label: 'EVENTO'   },
}

/* ─── ZONA DEL CAMPO POR TIPO (vista desde local = izquierda) ── */
// Devuelve [cx%, cy%] dentro del SVG 0-100
function eventZone(ev, isHome) {
  const kind = getEventKind(ev)
  const rand = (min, max) => min + ((ev.minute || 50) % 7) / 6 * (max - min)

  if (kind === 'goal') {
    // Goles en el área contraria
    return isHome
      ? [rand(82, 92), rand(35, 65)]   // local ataca derecha
      : [rand(8,  18), rand(35, 65)]   // visitante ataca izquierda
  }
  if (kind === 'yellow' || kind === 'red') {
    return isHome
      ? [rand(30, 70), rand(20, 80)]
      : [rand(30, 70), rand(20, 80)]
  }
  if (kind === 'subst') {
    return isHome
      ? [rand(15, 40), rand(15, 85)]
      : [rand(60, 85), rand(15, 85)]
  }
  return [rand(25, 75), rand(25, 75)]
}

/* ─── DETERMINISMO: qué lado es home para los eventos ──────── */
function isHomeEvent(ev, summary) {
  // Si el evento tiene teamId, lo comparamos con el homeTeam
  if (ev.teamId && summary?.homeTeamId) {
    return String(ev.teamId) === String(summary.homeTeamId)
  }
  // Fallback: buscar nombre del equipo en el label/player
  const home = (summary?.homeTeam?.name || '').toLowerCase()
  const text  = `${ev.label || ''} ${ev.player || ''}`.toLowerCase()
  if (home && text.includes(home.split(' ')[0])) return true
  // Goles locales se marcan con el primer equipo por defecto
  return true
}

/* ─── FORMATEO DE NOMBRES ───────────────────────────────────── */
function shortName(name = '') {
  const parts = name.trim().split(' ')
  return parts[parts.length - 1] || name
}

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════ */
export default function FootballFieldLive({
  summary    = null,
  events     = [],
  lineups    = null,
  statistics = null,
}) {
  /* ─── Datos derivados ─── */
  const homeTeam  = summary?.homeTeam?.name  || 'Local'
  const awayTeam  = summary?.awayTeam?.name  || 'Visitante'
  const elapsed   = summary?.elapsed ?? null
  const statusShort = summary?.statusShort || ''
  const isLive    = ['1H','2H','HT','ET','BT','P'].includes(statusShort)

  const rawPossH  = parseInt(summary?.miniStats?.possessionHome) ||
                    parseInt((statistics?.items || []).find(i => /posesión|possession/i.test(i.label))?.home) ||
                    50
  const possHome  = Math.min(Math.max(rawPossH, 0), 100)
  const possAway  = 100 - possHome

  const formation = {
    home: lineups?.home?.formation || null,
    away: lineups?.away?.formation || null,
  }

  /* ─── Eventos procesados ─── */
  const processedEvents = events.map(ev => ({
    ...ev,
    kind:    getEventKind(ev),
    isHome:  isHomeEvent(ev, summary),
    zone:    eventZone(ev, isHomeEvent(ev, summary)),
  }))

  /* Últimos 10 para timeline, todos para el campo */
  const timelineEvs = [...processedEvents].slice(-10)
  const fieldEvs    = processedEvents.filter(ev => ev.kind !== 'subst') // cambios no van al campo

  /* ─── Animación de puntos de campo ─── */
  const [activeDot, setActiveDot] = useState(null)
  useEffect(() => {
    if (!fieldEvs.length) return
    let i = 0
    const cycle = () => {
      setActiveDot(i % fieldEvs.length)
      i++
    }
    cycle()
    const interval = setInterval(cycle, 2800)
    return () => clearInterval(interval)
  }, [events.length]) // eslint-disable-line

  /* ══════════════════════════════════════════════════════════
     SVG CANCHA — vista cenital (top-down)
  ══════════════════════════════════════════════════════════ */
  // Cancha: 105 × 68 metros, escalada a SVG viewBox 420 × 272
  const VW = 420, VH = 272

  const px = (pct) => (pct / 100) * VW   // porcentaje → SVG x
  const py = (pct) => (pct / 100) * VH   // porcentaje → SVG y

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
                  style={{ borderColor: meta.color, background: meta.bg }}
                >
                  <span className="ollin-field2__tl-icon">{meta.icon}</span>
                  <div className="ollin-field2__tl-info">
                    <span className="ollin-field2__tl-min" style={{ color: meta.color }}>
                      {ev.minute != null ? `${ev.minute}'` : '—'}
                    </span>
                    <span className="ollin-field2__tl-player">
                      {shortName(ev.player || '')}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Minuto actual */}
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
          aria-label="Campo de fútbol — vista en vivo"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Franjas de césped */}
            <pattern id="ollin-stripes" x="0" y="0" width="35" height={VH} patternUnits="userSpaceOnUse">
              <rect x="0"  y="0" width="17.5" height={VH} fill="#1e6b43" />
              <rect x="17.5" y="0" width="17.5" height={VH} fill="#1a5c3a" />
            </pattern>

            {/* Glow naranja para eventos locales */}
            <filter id="glow-home" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-away" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-goal" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Fondo exterior */}
          <rect x="0" y="0" width={VW} height={VH} fill="#0d1b2a" />

          {/* Franjas césped */}
          <rect x="14" y="10" width={VW-28} height={VH-20} rx="3" fill="url(#ollin-stripes)" />

          {/* Borde del campo */}
          <rect x="14" y="10" width={VW-28} height={VH-20} rx="3"
            fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />

          {/* Línea de medio campo */}
          <line x1={VW/2} y1="10" x2={VW/2} y2={VH-10}
            stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />

          {/* Círculo central */}
          <circle cx={VW/2} cy={VH/2} r="36"
            fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
          <circle cx={VW/2} cy={VH/2} r="2.5"
            fill="rgba(255,255,255,0.8)" />

          {/* ── ÁREA GRANDE LOCAL (izquierda) ── */}
          <rect x="14" y={py(19.1)} width={px(16.6)} height={py(61.8)}
            fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1" />
          {/* Área chica local */}
          <rect x="14" y={py(36.8)} width={px(5.5)} height={py(26.5)}
            fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
          {/* Punto penal local */}
          <circle cx={px(11)} cy={VH/2} r="2" fill="rgba(255,255,255,0.7)" />
          {/* Arco de área local */}
          <path
            d={`M ${px(16.6)} ${VH/2 - 20} A 36 36 0 0 1 ${px(16.6)} ${VH/2 + 20}`}
            fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"
          />

          {/* ── ÁREA GRANDE VISITANTE (derecha) ── */}
          <rect x={VW - 14 - px(16.6)} y={py(19.1)} width={px(16.6)} height={py(61.8)}
            fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1" />
          {/* Área chica visitante */}
          <rect x={VW - 14 - px(5.5)} y={py(36.8)} width={px(5.5)} height={py(26.5)}
            fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
          {/* Punto penal visitante */}
          <circle cx={px(89)} cy={VH/2} r="2" fill="rgba(255,255,255,0.7)" />
          {/* Arco de área visitante */}
          <path
            d={`M ${VW - 14 - px(16.6)} ${VH/2 - 20} A 36 36 0 0 0 ${VW - 14 - px(16.6)} ${VH/2 + 20}`}
            fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"
          />

          {/* ── PORTERÍAS ── */}
          {/* Local */}
          <rect x="6" y={VH/2 - 16} width="8" height="32"
            fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" />
          {/* Visitante */}
          <rect x={VW-14} y={VH/2 - 16} width="8" height="32"
            fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" />

          {/* ── ZONA DE POSESIÓN ── */}
          {possHome !== 50 && (
            <rect
              x="14" y="10"
              width={(VW - 28) * (possHome / 100)}
              height={VH - 20}
              fill={possHome >= 50 ? 'rgba(249,115,22,0.06)' : 'rgba(56,189,248,0.06)'}
              rx="3"
            />
          )}

          {/* ── EVENTOS EN CAMPO ── */}
          {fieldEvs.map((ev, i) => {
            const meta   = KIND_META[ev.kind]
            const [cx, cy] = ev.zone
            const svgX   = 14 + (cx / 100) * (VW - 28)
            const svgY   = 10 + (cy / 100) * (VH - 20)
            const isActive = activeDot === i
            const isGoal   = ev.kind === 'goal'

            return (
              <g key={i} transform={`translate(${svgX}, ${svgY})`}>
                {/* Halo pulsante para el activo o goles */}
                {(isActive || isGoal) && (
                  <circle r={isGoal ? 18 : 14} fill={meta.color} opacity="0.12">
                    <animate
                      attributeName="r"
                      values={isGoal ? "12;22;12" : "10;18;10"}
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.15;0.04;0.15"
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Círculo base */}
                <circle
                  r={isGoal ? 11 : 9}
                  fill={meta.bg}
                  stroke={meta.color}
                  strokeWidth={isGoal ? 2 : 1.5}
                  filter={isGoal ? 'url(#glow-goal)' : undefined}
                />

                {/* Ícono del evento */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isGoal ? 10 : 8}
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  {meta.icon}
                </text>

                {/* Minuto */}
                <text
                  y={isGoal ? 18 : 16}
                  textAnchor="middle"
                  fill={meta.color}
                  fontSize="7"
                  fontWeight="700"
                  fontFamily="Inter, Arial, sans-serif"
                  style={{ userSelect: 'none' }}
                >
                  {ev.minute != null ? `${ev.minute}'` : ''}
                </text>

                {/* Apellido del jugador (solo activo) */}
                {isActive && ev.player && (
                  <text
                    y={isGoal ? 28 : 26}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.75)"
                    fontSize="6.5"
                    fontFamily="Inter, Arial, sans-serif"
                    style={{ userSelect: 'none' }}
                  >
                    {shortName(ev.player).slice(0, 10)}
                  </text>
                )}
              </g>
            )
          })}

          {/* ── FORMACIONES (texto esquinas) ── */}
          {formation.home && (
            <text x="22" y="22" fill="rgba(249,115,22,0.7)" fontSize="8"
              fontWeight="600" fontFamily="Inter, Arial, sans-serif">
              {formation.home}
            </text>
          )}
          {formation.away && (
            <text x={VW - 22} y="22" textAnchor="end"
              fill="rgba(56,189,248,0.7)" fontSize="8"
              fontWeight="600" fontFamily="Inter, Arial, sans-serif">
              {formation.away}
            </text>
          )}

          {/* ── ETIQUETAS DE EQUIPO ── */}
          <text x="22" y={VH - 14} fill="rgba(249,115,22,0.55)" fontSize="7.5"
            fontFamily="Inter, Arial, sans-serif" fontWeight="500">
            {homeTeam.slice(0, 14)}
          </text>
          <text x={VW - 22} y={VH - 14} textAnchor="end"
            fill="rgba(56,189,248,0.55)" fontSize="7.5"
            fontFamily="Inter, Arial, sans-serif" fontWeight="500">
            {awayTeam.slice(0, 14)}
          </text>
        </svg>
      </div>

      {/* ══ POSESIÓN ══════════════════════════════════════════ */}
      <div className="ollin-field2__possession">
        <span className="ollin-field2__poss-name ollin-field2__poss-name--home">
          {homeTeam}
        </span>

        <div className="ollin-field2__poss-track">
          <div
            className="ollin-field2__poss-bar ollin-field2__poss-bar--home"
            style={{ width: `${possHome}%` }}
          />
          <div
            className="ollin-field2__poss-bar ollin-field2__poss-bar--away"
            style={{ width: `${possAway}%` }}
          />
          <span className="ollin-field2__poss-pct ollin-field2__poss-pct--home">
            {possHome}%
          </span>
          <span className="ollin-field2__poss-pct ollin-field2__poss-pct--away">
            {possAway}%
          </span>
        </div>

        <span className="ollin-field2__poss-name ollin-field2__poss-name--away">
          {awayTeam}
        </span>
      </div>

    </div>
  )
}
