// NAVBAR — logo estático en src/assets/Logo_JeelJel_sin_fondo.png
import logoStatic from '../assets/Logo_JeelJel_sin_fondo.png'

export default function Navbar() {
  const handleScroll = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
      style={{
        backgroundColor: 'rgba(10, 5, 8, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2a1a2a',
      }}
    >
      {/* Logo izquierda */}
      <a
        href="#hero"
        onClick={handleScroll('hero')}
        className="flex items-center gap-3 no-underline"
      >
        <img
          src={logoStatic}
          alt="JeelJel Kaanab logo"
          className="h-9 w-auto"
        />
        <span
          className="font-cinzel font-bold text-dorado tracking-widest text-sm md:text-base hidden sm:inline"
          style={{ letterSpacing: '0.2em' }}
        >
          JEELJEL KAANAB
        </span>
      </a>

      {/* Links derecha */}
      <div className="flex items-center gap-6 md:gap-8">
        {[
          { label: 'APPS', id: 'apps' },
          { label: 'MISIÓN', id: 'mision' },
          { label: 'CONTACTO', id: 'footer' },
        ].map(({ label, id }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={handleScroll(id)}
            className="font-dm text-xs md:text-sm tracking-widest transition-colors duration-200 no-underline"
            style={{ color: '#9a7a9a', letterSpacing: '0.15em' }}
            onMouseEnter={(e) => (e.target.style.color = '#c9a84c')}
            onMouseLeave={(e) => (e.target.style.color = '#9a7a9a')}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}
