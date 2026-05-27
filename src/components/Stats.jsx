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
