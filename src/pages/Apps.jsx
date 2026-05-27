import { useEffect, useState } from 'react'
import mosaico from '../assets/mosaicos/Viracoch.png'
import logoIkanNaat from '../assets/Logo_con_letras_Ikan_Naat_sin_fondo.png'
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
      'Expertos Nivel 2 con protocolos reales',
      'Generación de imágenes con Flux',
      'Compañeros virtuales (Luna, Sofía, Mateo)',
      'Deep Agent — investigación en tiempo real',
      'Agente programador con ejecución real',
      'Videos con Luma AI',
      'Telaraña Deportiva',
    ],
    cta: { label: 'Entrar a Ikan Naat →', href: 'https://ikannaat.jeeljel.com' },
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
                className={`apps-row${isOpen ? ' apps-row--open' : ''}`}
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
                        width={40}
                        height={40}
                      />
                      <div className="apps-row-left-text">
                        <h2 className="apps-row-name" style={{ color: app.accent }}>
                          {app.name}
                        </h2>
                        <p className="apps-row-subtitle">{app.subtitle}</p>
                      </div>
                    </div>
                    <span className="apps-row-toggle" aria-hidden>
                      +
                    </span>
                  </div>

                  <div className="apps-row-right">
                    <p className="apps-row-preview cell-preview">{app.preview}</p>

                    <div className="apps-row-desc" onClick={stopInnerClick}>
                      {app.comingSoon ? (
                        <p className="apps-row-soon">Próximamente</p>
                      ) : (
                        <>
                          <p style={{ margin: 0 }}>{app.description}</p>
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
                            <li key={cap}>{cap}</li>
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
