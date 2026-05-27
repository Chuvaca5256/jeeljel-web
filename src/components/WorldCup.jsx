import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// LOGO Ollin Deportes: src/assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png ✓
import logoBalon from '../assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png'

// Deadline: 11 junio 2026, 17:00 UTC-6 = 23:00 UTC
const TARGET = new Date('2026-06-11T23:00:00.000Z')

function pad(n) {
  return String(n).padStart(2, '0')
}

function calcTimeLeft() {
  const diff = TARGET - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
  }
}

function CountdownBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="tarjeta font-cinzel font-bold text-center rounded-lg flex items-center justify-center"
        style={{
          color: 'var(--color-titulo)',
          fontSize: 'clamp(28px, 4vw, 44px)',
          width: 'clamp(70px, 10vw, 90px)',
          height: 'clamp(70px, 10vw, 90px)',
          letterSpacing: '2px',
          lineHeight: 1,
        }}
      >
        {pad(value)}
      </div>
      <span
        className="font-dm text-xs mt-2 uppercase tracking-widest etiqueta-secundaria"
        style={{ letterSpacing: '0.12em' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function WorldCup() {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      className="py-24 px-6 md:px-12"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">

            <div
              className="badge-pulse font-dm text-xs px-4 py-2 rounded-full mb-6 inline-flex items-center gap-2 etiqueta-secundaria"
              style={{
                backgroundColor: 'rgba(0, 168, 107, 0.15)',
                border: '1px solid var(--color-separador)',
                letterSpacing: '0.15em',
              }}
            >
              <span
                className="inline-block rounded-full"
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'var(--color-titulo-secundario)',
                }}
              />
              EN CONSTRUCCIÓN &nbsp;·&nbsp; DEADLINE 11 JUNIO 2026
            </div>

            <h2
              className="font-cinzel font-bold mb-4"
              style={{
                fontSize: 'clamp(24px, 4vw, 42px)',
                letterSpacing: '3px',
                lineHeight: 1.2,
              }}
            >
              Ollin Deportes
            </h2>

            <p
              className="font-dm mb-8"
              style={{
                fontSize: 'clamp(14px, 1.8vw, 17px)',
                lineHeight: '1.7',
                maxWidth: '500px',
              }}
            >
              El Mundial 2026 como nunca lo viviste — campo 2D en tiempo real,
              IA analista, narrador comunitario y modo apostador.
            </p>

            <div className="flex flex-nowrap items-start gap-3 sm:gap-5 mb-8 justify-center md:justify-start">
              <CountdownBox value={timeLeft.days}    label="Días"     />
              <div
                className="font-cinzel font-bold text-3xl self-start mt-4"
                style={{ color: 'var(--color-titulo)', opacity: 0.5 }}
              >
                :
              </div>
              <CountdownBox value={timeLeft.hours}   label="Horas"    />
              <div
                className="font-cinzel font-bold text-3xl self-start mt-4"
                style={{ color: 'var(--color-titulo)', opacity: 0.5 }}
              >
                :
              </div>
              <CountdownBox value={timeLeft.minutes} label="Minutos"  />
            </div>

            <button
              type="button"
              className="boton-secundario font-dm font-medium text-sm tracking-widest px-8 py-3 rounded-lg transition-all duration-200"
              style={{ letterSpacing: '0.15em', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(78, 205, 196, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              NOTIFÍCAME
            </button>
          </div>

          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: 'clamp(200px, 30vw, 320px)' }}
          >
            <Link
              to="/ollin-deportes"
              aria-label="Ir a Ollin Deportes"
              className="flex items-center justify-center rounded-full no-underline transition-transform duration-200"
              style={{
                width: 'clamp(200px, 28vw, 280px)',
                height: 'clamp(200px, 28vw, 280px)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <img
                src={logoBalon}
                alt="Ollin Deportes — Logo con balón"
                style={{
                  width: '100%',
                  maxWidth: '280px',
                  filter: 'drop-shadow(0 0 40px rgba(0, 168, 107, 0.25))',
                }}
              />
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
