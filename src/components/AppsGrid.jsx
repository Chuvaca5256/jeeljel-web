// LOGOS DE APPS:
// - Hub Biónico: src/assets/Logo_JeelJel_con_balon.png ✓
// - Ikan Naat: coloca Logo_con_letras_Ikan_Naat_sin_fondo.png en src/assets/ y descomenta:
// import logoIkanNaat from '../assets/Logo_con_letras_Ikan_Naat_sin_fondo.png'
import logoConBalon from '../assets/Logo_JeelJel_con_balon.png'

// Cuando tengas el archivo del logo de Ikan Naat, descomenta la línea de arriba
// y reemplaza `null` en la primera app por `logoIkanNaat`
const logoIkanNaat = null

const APPS = [
  {
    nombre: 'Ikan Naat',
    acento: '#1db8a0',
    badge: 'LIVE',
    badgeColor: '#1db8a0',
    desc: 'IA Conversacional para Latinoamérica',
    link: 'https://ikannaat.jeeljel.com',
    linkActivo: true,
    logo: logoIkanNaat, // reemplazar con `logoIkanNaat` cuando esté el archivo
  },
  {
    nombre: 'Hub Biónico Deportivo',
    acento: '#e85d26',
    badge: 'URGENTE',
    badgeColor: '#e85d26',
    desc: 'Seguimiento del Mundial 2026 en tiempo real',
    logo: logoConBalon,
  },
  {
    nombre: 'Virtyou',
    acento: '#7b2d8b',
    badge: 'FASE 1',
    badgeColor: '#7b2d8b',
    desc: 'Identidad digital dinámica con QR y NFC',
  },
  {
    nombre: 'Izydra OS',
    acento: '#c9a84c',
    badge: 'QA',
    badgeColor: '#c9a84c',
    desc: 'SaaS de gestión para seguridad privada',
  },
  {
    nombre: 'Inkógnito',
    acento: '#8b2a2a',
    badge: '+18',
    badgeColor: '#8b2a2a',
    desc: 'Red social adulta · Solo web',
    nota: 'Acceso con verificación de edad',
  },
]

function AppCard({ app }) {
  const content = (
    <div
      className="relative flex flex-col h-full p-5 rounded-xl transition-transform duration-200 cursor-pointer"
      style={{
        background: 'rgba(10, 5, 8, 0.82)',
        border: '1px solid rgba(201, 168, 76, 0.25)',
        borderRadius: '12px',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Borde superior de acento */}
      <div
        className="absolute top-0 left-0 right-0 rounded-t-xl"
        style={{ height: '2px', backgroundColor: app.acento }}
      />

      <div className="flex items-start justify-between mb-3 mt-1">
        {/* Logo si existe, sino nombre en texto */}
        {app.logo ? (
          <img
            src={app.logo}
            alt={app.nombre}
            className="h-10 w-auto object-contain"
            style={{ maxWidth: '70%' }}
          />
        ) : (
          <span
            className="font-cinzel font-bold text-base leading-tight"
            style={{ color: '#ffffff', maxWidth: '72%' }}
          >
            {app.nombre}
          </span>
        )}

        {/* Badge de estado */}
        <span
          className="font-dm text-xs px-2 py-0.5 rounded font-medium flex-shrink-0"
          style={{
            backgroundColor: `${app.badgeColor}22`,
            color: app.badgeColor,
            border: `1px solid ${app.badgeColor}55`,
            letterSpacing: '0.08em',
          }}
        >
          {app.badge}
        </span>
      </div>

      {/* Nombre debajo del logo cuando hay imagen */}
      {app.logo && (
        <span
          className="font-cinzel font-bold text-sm leading-tight mb-1"
          style={{ color: '#ffffff' }}
        >
          {app.nombre}
        </span>
      )}

      <p
        className="font-dm text-sm mt-auto"
        style={{ color: '#ffffff', lineHeight: '1.6' }}
      >
        {app.desc}
      </p>

      {/* Nota discreta para Inkógnito */}
      {app.nota && (
        <p className="font-dm text-xs mt-2" style={{ color: '#ffffff' }}>
          {app.nota}
        </p>
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
      {/* Título — todo en mayúsculas, más impacto */}
      <div className="text-center mb-14">
        <h2
          className="font-cinzel font-bold text-dorado uppercase"
          style={{ fontSize: 'clamp(22px, 4vw, 40px)', letterSpacing: '6px' }}
        >
          EL ECOSISTEMA
        </h2>
        <div
          className="mt-3 h-px w-24 mx-auto"
          style={{ background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }}
        />
      </div>

      {/* Grid de apps */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
      >
        {APPS.map((app) => (
          <AppCard key={app.nombre} app={app} />
        ))}

        {/* Celda "más apps" */}
        <div
          className="flex items-center justify-center p-5 rounded-xl"
          style={{
            background: 'rgba(10, 5, 8, 0.82)',
            border: '1px solid rgba(201, 168, 76, 0.25)',
            borderRadius: '12px',
            minHeight: '120px',
          }}
        >
          <p
            className="font-dm text-sm text-center"
            style={{ color: '#ffffff' }}
          >
            Más aplicaciones<br />en camino...
          </p>
        </div>
      </div>
    </section>
  )
}
