// NAVBAR — logo estático en src/assets/Logo_JeelJel_sin_fondo.png
import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import logoStatic from '../assets/Logo_JeelJel_sin_fondo.png'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'APPS', to: '/apps' },
  { label: 'OLLIN DEPORTES', to: '/ollin-deportes' },
  { label: 'MISIÓN', to: '/mision' },
  { label: 'ORGANIZACIONES', to: '/organizaciones' },
]

export default function Navbar() {
  const [userSession, setUserSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserSession(data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav
      className="sticky top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-4"
      style={{
        background: 'rgba(10, 5, 8, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
            style={({ isActive }) => ({
              color: isActive ? '#c9a84c' : '#ffffff',
              letterSpacing: '0.15em',
              transition: 'color 0.2s ease',
            })}
          >
            {label}
          </NavLink>
        ))}
        {userSession ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="navbar-signout-btn"
          >
            Cerrar sesión
          </button>
        ) : (
          <a href="/login" className="navbar-login-link">
            Iniciar sesión
          </a>
        )}
      </div>
    </nav>
  )
}
