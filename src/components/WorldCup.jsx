import { useState, useEffect } from 'react'
// LOGO HUB: src/assets/Logo_JeelJel_con_balon.png ✓
import logoBalon from '../assets/Logo_JeelJel_con_balon.png'

// Deadline: 11 junio 2026, 17:00 UTC-6 = 23:00 UTC
const TARGET = new Date('2026-06-11T23:00:00.000Z')

function pad(n) {
  return String(n).padStart(2, '0')
}

function calcTimeLeft() {
  const diff = TARGET - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

function CountdownBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="font-cinzel font-bold text-center rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(17, 10, 14, 0.85)',
          color: '#e85d26',
          fontSize: 'clamp(28px, 4vw, 44px)',
          width: 'clamp(70px, 10vw, 90px)',
          height: 'clamp(70px, 10vw, 90px)',
          border: '1px solid rgba(232,93,38,0.2)',
          letterSpacing: '2px',
          lineHeight: 1,
        }}
      >
        {pad(value)}
      </div>
      <span
        className="font-dm text-xs mt-2 uppercase tracking-widest"
        style={{ color: '#f5f0e8', letterSpacing: '0.12em' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function WorldCup() {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      className="py-24 px-6 md:px-12"
      style={{ backgroundColor: 'transparent', borderTop: '1px solid #2a0a0a' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Layout: texto izquierda + logo derecha en desktop */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Columna izquierda — contenido */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">

            {/* Badge rojo parpadeante */}
            <div
              className="badge-pulse font-dm text-xs px-4 py-2 rounded-full mb-6 inline-flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(232,93,38,0.15)',
                border: '1px solid rgba(232,93,38,0.5)',
                color: '#e85d26',
                letterSpacing: '0.15em',
              }}
            >
              <span
                className="inline-block rounded-full"
                style={{ width: '6px', height: '6px', backgroundColor: '#e85d26' }}
              />
              EN CONSTRUCCIÓN &nbsp;·&nbsp; DEADLINE 11 JUNIO 2026
            </div>

            {/* Título */}
            <h2
              className="font-cinzel font-bold mb-4"
              style={{
                color: '#f5f0e8',
                fontSize: 'clamp(24px, 4vw, 42px)',
                letterSpacing: '3px',
                lineHeight: 1.2,
              }}
            >
              Hub Biónico Deportivo
            </h2>

            {/* Subtítulo */}
            <p
              className="font-dm mb-8"
              style={{
                color: '#f5f0e8',
                fontSize: 'clamp(14px, 1.8vw, 17px)',
                lineHeight: '1.7',
                maxWidth: '500px',
              }}
            >
              El Mundial 2026 como nunca lo viviste — campo 2D en tiempo real,
              IA analista, narrador comunitario y modo apostador.
            </p>

            {/* Contador regresivo */}
            <div className="flex items-start gap-3 sm:gap-5 mb-8 flex-wrap justify-center md:justify-start">
              <CountdownBox value={timeLeft.days}    label="Días"     />
              <div className="font-cinzel font-bold text-3xl self-start mt-4" style={{ color: '#e85d26', opacity: 0.5 }}>:</div>
              <CountdownBox value={timeLeft.hours}   label="Horas"    />
              <div className="font-cinzel font-bold text-3xl self-start mt-4" style={{ color: '#e85d26', opacity: 0.5 }}>:</div>
              <CountdownBox value={timeLeft.minutes} label="Minutos"  />
              <div className="font-cinzel font-bold text-3xl self-start mt-4" style={{ color: '#e85d26', opacity: 0.5 }}>:</div>
              <CountdownBox value={timeLeft.seconds} label="Segundos" />
            </div>

            {/* Botón NOTIFÍCAME (visual solamente) */}
            <button
              className="font-dm font-medium text-sm tracking-widest px-8 py-3 rounded-lg transition-all duration-200"
              style={{
                border: '1px solid #e85d26',
                color: '#e85d26',
                background: 'transparent',
                letterSpacing: '0.15em',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(232,93,38,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              NOTIFÍCAME
            </button>
          </div>

          {/* Columna derecha — logo */}
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: 'clamp(200px, 30vw, 320px)' }}
          >
            <img
              src={logoBalon}
              alt="Hub Biónico Deportivo — Logo con balón"
              style={{
                width: '100%',
                maxWidth: '280px',
                filter: 'drop-shadow(0 0 40px rgba(232,93,38,0.25))',
              }}
            />
          </div>

        </div>
      </div>
    </section>
  )
}
