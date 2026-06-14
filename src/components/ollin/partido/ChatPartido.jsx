export default function ChatPartido({ partidoId, summary }) {
  const home = summary?.homeTeam?.name ?? 'Local'
  const away = summary?.awayTeam?.name ?? 'Visitante'
  return (
    <div style={{
      marginTop: '24px',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      padding: '16px',
      background: 'rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ color: '#4ecdc4', fontFamily: 'Cinzel, serif', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
          Chat en vivo
        </span>
        <span style={{ color: '#888', fontSize: '0.8rem' }}>{home} vs {away}</span>
      </div>
      <div style={{
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '0.85rem',
      }}>
        Chat próximamente — conectando backend...
      </div>
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <a href="/registro" style={{ color: '#f97316', fontSize: '0.8rem', textDecoration: 'none' }}>
          Regístrate para participar →
        </a>
      </div>
    </div>
  )
}
