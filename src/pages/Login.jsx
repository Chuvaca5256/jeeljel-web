import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import mosaico from '../assets/mosaicos/Tlaloc.png'
import { supabase } from '../lib/supabaseClient'
import './AuthPage.css'

function formatAuthError(message) {
  if (!message) return 'No pudimos iniciar sesión. Verifica tus datos.'
  if (/invalid login credentials/i.test(message)) {
    return 'Correo o contraseña incorrectos.'
  }
  if (/email not confirmed/i.test(message)) {
    return 'Confirma tu correo antes de iniciar sesión.'
  }
  return message
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirectTo = location.state?.from || '/'

  useEffect(() => {
    document.body.classList.add('page-auth')
    return () => document.body.classList.remove('page-auth')
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError(formatAuthError(signInError.message))
        return
      }

      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(formatAuthError(err?.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div
        className="auth-page__mosaic"
        style={{ backgroundImage: `url(${mosaico})` }}
        aria-hidden
      />

      <div className="auth-page__content">
        <h1 className="auth-page__title">INICIAR SESIÓN</h1>
        <p className="auth-page__subtitle">Accede con tu cuenta JeelJel Kaanab</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="login-email">
              Correo electrónico
            </label>
            <input
              id="login-email"
              className="auth-form__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="login-password">
              Contraseña
            </label>
            <input
              id="login-password"
              className="auth-form__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="auth-form__error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-form__footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
