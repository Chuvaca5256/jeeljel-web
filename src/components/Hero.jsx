// HERO — video del ajolote en src/assets/ajolote_final.webm
// mix-blend-mode: screen hace desaparecer el fondo negro del video
import ajoloteWebm from '../assets/ajolote_final.webm'

export default function Hero() {
  const handleScroll = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden"
      style={{ paddingTop: '80px' }}
    >
      {/* Radial gradient sutil de púrpura para dar profundidad */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(123,45,139,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Gradiente sutil en la base — sin tapar el patrón del body */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 85%, rgba(10,5,8,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
        {/* Badge pill */}
        <div
          className="font-dm text-xs tracking-widest px-4 py-2 rounded-full"
          style={{
            background: 'rgba(123, 45, 139, 0.15)',
            border: '1px solid rgba(123, 45, 139, 0.4)',
            color: '#ffffff',
            letterSpacing: '0.2em',
          }}
        >
          LATINOAMÉRICA · TECNOLOGÍA · IDENTIDAD
        </div>

        {/* Video del ajolote — mix-blend-mode: screen elimina el fondo negro */}
        <div className="relative" style={{ width: '220px', height: '220px' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '220px',
              height: '220px',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              display: 'block',
              margin: '0 auto',
            }}
          >
            <source src={ajoloteWebm} type="video/webm" />
            {/* Fallback MP4 — coloca ajolote_final.mp4 en src/assets/ si lo tienes */}
            {/* <source src={ajoloteMp4} type="video/mp4" /> */}
            Tu navegador no soporta video HTML5.
          </video>
        </div>

        {/* Título en dos líneas */}
        <h1
          className="font-cinzel font-bold leading-tight m-0"
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            letterSpacing: '6px',
          }}
        >
          <span style={{ color: '#ffffff', display: 'block' }}>
            NACIMOS PARA
          </span>
          <span style={{ color: '#c9a84c', display: 'block' }}>
            CREAR IMPERIOS
          </span>
        </h1>

        {/* Subtítulo */}
        <p
          className="font-dm"
          style={{
            color: '#ffffff',
            maxWidth: '480px',
            lineHeight: '1.7',
            fontSize: 'clamp(14px, 2vw, 17px)',
          }}
        >
          Ecosistema de tecnología latinoamericana.
          <br />
          Cinco plataformas. Una misión.
        </p>

        {/* Botones CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            href="#apps"
            onClick={handleScroll('apps')}
            className="font-dm font-medium text-sm tracking-widest px-8 py-3 rounded-lg transition-all duration-200 no-underline"
            style={{
              backgroundColor: '#e85d26',
              color: '#ffffff',
              letterSpacing: '0.12em',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            EXPLORAR APPS
          </a>
          <a
            href="#mision"
            onClick={handleScroll('mision')}
            className="font-dm font-medium text-sm tracking-widest px-8 py-3 rounded-lg transition-all duration-200 no-underline"
            style={{
              border: '1px solid #7b2d8b',
              color: '#ffffff',
              background: 'transparent',
              letterSpacing: '0.12em',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(123,45,139,0.15)'
              e.target.style.borderColor = '#c090d0'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = '#7b2d8b'
            }}
          >
            NUESTRA MISIÓN
          </a>
        </div>
      </div>

      {/* Separador ornamental con diamante dorado al centro */}
      <div className="relative w-full max-w-2xl mt-20 flex items-center justify-center">
        <div
          className="flex-1 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, #7b2d8b, transparent)',
          }}
        />
        {/* Rombo dorado */}
        <div
          className="flex-shrink-0 mx-4"
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#c9a84c',
            transform: 'rotate(45deg)',
            boxShadow: '0 0 8px rgba(201,168,76,0.5)',
          }}
        />
        <div
          className="flex-1 h-px"
          style={{
            background:
              'linear-gradient(to left, transparent, #7b2d8b, transparent)',
          }}
        />
      </div>
    </section>
  )
}
