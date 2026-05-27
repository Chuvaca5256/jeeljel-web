// HERO — video del ajolote en src/assets/ajolote_final.webm
// mix-blend-mode: screen hace desaparecer el fondo negro del video
import { useEffect, useRef } from 'react'
import ajoloteWebm from '../assets/ajolote_final.webm'

export default function Hero() {
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)

  useEffect(() => {
    const typewriter = (el, finalText, delay = 0) => {
      el.textContent = ''
      let i = 0
      setTimeout(() => {
        const interval = setInterval(() => {
          el.textContent = finalText.slice(0, i) + '|'
          i++
          if (i > finalText.length) {
            el.textContent = finalText
            clearInterval(interval)
          }
        }, 80)
      }, delay)
    }

    if (line1Ref.current) typewriter(line1Ref.current, 'NACIMOS PARA', 300)
    if (line2Ref.current) typewriter(line2Ref.current, 'CREAR IMPERIOS', 1400)
  }, [])

  const handleScroll = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-start min-h-0 text-center px-6 overflow-hidden pt-12 pb-6 sm:pt-14 sm:pb-8 md:min-h-screen md:pt-20 md:pb-16 lg:pt-24"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(0, 168, 107, 0.15) 0%, transparent 70%)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 85%, rgba(10,5,8,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 md:gap-6 max-w-3xl mx-auto w-full">
        <div
          className="font-dm text-xs tracking-widest px-4 py-2 rounded-full etiqueta-secundaria"
          style={{
            background: 'rgba(0, 168, 107, 0.15)',
            border: '1px solid var(--color-separador)',
            letterSpacing: '0.2em',
          }}
        >
          LATINOAMÉRICA · TECNOLOGÍA · IDENTIDAD
        </div>

        <div className="relative w-[200px] h-[200px] sm:w-[220px] sm:h-[220px]">
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
            Tu navegador no soporta video HTML5.
          </video>
        </div>

        <h1 className="text-center font-black" style={{ lineHeight: 1.1 }}>
          <span
            ref={line1Ref}
            style={{ color: '#4ecdc4', fontSize: 'clamp(2.5rem, 7vw, 5rem)', display: 'block' }}
          >
            NACIMOS PARA
          </span>
          <span
            ref={line2Ref}
            style={{ color: '#c9a84c', fontSize: 'clamp(2.5rem, 7vw, 5rem)', display: 'block' }}
          >
            CREAR IMPERIOS
          </span>
        </h1>

        <p
          className="font-dm"
          style={{
            maxWidth: '480px',
            lineHeight: '1.7',
            fontSize: 'clamp(14px, 2vw, 17px)',
          }}
        >
          Ecosistema de tecnología latinoamericana.
          <br />
          Cinco plataformas. Una misión.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            href="#apps"
            onClick={handleScroll('apps')}
            className="boton-primario font-dm font-medium text-sm tracking-widest px-8 py-3 rounded-lg transition-all duration-200 no-underline"
            style={{ letterSpacing: '0.12em' }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            EXPLORAR APPS
          </a>
          <a
            href="#mision"
            onClick={handleScroll('mision')}
            className="boton-secundario font-dm font-medium text-sm tracking-widest px-8 py-3 rounded-lg transition-all duration-200 no-underline"
            style={{ letterSpacing: '0.12em' }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(78, 205, 196, 0.12)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
            }}
          >
            NUESTRA MISIÓN
          </a>
        </div>
      </div>
    </section>
  )
}
