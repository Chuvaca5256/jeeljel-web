/* ─── Iconos SVG precolombinos ─────────────────────────── */
const PiramideIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {/* Pirámide escalonada maya — Identidad */}
    <path d="M24 6 L42 40 H6 Z" stroke="#c9a84c" strokeWidth="1.5" strokeLinejoin="round"/>
    <line x1="6"  y1="40" x2="42" y2="40" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="12" y1="32" x2="36" y2="32" stroke="#c9a84c" strokeWidth="1"  strokeOpacity="0.55"/>
    <line x1="18" y1="24" x2="30" y2="24" stroke="#c9a84c" strokeWidth="1"  strokeOpacity="0.4"/>
    <line x1="22" y1="16" x2="26" y2="16" stroke="#c9a84c" strokeWidth="1"  strokeOpacity="0.3"/>
  </svg>
)

const ChipIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {/* Chip / circuito — Tecnología */}
    <rect x="13" y="13" width="22" height="22" rx="2" stroke="#c9a84c" strokeWidth="1.5"/>
    <rect x="18" y="18" width="12" height="12" rx="1" fill="rgba(201,168,76,0.12)" stroke="#c9a84c" strokeWidth="1"/>
    {/* Pines horizontales */}
    <line x1="3"  y1="18" x2="13" y2="18" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="3"  y1="24" x2="13" y2="24" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="3"  y1="30" x2="13" y2="30" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="35" y1="18" x2="45" y2="18" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="35" y1="24" x2="45" y2="24" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="35" y1="30" x2="45" y2="30" stroke="#c9a84c" strokeWidth="1.5"/>
    {/* Pines verticales */}
    <line x1="18" y1="3"  x2="18" y2="13" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="24" y1="3"  x2="24" y2="13" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="30" y1="3"  x2="30" y2="13" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="18" y1="35" x2="18" y2="45" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="24" y1="35" x2="24" y2="45" stroke="#c9a84c" strokeWidth="1.5"/>
    <line x1="30" y1="35" x2="30" y2="45" stroke="#c9a84c" strokeWidth="1.5"/>
  </svg>
)

const AmericaIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {/* Mapa simplificado de América — Sin Límites */}
    {/* Norte */}
    <path d="M20 4 C16 5 14 9 15 13 L17 18 C14 20 13 24 14 29 L16 35 C17 39 19 42 22 43 C25 44 27 41 27 38 L27 33 C29 29 33 30 34 27 C37 22 35 15 31 10 L28 7 C26 5 23 3 20 4 Z"
      stroke="#c9a84c" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(201,168,76,0.06)"/>
    {/* Línea del ecuador */}
    <line x1="12" y1="26" x2="36" y2="26" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="2,3"/>
    {/* Punto central */}
    <circle cx="24" cy="24" r="1.5" fill="#c9a84c" fillOpacity="0.6"/>
  </svg>
)

/* ─── Datos de pilares ─────────────────────────────────── */
const PILARES = [
  {
    Icono: PiramideIcon,
    titulo: 'Identidad Maya',
    desc: 'Tecnología construida desde nuestra raíz. Nombres, símbolos y cosmovisión que nos definen.',
  },
  {
    Icono: ChipIcon,
    titulo: 'Tecnología de clase mundial',
    desc: 'Productos que compiten globalmente, construidos en Latinoamérica, para el mundo.',
  },
  {
    Icono: AmericaIcon,
    titulo: 'Sin límites',
    desc: 'La geografía no define el alcance. Nuestro ecosistema crece sin fronteras.',
  },
]

const IMPERIOS = ['Imperio Azteca', 'Imperio Maya', 'Imperio Inca']

export default function Mission() {
  return (
    <section
      id="mision"
      className="py-24 px-6 md:px-12"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Cita principal */}
        <div className="text-center mb-16">
          <p
            className="font-cinzel font-bold leading-tight"
            style={{
              color: '#c9a84c',
              fontSize: 'clamp(20px, 3.5vw, 36px)',
              letterSpacing: '2px',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            &ldquo;Latinoamérica puede crear tecnología de clase mundial&rdquo;
          </p>
          <div
            className="mt-6 h-px w-32 mx-auto"
            style={{ background: 'linear-gradient(to right, transparent, #7b2d8b, transparent)' }}
          />
        </div>

        {/* Tres pilares — 3 columnas en desktop, 1 en móvil */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {PILARES.map((p) => (
            <div key={p.titulo} className="flex flex-col items-center text-center">
              <div className="mb-5">
                <p.Icono />
              </div>
              <h3
                className="font-cinzel font-bold mb-3"
                style={{ color: '#f5f0e8', fontSize: '15px', letterSpacing: '1px' }}
              >
                {p.titulo}
              </h3>
              <p className="font-dm text-sm" style={{ color: '#9a7a9a', lineHeight: '1.7' }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tags de imperios */}
        <div className="flex flex-wrap justify-center gap-3">
          {IMPERIOS.map((imperio) => (
            <span
              key={imperio}
              className="font-dm text-xs px-4 py-2 rounded-full"
              style={{
                border: '1px solid rgba(201,168,76,0.3)',
                color: '#c9a84c',
                backgroundColor: 'rgba(201,168,76,0.05)',
                letterSpacing: '0.1em',
              }}
            >
              {imperio}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
