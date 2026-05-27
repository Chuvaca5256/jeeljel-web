import { useEffect, useRef } from 'react'
import mosaico from '../assets/mosaicos/Viracoch.png'

function CubeBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cubes = []
    const count = 55

    for (let i = 0; i < count; i++) {
      const type = i % 3
      const el = document.createElement('div')
      const size = Math.random() * 40 + 20
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = Math.random() * 8000 + 6000
      const delay = Math.random() * 4000

      if (type === 0) {
        el.style.cssText = `
          position: absolute;
          width: ${size}px; height: ${size}px;
          left: ${x}%; top: ${y}%;
          border: 1px solid rgba(78, 205, 196, 0.6);
          transform-style: preserve-3d;
          animation: cube-spin ${duration}ms linear ${delay}ms infinite;
          pointer-events: none;
        `
      } else if (type === 1) {
        el.style.cssText = `
          position: absolute;
          width: ${size}px; height: ${size}px;
          left: ${x}%; top: ${y}%;
          border: 1px solid rgba(201, 168, 76, 0.6);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          background: rgba(201, 168, 76, 0.08);
          transform-style: preserve-3d;
          animation: cube-spin ${duration}ms linear ${delay}ms infinite;
          pointer-events: none;
        `
      } else {
        el.style.cssText = `
          position: absolute;
          left: ${x}%; top: ${y}%;
          color: rgba(100, 160, 255, 0.7);
          font-size: ${size * 0.6}px;
          animation: cube-spin ${duration}ms linear ${delay}ms infinite;
          pointer-events: none;
          user-select: none;
        `
        el.textContent = '✦'
      }

      container.appendChild(el)
      cubes.push(el)
    }

    return () => cubes.forEach((c) => c.remove())
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

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

      <CubeBackground />

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
