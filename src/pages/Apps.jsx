import { useEffect } from 'react'
import mosaico from '../assets/mosaicos/Viracoch.png'

export default function Apps() {
  useEffect(() => {
    document.body.classList.add('page-apps')
    return () => document.body.classList.remove('page-apps')
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#1a0400' }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${mosaico})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '80px 80px',
          opacity: 0.12,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          padding: '120px 40px 40px',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            fontFamily: "'Cinzel', serif",
            fontSize: '32px',
            fontWeight: 700,
            color: '#4ecdc4',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginTop: 0,
            marginBottom: '10px',
          }}
        >
          Apps
        </h1>
        <p
          style={{
            textAlign: 'center',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            color: 'rgba(255,255,255,0.75)',
            marginTop: 0,
            marginBottom: '48px',
          }}
        >
          El ecosistema JeelJel Kaanab.
        </p>
      </div>
    </div>
  )
}
