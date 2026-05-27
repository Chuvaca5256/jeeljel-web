import { useEffect, useRef, useState } from 'react'
import mosaico from '../assets/mosaicos/Viracoch.png'
import logoIkanNaat from '../assets/Logo_con_letras_Ikan_Naat_sin_fondo.png'
import logoTelarana from '../assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png'
import logoIzydra from '../assets/Logo_Izydra_OS_Sin_fondo.png'
import logoVirtyou from '../assets/Logo_virtyou_sin_fondo.png'
import logoInkognito from '../assets/Logo_inkognito_sin_fondo.png'
import './Apps.css'

const APPS = [
  {
    id: 'ikan-naat',
    name: 'Ikan Naat IA',
    logo: logoIkanNaat,
    accent: '#4ecdc4',
    subtitle: 'Ecosistema IA latinoamericano',
    preview:
      'Chat, expertos, imágenes, videos y compañeros virtuales — todo desde $0',
    description:
      'El ecosistema de inteligencia artificial de Latinoamérica. Expertos especializados con protocolos reales (médico, abogado, psicólogo, nutriólogo, financiero), generación de imágenes y videos, compañeros virtuales, agente programador, análisis deportivo y más. Todo en una sola plataforma, desde $0, en tu idioma y con contexto cultural latinoamericano.',
    capabilities: [
      '🧠 Expertos Nivel 2 — Médico, abogado, psicólogo, nutriólogo, financiero, dentista, veterinario y más con protocolos clínicos reales',
      '🎨 Imágenes con IA — Genera imágenes fotorrealistas e ilustraciones en segundos con solo describirlas',
      '🎬 Videos con IA — Crea clips y animaciones directamente desde el chat con solo pedirlos',
      '💕 Compañeros Virtuales — Luna, Sofía, Mateo y más: presencias inteligentes disponibles 24/7 con memoria',
      '🔍 Deep Agent Web — Investiga en internet en tiempo real y sintetiza la información al instante',
      '💻 Agente Programador — Genera, ejecuta y descarga apps web completas con código real',
      '⚽ Agente Deportivo — Picks diarios, parlays, análisis de momios y predicciones para fútbol, NBA, NFL y más con datos en tiempo real. Ideal para apostar con criterio: compara cuotas, arma tus combinadas y recibe análisis detallado de cada partido antes de jugarte tu dinero',
      '🗣️ Videollamada con IA — Sesiones en vivo con expertos: cámara, audio y detección emocional',
      '📄 Análisis de documentos — Procesa Word, Excel, PDF y archivos con IA especializada',
      '💰 Desde $0 — Plan gratuito real, sin trampa, con acceso a funciones clave desde el primer día',
    ],
    cta: { label: 'Entrar a Ikan Naat →', href: 'https://ikannaat.jeeljel.com' },
    comingSoon: false,
  },
  {
    id: 'ollin-deportes',
    name: 'Ollin Deportes',
    logo: logoTelarana,
    accent: '#f97316',
    subtitle: 'Fútbol en vivo · Modo Apostador · IA en tiempo real',
    preview:
      'Mundial 2026 en campo 2D · modo apostador · IA analista — próximamente en jeeljel.com',
    description:
      'Ve los partidos del Mundial 2026 en un campo 2D en tiempo real. Estadísticas de jugador, modo apostador con momios en vivo e IA analista integrada — todo desde jeeljel.com, sin pagar derechos de transmisión.',
    capabilities: [
      'Campo 2D isométrico en tiempo real',
      'Estadísticas granulares por jugador',
      'Modo Apostador con momios en vivo',
      'Narrador comunitario con rating',
      'IA analista (Ikan Naat) conectada al partido',
    ],
    cta: { label: 'Próximamente en jeeljel.com/ollin-deportes', disabled: true },
    comingSoon: false,
  },
  {
    id: 'companeros',
    name: 'Compañeros Virtuales',
    logo: logoVirtyou,
    accent: '#ec4899',
    subtitle: 'Siempre contigo',
    preview: 'Luna, Sofía, Mateo y más — compañía inteligente disponible 24/7',
    description:
      'Los compañeros virtuales de Ikan Naat IA son presencias inteligentes diseñadas para acompañarte. Conversación natural, memoria de tus preferencias, personalidades únicas y disponibles en cualquier momento.',
    capabilities: [
      'Luna, Sofía, Mateo y más',
      'Conversación natural profunda',
      'Memoria de preferencias',
      'Personalidades únicas',
      'Disponibles 24/7',
    ],
    cta: { label: 'Conocer compañeros →', href: 'https://ikannaat.jeeljel.com' },
    comingSoon: false,
  },
  {
    id: 'izydra',
    name: 'Izydra OS',
    logo: logoIzydra,
    accent: '#c9a84c',
    subtitle: 'Sistema operativo del futuro',
    preview: 'Próximamente — el sistema operativo inteligente de JeelJel Kaanab',
    comingSoon: true,
  },
  {
    id: 'virtyou',
    name: 'VirtYou',
    logo: logoVirtyou,
    accent: '#b464ff',
    subtitle: 'Tu identidad digital',
    preview: 'Próximamente — tu avatar e identidad digital inteligente',
    comingSoon: true,
  },
  {
    id: 'inkognito',
    name: 'Inkógnito',
    logo: logoInkognito,
    accent: '#e05555',
    subtitle: 'Relatos sin censura',
    preview: 'Próximamente — narrativa adulta e historias interactivas con IA',
    comingSoon: true,
  },
]

function CubeBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const elements = []
    const count = 90

    for (let i = 0; i < count; i++) {
      const type = i % 3
      const el = document.createElement('div')
      const size = Math.random() * 38 + 12
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = Math.random() * 14000 + 6000
      const delay = Math.random() * 4000

      if (type === 0) {
        el.style.cssText = `
          position: absolute;
          left: ${x}%;
          top: ${y}%;
          width: ${size}px;
          height: ${size}px;
          border: 1px solid rgba(78, 205, 196, 0.6);
          background: transparent;
          transform-style: preserve-3d;
          animation: cube-spin ${duration}ms linear ${delay}ms infinite;
          pointer-events: none;
        `
      } else if (type === 1) {
        el.style.cssText = `
          position: absolute;
          left: ${x}%;
          top: ${y}%;
          width: 0;
          height: 0;
          border-left: ${size / 2}px solid transparent;
          border-right: ${size / 2}px solid transparent;
          border-bottom: ${size}px solid rgba(201, 168, 76, 0.45);
          background: transparent;
          animation: cube-spin ${duration}ms linear ${delay}ms infinite;
          pointer-events: none;
        `
      } else {
        el.style.cssText = `
          position: absolute;
          left: ${x}%;
          top: ${y}%;
          color: rgba(100, 160, 255, 0.7);
          font-size: ${size * 0.6}px;
          background: transparent;
          user-select: none;
          animation: cube-spin ${duration}ms linear ${delay}ms infinite;
          pointer-events: none;
        `
        el.textContent = '✦'
      }

      container.appendChild(el)
      elements.push(el)
    }

    return () => elements.forEach((node) => node.remove())
  }, [])

  return (
    <div
      ref={containerRef}
      className="apps-shapes"
      aria-hidden
    />
  )
}

function stopInnerClick(e) {
  e.stopPropagation()
}

export default function Apps() {
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    document.body.classList.add('page-apps')
    return () => document.body.classList.remove('page-apps')
  }, [])

  const handleRowClick = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="apps-page">
      <div
        className="apps-mosaic"
        style={{ backgroundImage: `url(${mosaico})` }}
        aria-hidden
      />

      <CubeBackground />

      <div className="apps-content">
        <header className="apps-header">
          <h1>APPS</h1>
          <p>El ecosistema JeelJel Kaanab</p>
        </header>

        <ul className="apps-list">
          {APPS.map((app, index) => {
            const isOpen = openId === app.id
            const indexLabel = String(index + 1).padStart(2, '0')

            return (
              <li
                key={app.id}
                className={`apps-row${isOpen ? ' apps-row--open open' : ''}`}
                onClick={() => handleRowClick(app.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleRowClick(app.id)
                  }
                }}
              >
                <div className="apps-row-grid">
                  <div className="apps-row-left">
                    <span className="apps-row-index">{indexLabel}</span>
                    <div className="apps-row-left-body">
                      <img
                        src={app.logo}
                        alt=""
                        className="apps-row-logo"
                        width={36}
                        height={36}
                      />
                      <div className="apps-row-left-text">
                        <h2 className="apps-row-name" style={{ color: app.accent }}>
                          {app.name}
                        </h2>
                        <p className="apps-row-subtitle">{app.subtitle}</p>
                      </div>
                    </div>
                    {!isOpen ? (
                      <span className="apps-row-toggle" aria-hidden>
                        +
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="apps-row-close"
                        aria-label="Cerrar"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(app.id)
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="apps-row-right">
                    <p className="apps-row-preview cell-preview">{app.preview}</p>

                    <div className="apps-row-desc" onClick={stopInnerClick}>
                      {app.comingSoon ? (
                        <p className="apps-row-soon">Próximamente</p>
                      ) : (
                        <>
                          <p className="apps-row-desc-text">{app.description}</p>
                          {app.cta &&
                            (app.cta.disabled ? (
                              <span
                                className="apps-row-cta"
                                style={{
                                  opacity: 0.55,
                                  cursor: 'not-allowed',
                                  pointerEvents: 'none',
                                }}
                                onClick={stopInnerClick}
                              >
                                {app.cta.label}
                              </span>
                            ) : (
                              <a
                                className="apps-row-cta"
                                href={app.cta.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={stopInnerClick}
                              >
                                {app.cta.label}
                              </a>
                            ))}
                        </>
                      )}
                    </div>

                    <div className="apps-row-caps" onClick={stopInnerClick}>
                      {app.comingSoon ? (
                        <p className="apps-row-soon">Próximamente</p>
                      ) : (
                        <ul>
                          {app.capabilities.map((cap) => (
                            <li key={cap} className="feat">
                              {cap}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
