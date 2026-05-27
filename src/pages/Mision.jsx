import { useEffect } from 'react'
import PageStub from './PageStub'
import Tlaloc from '../assets/mosaicos/Tlaloc.png'

export default function Mision() {
  useEffect(() => {
    document.body.classList.add('page-mision')
    return () => document.body.classList.remove('page-mision')
  }, [])

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
          backgroundImage: `url(${Tlaloc})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
          backgroundPosition: 'center center',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageStub title="MISIÓN" />
      </div>
    </div>
  )
}
