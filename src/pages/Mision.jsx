import { useEffect, useRef, useState, useCallback } from 'react'
import { animate, stagger } from 'animejs'
import mosaico from '../assets/mosaicos/Tlaloc.png'

const countries = [
  { code: 'mx', name: 'México', url: 'https://www.google.com/search?q=m%C3%A9xico' },
  { code: 'ar', name: 'Argentina', url: 'https://www.google.com/search?q=Argentina' },
  { code: 'co', name: 'Colombia', url: 'https://www.google.com/search?q=colombia' },
  { code: 'cl', name: 'Chile', url: 'https://www.google.com/search?q=Chile' },
  { code: 'pe', name: 'Perú', url: 'https://www.google.com/search?q=Peru' },
  { code: 've', name: 'Venezuela', url: 'https://www.google.com/search?q=Venezuela' },
  { code: 'ec', name: 'Ecuador', url: 'https://www.google.com/search?q=Ecuador' },
  { code: 'bo', name: 'Bolivia', url: 'https://www.google.com/search?q=Bolivia' },
  { code: 'py', name: 'Paraguay', url: 'https://www.google.com/search?q=Paraguay' },
  { code: 'uy', name: 'Uruguay', url: 'https://www.google.com/search?q=Uruguay' },
  { code: 'gt', name: 'Guatemala', url: 'https://www.google.com/search?q=Guatemala' },
  { code: 'hn', name: 'Honduras', url: 'https://www.google.com/search?q=Honduras' },
  { code: 'sv', name: 'El Salvador', url: 'https://www.google.com/search?q=El+Salvador' },
  { code: 'cu', name: 'Cuba', url: 'https://www.google.com/search?q=Cuba' },
  { code: 'do', name: 'República Dominicana', url: 'https://www.google.com/search?q=Republica+Dominicana' },
  { code: 'pr', name: 'Puerto Rico', url: 'https://www.google.com/search?q=Puerto+Rico' },
  { code: 'pa', name: 'Panamá', url: 'https://www.google.com/search?q=Panama' },
  { code: 'cr', name: 'Costa Rica', url: 'https://www.google.com/search?q=Costa+Rica' },
  { code: 'ni', name: 'Nicaragua', url: 'https://www.google.com/search?q=Nicaragua' },
  { code: 'br', name: 'Brasil', url: 'https://www.google.com/search?q=Brasil' },
]

const PILARES = [
  {
    num: '01',
    titulo: 'Demostrar',
    tagline: 'La tecnología latinoamericana compite al más alto nivel global.',
    desc: 'Durante décadas se asumió que lo tecnológico de calidad venía de afuera. JeelJel existe para romper ese mito con hechos: plataformas bien diseñadas, bien construidas y pensadas desde adentro. Cada línea de código es una respuesta a quienes creyeron que no podíamos.',
  },
  {
    num: '02',
    titulo: 'Unir',
    tagline: 'Un ecosistema que conecta a todos los países latinoamericanos sin fronteras.',
    desc: 'Latinoamérica comparte idioma, historia y cultura, pero rara vez construye junta. JeelJel es el puente digital que cambia eso. No buscamos competir entre nosotros — buscamos sumar. El talento latino no tiene frontera, y tampoco debería tenerla nuestra tecnología.',
  },
  {
    num: '03',
    titulo: 'Empoderar',
    tagline: 'Herramientas para que cada creador latinoamericano construya su propio imperio.',
    desc: 'El emprendedor latino tiene ideas, tiene hambre y tiene creatividad. Lo que le ha faltado son las herramientas correctas a su alcance. JeelJel Kaanab construye esas herramientas — no para Silicon Valley, sino para el fundador que opera desde cualquier rincón de Latinoamérica.',
  },
]

const STATS = [
  { target: 5, label: 'Plataformas', suffix: '' },
  { target: 18, label: 'Países hermanos', suffix: '' },
  { target: 30, label: 'Agentes IA', suffix: '+' },
]

const TOTAL = 5

const S = {
  slider: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  },
  slide: (visible) => ({
    position: 'absolute',
    inset: 0,
    display: visible ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px 40px',
    textAlign: 'center',
    overflowY: 'auto',
    zIndex: 1,
  }),
  header: {
    position: 'absolute',
    top: '80px',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#4ecdc4',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginBottom: '10px',
    fontFamily: "'Cinzel', serif",
    marginTop: 0,
  },
  headerSub: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.45)',
    margin: 0,
  },
  sceneNav: {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },
  sceneDots: {
    display: 'flex',
    gap: '10px',
  },
  eyebrow: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: '#00e5a0',
    marginBottom: '20px',
    opacity: 0,
  },
  titleTurquesa: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: 'clamp(22px, 4vw, 40px)',
    color: '#4ecdc4',
    letterSpacing: '2px',
    lineHeight: 1.25,
    margin: 0,
  },
  titleBlanco: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: 'clamp(22px, 4vw, 40px)',
    color: '#ffffff',
    letterSpacing: '2px',
    lineHeight: 1.25,
    margin: 0,
  },
  titleDorado: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: 'clamp(22px, 4vw, 40px)',
    color: '#c9a84c',
    letterSpacing: '2px',
    lineHeight: 1.25,
    margin: 0,
  },
  subtitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 'clamp(15px, 2vw, 18px)',
    lineHeight: 1.75,
    color: '#ffffff',
    opacity: 0,
    marginTop: '24px',
    maxWidth: '640px',
  },
  goldLine: {
    width: 0,
    height: '2px',
    backgroundColor: '#c9a84c',
    margin: '28px auto 0',
    opacity: 0.85,
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    padding: '10px 16px',
    borderRadius: '999px',
    border: '1px solid rgba(0, 168, 107, 0.25)',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(4px)',
    color: '#ffffff',
    opacity: 0,
    transform: 'scale(0.8)',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  flagImg: {
    width: '24px',
    height: '18px',
    borderRadius: '2px',
    marginRight: '6px',
    flexShrink: 0,
  },
  chipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '32px',
  },
  pillarCard: {
    width: '100%',
    padding: '28px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(0, 168, 107, 0.25)',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(4px)',
    opacity: 0,
    transform: 'translateY(24px)',
    cursor: 'pointer',
    textAlign: 'center',
    font: 'inherit',
    color: 'inherit',
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
  },
  pillarsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginTop: '32px',
    width: '100%',
  },
  pillarNum: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: '28px',
    color: '#c9a84c',
    marginBottom: '8px',
  },
  pillarTitle: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: '17px',
    color: '#4ecdc4',
    letterSpacing: '1px',
    margin: 0,
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 100,
    opacity: 0,
  },
  modalPanel: {
    position: 'relative',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '85vh',
    overflowY: 'auto',
    backgroundColor: '#0d0200',
    border: '1px solid rgba(0, 229, 160, 0.3)',
    borderRadius: '20px',
    padding: '40px 32px 32px',
    opacity: 0,
    transform: 'scale(0.85)',
  },
  modalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid rgba(0, 168, 107, 0.25)',
    background: 'rgba(0, 0, 0, 0.4)',
    color: '#4ecdc4',
    fontSize: '20px',
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  modalNum: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: '56px',
    color: '#c9a84c',
    lineHeight: 1,
    marginBottom: '8px',
  },
  modalTitle: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: '22px',
    color: '#4ecdc4',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    margin: '0 0 20px',
  },
  modalDivider: {
    width: '56px',
    height: '2px',
    backgroundColor: '#c9a84c',
    marginBottom: '20px',
    opacity: 0.85,
  },
  modalTagline: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#00e5a0',
    margin: '0 0 16px',
    fontWeight: 500,
  },
  modalDesc: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    lineHeight: 1.75,
    color: 'rgba(255, 255, 255, 0.75)',
    margin: 0,
  },
  statsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '40px',
    marginTop: '36px',
  },
  statBox: {
    textAlign: 'center',
    minWidth: '140px',
  },
  statNum: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: 'clamp(40px, 8vw, 64px)',
    color: '#4ecdc4',
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#00e5a0',
    marginTop: '8px',
  },
  cierreBlock: {
    borderLeft: '3px solid #c9a84c',
    paddingLeft: '24px',
    maxWidth: '720px',
    margin: '0 auto',
  },
  cierreText: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: 'clamp(22px, 4vw, 38px)',
    color: '#ffffff',
    letterSpacing: '2px',
    lineHeight: 1.35,
    margin: 0,
  },
  highlightWord: {
    color: '#ffffff',
  },
  cierreSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    color: '#ffffff',
    opacity: 0,
    marginTop: '28px',
    lineHeight: 1.7,
  },
  tagline: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: '#00e5a0',
    opacity: 0,
    marginTop: '16px',
  },
  dot: (active) => ({
    width: active ? '28px' : '10px',
    height: '10px',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: active ? '#c9a84c' : 'rgba(0, 168, 107, 0.35)',
  }),
  btnNext: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    letterSpacing: '0.15em',
    padding: '12px 32px',
    borderRadius: '8px',
    border: '1px solid #4ecdc4',
    color: '#4ecdc4',
    background: 'transparent',
    cursor: 'pointer',
    opacity: 0,
  },
  wordWrap: {
    display: 'inline-block',
    overflow: 'hidden',
    verticalAlign: 'top',
    marginRight: '0.28em',
  },
  wordInner: {
    display: 'inline-block',
    transform: 'translateY(110%)',
  },
  sceneCenter: {
    width: '100%',
    maxWidth: '920px',
    textAlign: 'center',
    flexShrink: 0,
  },
}

function SplitWords({ text, innerClass = 'm-word-inner', style }) {
  return (
    <span style={style}>
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`} style={S.wordWrap}>
          <span className={innerClass} style={S.wordInner}>
            {word}
          </span>
        </span>
      ))}
    </span>
  )
}

function animateWords(container, staggerMs = 55) {
  const words = container?.querySelectorAll('.m-word-inner')
  if (!words?.length) return
  animate(words, {
    y: ['110%', '0%'],
    duration: 600,
    delay: stagger(staggerMs),
    ease: 'outExpo',
  })
}

function animateWordsSelector(root, selector, staggerMs = 55) {
  const container = root?.querySelector(selector)
  if (container) animateWords(container, staggerMs)
}

export default function Mision() {
  const [current, setCurrent] = useState(0)
  const [openPilar, setOpenPilar] = useState(null)
  const sceneRefs = useRef([])
  const timersRef = useRef([])
  const modalOverlayRef = useRef(null)
  const modalPanelRef = useRef(null)

  const clearTimers = () => {
    timersRef.current.forEach((id) => {
      clearInterval(id)
      clearTimeout(id)
    })
    timersRef.current = []
  }

  const goTo = useCallback((n) => {
    setOpenPilar(null)
    setCurrent(Math.max(0, Math.min(n, TOTAL - 1)))
  }, [])

  const openPilarModal = useCallback((index) => {
    setOpenPilar(index)
  }, [])

  const closePilarModal = useCallback(() => {
    const overlay = modalOverlayRef.current
    const panel = modalPanelRef.current
    if (!overlay || !panel) {
      setOpenPilar(null)
      return
    }
    animate(overlay, { opacity: [1, 0], duration: 280, ease: 'outExpo' })
    animate(panel, {
      opacity: [1, 0],
      scale: [1, 0.9],
      duration: 280,
      ease: 'outExpo',
    }).then(() => setOpenPilar(null))
  }, [])

  useEffect(() => {
    document.body.classList.add('page-mision');
    return () => document.body.classList.remove('page-mision');
  }, []);

  useEffect(() => {
    if (current !== 2) setOpenPilar(null)
  }, [current])

  useEffect(() => {
    if (openPilar === null) return undefined

    const overlay = modalOverlayRef.current
    const panel = modalPanelRef.current
    if (!overlay || !panel) return undefined

    overlay.style.opacity = '0'
    panel.style.opacity = '0'
    panel.style.transform = 'scale(0.85)'

    const frame = requestAnimationFrame(() => {
      animate(overlay, { opacity: [0, 1], duration: 400, ease: 'outExpo' })
      animate(panel, {
        opacity: [0, 1],
        scale: [0.85, 1],
        duration: 400,
        ease: 'cubicBezier(0.34, 1.56, 0.64, 1)',
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [openPilar])

  useEffect(() => {
    const root = sceneRefs.current[current]
    if (!root) return undefined

    clearTimers()
    const animations = []

    const run = () => {
      switch (current) {
        case 0: {
          animateWords(root)
          const eyebrow = root.querySelector('.m-eyebrow')
          const line = root.querySelector('.m-gold-line')
          const sub = root.querySelector('.m-subtitle')
          const btn = root.querySelector('.m-btn-next')
          if (eyebrow) {
            animations.push(
              animate(eyebrow, { opacity: [0, 1], duration: 500, delay: 100, ease: 'outExpo' })
            )
          }
          if (line) {
            animations.push(
              animate(line, {
                width: [0, 56],
                opacity: [0, 0.85],
                duration: 700,
                delay: 400,
                ease: 'outExpo',
              })
            )
          }
          if (sub) {
            animations.push(
              animate(sub, { opacity: [0, 1], duration: 600, delay: 700, ease: 'outExpo' })
            )
          }
          if (btn) {
            animations.push(
              animate(btn, { opacity: [0, 1], duration: 500, delay: 900, ease: 'outExpo' })
            )
          }
          break
        }
        case 1: {
          animateWordsSelector(root, '.m-title-line1', 55)
          animateWordsSelector(root, '.m-title-line2', 55)
          const eyebrow = root.querySelector('.m-eyebrow')
          if (eyebrow) {
            animations.push(
              animate(eyebrow, { opacity: [0, 1], duration: 500, ease: 'outExpo' })
            )
          }
          const chips = root.querySelectorAll('.m-chip')
          if (chips.length) {
            animations.push(
              animate(chips, {
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 500,
                delay: stagger(70),
                ease: 'outExpo',
              })
            )
          }
          break
        }
        case 2: {
          animateWords(root)
          const eyebrow = root.querySelector('.m-eyebrow')
          if (eyebrow) {
            animations.push(
              animate(eyebrow, { opacity: [0, 1], duration: 500, ease: 'outExpo' })
            )
          }
          const cards = root.querySelectorAll('.m-pillar')
          if (cards.length) {
            animations.push(
              animate(cards, {
                opacity: [0, 1],
                y: [24, 0],
                duration: 550,
                delay: stagger(150),
                ease: 'outExpo',
              })
            )
          }
          break
        }
        case 3: {
          animateWords(root)
          const eyebrow = root.querySelector('.m-eyebrow')
          if (eyebrow) {
            animations.push(
              animate(eyebrow, { opacity: [0, 1], duration: 500, ease: 'outExpo' })
            )
          }
          STATS.forEach((stat, i) => {
            const el = root.querySelector(`[data-stat="${i}"]`)
            if (!el) return
            let val = 0
            el.textContent = `0${stat.suffix}`
            const id = setInterval(() => {
              val += 1
              el.textContent = `${val}${val >= stat.target ? stat.suffix : ''}`
              if (val >= stat.target) clearInterval(id)
            }, 40)
            timersRef.current.push(id)
          })
          break
        }
        case 4: {
          const cierreWords = root.querySelectorAll('.m-cierre-word')
          if (cierreWords.length) {
            animations.push(
              animate(cierreWords, {
                y: ['110%', '0%'],
                duration: 600,
                delay: stagger(50),
                ease: 'outExpo',
              })
            )
          }
          const highlight = root.querySelector('.m-highlight')
          const t1 = setTimeout(() => {
            if (highlight) {
              animate(highlight, { color: '#c9a84c', duration: 600, ease: 'outExpo' })
            }
          }, 2400)
          timersRef.current.push(t1)
          const sub = root.querySelector('.m-cierre-sub')
          const tag = root.querySelector('.m-tagline')
          if (sub) {
            animations.push(
              animate(sub, { opacity: [0, 1], duration: 600, delay: 1200, ease: 'outExpo' })
            )
          }
          if (tag) {
            animations.push(
              animate(tag, { opacity: [0, 1], duration: 600, delay: 1600, ease: 'outExpo' })
            )
          }
          break
        }
        default:
          break
      }
    }

    const frame = requestAnimationFrame(run)
    return () => {
      cancelAnimationFrame(frame)
      clearTimers()
      animations.forEach((a) => {
        if (a?.pause) a.pause()
      })
    }
  }, [current])

  const setSceneRef = (index) => (el) => {
    sceneRefs.current[index] = el
  }

  const renderSceneNav = (sceneIndex) => (
    <div style={S.sceneNav}>
      <div style={S.sceneDots}>
        {Array.from({ length: TOTAL }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Escena ${i + 1}`}
            style={S.dot(i === current)}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
      {sceneIndex < 4 && (
        <button
          type="button"
          className={sceneIndex === 0 ? 'm-btn-next' : undefined}
          style={{ ...S.btnNext, opacity: sceneIndex === 0 ? 0 : 1 }}
          onClick={() => goTo(sceneIndex + 1)}
        >
          Siguiente
        </button>
      )}
    </div>
  )

  const renderSceneBody = (sceneIndex) => {
    switch (sceneIndex) {
      case 0:
        return (
          <div style={S.sceneCenter}>
            <p className="m-eyebrow" style={S.eyebrow}>
              Nuestra razón de existir
            </p>
            <h1 style={S.titleTurquesa}>
              <SplitWords text="El mayor obstáculo del latino no es el talento. Es la desconfianza en sí mismo." />
            </h1>
            <div className="m-gold-line" style={S.goldLine} />
            <p className="m-subtitle" style={{ ...S.subtitle, margin: '24px auto 0' }}>
              Durante décadas nos enseñaron que lo extranjero es sinónimo de calidad. Que lo
              nuestro siempre queda en segundo lugar.
            </p>
          </div>
        )

      case 1:
        return (
          <div style={S.sceneCenter}>
            <p className="m-eyebrow" style={S.eyebrow}>
              El problema
            </p>
            <h2 className="m-title-line1" style={{ ...S.titleBlanco, marginBottom: '8px' }}>
              <SplitWords text="Divididos por frontera." />
            </h2>
            <h2 className="m-title-line2" style={S.titleDorado}>
              <SplitWords text="Unidos por instinto." innerClass="m-word-inner-gold" />
            </h2>
            <div style={S.chipsWrap}>
              {countries.map((country) => (
                <a
                  key={country.code}
                  href={country.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m-chip"
                  style={S.chip}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 229, 160, 0.6)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 168, 107, 0.25)'
                  }}
                >
                  <img
                    src={`https://flagcdn.com/24x18/${country.code}.png`}
                    alt={`Bandera ${country.name}`}
                    style={S.flagImg}
                    loading="lazy"
                  />
                  {country.name}
                </a>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div style={{ ...S.sceneCenter, maxWidth: '900px' }}>
            <p className="m-eyebrow" style={S.eyebrow}>
              La respuesta
            </p>
            <h2 style={S.titleTurquesa}>
              <SplitWords text="JeelJel nació para demostrar que eso es mentira." />
            </h2>
            <div style={S.pillarsGrid}>
              {PILARES.map((p, index) => (
                <button
                  key={p.num}
                  type="button"
                  className="m-pillar"
                  style={S.pillarCard}
                  onClick={() => openPilarModal(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 229, 160, 0.45)'
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.55)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 168, 107, 0.25)'
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.45)'
                  }}
                >
                  <div style={S.pillarNum}>{p.num}</div>
                  <div style={S.pillarTitle}>{p.titulo}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div style={{ ...S.sceneCenter, paddingTop: '5rem' }}>
            <p className="m-eyebrow" style={S.eyebrow}>
              El ecosistema
            </p>
            <h2 style={S.titleTurquesa}>
              <SplitWords text="5 plataformas. Un solo movimiento." />
            </h2>
            <div style={S.statsWrap}>
              {STATS.map((stat, i) => (
                <div key={stat.label} style={S.statBox}>
                  <div className="m-stat-num" data-stat={i} style={S.statNum}>
                    0{stat.suffix}
                  </div>
                  <div style={S.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 4: {
        const part1 = 'No somos la copia de nada. Somos el'
        const part2 = 'original'
        const part3 = 'que estaba faltando.'
        return (
          <div style={{ ...S.sceneCenter, paddingTop: '5rem' }}>
            <div style={S.cierreBlock}>
              <p style={S.cierreText}>
                {part1.split(' ').map((w, i) => (
                  <span key={`a-${i}`} style={S.wordWrap}>
                    <span className="m-cierre-word" style={S.wordInner}>
                      {w}
                    </span>
                  </span>
                ))}{' '}
                <span style={S.wordWrap}>
                  <span className="m-cierre-word m-highlight" style={{ ...S.wordInner, ...S.highlightWord }}>
                    {part2}
                  </span>
                </span>{' '}
                {part3.split(' ').map((w, i) => (
                  <span key={`b-${i}`} style={S.wordWrap}>
                    <span className="m-cierre-word" style={S.wordInner}>
                      {w}
                    </span>
                  </span>
                ))}
              </p>
              <p className="m-cierre-sub" style={S.cierreSub}>
                Tecnología con identidad. Imperios con raíces.
              </p>
              <p className="m-tagline" style={S.tagline}>
                JeelJel Kaanab · Tecnología con raíces
              </p>
            </div>
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#1a0400',
        color: '#ffffff',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .m-chip {
            font-size: 12px !important;
            padding: 4px 10px !important;
          }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${mosaico})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '80px 80px',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={S.slider}>
          <div style={S.header}>
            <h1 style={S.headerTitle}>Misión</h1>
            <p style={S.headerSub}>La razón por la que JeelJel Kaanab existe.</p>
          </div>

          {Array.from({ length: TOTAL }, (_, n) => (
            <div
              key={n}
              ref={setSceneRef(n)}
              data-scene={n}
              style={S.slide(current === n)}
            >
              {renderSceneBody(n)}
              {renderSceneNav(n)}
            </div>
          ))}
        </div>

        {openPilar !== null && (
          <div
            ref={modalOverlayRef}
            style={S.modalOverlay}
            role="presentation"
            onClick={closePilarModal}
          >
            <div
              ref={modalPanelRef}
              style={S.modalPanel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="pilar-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                style={S.modalClose}
                onClick={closePilarModal}
                aria-label="Cerrar"
              >
                ×
              </button>
              <div style={S.modalNum}>{PILARES[openPilar].num}</div>
              <h3 id="pilar-modal-title" style={S.modalTitle}>
                {PILARES[openPilar].titulo}
              </h3>
              <div style={S.modalDivider} />
              <p style={S.modalTagline}>{PILARES[openPilar].tagline}</p>
              <p style={S.modalDesc}>{PILARES[openPilar].desc}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
