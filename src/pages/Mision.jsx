import { useEffect, useState } from 'react'
import Tlaloc from '../assets/mosaicos/Tlaloc.png'

const PAIS_CHIPS = [
  '🇲🇽 México',
  '🇦🇷 Argentina',
  '🇨🇴 Colombia',
  '🇨🇱 Chile',
  '🇵🇪 Perú',
  '🇻🇪 Venezuela',
  '🇪🇨 Ecuador',
  '🇧🇴 Bolivia',
  '🇵🇾 Paraguay',
  '🇺🇾 Uruguay',
  '🇬🇹 Guatemala',
]

const PILARES = [
  { num: '01', titulo: 'Demostrar' },
  { num: '02', titulo: 'Unir' },
  { num: '03', titulo: 'Empoderar' },
]

const CONTADORES = [
  { valor: 5, etiqueta: 'Plataformas' },
  { valor: 18, etiqueta: 'Países objetivo' },
  { valor: 30, etiqueta: 'Agentes IA', sufijo: '+' },
]

const TOTAL_ESCENAS = 5

function useCountUp(target, active, duration = 1400) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) {
      setCount(0)
      return
    }
    let start = null
    let frame
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setCount(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration])

  return count
}

function EscenaContadores({ active }) {
  const c0 = useCountUp(5, active)
  const c1 = useCountUp(18, active)
  const c2 = useCountUp(30, active)
  const valores = [c0, c1, c2]

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-10">
      {CONTADORES.map((item, i) => (
        <div key={item.etiqueta} className="text-center">
          <div
            className="font-cinzel font-bold"
            style={{
              fontSize: 'clamp(40px, 8vw, 64px)',
              color: '#4ecdc4',
              lineHeight: 1,
            }}
          >
            {valores[i]}
            {item.sufijo || ''}
          </div>
          <div
            className="font-dm text-xs mt-2 uppercase tracking-widest"
            style={{ color: '#00e5a0', letterSpacing: '0.15em' }}
          >
            {item.etiqueta}
          </div>
        </div>
      ))}
    </div>
  )
}

function renderEscena(scene) {
  switch (scene) {
    case 0:
      return (
        <div className="mision-fade-up text-center max-w-3xl mx-auto">
          <h1
            className="font-cinzel font-bold leading-tight mb-6"
            style={{
              fontSize: 'clamp(22px, 4vw, 38px)',
              color: '#4ecdc4',
              letterSpacing: '2px',
            }}
          >
            El mayor obstáculo del latino no es el talento. Es la desconfianza en
            sí mismo.
          </h1>
          <p
            className="font-dm"
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              lineHeight: 1.75,
              color: '#ffffff',
              opacity: 0.9,
            }}
          >
            Durante décadas nos enseñaron que lo extranjero es sinónimo de calidad.
            Que lo nuestro siempre queda en segundo lugar.
          </p>
        </div>
      )

    case 1:
      return (
        <div className="mision-fade-up text-center max-w-4xl mx-auto w-full">
          <h2
            className="font-cinzel font-bold mb-10"
            style={{
              fontSize: 'clamp(20px, 3.5vw, 32px)',
              color: '#4ecdc4',
              letterSpacing: '2px',
            }}
          >
            Divididos por frontera. Unidos por instinto.
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {PAIS_CHIPS.map((chip, i) => (
              <span
                key={chip}
                className="mision-chip-in font-dm text-sm px-4 py-2 rounded-full"
                style={{
                  animationDelay: `${i * 80}ms`,
                  border: '1px solid rgba(0, 168, 107, 0.25)',
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(4px)',
                  color: '#00e5a0',
                  letterSpacing: '0.05em',
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      )

    case 2:
      return (
        <div className="mision-fade-up text-center max-w-4xl mx-auto w-full">
          <h2
            className="font-cinzel font-bold mb-10"
            style={{
              fontSize: 'clamp(20px, 3.5vw, 32px)',
              color: '#4ecdc4',
              letterSpacing: '2px',
            }}
          >
            JeelJel nació para demostrar que eso es mentira.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PILARES.map((p, i) => (
              <div
                key={p.num}
                className="mision-card-in tarjeta rounded-xl p-6 text-center"
                style={{
                  animationDelay: `${i * 180}ms`,
                  background: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(0, 168, 107, 0.25)',
                }}
              >
                <span
                  className="font-cinzel font-bold block mb-2"
                  style={{ color: '#c9a84c', fontSize: '28px' }}
                >
                  {p.num}
                </span>
                <span
                  className="font-cinzel font-bold"
                  style={{ color: '#4ecdc4', fontSize: '18px', letterSpacing: '1px' }}
                >
                  {p.titulo}
                </span>
              </div>
            ))}
          </div>
        </div>
      )

    case 3:
      return (
        <div className="mision-fade-up text-center max-w-4xl mx-auto w-full">
          <h2
            className="font-cinzel font-bold"
            style={{
              fontSize: 'clamp(20px, 3.5vw, 32px)',
              color: '#4ecdc4',
              letterSpacing: '2px',
            }}
          >
            5 plataformas. Un solo movimiento.
          </h2>
          <EscenaContadores active />
        </div>
      )

    case 4:
      return (
        <div className="mision-fade-up text-center max-w-3xl mx-auto">
          <p
            className="font-cinzel font-bold leading-tight mb-8"
            style={{
              fontSize: 'clamp(24px, 4.5vw, 42px)',
              color: '#c9a84c',
              letterSpacing: '3px',
            }}
          >
            No somos la copia de nada.
            <br />
            Somos el original que estaba faltando.
          </p>
          <p
            className="font-dm uppercase tracking-widest"
            style={{
              color: '#00e5a0',
              letterSpacing: '0.25em',
              fontSize: 'clamp(12px, 1.5vw, 14px)',
            }}
          >
            JeelJel Kaanab · Tecnología con raíces
          </p>
        </div>
      )

    default:
      return null
  }
}

export default function Mision() {
  const [scene, setScene] = useState(0)

  useEffect(() => {
    document.body.classList.add('page-mision')
    return () => document.body.classList.remove('page-mision')
  }, [])

  const siguiente = () => {
    setScene((s) => Math.min(s + 1, TOTAL_ESCENAS - 1))
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#1a0400' }}>
      <style>{`
        @keyframes misionFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes misionChipIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes misionCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mision-fade-up {
          animation: misionFadeUp 0.65s ease-out forwards;
        }
        .mision-chip-in {
          opacity: 0;
          animation: misionChipIn 0.45s ease-out forwards;
        }
        .mision-card-in {
          opacity: 0;
          animation: misionCardIn 0.55s ease-out forwards;
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${Tlaloc})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '80px 80px',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201, 168, 76, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 168, 76, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '100px',
          paddingBottom: '120px',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        <div
          key={scene}
          className="flex-1 flex items-center justify-center w-full max-w-5xl mx-auto"
        >
          {renderEscena(scene)}
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 flex flex-col items-center gap-5 pb-8 pt-4"
          style={{
            background: 'linear-gradient(to top, #1a0400 60%, transparent)',
            zIndex: 2,
          }}
        >
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_ESCENAS }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Escena ${i + 1}`}
                onClick={() => setScene(i)}
                style={{
                  width: i === scene ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor:
                    i === scene ? '#4ecdc4' : 'rgba(0, 168, 107, 0.35)',
                }}
              />
            ))}
          </div>

          {scene < TOTAL_ESCENAS - 1 && (
            <button
              type="button"
              onClick={siguiente}
              className="boton-secundario font-dm font-medium text-sm tracking-widest px-8 py-3 rounded-lg transition-all duration-200"
              style={{ letterSpacing: '0.15em', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(78, 205, 196, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
