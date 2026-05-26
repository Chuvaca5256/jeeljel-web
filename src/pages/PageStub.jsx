export default function PageStub({ title }) {
  return (
    <section
      className="flex flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: '70vh', paddingTop: '100px' }}
    >
      <h1
        className="font-cinzel font-bold text-dorado uppercase"
        style={{ fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '6px' }}
      >
        {title}
      </h1>
      <div
        className="mt-4 h-px w-24"
        style={{ background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }}
      />
    </section>
  )
}
