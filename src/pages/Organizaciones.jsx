import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import DiosTupa from '../assets/mosaicos/Dios_Tupa.png'

const organizations = [
  {
    name: 'PETA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/PETA_logo.svg/320px-PETA_logo.svg.png',
    descripcion:
      "People for the Ethical Treatment of Animals es la organización de derechos animales más grande del mundo. Desde 1980 luchan incansablemente contra el maltrato en laboratorios, granjas industriales, la industria de la moda y el entretenimiento. Sus investigaciones encubiertas han expuesto crueldades que llevaron a cambios legales en decenas de países. Marcas como H&M, Victoria's Secret y Marc Jacobs han eliminado materiales de origen animal gracias a su presión.",
    impacto:
      '+178,500 acciones directas en 2023 que salvaron animales de laboratorios, circos y granjas industriales.',
    url: 'https://www.peta.org/donate/',
    color: '#c9a84c',
  },
  {
    name: 'UNESCO',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/UNESCO_logo.svg/320px-UNESCO_logo.svg.png',
    descripcion:
      'La Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura trabaja desde 1945 para preservar lo que la humanidad ha construido a lo largo de milenios. Protege sitios arqueológicos, idiomas en peligro de extinción, tradiciones culturales y ecosistemas naturales únicos. Su lista del Patrimonio Mundial es el reconocimiento más importante que existe para un lugar en la Tierra.',
    impacto:
      '1,248 sitios protegidos distribuidos en 170 países, con 196 estados miembros comprometidos.',
    url: 'https://es.unesco.org/',
    color: '#4ecdc4',
  },
  {
    name: 'Cruz Roja',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_the_Red_Cross.svg/240px-Flag_of_the_Red_Cross.svg.png',
    descripcion:
      'El Comité Internacional de la Cruz Roja es la organización humanitaria más antigua del mundo, fundada en 1863. Actúa en zonas de conflicto armado, desastres naturales y crisis sanitarias llevando agua, alimentos, atención médica y comunicación familiar a quienes más lo necesitan. Opera bajo los principios de neutralidad e imparcialidad, lo que le permite llegar donde ningún gobierno puede entrar.',
    impacto:
      'Presencia activa en más de 190 países, respondiendo emergencias humanitarias las 24 horas del día, los 365 días del año.',
    url: 'https://www.icrc.org/es/donar',
    color: '#e63946',
  },
  {
    name: 'UNICEF',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_of_UNICEF.svg/320px-Logo_of_UNICEF.svg.png',
    descripcion:
      'El Fondo de las Naciones Unidas para la Infancia protege a los niños más vulnerables del planeta desde 1946. Garantiza acceso a vacunas, agua potable, educación y protección contra la violencia en zonas de guerra, hambruna y desastre. En un mundo donde millones de niños nacen sin derechos básicos, UNICEF es con frecuencia la única red de protección que existe.',
    impacto:
      'En 2024 respondió a 448 emergencias en 104 países, alcanzando a millones de niñas y niños en situación crítica.',
    url: 'https://www.unicef.org/es/donaciones',
    color: '#00b4d8',
  },
  {
    name: 'WWF',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/WWF_logo.svg/240px-WWF_logo.svg.png',
    descripcion:
      'World Wildlife Fund es la organización de conservación ambiental independiente más grande del mundo, fundada en 1961. Trabaja para detener la degradación del medioambiente y construir un futuro donde los seres humanos vivan en armonía con la naturaleza. Ha logrado recuperar especies al borde de la extinción como el tigre de Bengala y el lince ibérico, y protege ecosistemas enteros en todos los continentes.',
    impacto:
      'Activa en más de 100 países con 6 millones de seguidores. Ayudó a elevar la población de tigres salvajes a 5,574 ejemplares.',
    url: 'https://www.wwf.org.mx/donar/',
    color: '#00a86b',
  },
]

export default function Organizaciones() {
  const gridRef = useRef(null)
  const animatedRef = useRef(new Set())
  const timeoutsRef = useRef([])
  const scrambleIntervalsRef = useRef([])

  function scramble(el, finalText, duration) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'
    const len = finalText.length
    let frame = 0
    const totalFrames = Math.round(duration / 30)
    const iv = setInterval(() => {
      let out = ''
      for (let c = 0; c < len; c++) {
        const progress = frame / totalFrames
        const revealed = c / len < progress * 1.4
        out += revealed
          ? finalText[c]
          : finalText[c] === ' '
            ? ' '
            : chars[Math.floor(Math.random() * chars.length)]
      }
      el.textContent = out
      frame++
      if (frame > totalFrames) {
        el.textContent = finalText
        clearInterval(iv)
      }
    }, 30)
    scrambleIntervalsRef.current.push(iv)
  }

  useEffect(() => {
    document.body.classList.add('page-organizaciones')
    return () => document.body.classList.remove('page-organizaciones')
  }, [])

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.org-card')
    if (!cards?.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const card = entry.target
          if (animatedRef.current.has(card)) return
          animatedRef.current.add(card)
          observer.unobserve(card)

          const index = Number(card.dataset.orgIndex) || 0
          const nameEl = card.querySelector('.org-name')
          const statEl = card.querySelector('.org-stat')
          const nameText = card.dataset.orgName || ''
          const statText = card.dataset.orgStat || ''

          animate(card, {
            opacity: [0, 1],
            y: [32, 0],
            duration: 600,
            delay: (index % 3) * 120,
            ease: 'outExpo',
          })

          const t1 = setTimeout(() => {
            if (nameEl) scramble(nameEl, nameText, 800)
          }, 300)
          const t2 = setTimeout(() => {
            if (statEl) scramble(statEl, statText, 1200)
          }, 700)
          timeoutsRef.current.push(t1, t2)
        })
      },
      { threshold: 0.15 }
    )

    cards.forEach((card) => observer.observe(card))

    return () => {
      observer.disconnect()
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
      scrambleIntervalsRef.current.forEach(clearInterval)
      scrambleIntervalsRef.current = []
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${DiosTupa})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '80px 80px',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <section className="px-6 md:px-12 pt-24 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1
                className="font-cinzel font-bold uppercase mb-4"
                style={{
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  letterSpacing: '6px',
                }}
              >
                ORGANIZACIONES
              </h1>
              <p
                className="font-dm text-sm md:text-base max-w-2xl mx-auto"
                style={{ color: '#ffffff', opacity: 0.7, lineHeight: 1.7 }}
              >
                Causas que JeelJel Kaanab reconoce. Ninguna afiliación — solo
                admiración.
              </p>
            </div>

            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {organizations.map((org, index) => (
                <article
                  key={org.name}
                  className="tarjeta org-card flex flex-col rounded-xl p-6"
                  data-org-index={index}
                  data-org-name={org.name}
                  data-org-stat={org.impacto}
                  style={{
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.45)',
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(4px)',
                    opacity: 0,
                  }}
                >
                  <img
                    src={org.logo}
                    alt={`Logo ${org.name}`}
                    className="h-16 w-auto object-contain mb-4 self-start"
                    loading="lazy"
                  />

                  <h2
                    className="org-name font-cinzel font-bold text-lg mb-3"
                    style={{ color: '#c9a84c', letterSpacing: '1px' }}
                  >
                    {org.name}
                  </h2>

                  <p
                    className="font-dm text-sm mb-4 flex-1"
                    style={{ color: '#ffffff', lineHeight: 1.7 }}
                  >
                    {org.descripcion}
                  </p>

                  <p
                    className="org-stat font-dm text-sm font-medium mb-5"
                    style={{ color: '#4ecdc4', lineHeight: 1.6 }}
                  >
                    {org.impacto}
                  </p>

                  <a
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-dm text-xs px-4 py-2 rounded-lg no-underline self-start transition-all duration-200"
                    style={{
                      border: `1px solid ${org.color}55`,
                      color: org.color,
                      background: 'transparent',
                      letterSpacing: '0.1em',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${org.color}18`
                      e.currentTarget.style.borderColor = `${org.color}88`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = `${org.color}55`
                    }}
                  >
                    Apoyar su causa →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
