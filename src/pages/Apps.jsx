import mosaico from '../assets/mosaicos/Viracoch.png';

export default function Apps() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#1a0400' }}>
      
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${mosaico})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '80px 80px',
        opacity: 0.08,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '80px 40px' }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: 700,
          color: '#4ecdc4',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}>Apps</h1>
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.45)',
          marginBottom: '48px'
        }}>El ecosistema JeelJel Kaanab.</p>
      </div>

    </div>
  );
}
