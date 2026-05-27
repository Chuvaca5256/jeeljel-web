// FOOTER — logo estático en src/assets/Logo_JeelJel_sin_fondo.png
import { Link } from 'react-router-dom'
import logoStatic from '../assets/Logo_JeelJel_sin_fondo.png'
import Divider from './Divider'

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="pt-2 pb-12 px-6 md:px-12"
      style={{ backgroundColor: 'transparent' }}
    >
      <Divider />
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 text-center">
        {/* Logo + nombre */}
        <div className="flex items-center gap-3">
          <img src={logoStatic} alt="JeelJel Kaanab" className="h-8 w-auto" />
          <span
            className="font-cinzel font-bold text-dorado tracking-widest text-sm"
            style={{ letterSpacing: '0.2em' }}
          >
            JEELJEL KAANAB
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {[
            { label: 'jeejel.com', href: 'https://jeejel.com' },
            { label: 'ikannaat.jeeljel.com', href: 'https://ikannaat.jeeljel.com' },
            { label: 'hola@jeeljel.com', href: 'mailto:hola@jeeljel.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-dm text-sm transition-colors duration-200 no-underline"
              style={{ color: 'var(--color-boton-secundario)' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--color-titulo)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--color-boton-secundario)')}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {[
            { label: 'Aviso de Privacidad', to: '/privacidad' },
            { label: 'Términos de Uso', to: '/terminos' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="font-dm text-sm transition-colors duration-200 no-underline"
              style={{ color: '#4ecdc4' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#c9a84c'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4ecdc4'
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="font-dm text-xs" style={{ color: '#ffffff' }}>
          © 2026 JeelJel Kaanab — Todos los derechos reservados
        </p>

        {/* Frase final */}
        <p
          className="font-cinzel text-xs tracking-widest etiqueta-secundaria"
          style={{ opacity: 0.85, letterSpacing: '0.2em' }}
        >
          "Nacimos para crear imperios"
        </p>
      </div>
    </footer>
  )
}
