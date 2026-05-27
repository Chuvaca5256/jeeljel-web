import { useEffect, useRef } from 'react'
import mosaico from '../assets/mosaicos/Viracoch.png'
import logoIkanNaat from '../assets/Logo_con_letras_Ikan_Naat_sin_fondo.png'

const FEATURES = [
  {
    icon: '🧠',
    title: 'Expertos Nivel 2',
    desc: 'Médico, abogado, psicólogo y más con protocolos reales',
  },
  {
    icon: '🎨',
    title: 'Imágenes con IA',
    desc: 'Genera imágenes en segundos con Flux',
  },
  {
    icon: '💕',
    title: 'Compañeros Virtuales',
    desc: 'Luna, Sofía, Mateo y más, siempre disponibles',
  },
  {
    icon: '🔍',
    title: 'Deep Agent Web',
    desc: 'Investiga en internet en tiempo real',
  },
  {
    icon: '💻',
    title: 'Agente Programador',
    desc: 'Genera y ejecuta código real',
  },
  {
    icon: '🎬',
    title: 'Videos con IA',
    desc: 'Clips con Luma AI',
  },
]

function CubeBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cubes = []
    const count = 55

    for (let i = 0; i < count; i++) {
      const type = i % 3
      const el = document.createElement('div')
      const size = Math.random() * 40 + 20
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = Math.random() * 8000 + 6000
      const delay = Math.random() * 4000

      if (type === 0) {
        el.style.cssText = `
          position: absolute;
          width: ${size}px; height: ${size}px;
          left: ${x}%; top: ${y}%;
          border: 1px solid rgba(78, 205, 196, 0.6);
          transform-style: preserve-3d;
          animation: cube-spin ${duration}ms linear ${delay}ms infinite;
          pointer-events: none;
        `
      } else if (type === 1) {
        el.style.cssText = `
          position: absolute;
          width: ${size}px; height: ${size}px;
          left: ${x}%; top: ${y}%;
          border: 1px solid rgba(201, 168, 76, 0.6);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          background: rgba(201, 168, 76, 0.08);
          transform-style: preserve-3d;
          animation: cube-spin ${duration}ms linear ${delay}ms infinite;
          pointer-events: none;
        `
      } else {
        el.style.cssText = `
          position: absolute;
          left: ${x}%; top: ${y}%;
          color: rgba(100, 160, 255, 0.7);
          font-size: ${size * 0.6}px;
          animation: cube-spin ${duration}ms linear ${delay}ms infinite;
          pointer-events: none;
          user-select: none;
        `
        el.textContent = '✦'
      }

      container.appendChild(el)
      cubes.push(el)
    }

    return () => cubes.forEach((c) => c.remove())
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

export default function Apps() {
  useEffect(() => {
    document.body.classList.add('page-apps')
    return () => document.body.classList.remove('page-apps')
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#1a0400' }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${mosaico})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '80px 80px',
          opacity: 0.12,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <CubeBackground />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '120px 24px 64px',
        }}
      >
        {/* Hero */}
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <img
            src={logoIkanNaat}
            alt="Ikan Naat IA"
            style={{
              width: 'min(280px, 85vw)',
              height: 'auto',
              margin: '0 auto 28px',
              display: 'block',
              filter: 'drop-shadow(0 0 32px rgba(78, 205, 196, 0.2))',
            }}
          />
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 700,
              color: '#4ecdc4',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              margin: '0 0 12px',
            }}
          >
            Ikan Naat IA
          </h1>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(14px, 2.5vw, 18px)',
              color: '#c9a84c',
              letterSpacing: '2px',
              margin: 0,
            }}
          >
            Programada en código, nacida en cultura
          </p>
        </header>

        {/* Descripción */}
        <p
          className="font-dm"
          style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            lineHeight: 1.75,
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto 48px',
          }}
        >
          Ikan Naat IA es el ecosistema de inteligencia artificial de Latinoamérica. Chat
          inteligente, expertos especializados con protocolos reales (médico, abogado, psicólogo,
          nutriólogo, financiero), generación de imágenes y videos, compañeros virtuales, agente
          programador, análisis deportivo y más. Todo en una sola plataforma, desde $0, en tu idioma
          y con contexto cultural latinoamericano.
        </p>

        {/* Grid de tarjetas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '48px',
          }}
        >
          {FEATURES.map((feature) => (
            <article key={feature.title} className="tarjeta" style={{ borderRadius: '12px' }}>
              <span
                style={{
                  fontSize: '32px',
                  lineHeight: 1,
                  display: 'block',
                  marginBottom: '12px',
                }}
                aria-hidden
              >
                {feature.icon}
              </span>
              <h2
                className="font-cinzel"
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#4ecdc4',
                  letterSpacing: '1px',
                  margin: '0 0 10px',
                }}
              >
                {feature.title}
              </h2>
              <p
                className="font-dm"
                style={{
                  fontSize: '14px',
                  lineHeight: 1.65,
                  color: 'rgba(255, 255, 255, 0.85)',
                  margin: 0,
                }}
              >
                {feature.desc}
              </p>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="https://ikannaat.jeeljel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-dm font-medium no-underline"
            style={{
              display: 'inline-block',
              padding: '14px 36px',
              borderRadius: '8px',
              border: '1px solid #c9a84c',
              color: '#c9a84c',
              fontSize: '15px',
              letterSpacing: '0.12em',
              transition: 'background 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201, 168, 76, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Entrar a Ikan Naat →
          </a>
        </div>
      </div>
    </div>
  )
}
