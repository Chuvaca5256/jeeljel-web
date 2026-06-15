/**
 * FootballFieldLive.jsx — CANCHA-3D
 * Cancha isométrica con PixiJS (cargado vía CDN dinámico).
 * Props recibidos desde OllinPartido.jsx:
 *   summary    — datos del partido (possession, elapsed, equipos, etc.)
 *   events     — array de eventos [{minute, label, player, type, team}]
 *   lineups    — { home: { startXI, formation }, away: { startXI, formation } }
 *   statistics — { items: [{label, home, away}] }
 */

import { useEffect, useRef, useState } from 'react'

/* ─────────────────────────────────────────────────────────
   CONSTANTES DE DISEÑO
───────────────────────────────────────────────────────── */
const W = 700          // ancho canvas PixiJS
const H = 420          // alto canvas PixiJS
const PITCH_COLOR = 0x1a5c42
const PITCH_DARK  = 0x134832
const LINE_COLOR  = 0xffffff
const LINE_ALPHA  = 0.35

/* Convierte coordenadas de campo (0-1, 0-1) a canvas isométrico */
function fieldToIso(fx, fy) {
  // Cancha centrada en el canvas, con perspectiva isométrica suave
  const originX = W / 2
  const originY = H * 0.55
  const tileW   = W * 0.85
  const tileH   = H * 0.55

  const dx = (fx - 0.5) * tileW
  const dy = (fy - 0.5) * tileH

  return {
    x: originX + dx,
    y: originY + dy * 0.52 - dx * 0.18,
  }
}

/* Mapa pos → coordenada de campo [fx, fy] — vista desde local (izquierda) */
const POS_GRID = {
  G:  [0.06, 0.50],
  D:  [0.25, null],   // fy se distribuye entre defensas
  M:  [0.50, null],
  F:  [0.75, null],
}

function getPlayerPositions(startXI = []) {
  // Agrupa por línea según pos
  const groups = { G: [], D: [], M: [], F: [] }
  startXI.forEach(p => {
    const pos = p.pos || 'M'
    const key = groups[pos] !== undefined ? pos : 'M'
    groups[key].push(p)
  })

  const positions = []
  Object.entries(groups).forEach(([pos, players]) => {
    if (!players.length) return
    const [fx] = POS_GRID[pos] || [0.5, 0.5]
    players.forEach((p, i) => {
      const fy = players.length === 1
        ? 0.5
        : 0.15 + (0.70 / (players.length - 1)) * i
      positions.push({ ...p, fx, fy })
    })
  })
  return positions
}

/* ─────────────────────────────────────────────────────────
   DETECCIÓN DE TIPO DE EVENTO
───────────────────────────────────────────────────────── */
function eventIcon(ev) {
  const label = (ev.label || '').toLowerCase()
  if (label.includes('gol') || label.includes('⚽')) return '⚽'
  if (label.includes('roja') || label.includes('🟥')) return '🟥'
  if (label.includes('amarilla') || label.includes('🟨') || label.includes('falta')) return '🟨'
  if (label.includes('cambio') || label.includes('sustituc') || label.includes('🔄')) return '🔄'
  return '📌'
}

function eventColor(ev) {
  const icon = eventIcon(ev)
  if (icon === '⚽') return '#f97316'
  if (icon === '🟥') return '#ef4444'
  if (icon === '🟨') return '#facc15'
  if (icon === '🔄') return '#38bdf8'
  return '#a3a3a3'
}

/* ─────────────────────────────────────────────────────────
   CARGA DINÁMICA DE PIXI
───────────────────────────────────────────────────────── */
const PIXI_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.4.2/pixi.min.js'

function loadPixi() {
  return new Promise((resolve, reject) => {
    if (window.PIXI) { resolve(window.PIXI); return }
    const s = document.createElement('script')
    s.src = PIXI_CDN
    s.onload  = () => resolve(window.PIXI)
    s.onerror = reject
    document.head.appendChild(s)
  })
}

/* ─────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────── */
export default function FootballFieldLive({
  summary    = null,
  events     = [],
  lineups    = null,
  statistics = null,
}) {
  const mountRef  = useRef(null)
  const appRef    = useRef(null)
  const [pixiErr, setPixiErr] = useState(false)
  const [ready,   setReady]   = useState(false)

  /* Datos derivados */
  const elapsed        = summary?.elapsed ?? 0
  const possessionHome = parseInt(summary?.miniStats?.possessionHome) || 50
  const possessionAway = 100 - possessionHome
  const homeTeam       = summary?.homeTeam?.name || 'Local'
  const awayTeam       = summary?.awayTeam?.name || 'Visitante'
  const homeScore      = summary?.homeScore ?? 0
  const awayScore      = summary?.awayScore ?? 0
  const statusShort    = summary?.statusShort || ''
  const isLive         = ['1H', '2H', 'HT', 'ET', 'BT', 'P'].includes(statusShort)

  /* Alineaciones */
  const homeXI  = lineups?.home?.startXI || []
  const awayXI  = lineups?.away?.startXI || []
  const homePlayers = getPlayerPositions(homeXI)
  const awayPlayers = getPlayerPositions(awayXI).map(p => ({
    ...p, fx: 1 - p.fx, fy: 1 - p.fy,
  }))

  /* ─── PIXI SETUP ─── */
  useEffect(() => {
    let destroyed = false
    const container = mountRef.current
    if (!container) return

    loadPixi().then(PIXI => {
      if (destroyed) return

      /* Resolver ancho real del contenedor */
      const cw = Math.min(container.clientWidth || W, W)
      const scale = cw / W
      const ch = H * scale

      const app = new PIXI.Application({
        width:           cw,
        height:          ch,
        backgroundColor: 0x0a0f1a,
        antialias:       true,
        resolution:      window.devicePixelRatio || 1,
        autoDensity:     true,
      })

      container.innerHTML = ''
      container.appendChild(app.view)
      appRef.current = app

      /* ── Escalar todo con un contenedor maestro ── */
      const root = new PIXI.Container()
      root.scale.set(scale)
      app.stage.addChild(root)

      /* ── GRADIENTE CIELO (fondo) ── */
      const bg = new PIXI.Graphics()
      bg.beginFill(0x0d1b2a)
      bg.drawRect(0, 0, W, H)
      bg.endFill()
      root.addChild(bg)

      /* ══════════════════════════════════════════
         CANCHA ISOMÉTRICA
      ══════════════════════════════════════════ */
      const field = new PIXI.Graphics()

      /* Sombra difusa de la cancha */
      const shadow = new PIXI.Graphics()
      shadow.beginFill(0x000000, 0.3)
      const sc = [
        fieldToIso(0,0), fieldToIso(1,0), fieldToIso(1,1), fieldToIso(0,1)
      ]
      shadow.moveTo(sc[0].x+6, sc[0].y+8)
      sc.slice(1).forEach(p => shadow.lineTo(p.x+6, p.y+8))
      shadow.closePath()
      shadow.endFill()
      root.addChild(shadow)

      /* Franjas de césped alternadas */
      const STRIPES = 8
      for (let i = 0; i < STRIPES; i++) {
        const t0 = i / STRIPES
        const t1 = (i + 1) / STRIPES
        const color = i % 2 === 0 ? PITCH_COLOR : PITCH_DARK
        const stripe = new PIXI.Graphics()
        stripe.beginFill(color)
        const p0 = fieldToIso(0, t0), p1 = fieldToIso(1, t0)
        const p2 = fieldToIso(1, t1), p3 = fieldToIso(0, t1)
        stripe.moveTo(p0.x, p0.y)
        stripe.lineTo(p1.x, p1.y)
        stripe.lineTo(p2.x, p2.y)
        stripe.lineTo(p3.x, p3.y)
        stripe.closePath()
        stripe.endFill()
        root.addChild(stripe)
      }

      /* Función helper: línea en coordenadas de campo */
      const fLine = (fx1, fy1, fx2, fy2, alpha = LINE_ALPHA, width = 1.5) => {
        const a = fieldToIso(fx1, fy1)
        const b = fieldToIso(fx2, fy2)
        field.lineStyle(width, LINE_COLOR, alpha)
        field.moveTo(a.x, a.y)
        field.lineTo(b.x, b.y)
      }

      /* Función helper: polígono de campo */
      const fPoly = (pts, alpha = LINE_ALPHA) => {
        const mapped = pts.map(([x, y]) => fieldToIso(x, y))
        field.lineStyle(1.5, LINE_COLOR, alpha)
        field.moveTo(mapped[0].x, mapped[0].y)
        mapped.slice(1).forEach(p => field.lineTo(p.x, p.y))
        field.lineTo(mapped[0].x, mapped[0].y)
      }

      /* Borde exterior */
      fPoly([[0,0],[1,0],[1,1],[0,1]], 0.8)

      /* Línea de medio */
      fLine(0.5, 0, 0.5, 1, 0.5)

      /* Círculo central — aproximado con segmentos */
      const R = 0.12
      const segs = 40
      let firstPt = true
      for (let i = 0; i <= segs; i++) {
        const ang = (i / segs) * Math.PI * 2
        const fx = 0.5 + R * Math.cos(ang)
        const fy = 0.5 + R * Math.sin(ang) * 0.5
        const { x, y } = fieldToIso(fx, fy)
        if (firstPt) { field.moveTo(x, y); firstPt = false }
        else field.lineTo(x, y)
      }
      field.lineStyle(1.5, LINE_COLOR, LINE_ALPHA)

      /* Punto central */
      const center = fieldToIso(0.5, 0.5)
      field.beginFill(LINE_COLOR, 0.6)
      field.drawCircle(center.x, center.y, 2.5)
      field.endFill()

      /* Área grande local (izquierda) */
      fPoly([[0,0.2],[0.18,0.2],[0.18,0.8],[0,0.8]], 0.4)
      /* Área chica local */
      fPoly([[0,0.35],[0.07,0.35],[0.07,0.65],[0,0.65]], 0.3)

      /* Área grande visitante (derecha) */
      fPoly([[1,0.2],[0.82,0.2],[0.82,0.8],[1,0.8]], 0.4)
      /* Área chica visitante */
      fPoly([[1,0.35],[0.93,0.35],[0.93,0.65],[1,0.65]], 0.3)

      /* Portería local */
      fPoly([[0,0.41],[-0.025,0.41],[-0.025,0.59],[0,0.59]], 0.7)
      /* Portería visitante */
      fPoly([[1,0.41],[1.025,0.41],[1.025,0.59],[1,0.59]], 0.7)

      root.addChild(field)

      /* ══════════════════════════════════════════
         GRADAS (laterales) — rectángulos degradados
      ══════════════════════════════════════════ */
      const stands = new PIXI.Graphics()

      /* Lado inferior — degradado oscuro */
      const sA = fieldToIso(0, 1), sB = fieldToIso(1, 1)
      stands.beginFill(0x1e293b, 0.85)
      stands.moveTo(sA.x - 30, sA.y + 60)
      stands.lineTo(sB.x + 30, sB.y + 60)
      stands.lineTo(sB.x, sB.y)
      stands.lineTo(sA.x, sA.y)
      stands.closePath()
      stands.endFill()

      /* Rayas de asientos */
      for (let i = 0; i < 5; i++) {
        const t = i / 5
        const y0 = sA.y + 10 + t * 50
        stands.lineStyle(1, 0x334155, 0.5)
        stands.moveTo(sA.x - 30, y0)
        stands.lineTo(sB.x + 30, y0)
      }

      /* Lado superior */
      const sC = fieldToIso(0, 0), sD = fieldToIso(1, 0)
      stands.beginFill(0x1e293b, 0.70)
      stands.moveTo(sC.x - 20, sC.y - 45)
      stands.lineTo(sD.x + 20, sD.y - 45)
      stands.lineTo(sD.x, sD.y)
      stands.lineTo(sC.x, sC.y)
      stands.closePath()
      stands.endFill()

      root.addChild(stands)

      /* ══════════════════════════════════════════
         ZONA DE POSESIÓN ANIMADA
      ══════════════════════════════════════════ */
      const possGfx = new PIXI.Graphics()
      root.addChild(possGfx)

      const drawPossession = (pct) => {
        possGfx.clear()
        const side  = pct >= 50 ? 'home' : 'away'
        const color = side === 'home' ? 0xf97316 : 0x38bdf8
        const cx    = side === 'home' ? 0.30 : 0.70
        const rx    = 0.22, ry = 0.35
        const segsP = 40
        let fp = true
        for (let i = 0; i <= segsP; i++) {
          const ang = (i / segsP) * Math.PI * 2
          const fx = cx + rx * Math.cos(ang)
          const fy = 0.5 + ry * Math.sin(ang) * 0.55
          const { x, y } = fieldToIso(fx, fy)
          if (fp) { possGfx.moveTo(x, y); fp = false }
          else possGfx.lineTo(x, y)
        }
        possGfx.beginFill(color, 0.09)
        possGfx.lineStyle(1.5, color, 0.35)
        possGfx.closePath()
        possGfx.endFill()
      }

      drawPossession(possessionHome)

      /* ══════════════════════════════════════════
         BALÓN ANIMADO
      ══════════════════════════════════════════ */
      const ballContainer = new PIXI.Container()
      root.addChild(ballContainer)

      const ballGfx = new PIXI.Graphics()
      ballGfx.beginFill(0xffffff)
      ballGfx.drawCircle(0, 0, 7)
      ballGfx.endFill()
      ballGfx.lineStyle(2, 0x000000, 0.5)
      ballGfx.drawCircle(0, 0, 7)

      /* Hexágonos del balón */
      ;[0, 60, 120, 180, 240, 300].forEach(deg => {
        const r = 4.5
        const rad = (deg * Math.PI) / 180
        ballGfx.beginFill(0x222222, 0.4)
        ballGfx.drawCircle(r * Math.cos(rad), r * Math.sin(rad), 1.5)
        ballGfx.endFill()
      })

      ballContainer.addChild(ballGfx)

      /* Posición inicial del balón */
      const ballPos = { ...fieldToIso(0.5, 0.5) }
      let ballTargetFx = 0.5, ballTargetFy = 0.5

      ballContainer.x = ballPos.x
      ballContainer.y = ballPos.y

      /* ══════════════════════════════════════════
         JUGADORES
      ══════════════════════════════════════════ */
      const playersContainer = new PIXI.Container()
      root.addChild(playersContainer)

      const drawPlayers = (players, isHome) => {
        players.forEach(p => {
          const { x, y } = fieldToIso(p.fx, p.fy)
          const color = isHome ? 0xf97316 : 0x38bdf8

          /* Sombra jugador */
          const shadow2 = new PIXI.Graphics()
          shadow2.beginFill(0x000000, 0.3)
          shadow2.drawEllipse(x, y + 12, 8, 3)
          shadow2.endFill()
          playersContainer.addChild(shadow2)

          /* Círculo jugador */
          const dot = new PIXI.Graphics()
          dot.beginFill(color, 0.95)
          dot.drawCircle(x, y, 9)
          dot.endFill()
          dot.lineStyle(2, 0xffffff, 0.9)
          dot.drawCircle(x, y, 9)
          playersContainer.addChild(dot)

          /* Número */
          const numStyle = new PIXI.TextStyle({
            fontSize: 8,
            fill: '#ffffff',
            fontWeight: 'bold',
            fontFamily: 'Inter, Arial, sans-serif',
          })
          const numText = new PIXI.Text(String(p.number || ''), numStyle)
          numText.anchor.set(0.5)
          numText.x = x
          numText.y = y
          playersContainer.addChild(numText)

          /* Nombre debajo */
          const nameStyle = new PIXI.TextStyle({
            fontSize: 7,
            fill: '#e2e8f0',
            fontFamily: 'Inter, Arial, sans-serif',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 2,
            dropShadowDistance: 1,
          })
          const shortName = (p.name || '').split(' ').pop().slice(0, 10)
          const nameText  = new PIXI.Text(shortName, nameStyle)
          nameText.anchor.set(0.5, 0)
          nameText.x = x
          nameText.y = y + 12
          playersContainer.addChild(nameText)
        })
      }

      drawPlayers(homePlayers, true)
      drawPlayers(awayPlayers, false)

      /* ══════════════════════════════════════════
         EVENTOS FLOTANTES
      ══════════════════════════════════════════ */
      const eventsContainer = new PIXI.Container()
      root.addChild(eventsContainer)

      const floatingEvents = []

      const spawnEvent = (ev) => {
        const icon  = eventIcon(ev)
        const color = eventColor(ev)

        /* Posición aleatoria dentro del campo */
        const fx = 0.2 + Math.random() * 0.6
        const fy = 0.2 + Math.random() * 0.6
        const { x, y } = fieldToIso(fx, fy)

        const style = new PIXI.TextStyle({
          fontSize: 18,
          fill: color,
          fontFamily: 'Arial, sans-serif',
          dropShadow: true,
          dropShadowColor: '#000000',
          dropShadowBlur: 4,
          dropShadowDistance: 2,
        })
        const txt = new PIXI.Text(icon, style)
        txt.anchor.set(0.5)
        txt.x = x
        txt.y = y
        txt.alpha = 0

        /* Texto secundario con minuto y jugador */
        const subStyle = new PIXI.TextStyle({
          fontSize: 8,
          fill: '#ffffff',
          fontFamily: 'Inter, Arial, sans-serif',
          dropShadow: true,
          dropShadowColor: '#000000',
          dropShadowBlur: 3,
          dropShadowDistance: 1,
        })
        const label = `${ev.minute ? ev.minute + "'" : ''} ${(ev.player || '').split(' ').pop()}`.trim()
        const sub = new PIXI.Text(label, subStyle)
        sub.anchor.set(0.5, 0)
        sub.x = x
        sub.y = y + 14
        sub.alpha = 0

        eventsContainer.addChild(txt)
        eventsContainer.addChild(sub)

        floatingEvents.push({ txt, sub, life: 0, maxLife: 240, vy: -0.4 })
      }

      /* Mostrar eventos recientes al montar */
      const recentEvents = [...events].slice(-5)
      recentEvents.forEach((ev, i) => {
        setTimeout(() => { if (!destroyed) spawnEvent(ev) }, i * 600)
      })

      /* ══════════════════════════════════════════
         LOOP DE ANIMACIÓN
      ══════════════════════════════════════════ */
      let tick = 0

      app.ticker.add(() => {
        tick++

        /* Mover balón suavemente hacia el objetivo */
        const bCurrent = fieldToIso(
          ballTargetFx + 0.04 * Math.sin(tick * 0.018),
          ballTargetFy + 0.025 * Math.cos(tick * 0.024),
        )
        ballContainer.x += (bCurrent.x - ballContainer.x) * 0.04
        ballContainer.y += (bCurrent.y - ballContainer.y) * 0.04

        /* Rotar el balón */
        ballGfx.rotation += 0.02

        /* Pulso de posesión cada 90 ticks */
        if (tick % 90 === 0) {
          const nextFx = possessionHome >= 50
            ? 0.2 + Math.random() * 0.3
            : 0.5 + Math.random() * 0.3
          ballTargetFx = nextFx
          ballTargetFy = 0.2 + Math.random() * 0.6
          drawPossession(possessionHome)
        }

        /* Actualizar eventos flotantes */
        for (let i = floatingEvents.length - 1; i >= 0; i--) {
          const fe = floatingEvents[i]
          fe.life++
          fe.txt.y += fe.vy
          fe.sub.y += fe.vy

          if (fe.life < 20) {
            fe.txt.alpha = fe.life / 20
            fe.sub.alpha = fe.life / 20
          } else if (fe.life > fe.maxLife - 40) {
            fe.txt.alpha = (fe.maxLife - fe.life) / 40
            fe.sub.alpha = (fe.maxLife - fe.life) / 40
          } else {
            fe.txt.alpha = 1
            fe.sub.alpha = 0.85
          }

          if (fe.life >= fe.maxLife) {
            eventsContainer.removeChild(fe.txt)
            eventsContainer.removeChild(fe.sub)
            fe.txt.destroy()
            fe.sub.destroy()
            floatingEvents.splice(i, 1)
          }
        }
      })

      setReady(true)
    }).catch(() => setPixiErr(true))

    return () => {
      destroyed = true
      if (appRef.current) {
        try { appRef.current.destroy(true, { children: true }) } catch {}
        appRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])   // solo montar/desmontar — actualizaciones via DOM overlay

  /* ─────────────────────────────────────────────────────────
     TIMELINE SUPERIOR
  ───────────────────────────────────────────────────────── */
  const timelineEvents = [...events].slice(-12)

  /* ─────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────── */
  return (
    <div className="ollin-cancha3d">
      {/* ── TIMELINE HORIZONTAL ── */}
      <div className="ollin-cancha3d__timeline">
        <div className="ollin-cancha3d__timeline-inner">
          {timelineEvents.length === 0 ? (
            <span className="ollin-cancha3d__timeline-empty">Sin eventos aún</span>
          ) : (
            timelineEvents.map((ev, i) => (
              <div
                key={`tl-${i}`}
                className="ollin-cancha3d__tl-event"
                style={{ borderColor: eventColor(ev) }}
                title={`${ev.minute ? ev.minute + "'" : ''} ${ev.label} ${ev.player || ''}`.trim()}
              >
                <span className="ollin-cancha3d__tl-icon">{eventIcon(ev)}</span>
                <span className="ollin-cancha3d__tl-min" style={{ color: eventColor(ev) }}>
                  {ev.minute != null ? `${ev.minute}'` : '—'}
                </span>
                <span className="ollin-cancha3d__tl-player">
                  {(ev.player || '').split(' ').pop().slice(0, 10)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Indicador de minuto actual */}
        {isLive && elapsed > 0 && (
          <div className="ollin-cancha3d__elapsed">
            <span className="ollin-cancha3d__elapsed-dot" />
            {elapsed}'
          </div>
        )}
      </div>

      {/* ── CANVAS PIXI ── */}
      <div
        ref={mountRef}
        className="ollin-cancha3d__canvas"
        aria-label="Cancha de fútbol 3D en vivo"
      >
        {pixiErr && (
          <div className="ollin-cancha3d__fallback">
            <svg viewBox="0 0 400 240" className="ollin-field-svg" role="img" aria-label="Campo de fútbol">
              <rect width="400" height="240" fill="#134832" rx="6" />
              <line x1="200" y1="0" x2="200" y2="240" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <circle cx="200" cy="120" r="36" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <text x="200" y="126" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12">
                Vista simplificada
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* ── INDICADOR DE POSESIÓN ── */}
      <div className="ollin-cancha3d__possession">
        <span className="ollin-cancha3d__poss-team ollin-cancha3d__poss-team--home">
          {homeTeam}
        </span>
        <div className="ollin-cancha3d__poss-bar">
          <div
            className="ollin-cancha3d__poss-fill ollin-cancha3d__poss-fill--home"
            style={{ width: `${possessionHome}%` }}
          />
          <div
            className="ollin-cancha3d__poss-fill ollin-cancha3d__poss-fill--away"
            style={{ width: `${possessionAway}%` }}
          />
          <span className="ollin-cancha3d__poss-label ollin-cancha3d__poss-label--home">
            {possessionHome}%
          </span>
          <span className="ollin-cancha3d__poss-label ollin-cancha3d__poss-label--away">
            {possessionAway}%
          </span>
        </div>
        <span className="ollin-cancha3d__poss-team ollin-cancha3d__poss-team--away">
          {awayTeam}
        </span>
      </div>

      {/* ── LEYENDA FORMACIÓN ── */}
      {(lineups?.home?.formation || lineups?.away?.formation) && (
        <div className="ollin-cancha3d__formations">
          <span className="ollin-cancha3d__form-home">
            <span className="ollin-cancha3d__form-dot ollin-cancha3d__form-dot--home" />
            {homeTeam} {lineups?.home?.formation || ''}
          </span>
          <span className="ollin-cancha3d__form-away">
            {awayTeam} {lineups?.away?.formation || ''}
            <span className="ollin-cancha3d__form-dot ollin-cancha3d__form-dot--away" />
          </span>
        </div>
      )}
    </div>
  )
}
