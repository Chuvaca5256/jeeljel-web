const STATS = [
  { numero: '5',   etiqueta: 'Plataformas'   },
  { numero: '30+', etiqueta: 'Agentes IA'    },
  { numero: '10+', etiqueta: 'Países LATAM'  },
  { numero: '1',   etiqueta: 'Misión'        },
]

export default function Stats() {
  return (
    <section
      className="py-10 px-6"
      style={{ backgroundColor: 'transparent', borderTop: '1px solid #1a0a1a', borderBottom: '1px solid #1a0a1a' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          {STATS.map(({ numero, etiqueta }, i) => (
            <div
              key={etiqueta}
              className="flex flex-col items-center text-center py-4"
              style={{
                borderRight: i < 3 ? '1px solid #2a1a2a' : 'none',
              }}
            >
              <span
                className="font-cinzel font-bold"
                style={{ color: '#c9a84c', fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1 }}
              >
                {numero}
              </span>
              <span
                className="font-dm mt-2 text-xs tracking-widest uppercase"
                style={{ color: '#f5f0e8', letterSpacing: '0.15em' }}
              >
                {etiqueta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
