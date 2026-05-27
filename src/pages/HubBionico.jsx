import { useEffect } from 'react'
import PageStub from './PageStub'
import Macuilxochitl from '../assets/mosaicos/Macuilxochitl.png'

export default function HubBionico() {
  useEffect(() => {
    document.body.classList.add('page-hub-bionico')
    return () => document.body.classList.remove('page-hub-bionico')
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
          backgroundImage: `url(${Macuilxochitl})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '80px 80px',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageStub title="OLLIN DEPORTES" />
      </div>
    </div>
  )
}
