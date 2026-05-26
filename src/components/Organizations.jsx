/*
 * ORGANIZACIONES ADMIRADAS
 * Nota: los logos reales de UNICEF, Cruz Roja, WWF y PETA se agregarán
 * cuando tengamos permiso formal de cada organización.
 * Por ahora se muestra solo el nombre en Cinzel.
 */

const ORGS = [
  {
    nombre: 'UNICEF',
    desc: 'Fondo de las Naciones Unidas para la Infancia — protección de derechos de niños en todo el mundo.',
    donarUrl: 'https://www.unicef.org/es/donar',
    color: '#1CABE2',
  },
  {
    nombre: 'Cruz Roja Internacional',
    desc: 'Comité Internacional de la Cruz Roja — asistencia humanitaria en zonas de conflicto y desastre.',
    donarUrl: 'https://www.icrc.org/es/donaciones',
    color: '#ED1B2E',
  },
  {
    nombre: 'WWF',
    desc: 'World Wildlife Fund — conservación de la biodiversidad y lucha contra el cambio climático global.',
    donarUrl: 'https://www.worldwildlife.org/pages/donate',
    color: '#FF6600',
  },
  {
    nombre: 'PETA',
    desc: 'People for the Ethical Treatment of Animals — derechos y bienestar animal en todas sus formas.',
    donarUrl: 'https://www.peta.org/donate/',
    color: '#CF1F00',
  },
]

export default function Organizations() {
  return (
    <section
      className="py-20 px-6 md:px-12"
      style={{ backgroundColor: '#08040a', borderTop: '1px solid #150a15' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Encabezado */}
        <div className="text-center mb-3">
          <h2
            className="font-cinzel font-bold text-dorado"
            style={{ fontSize: 'clamp(18px, 3vw, 30px)', letterSpacing: '3px' }}
          >
            Organizaciones que admiramos
          </h2>
        </div>
        <p
          className="font-dm text-center mb-12 text-sm"
          style={{ color: '#6a4a6a' }}
        >
          No son socios ni aliados — son causas que creemos merecen existir.
        </p>

        {/* Cards horizontales */}
        <div className="flex flex-col gap-4">
          {ORGS.map((org) => (
            <div
              key={org.nombre}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: '#0d060d',
                border: '0.5px solid #1e0e1e',
                borderRadius: '12px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2a1a2a')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e0e1e')}
            >
              {/* Nombre */}
              <div className="flex-shrink-0" style={{ minWidth: '180px' }}>
                <span
                  className="font-cinzel font-bold"
                  style={{ color: '#f5f0e8', fontSize: '14px', letterSpacing: '1px' }}
                >
                  {org.nombre}
                </span>
              </div>

              {/* Descripción */}
              <p
                className="font-dm text-sm flex-1"
                style={{ color: '#7a5a7a', lineHeight: '1.6' }}
              >
                {org.desc}
              </p>

              {/* Botón donar con color de la organización */}
              <a
                href={org.donarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-dm text-xs px-4 py-2 rounded-lg no-underline flex-shrink-0 transition-all duration-200"
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
                Donar →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
