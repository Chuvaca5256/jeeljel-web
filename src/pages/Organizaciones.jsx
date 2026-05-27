import PageStub from './PageStub'
import DiosTupa from '../assets/mosaicos/Dios_Tupa.png'

export default function Organizaciones() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${DiosTupa})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '80px 80px',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageStub title="ORGANIZACIONES" />
      </div>
    </div>
  )
}
