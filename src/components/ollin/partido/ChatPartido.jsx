import { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { supabase } from '../../../lib/supabaseClient'

const MAX_MESSAGES = 200
const FLUSH_MS = 500
const COOLDOWN_MS = 4000

function msgMatchId(msg) {
  return msg?.matchId ?? msg?.match_id
}

function msgDisplayName(msg) {
  return msg?.displayName ?? msg?.display_name ?? 'Anónimo'
}

export default function ChatPartido({ partidoId, summary }) {
  const [messages, setMessages] = useState([])
  const [pinnedMessage, setPinnedMessage] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [blockError, setBlockError] = useState(null)

  const bodyRef = useRef(null)
  const pendingRef = useRef([])

  const home = summary?.homeTeam?.name ?? 'Local'
  const away = summary?.awayTeam?.name ?? 'Visitante'

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setUser(data.session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null)
    })
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let mounted = true
    let socket
    let flushInterval

    async function init() {
      try {
        const { data } = await supabase.auth.getSession()
        const sessionUser = data.session?.user ?? null
        const q = sessionUser?.id ? `?userId=${encodeURIComponent(sessionUser.id)}` : ''
        const statusRes = await fetch(`/api/ollin/chat/status${q}`)
        if (statusRes.ok) {
          const status = await statusRes.json()
          if (!status.canSend && status.userMessage) {
            setBlockError(status.userMessage)
          }
        }
      } catch {
        /* status opcional */
      }

      try {
        socket = io(window.location.origin, {
          path: '/socket.io',
          transports: ['websocket', 'polling'],
        })

        socket.on('ollin:chat:message', (msg) => {
          if (String(msgMatchId(msg)) !== String(partidoId)) return
          if (msg.tipo === 'bot' || msg.tipo === 'telarana') {
            setPinnedMessage(msg)
          }
          pendingRef.current.push(msg)
        })
      } catch {
        /* socket opcional */
      }

      flushInterval = setInterval(() => {
        if (pendingRef.current.length === 0) return
        const batch = pendingRef.current.splice(0)
        setMessages((prev) => {
          const next = [...prev, ...batch]
          return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next
        })
      }, FLUSH_MS)
    }

    init()

    return () => {
      mounted = false
      clearInterval(flushInterval)
      socket?.disconnect()
    }
  }, [partidoId])

  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  const handleSend = useCallback(async (e) => {
    e.preventDefault()
    if (!user) {
      setShowModal(true)
      return
    }
    if (cooldown || sending) return

    const trimmed = message.trim()
    const words = trimmed.split(/\s+/).filter(Boolean)
    if (words.length > 50) {
      setBlockError('Máximo 50 palabras por mensaje')
      setTimeout(() => setBlockError(null), 5000)
      return
    }
    if (!trimmed) return

    setSending(true)
    try {
      const res = await fetch('/api/ollin/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: partidoId,
          message: trimmed,
          userId: user.id,
          displayName: user.user_metadata?.nombre || user.email,
        }),
      })
      const result = await res.json()

      if (result.ok) {
        setMessage('')
        setCooldown(true)
        setTimeout(() => setCooldown(false), COOLDOWN_MS)
      } else if (result.userMessage) {
        setBlockError(result.userMessage)
        setTimeout(() => setBlockError(null), 5000)
      }
    } catch {
      setBlockError('No se pudo enviar el mensaje')
      setTimeout(() => setBlockError(null), 5000)
    } finally {
      setSending(false)
    }
  }, [user, cooldown, sending, message, partidoId])

  return (
    <div className="ollin-chat-partido">
      {pinnedMessage && (
        <div className="ollin-chat-partido__pinned">
          <span>📌 Telaraña</span>
          <p>{pinnedMessage.message}</p>
        </div>
      )}

      <div className="ollin-chat-partido__header">
        <span>Chat en vivo</span>
        <span>{home} vs {away}</span>
      </div>

      {blockError && (
        <div className="ollin-chat-partido__error">{blockError}</div>
      )}

      <div className="ollin-chat-partido__body" ref={bodyRef}>
        {messages.map((msg, i) => (
          <div
            key={msg.id || i}
            className={`ollin-chat-msg${msg.tipo === 'bot' ? ' ollin-chat-msg--bot' : ''}`}
          >
            <span className="ollin-chat-msg__name">{msgDisplayName(msg)}</span>
            <span className="ollin-chat-msg__text">{msg.message}</span>
          </div>
        ))}
      </div>

      <form className="ollin-chat-partido__form" onSubmit={handleSend}>
        <input
          type="text"
          className="ollin-chat-partido__input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={user ? 'Escribe un mensaje...' : 'Regístrate para participar'}
          disabled={sending || cooldown}
          onClick={() => !user && setShowModal(true)}
          readOnly={!user}
        />
        <button type="submit" disabled={sending || cooldown || !user}>
          {sending ? '...' : 'Enviar'}
        </button>
      </form>

      {showModal && (
        <div className="ollin-chat-partido__modal" onClick={() => setShowModal(false)}>
          <div className="ollin-chat-partido__modal-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ollin-chat-partido__modal-close"
              onClick={() => setShowModal(false)}
            >✕</button>
            <p>Únete al chat en vivo</p>
            <a
              href={`/registro?origen=ollin_deportes&return=/ollin-deportes/partido/${partidoId}`}
              className="ollin-chat-partido__modal-btn ollin-chat-partido__modal-btn--primary"
            >
              Crear cuenta gratis
            </a>
            <a
              href={`/login?return=/ollin-deportes/partido/${partidoId}`}
              className="ollin-chat-partido__modal-btn ollin-chat-partido__modal-btn--secondary"
            >
              Ya tengo cuenta — Iniciar sesión
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
