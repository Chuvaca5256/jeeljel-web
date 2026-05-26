// NAVBAR — logo estático en src/assets/Logo_JeelJel_sin_fondo.png
import { Link, NavLink } from 'react-router-dom'
import logoStatic from '../assets/Logo_JeelJel_sin_fondo.png'

const NAV_LINKS = [
  { label: 'APPS', to: '/apps' },
  { label: 'HUB BIÓNICO', to: '/hub-bionico' },
  { label: 'MISIÓN', to: '/mision' },
  { label: 'ORGANIZACIONES', to: '/organizaciones' },
  { label: 'CONTACTO', to: '/contacto' },
]

const linkStyle = {
  color: '#ffffff',
  letterSpacing: '0.15em',
  transition: 'color 0.2s ease',
}

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-4"
      style={{
        background: 'rgba(10, 5, 8, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-separador)',
        zIndex: 100,
      }}
    >
      <Link to="/" className="flex items-center gap-3 no-underline">
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
      </Link>

      <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-end">
        {NAV_LINKS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className="font-dm text-xs md:text-sm tracking-widest no-underline"
            style={linkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#c9a84c'
            }}
            onMouseLeave={(e) => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
              e.currentTarget.style.color = isActive ? '#c9a84c' : '#ffffff'
            }}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
