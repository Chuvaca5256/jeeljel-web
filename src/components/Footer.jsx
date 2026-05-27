// FOOTER — logo estático en src/assets/Logo_JeelJel_sin_fondo.png
import logoStatic from '../assets/Logo_JeelJel_sin_fondo.png'
import Divider from './Divider'

export default function Footer() {
  return (
    <footer
      id="footer"
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
