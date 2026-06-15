/**
 * FootballFieldLive.jsx — CANCHA v3
 * SVG top-down, sin dependencias externas.
 * - Sin media luna
 * - Eventos con color por equipo (naranja=local, azul=visitante)
 * - Label: equipo + jugador + tipo en campo
 * - Posesión más prominente
 * - Todos los tipos de evento visibles
 */

import { useEffect, useRef, useState } from 'react'
import useTickerEvents from '../../../hooks/useTickerEvents'
import LiveTicker from './LiveTicker'

/* ─── TIPO DE EVENTO ─────────────────────────────────────── */
function getEventKind(ev) {
  const label  = (ev.label  || '').toLowerCase()
  const type   = (ev.type   || '').toLowerCase()
  const detail = (ev.detail || '').toLowerCase()

  if (label.includes('gol') || type === 'goal' || detail.includes('goal'))                return 'goal'
  if (label.includes('propia') || detail.includes('own goal'))                            return 'goal'
  if (detail.includes('red card') || label.includes('roja'))                              return 'red'
  if (detail.includes('yellow card') || label.includes('amarilla'))                       return 'yellow'
  if (type === 'subst' || label.includes('cambio') || label.includes('sustituc'))        return 'subst'
  if (detail.includes('corner') || label.includes('corner') || label.includes('esquina')) return 'corner'
  if (detail.includes('penalty') || label.includes('penal'))                              return 'penalty'
  if (detail.includes('shot on target') || label.includes('tiro a puerta'))              return 'shot'
  if (detail.includes('free kick') || label.includes('tiro libre'))                      return 'freekick'
  if (detail.includes('throw in') || label.includes('saque de banda'))                   return 'throwin'
  if (type === 'foul' || detail.includes('foul') || label.includes('falta'))             return 'foul'
  if (detail.includes('injury') || label.includes('lesión') || label.includes('lesion')) return 'injury'
  if (detail.includes('var') || label.includes('var'))                                    return 'var'
  if (detail.includes('drink') || detail.includes('hydration') || label.includes('hidrat')) return 'hydration'
  if (detail.includes('delay') || detail.includes('suspended') ||
      detail.includes('lightning') || detail.includes('rain') ||
      detail.includes('pitch invasion') || label.includes('detenido'))                   return 'stoppage'
  if (detail.includes('added time') || label.includes('tiempo agregado'))                return 'addedtime'
  return 'other'
}

const KIND_META = {
  goal:      { icon: '⚽', label: 'GOL'         },
  red:       { icon: '🟥', label: 'ROJA'        },
  yellow:    { icon: '🟨', label: 'AMARILLA'    },
  subst:     { icon: '🔄', label: 'CAMBIO'      },
  corner:    { icon: '🚩', label: 'CORNER'      },
  penalty:   { icon: '🎯', label: 'PENAL'       },
  var:       { icon: '📺', label: 'VAR'         },
  foul:      { icon: '⚠️', label: 'FALTA'       },
  shot:      { icon: '🥅', label: 'TIRO'        },
  freekick:  { icon: '🎯', label: 'TIRO LIBRE'  },
  throwin:   { icon: '🤚', label: 'BANDA'       },
  injury:    { icon: '🚑', label: 'LESIÓN'      },
  hydration: { icon: '💧', label: 'HIDRATACIÓN' },
  stoppage:  { icon: '⏸️', label: 'DETENIDO'    },
  addedtime: { icon: '⏱️', label: 'T. EXTRA'    },
  other:     { icon: '⏳', label: 'EVENTO'      },
}

/* Íconos broadcast — eventos sintéticos del ticker (stats diff) */
const TICKER_STAT_ICONS = {
  'Corner Kicks':      '🚩',
  'Shots on Goal':     '🎯',
  'Fouls':             '🛑',
  'Goalkeeper Saves':  '🧤',
  'Shots off Goal':    '💨',
  'Total Shots':       '💨',
  'Blocked Shots':     '🛡️',
  'Shots insidebox':   '⚡',
  'Total passes':      '👟',
  'Passes':            '👟',
}

const TICKER_TYPE_ICONS = {
  corner:    '🚩',
  shot:      '🎯',
  shot_off:  '💨',
  foul:      '🛑',
  blocked:   '🛡️',
  insidebox: '⚡',
  pass:      '👟',
}

const OFFICIAL_EVENT_ICONS = {
  goal:    '⚽',
  yellow:  '🟨',
  red:     '🟥',
  subst:   '🚑',
  injury:  '🚑',
}

const OFFICIAL_TYPE_ICONS = {
  Goal:         '⚽',
  'Yellow Card': '🟨',
  'Red Card':    '🟥',
  subst:         '🚑',
  Card:          '🟨',
}

const BROADCAST_DURATION_MS = 8000
const FREQUENT_TOAST_MS = 3000

function tickerBroadcastIcon(ev) {
  if (!ev) return '📺'
  if (ev.kind && OFFICIAL_EVENT_ICONS[ev.kind]) return OFFICIAL_EVENT_ICONS[ev.kind]
  const rawType = ev.type || ''
  if (OFFICIAL_TYPE_ICONS[rawType]) return OFFICIAL_TYPE_ICONS[rawType]
  const typeLower = rawType.toLowerCase()
  if (typeLower === 'goal') return OFFICIAL_EVENT_ICONS.goal
  if (typeLower === 'subst') return OFFICIAL_EVENT_ICONS.subst
  if (typeLower === 'card') {
    const detail = (ev.detail || ev.label || '').toLowerCase()
    if (detail.includes('red')) return OFFICIAL_EVENT_ICONS.red
    return OFFICIAL_EVENT_ICONS.yellow
  }
  if (TICKER_TYPE_ICONS[ev.type]) return TICKER_TYPE_ICONS[ev.type]
  const label = (ev.label || '').toLowerCase()
  if (label.includes('esquina') || label.includes('corner')) return TICKER_STAT_ICONS['Corner Kicks']
  if (label.includes('bloquead') || label.includes('blocked')) return TICKER_STAT_ICONS['Blocked Shots']
  if (label.includes('área') || label.includes('area') || label.includes('inside')) return TICKER_STAT_ICONS['Shots insidebox']
  if (label.includes('pase') || label.includes('pass')) return TICKER_STAT_ICONS['Total passes']
  if (label.includes('puerta') || label.includes('on goal')) return TICKER_STAT_ICONS['Shots on Goal']
  if (label.includes('fuera') || label.includes('off goal')) return TICKER_STAT_ICONS['Shots off Goal']
  if (label.includes('falta') || label.includes('foul')) return TICKER_STAT_ICONS['Fouls']
  if (label.includes('parad') || label.includes('save')) return TICKER_STAT_ICONS['Goalkeeper Saves']
  if (label.includes('gol') || label.includes('goal')) return OFFICIAL_EVENT_ICONS.goal
  if (label.includes('roja') || label.includes('red card')) return OFFICIAL_EVENT_ICONS.red
  if (label.includes('amarilla') || label.includes('yellow')) return OFFICIAL_EVENT_ICONS.yellow
  if (label.includes('lesión') || label.includes('lesion') || label.includes('injury')) return OFFICIAL_EVENT_ICONS.injury
  return ev.icon || '📺'
}

function broadcastLabel(ev) {
  if (!ev) return 'Evento'
  if (ev.isOfficial && ev.kind === 'goal') return 'GOL'
  if (ev.label) return ev.label.replace(/\s*[⚽🟨🟥🔄🚩🎯🥅🤚🚑📺💧⚠️⏱️⏸️⏳🛡️⚡👟🛑🧤💨]+\s*$/u, '').trim() || ev.label
  return ev.type || 'Evento'
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
  const jx = (seed % 9) / 9
  const jy = ((seed * 13 + (ev.minute || 0) * 31) % 97) / 97

  // Franjas verticales del campo (% de ancho):
  // 0-16: área propia local / 84-100: área propia visitante
  // 16-50: campo propio local / 50-84: campo propio visitante

  if (kind === 'goal') {
    return isHome
      ? [83 + jx * 10, 20 + jy * 60]
      : [7  + jx * 10, 20 + jy * 60]
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
  players    = null,
  partidoId  = null,
}) {
  const homeTeam    = summary?.homeTeam?.name || 'Local'
  const awayTeam    = summary?.awayTeam?.name || 'Visitante'
  const elapsed     = summary?.elapsed ?? null
  const statusShort = summary?.statusShort || ''
  const isLive      = ['1H','2H','HT','ET','BT','P'].includes(statusShort)
  const tickerEvent = useTickerEvents(isLive ? partidoId : null)
  const [officialBurst, setOfficialBurst] = useState(null)
  const [frequentToast, setFrequentToast] = useState(null)
  const prevEventsLenRef = useRef(events.length)

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
  const [activeDot, setActiveDot] = useState(null)

  const [statEvents, setStatEvents] = useState([])

  useEffect(() => {
    if (!statistics || !summary?.elapsed) return
    const elapsed = summary.elapsed
    const h = statistics.home || {}
    const a = statistics.away || {}
    const evs = []

    const add = (key, label, side) => {
      const val = side === 'home' ? h[key] : a[key]
      if (val && Number(val) > 0) {
        evs.push({
          minute: elapsed,
          type: key,
          detail: key,
          label,
          player: null,
          assist: null,
          teamId: side === 'home' ? summary?.homeTeam?.id : summary?.awayTeam?.id,
          _synthetic: true,
          _side: side,
        })
      }
    }

    add('Shots on Goal',  'TIRO A PUERTA 🥅', 'home')
    add('Shots on Goal',  'TIRO A PUERTA 🥅', 'away')
    add('Corner Kicks',   'CORNER 🚩',         'home')
    add('Corner Kicks',   'CORNER 🚩',         'away')
    add('Total Shots',    'TIRO TOTAL 👟',      'home')
    add('Total Shots',    'TIRO TOTAL 👟',      'away')
    add('Fouls',          'FALTA 🟨',           'home')
    add('Fouls',          'FALTA 🟨',           'away')

    setStatEvents(evs)
  }, [statistics, summary?.elapsed]) // eslint-disable-line

  /* Toast sutil — pases y stats frecuentes del ticker */
  useEffect(() => {
    if (!tickerEvent?.isFrequent) {
      setFrequentToast(null)
      return undefined
    }
    setFrequentToast(tickerEvent)
    const t = setTimeout(() => setFrequentToast(null), FREQUENT_TOAST_MS)
    return () => clearTimeout(t)
  }, [tickerEvent])

  /* Overlay central — goles y tarjetas oficiales nuevos */
  useEffect(() => {
    if (events.length <= prevEventsLenRef.current) {
      prevEventsLenRef.current = events.length
      return undefined
    }

    const latest = events[events.length - 1]
    prevEventsLenRef.current = events.length
    if (!latest) return undefined

    const kind = getEventKind(latest)
    if (!['goal', 'yellow', 'red'].includes(kind)) return undefined

    const home = isHomeEvent(latest, summary)
    setOfficialBurst({
      elapsed: latest.minute ?? elapsed,
      label: broadcastLabel({ ...latest, kind }),
      team: home ? homeTeam : awayTeam,
      player: latest.player || null,
      type: latest.type,
      detail: latest.detail,
      kind,
      isOfficial: true,
    })

    const t = setTimeout(() => setOfficialBurst(null), BROADCAST_DURATION_MS)
    return () => clearTimeout(t)
  }, [events, events.length, summary, homeTeam, awayTeam, elapsed])

  const centralBroadcast = officialBurst
    || (tickerEvent && !tickerEvent.isFrequent ? tickerEvent : null)

  const allEvents = [...events, ...statEvents]
  const processed = allEvents.map(ev => {
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

  const timelineEvs = [...processed]
  // En campo: todos los eventos excepto cambios (no tienen ubicación táctica relevante)
  const fieldEvs = processed.filter(ev => ev.kind !== 'subst')
  const visibleFieldEvs = fieldEvs.filter((ev, i) => i === activeDot)

  /* Evento activo ciclado — muestra apellido + equipo del jugador activo */
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

      <LiveTicker event={tickerEvent} />

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
      <div className="ollin-field2__pitch-wrap relative">
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
          {visibleFieldEvs.map((ev, i) => {
            const meta     = KIND_META[ev.kind]
            const [cpx, cpy] = ev.zone
            // Convertir % de zona interior a coordenadas SVG
            const svgX = 14 + (cpx / 100) * (VW - 28)
            const svgY = 8  + (cpy / 100) * (VH - 16)
            const isActive = ev.kind !== 'goal'
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

        {centralBroadcast && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div
              className="animate-pulse flex flex-col items-center gap-2 rounded-2xl border border-white/25 bg-black/55 px-10 py-7 text-center text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md"
              role="status"
              aria-live="polite"
            >
              {centralBroadcast.elapsed != null && centralBroadcast.elapsed !== '—' && (
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  {centralBroadcast.elapsed}&apos;
                </span>
              )}
              <span className="animate-bounce text-5xl leading-none" aria-hidden="true">
                {tickerBroadcastIcon(centralBroadcast)}
              </span>
              <span className="text-lg font-bold uppercase tracking-wide">
                {broadcastLabel(centralBroadcast)}
              </span>
              {centralBroadcast.team && (
                <span className="text-sm font-medium text-white/85">
                  {centralBroadcast.team}
                </span>
              )}
              {centralBroadcast.player && (
                <span className="text-sm text-white/75">
                  {shortName(centralBroadcast.player)}
                </span>
              )}
            </div>
          </div>
        )}

        {frequentToast && (
          <div
            className="absolute bottom-2 right-2 z-40 flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 text-xs text-white animate-pulse pointer-events-none"
            role="status"
            aria-live="polite"
          >
            <span>{tickerBroadcastIcon(frequentToast)}</span>
            <span>{frequentToast.label || 'Pase'}</span>
            {frequentToast.team && (
              <span className="text-white/70">· {frequentToast.team}</span>
            )}
          </div>
        )}
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
