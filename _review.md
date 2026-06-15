# Review dump — partido en vivo (frontend + backend emit)

Generado para análisis de flujo `ollin:partido:{id}`.

---

## 1. `src/hooks/usePartido.js` (completo)

```javascript
import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

async function fetchPartido(id) {
  const res = await fetch(`/api/ollin/fixtures/partido/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!data?.summary) throw new Error('Sin datos')
  return data
}

export default function usePartido(id) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)

  const loadPartido = useCallback(async () => {
    if (!id) {
      setError(true)
      setLoading(false)
      return
    }

    try {
      const payload = await fetchPartido(id)
      setData(payload)
      setError(false)
    } catch {
      setData(null)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    setLoading(true)
    loadPartido()

    let socket
    try {
      socket = io(window.location.origin, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
      })
      socket.on(`ollin:partido:${id}`, loadPartido)
      socket.on('ollin:update', loadPartido)
    } catch {
      /* Socket opcional */
    }

    return () => {
      socket?.off(`ollin:partido:${id}`, loadPartido)
      socket?.off('ollin:update', loadPartido)
      socket?.disconnect()
    }
  }, [id, loadPartido])

  return { loading, error, data, refresh: loadPartido }
}
```

---

## 2. `src/pages/OllinPartido.jsx` (completo)

```jsx
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import OllinLayout from '../components/ollin/OllinLayout'
import PartidoHeader from '../components/ollin/partido/PartidoHeader'
import PartidoSkeleton from '../components/ollin/partido/PartidoSkeleton'
import FootballFieldLive from '../components/ollin/partido/FootballFieldLive'
import BaseballDiamondLive from '../components/ollin/partido/BaseballDiamondLive'
import StatsTab from '../components/ollin/partido/StatsTab'
import PlayersTab from '../components/ollin/partido/PlayersTab'
import LineupsTab from '../components/ollin/partido/LineupsTab'
import H2HTab from '../components/ollin/partido/H2HTab'
import usePartido from '../hooks/usePartido'
import ChatPartido from '../components/ollin/partido/ChatPartido'
import { resolveSport } from '../ollin/partidoMock'
import mosaico from '../assets/mosaicos/Macuilxochitl.png'
import './OllinDeportes.css'

const PARTIDO_TABS = [
  { id: 'live', label: 'EN VIVO' },
  { id: 'stats', label: 'ESTADÍSTICAS' },
  { id: 'players', label: 'JUGADORES' },
  { id: 'lineups', label: 'ALINEACIONES' },
  { id: 'h2h', label: 'H2H' },
]

const BANNER_ITEMS = [
  {
    type: 'cta',
    text: '🤖 ¿Quieres picks con IA para este partido?',
    btnText: 'Probar Ikan Naat IA',
    url: 'https://ikannaat.jeeljel.com',
  },
]

function IkanNaatBanner() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    if (BANNER_ITEMS.length <= 1) return
    const t = setInterval(() => setCurrent(i => (i + 1) % BANNER_ITEMS.length), 5000)
    return () => clearInterval(t)
  }, [])
  const item = BANNER_ITEMS[current]
  return (
    <div className="ollin-banner-rotativo">
      {item.type === 'cta' && (
        <div className="ollin-banner-rotativo__cta">
          <span>{item.text}</span>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="ollin-banner-rotativo__btn">
            {item.btnText}
          </a>
        </div>
      )}
    </div>
  )
}

export default function OllinPartido() {
  const { id } = useParams()
  const { loading, error, data } = usePartido(id)
  const [activeTab, setActiveTab] = useState('live')

  useEffect(() => {
    document.body.classList.add('page-ollin-deportes')
    return () => document.body.classList.remove('page-ollin-deportes')
  }, [])

  const summary = data?.summary
  const sport = resolveSport(summary, data)

  const liveTabLabel = (() => {
    const s = summary?.statusShort || ''
    if (['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(s)) return 'RESUMEN'
    if (['1H', '2H', 'ET', 'BT', 'P', 'LIVE'].includes(s)) return 'EN VIVO'
    return 'PARTIDO'
  })()

  return (
    <OllinLayout pageTitle="Partido — Ollin Deportes">
      <div className="ollin-page">
        <div
          className="ollin-page__mosaic"
          style={{ backgroundImage: `url(${mosaico})` }}
          aria-hidden
        />

        <div className="ollin-partido-page">
          {loading && <PartidoSkeleton />}

          {!loading && error && (
            <div className="ollin-partido-unavailable">
              <h1>Partido no disponible</h1>
              <p>No pudimos cargar la información de este partido.</p>
              <Link to="/ollin-deportes" className="ollin-partido-back-btn">
                ← Volver a Ollin Deportes
              </Link>
            </div>
          )}

          {!loading && !error && data && (
            <>
              <PartidoHeader summary={summary} sport={sport} />

              <div className={`ollin-partido-layout${activeTab !== 'live' ? ' ollin-partido-layout--full' : ''}`}>
                {/* COLUMNA IZQUIERDA */}
                <div className="ollin-partido-main">
                  <div className="ollin-partido-tabs" role="tablist" aria-label="Detalle del partido">
                    {PARTIDO_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`ollin-partido-tabs__btn${activeTab === tab.id ? ' is-active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.id === 'live' ? liveTabLabel : tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="ollin-partido-panel" role="tabpanel">
                    {activeTab === 'live' && (sport === 'beisbol' ? (
                      <BaseballDiamondLive summary={summary} />
                    ) : (
                      <FootballFieldLive summary={summary} events={data.events} />
                    ))}
                    {activeTab === 'stats' && <StatsTab statistics={data.statistics} sport={sport} summary={summary} />}
                    {activeTab === 'players' && <PlayersTab players={data.players} sport={sport} summary={summary} />}
                    {activeTab === 'lineups' && <LineupsTab lineups={data.lineups} sport={sport} summary={summary} events={data.events} />}
                    {activeTab === 'h2h' && <H2HTab h2h={data.h2h} />}
                  </div>

                  {/* BANNER ROTATIVO IKAN NAAT */}
                  <div className="ollin-partido-banner">
                    <IkanNaatBanner />
                  </div>
                </div>

                {activeTab === 'live' && (
                  <div className="ollin-partido-sidebar">
                    <ChatPartido partidoId={id} summary={summary} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </OllinLayout>
  )
}
```

---

## 3. `src/components/ollin/partido/FootballFieldLive.jsx` (completo)

```jsx
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

  const timelineEvs = [...processed]
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
```

---

## 4. Backend — emit `ollin:partido:{id}` y cadena de polling (`ollin-backend/src/services/polling.js`)

Incluye: `attachSocketIO`, `pollLiveFixtureEvents` (emit), `runLiveCycle`, `runPollingCycle`, `scheduleNextCycle`, `startPolling`. Intervalos LIVE 15s / IDLE 180s.

```javascript
const config = require('../config/env')
const { KEYS, setJson, getJson, setMeta } = require('../lib/redis')
const { isPollingPaused, setPollingPaused, getRequestCount } = require('../lib/requestCounter')
const { FOOTBALL_LIVE_STATUSES } = require('../config/leagues')
const { footballClient, apiGet } = require('./apiClient')
const {
  pollFootballLive,
  pollFootballHoy,
  pollFootballProximos,
  TORNEO_SELECCIONES_LIGAS,
} = require('./footballPolling')
// const { pollBaseball, isBaseballLive } = require('./baseballPolling')
// Béisbol desactivado temporalmente — stub para rutas que aún importan isBaseballLive
function isBaseballLive(_game) {
  return false
}
const { fetchStandings } = require('./standingsService')
const { pollFootballPasados } = require('./pasadosService')

const LIVE_INTERVAL_MS = 15000
const IDLE_INTERVAL_MS = 180000

let pollingTimer = null
let standingsTimer = null
let pasadosTimer = null
let liveTransitionTimer = null
let ioRef = null
let currentIntervalMs = IDLE_INTERVAL_MS

function attachSocketIO(io) {
  ioRef = io
}

function eventsKey(fixtureId) {
  return `ollin:futbol:events:${fixtureId}`
}

function hasAnyLiveFixture(futbolLive, beisbolHoy) {
  const futbolActive =
    Array.isArray(futbolLive) &&
    futbolLive.some((f) => {
      const short = f?.fixture?.status?.short
      return short && FOOTBALL_LIVE_STATUSES.has(short)
    })
  // const beisbolActive =
  //   Array.isArray(beisbolHoy) && beisbolHoy.some((g) => isBaseballLive(g))
  return futbolActive // || beisbolActive
}

function computeDeportesActivos(futbolLive, futbolHoy, beisbolHoy) {
  const activos = []
  const hasFutbol =
    (Array.isArray(futbolLive) && futbolLive.length > 0) ||
    (Array.isArray(futbolHoy) && futbolHoy.length > 0)
  const hasBeisbol = Array.isArray(beisbolHoy) && beisbolHoy.length > 0
  if (hasFutbol) activos.push('futbol')
  // if (hasBeisbol) activos.push('beisbol')
  return activos
}

async function emitUpdate(deporte, tipo, data) {
  if (!ioRef) return
  ioRef.emit('ollin:update', { deporte, tipo, data, at: new Date().toISOString() })
}

async function pollLiveFixtureEvents(redis, liveFixtures, ttl) {
  if (!Array.isArray(liveFixtures) || liveFixtures.length === 0) return

  for (const fixture of liveFixtures) {
    const fixtureId = fixture?.fixture?.id
    if (!fixtureId) continue

    const result = await apiGet(
      footballClient,
      '/fixtures/events',
      { fixture: fixtureId },
      redis
    )

    if (!result.ok) {
      console.warn(`[ollin][polling] Events falló fixture=${fixtureId}`)
      continue
    }

    await setJson(eventsKey(fixtureId), result.data, ttl)

    if (ioRef) {
      ioRef.emit(`ollin:partido:${fixtureId}`, {
        events: result.data,
        at: new Date().toISOString(),
      })
    }
  }
}

(redis) {
  for (const ligaId of TORNEO_SELECCIONES_LIGAS) {
    try {
      await fetchStandings(ligaId, redis)
    } catch (err) {
      console.warn(`[ollin][polling] Standings falló liga=${ligaId}:`, err.message)
    }
  }
}

async function runLiveCycle(redis, ttl) {
  console.log('[ollin][polling] Modo LIVE — live + events')

  const football = await pollFootballLive(redis)
  if (football.live !== null) {
    await setJson(KEYS.futbolLive, football.live, ttl)
    await emitUpdate('futbol', 'live', football.live)
    await pollLiveFixtureEvents(redis, football.live, ttl)
  } else {
    console.warn('[ollin][polling] Fútbol live sin actualizar — conservando caché')
  }

  // const baseball = await pollBaseball(redis)
  // if (baseball.hoy !== null) {
  //   await setJson(KEYS.beisbolHoy, baseball.hoy, ttl)
  //   await emitUpdate('beisbol', 'hoy', baseball.hoy)
  // }
}

async function runIdleCycle(redis, ttl) {
  // Verificar live primero
  const football = await pollFootballLive(redis)
  if (football.live !== null && football.live.length > 0) {
    await setJson(KEYS.futbolLive, football.live, ttl)
    await emitUpdate('futbol', 'live', football.live)
    return true // hay live — el ciclo siguiente será LIVE
  }

  console.log('[ollin][polling] Modo IDLE — hoy + próximos')

  const proximos = await pollFootballProximos(redis)
  if (proximos.proximos !== null) {
    await setJson(KEYS.futbolProximos, proximos.proximos, ttl)
    await emitUpdate('futbol', 'proximos', proximos.proximos)
  }

  // pollStandingsBatch removido del ciclo idle — se ejecuta en timer de 6h (startPolling)

  pollFootballHoy(redis)
    .then((hoy) => {
      if (hoy && hoy.hoy !== null) return setJson(KEYS.futbolHoy, hoy.hoy, ttl)
    })
    .catch((err) => console.warn('[ollin][polling] pollFootballHoy idle falló:', err.message))

  return false
}

async function detectLiveTransition(redis, ttl) {
  const football = await pollFootballLive(redis)
  if (football.live !== null) {
    await setJson(KEYS.futbolLive, football.live, ttl)
  }

  // const baseball = await pollBaseball(redis)
  // if (baseball.hoy !== null) {
  //   await setJson(KEYS.beisbolHoy, baseball.hoy, ttl)
  // }
}

function scheduleNextCycle(redis, intervalMs) {
  if (pollingTimer) clearTimeout(pollingTimer)
  currentIntervalMs = intervalMs
  console.log(`[ollin][polling] Intervalo: ${intervalMs}ms`)
  pollingTimer = setTimeout(() => {
    runPollingCycle(redis).catch((err) => {
      console.error('[ollin][polling] Error en ciclo:', err.message)
      scheduleNextCycle(redis, currentIntervalMs)
    })
  }, intervalMs)
}

async function runPollingCycle(redis) {
  const pause = await isPollingPaused(redis)
  if (pause.paused) {
    console.warn(
      `[ollin][polling] Pausado (${pause.reason}) — requests hoy: ${pause.count}/${config.apiDailyLimit}`
    )
    scheduleNextCycle(redis, IDLE_INTERVAL_MS)
    return
  }

  const countBefore = await getRequestCount(redis)
  if (countBefore >= config.apiDailyPauseAt) {
    console.warn(
      `[ollin][polling] Ciclo omitido — ${countBefore} requests hoy, límite pausa en ${config.apiDailyPauseAt}`
    )
    await setPollingPaused(redis, true)
    scheduleNextCycle(redis, IDLE_INTERVAL_MS)
    return
  }

  console.log('[ollin][polling] Iniciando ciclo…')
  const ttl = config.cacheTtlMs
  const now = new Date().toISOString()

  const cachedLive = (await getJson(KEYS.futbolLive, [])) || []
  const cachedBeisbol = (await getJson(KEYS.beisbolHoy, [])) || []
  const cachedHoy = (await getJson(KEYS.futbolHoy, [])) || []
  const wasLive = hasAnyLiveFixture(cachedLive, cachedBeisbol)

  let idleFoundLive = false

  if (wasLive) {
    await runLiveCycle(redis, ttl)
  } else {
    idleFoundLive = await runIdleCycle(redis, ttl)
    // detectLiveTransition removido del ciclo normal — se ejecuta en timer de 10min (startPolling)
  }

  const liveAfter = (await getJson(KEYS.futbolLive, [])) || []
  const beisbolAfter = (await getJson(KEYS.beisbolHoy, [])) || []
  const nowLive = hasAnyLiveFixture(liveAfter, beisbolAfter)

  // Transición live→idle: uno o más partidos acaban de terminar — refrescar "hoy"
  if (wasLive && !nowLive) {
    console.log('[ollin][polling] Transición live→idle — refrescando futbolHoy + pasados')
    const hoy = await pollFootballHoy(redis)
    if (hoy.hoy !== null) {
      await setJson(KEYS.futbolHoy, hoy.hoy, ttl)
      await emitUpdate('futbol', 'hoy', hoy.hoy)
    }
    pollFootballPasados(redis).catch((err) =>
      console.warn('[ollin][polling] pollFootballPasados post-live falló:', err.message)
    )
  }

  const hoyAfter = (await getJson(KEYS.futbolHoy, [])) || []
  const deportesActivos = computeDeportesActivos(liveAfter, hoyAfter, beisbolAfter)
  await setMeta(now, deportesActivos)

  const countAfter = await getRequestCount(redis)
  const nextLive = idleFoundLive || hasAnyLiveFixture(liveAfter, beisbolAfter)
  const nextInterval = nextLive ? LIVE_INTERVAL_MS : IDLE_INTERVAL_MS

  console.log(
    `[ollin][polling] Ciclo OK — modo ${nextLive ? 'LIVE' : 'IDLE'} — requests hoy: ${countAfter}/${config.apiDailyLimit}`
  )

  if (countAfter >= config.apiDailyPauseAt) {
    await setPollingPaused(redis, true)
    console.warn('[ollin][polling] Límite diario alcanzado — pausado hasta mañana')
  }

  scheduleNextCycle(redis, nextInterval)
}

function startPolling(redis) {
  if (pollingTimer) clearTimeout(pollingTimer)
  if (standingsTimer) clearInterval(standingsTimer)
  if (pasadosTimer) clearInterval(pasadosTimer)
  if (liveTransitionTimer) clearInterval(liveTransitionTimer)

  // Poblar futbolHoy inmediatamente al arrancar
  const ttl = config.cacheTtlMs
  pollFootballHoy(redis)
    .then((hoy) => {
      if (hoy.hoy !== null) return setJson(KEYS.futbolHoy, hoy.hoy, ttl)
    })
    .catch((err) => console.warn('[ollin][polling] pollFootballHoy inicial falló:', err.message))

  pollFootballProximos(redis)
    .then((proximos) => {
      if (proximos !== null && proximos.proximos !== null) return setJson(KEYS.futbolProximos, proximos.proximos, ttl)
    })
    .catch((err) => console.warn('[ollin][polling] pollFootballProximos inicial falló:', err.message))

  // Pasados: llamada inmediata al arrancar + cada 6 horas
  pollFootballPasados(redis).catch((err) => {
    console.warn('[ollin][polling] pollFootballPasados inicial falló:', err.message)
  })
  pasadosTimer = setInterval(() => {
    pollFootballPasados(redis).catch((err) => {
      console.warn('[ollin][polling] pollFootballPasados falló:', err.message)
    })
  }, 6 * 60 * 60 * 1000)

  runPollingCycle(redis).catch((err) => {
    console.error('[ollin][polling] Error en ciclo inicial:', err.message)
    scheduleNextCycle(redis, IDLE_INTERVAL_MS)
  })

  // Standings: actualizar cada 6 horas (independiente del ciclo de polling)
  standingsTimer = setInterval(() => {
    console.log('[ollin][polling] Timer standings — actualizando cada 6h')
    pollStandingsBatch(redis).catch((err) => {
      console.warn('[ollin][polling] Standings batch falló:', err.message)
    })
  }, 6 * 60 * 60 * 1000)

  // Detección de transición live: verificar cada 10 minutos, solo si no hay partidos en vivo
  liveTransitionTimer = setInterval(async () => {
    try {
      const cachedLive = (await getJson(KEYS.futbolLive, [])) || []
      const cachedBeisbol = (await getJson(KEYS.beisbolHoy, [])) || []
      if (hasAnyLiveFixture(cachedLive, cachedBeisbol)) return
      const ttl = config.cacheTtlMs
      await detectLiveTransition(redis, ttl)
    } catch (err) {
      console.warn('[ollin][polling] detectLiveTransition falló:', err.message)
    }
  }, 10 * 60 * 1000)
}
```

**Notas:**
- `usePartido.js` ignora el payload del socket y re-fetch HTTP vía `loadPartido()`.
- El evento socket lleva `{ events, at }`; el GET partido usa caché Redis distinta (`partidoKey`).
