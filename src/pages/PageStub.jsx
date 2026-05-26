import QuetzalDivider from '../components/QuetzalDivider'

export default function PageStub({ title }) {
  return (
    <section
      className="flex flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: '70vh', paddingTop: '100px' }}
    >
      <h1
        className="font-cinzel font-bold uppercase"
        style={{ fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '6px' }}
      >
        {title}
      </h1>
      <QuetzalDivider />
    </section>
  )
}
