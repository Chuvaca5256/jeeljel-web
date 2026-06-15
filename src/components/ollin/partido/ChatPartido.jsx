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
    <div className="ollin-chat-partido">
      <div className="ollin-chat-partido__header">
        <span className="ollin-chat-partido__title">Chat en vivo</span>
        <span className="ollin-chat-partido__match">{home} vs {away}</span>
      </div>

      <div className="ollin-chat-partido__body">
        Chat próximamente — conectando backend...
      </div>

      <form className="ollin-chat-partido__form" onSubmit={handleSend}>
        <input
          type="text"
          className="ollin-chat-partido__input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit" className="ollin-chat-partido__send">
          Enviar
        </button>
      </form>

      <div className="ollin-chat-partido__register">
        <a href="/registro">Regístrate para participar →</a>
      </div>
    </div>
  )
}
