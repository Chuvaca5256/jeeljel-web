function scrollToContacto() {
  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
}

export default function Stats() {
  return (
    <section
      className="py-12 px-6 md:px-12"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <p
          className="font-dm mb-6"
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.75,
          }}
        >
          JeelJel Kaanab es un ecosistema de tecnología 100% latinoamericano.
          Cinco plataformas activas y creciendo — también apoyamos a emprendedores
          e independientes a hacer realidad sus proyectos.
        </p>
        <p
          className="font-dm mb-6"
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.75,
          }}
        >
          ¿Tienes una idea?
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            margin: '24px auto',
            maxWidth: '640px',
          }}
        >
          {[
            { code: 'mx', url: 'https://www.google.com/search?q=m%C3%A9xico' },
            { code: 'ar', url: 'https://www.google.com/search?q=Argentina' },
            { code: 'co', url: 'https://www.google.com/search?q=colombia' },
            { code: 'cl', url: 'https://www.google.com/search?q=Chile' },
            { code: 'pe', url: 'https://www.google.com/search?q=Peru' },
            { code: 've', url: 'https://www.google.com/search?q=Venezuela' },
            { code: 'ec', url: 'https://www.google.com/search?q=Ecuador' },
            { code: 'bo', url: 'https://www.google.com/search?q=Bolivia' },
            { code: 'py', url: 'https://www.google.com/search?q=Paraguay' },
            { code: 'uy', url: 'https://www.google.com/search?q=Uruguay' },
            { code: 'gt', url: 'https://www.google.com/search?q=Guatemala' },
            { code: 'hn', url: 'https://www.google.com/search?q=Honduras' },
            { code: 'sv', url: 'https://www.google.com/search?q=El+Salvador' },
            { code: 'cu', url: 'https://www.google.com/search?q=Cuba' },
            { code: 'do', url: 'https://www.google.com/search?q=Republica+Dominicana' },
            { code: 'pr', url: 'https://www.google.com/search?q=Puerto+Rico' },
            { code: 'pa', url: 'https://www.google.com/search?q=Panama' },
            { code: 'cr', url: 'https://www.google.com/search?q=Costa+Rica' },
            { code: 'ni', url: 'https://www.google.com/search?q=Nicaragua' },
            { code: 'br', url: 'https://www.google.com/search?q=Brasil' },
          ].map((c) => (
            <a
              key={c.code}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                borderRadius: '4px',
                overflow: 'hidden',
                transition: 'transform 0.2s, opacity 0.2s',
                opacity: 0.85,
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)'
                e.currentTarget.style.opacity = '1'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.opacity = '0.85'
              }}
            >
              <img
                src={`https://flagcdn.com/32x24/${c.code}.png`}
                width="32"
                height="24"
                alt={c.code}
                style={{ display: 'block' }}
              />
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={scrollToContacto}
          className="boton-secundario font-dm font-medium text-sm tracking-widest px-8 py-3 rounded-lg transition-all duration-200"
          style={{ letterSpacing: '0.15em', cursor: 'pointer' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(78, 205, 196, 0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          Contáctanos
        </button>
      </div>
    </section>
  )
}
