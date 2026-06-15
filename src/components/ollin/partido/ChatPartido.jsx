import { useState } from 'react'

export default function ChatPartido({ partidoId, summary }) {
  const [message, setMessage] = useState('')
  const home = summary?.homeTeam?.name ?? 'Local'
  const away = summary?.awayTeam?.name ?? 'Visitante'

  const handleSend = (e) => {
    e.preventDefault()
    const words = message.trim().split(/\s+/).filter(Boolean)
    if (words.length > 50) {
      alert('Máximo 50 palabras por mensaje')
      return
    }
    if (!message.trim()) return
    // TODO CHAT-1: POST /chat/messages
    setMessage('')
  }

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
      <form onSubmit={handleSend} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '6px',
            padding: '8px 10px',
            color: '#fff',
            fontSize: '0.85rem',
          }}
        />
        <button
          type="submit"
          style={{
            background: '#f97316',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 14px',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          Enviar
        </button>
      </form>
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <a href="/registro" style={{ color: '#f97316', fontSize: '0.8rem', textDecoration: 'none' }}>
          Regístrate para participar →
        </a>
      </div>
    </div>
  )
}
