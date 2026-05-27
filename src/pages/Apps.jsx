import { useEffect, useState } from 'react'
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
      'El ecosistema de inteligencia artificial de Latinoamérica. Expertos especializados con protocolos reales (médico, abogado, psicólogo, nutriólogo, financiero), generación de imágenes con Flux, videos con Luma AI, compañeros virtuales y agente programador.',
    capabilities: [
      '🧠 Expertos Nivel 2 — Médico, abogado, psicólogo, nutriólogo, financiero, dentista, veterinario y más con protocolos clínicos reales',
      '🎨 Imágenes con IA — Genera imágenes fotorrealistas e ilustraciones en segundos con Flux',
      '🎬 Videos con IA — Crea clips y animaciones con Luma AI directo desde el chat',
      '💕 Compañeros Virtuales — Luna, Sofía, Mateo y más: presencias inteligentes disponibles 24/7 con memoria',
      '🔍 Deep Agent Web — Investiga en internet en tiempo real y sintetiza la información al instante',
      '💻 Agente Programador — Genera, ejecuta y descarga apps web completas con código real',
      '⚽ Telaraña Deportiva — Picks diarios, parlays y análisis de fútbol, NBA, NFL con datos en tiempo real',
      '🗣️ Videollamada con IA — Sesiones en vivo con expertos: cámara, audio y detección emocional',
      '📄 Análisis de documentos — Procesa Word, Excel, PDF y archivos con IA especializada',
      '💰 Desde $0 — Plan gratuito real, sin trampa, con acceso a funciones clave desde el primer día',
    ],
    cta: { label: 'Entrar a Ikan Naat →', href: 'https://ikannaat.jeeljel.com' },
    comingSoon: false,
  },
  {
    id: 'telarana',
    name: 'Telaraña Deportiva',
    logo: logoTelarana,
    accent: '#f97316',
    subtitle: 'Análisis deportivo con IA',
    preview: 'Picks, parlays y análisis de partidos en tiempo real',
    description:
      'La Telaraña Deportiva es el agente de análisis deportivo de Ikan Naat IA. Picks diarios, parlays, momios, análisis de fútbol, NBA, NFL y más — con datos en tiempo real y contexto latinoamericano.',
    capabilities: [
      'Picks diarios con datos reales',
      'Análisis de momios y parlays',
      'Fútbol, NBA, NFL, MLB',
      'Datos en tiempo real vía API',
      'Contexto LATAM',
    ],
    cta: { label: 'Ir a Telaraña →', href: 'https://ikannaat.jeeljel.com' },
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
                          {app.cta && (
                            <a
                              className="apps-row-cta"
                              href={app.cta.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={stopInnerClick}
                            >
                              {app.cta.label}
                            </a>
                          )}
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
