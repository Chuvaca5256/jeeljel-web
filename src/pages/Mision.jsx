import { useEffect, useRef, useState, useCallback } from 'react'
import { animate, stagger } from 'animejs'
import Tlaloc from '../assets/mosaicos/Tlaloc.png'

const PAIS_CHIPS = [
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Perú' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'BZ', name: 'Belice' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'PA', name: 'Panamá' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'NI', name: 'Nicaragua' },
]

const PILARES = [
  {
    num: '01',
    titulo: 'Demostrar',
    desc: 'Que la tecnología latinoamericana compite al más alto nivel global.',
  },
  {
    num: '02',
    titulo: 'Unir',
    desc: 'Un ecosistema que conecta talento, ideas y territorios sin fronteras.',
  },
  {
    num: '03',
    titulo: 'Empoderar',
    desc: 'Herramientas para que cada creador construya su propio imperio.',
  },
]

const STATS = [
  { target: 5, label: 'Plataformas', suffix: '' },
  { target: 18, label: 'Países objetivo', suffix: '' },
  { target: 30, label: 'Agentes IA', suffix: '+' },
]

const TOTAL = 5

const S = {
  page: {
    position: 'relative',
    minHeight: 'auto',
    backgroundColor: '#1a0400',
    color: '#ffffff',
    fontFamily: "'DM Sans', sans-serif",
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `repeating-linear-gradient(
        0deg,
        rgba(201, 168, 76, 0.05) 0px,
        rgba(201, 168, 76, 0.05) 1px,
        transparent 1px,
        transparent 48px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(201, 168, 76, 0.05) 0px,
        rgba(201, 168, 76, 0.05) 1px,
        transparent 1px,
        transparent 48px
      )`,
    pointerEvents: 'none',
    zIndex: 0,
  },
  mosaico: {
    position: 'fixed',
    inset: 0,
    backgroundRepeat: 'repeat',
    backgroundSize: '80px 80px',
    opacity: 0.08,
    pointerEvents: 'none',
    zIndex: 0,
  },
  main: {
    position: 'relative',
    zIndex: 1,
    minHeight: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '100px',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  content: {
    width: '100%',
    maxWidth: '920px',
    margin: '0 auto',
    minHeight: 'fit-content',
    paddingTop: '40px',
    paddingBottom: '32px',
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
  },
  chipCode: {
    color: '#4ecdc4',
    fontWeight: 700,
    marginRight: '4px',
  },
  chipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '32px',
  },
  pillarCard: {
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid rgba(0, 168, 107, 0.25)',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(4px)',
    opacity: 0,
    transform: 'translateY(24px)',
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
    marginBottom: '10px',
  },
  pillarDesc: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    lineHeight: 1.65,
    color: '#ffffff',
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
  navBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '18px',
    paddingBottom: '32px',
    paddingTop: '16px',
    background: 'linear-gradient(to top, #1a0400 65%, transparent)',
    zIndex: 2,
  },
  dots: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    textAlign: 'center',
    minHeight: 'fit-content',
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
  const sceneRef = useRef(null)
  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach((id) => {
      clearInterval(id)
      clearTimeout(id)
    })
    timersRef.current = []
  }

  const goTo = useCallback((n) => {
    setCurrent(Math.max(0, Math.min(n, TOTAL - 1)))
  }, [])

  useEffect(() => {
    document.body.classList.add('page-mision')
    return () => document.body.classList.remove('page-mision')
  }, [])

  useEffect(() => {
    const root = sceneRef.current
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

  const renderScene = () => {
    switch (current) {
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
            <button
              type="button"
              className="m-btn-next"
              style={{ ...S.btnNext, marginTop: '32px' }}
              onClick={() => goTo(1)}
            >
              Siguiente
            </button>
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
              {PAIS_CHIPS.map((pais) => (
                <span key={pais.code} className="m-chip" style={S.chip}>
                  <span style={S.chipCode}>{pais.code}</span>
                  {pais.name}
                </span>
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
              {PILARES.map((p) => (
                <div key={p.num} className="m-pillar" style={S.pillarCard}>
                  <div style={S.pillarNum}>{p.num}</div>
                  <div style={S.pillarTitle}>{p.titulo}</div>
                  <p style={S.pillarDesc}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div style={S.sceneCenter}>
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
          <div style={S.sceneCenter}>
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
    <div style={S.page}>
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
          ...S.mosaico,
          backgroundImage: `url(${Tlaloc})`,
        }}
      />
      <div style={S.grid} />

      <div style={S.main}>
        <div ref={sceneRef} key={current} style={S.content}>
          {renderScene()}
        </div>

        <div style={S.navBar}>
          <div style={S.dots}>
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
          {current < TOTAL - 1 && current !== 0 && (
            <button type="button" style={{ ...S.btnNext, opacity: 1 }} onClick={() => goTo(current + 1)}>
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
