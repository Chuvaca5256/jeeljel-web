import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function OllinChat() {
  const location = useLocation()
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session)
        setCheckingSession(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (nextSession) setModalOpen(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const isAuthenticated = Boolean(session)

  function openAuthModal() {
    if (!isAuthenticated) setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
  }

  return (
    <section className="ollin-chat" aria-label="Chat en vivo">
      <div className="ollin-chat__header">
        <h2 className="ollin-chat__title">Chat en vivo</h2>
        {!checkingSession && !isAuthenticated && (
          <span className="ollin-chat__hint">Regístrate para participar</span>
        )}
      </div>

      <div className="ollin-chat__messages" aria-live="polite">
        <p className="ollin-chat__empty">
          {isAuthenticated
            ? 'Sé el primero en escribir en este chat.'
            : 'Únete a la conversación del torneo.'}
        </p>
      </div>

      <div
        className="ollin-chat__input-wrap"
        onClick={!isAuthenticated ? openAuthModal : undefined}
        onKeyDown={
          !isAuthenticated
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') openAuthModal()
              }
            : undefined
        }
        role={!isAuthenticated ? 'button' : undefined}
        tabIndex={!isAuthenticated ? 0 : undefined}
        aria-label={!isAuthenticated ? 'Regístrate para participar en el chat' : undefined}
      >
        <input
          type="text"
          className="ollin-chat__input"
          placeholder={
            isAuthenticated ? 'Escribe tu mensaje...' : 'Regístrate para participar en el chat'
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isAuthenticated}
          maxLength={200}
          aria-disabled={!isAuthenticated}
        />
      </div>

      {modalOpen && (
        <div
          className="ollin-chat-modal-overlay"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="ollin-chat-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ollin-chat-modal-title"
          >
            <button
              type="button"
              className="ollin-chat-modal__close"
              onClick={closeModal}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 id="ollin-chat-modal-title" className="ollin-chat-modal__title">
              ¡Únete a la conversación!
            </h3>
            <p className="ollin-chat-modal__text">
              Crea tu cuenta gratis para participar en el chat en vivo.
            </p>
            <div className="ollin-chat-modal__actions">
              <Link
                to="/registro?origen=ollin_chat"
                className="ollin-chat-modal__btn ollin-chat-modal__btn--primary"
                onClick={closeModal}
              >
                Crear cuenta gratis
              </Link>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="ollin-chat-modal__btn ollin-chat-modal__btn--secondary"
                onClick={closeModal}
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
