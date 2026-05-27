import logoHubBionico from '../assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png'
import logoIkanNaat from '../assets/Logo_con_letras_Ikan_Naat_sin_fondo.png'
import logoVirtyou from '../assets/Logo_virtyou_sin_fondo.png'
import logoIzydra from '../assets/Logo_Izydra_OS_Sin_fondo.png'
import logoInkognito from '../assets/Logo_inkognito_sin_fondo.png'

const APPS = [
  {
    nombre: 'Ikan Naat',
    acento: '#1db8a0',
    badge: 'LIVE',
    badgeColor: '#1db8a0',
    desc: 'IA Conversacional para Latinoamérica',
    link: 'https://ikannaat.jeeljel.com',
    linkActivo: true,
    logo: logoIkanNaat,
  },
  {
    nombre: 'Hub Biónico Deportivo',
    acento: '#e85d26',
    badge: 'URGENTE',
    badgeColor: '#e85d26',
    desc: 'Seguimiento del Mundial 2026 en tiempo real',
    logo: logoHubBionico,
  },
  {
    nombre: 'Virtyou',
    acento: '#7b2d8b',
    badge: 'FASE 1',
    badgeColor: '#7b2d8b',
    desc: 'Identidad digital dinámica con QR y NFC',
    logo: logoVirtyou,
  },
  {
    nombre: 'Izydra OS',
    acento: '#c9a84c',
    badge: 'QA',
    badgeColor: '#c9a84c',
    desc: 'SaaS de gestión para seguridad privada',
    logo: logoIzydra,
  },
  {
    nombre: 'Inkógnito',
    acento: '#8b2a2a',
    badge: '+18',
    badgeColor: '#8b2a2a',
    desc: 'Red social adulta · Solo web',
    nota: 'Acceso con verificación de edad',
    logo: logoInkognito,
  },
]

const LOGO_STYLE = {
  position: 'absolute',
  top: '12px',
  left: '12px',
  width: '36px',
  height: '36px',
  objectFit: 'contain',
}

function AppCard({ app }) {
  const content = (
    <div
      className="tarjeta relative flex flex-col h-full p-5 pt-14 rounded-xl transition-transform duration-200 cursor-pointer"
      style={{ borderRadius: '12px' }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div
        className="absolute top-0 left-0 right-0 rounded-t-xl"
        style={{ height: '2px', backgroundColor: 'var(--color-titulo-secundario)' }}
      />

      <img src={app.logo} alt={app.nombre} style={LOGO_STYLE} />

      <span
        className="absolute top-3 right-3 font-dm text-xs px-2 py-0.5 rounded font-medium etiqueta-secundaria"
        style={{
          backgroundColor: 'rgba(0, 168, 107, 0.15)',
          border: '1px solid var(--color-separador)',
          letterSpacing: '0.08em',
        }}
      >
        {app.badge}
      </span>

      <span
        className="font-cinzel font-bold text-sm leading-tight mb-2 pr-16"
        style={{ color: 'var(--color-titulo)' }}
      >
        {app.nombre}
      </span>

      <p className="font-dm text-sm mt-auto" style={{ lineHeight: '1.6' }}>
        {app.desc}
      </p>

      {app.nota && (
        <p className="font-dm text-xs mt-2">{app.nota}</p>
      )}
    </div>
  )

  if (app.linkActivo) {
    return (
      <a
        href={app.link}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline block"
      >
        {content}
      </a>
    )
  }
  return content
}

export default function AppsGrid() {
  return (
    <section id="apps" className="py-24 px-6 md:px-12 max-w-6xl mx-auto w-full">
      <div className="text-center mb-14">
        <h2
          className="font-cinzel font-bold uppercase"
          style={{ fontSize: 'clamp(22px, 4vw, 40px)', letterSpacing: '6px' }}
        >
          EL ECOSISTEMA
        </h2>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
      >
        {APPS.map((app) => (
          <AppCard key={app.nombre} app={app} />
        ))}

        <div
          className="tarjeta flex items-center justify-center p-5 rounded-xl"
          style={{ borderRadius: '12px', minHeight: '120px' }}
        >
          <p className="font-dm text-sm text-center">
            Más aplicaciones<br />en camino...
          </p>
        </div>
      </div>
    </section>
  )
}
