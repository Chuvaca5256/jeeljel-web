import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import mosaico from '../assets/mosaicos/Tlaloc.png'
import { supabase } from '../lib/supabaseClient'
import './AuthPage.css'

function formatAuthError(message) {
  if (!message) return 'No pudimos crear tu cuenta. Intenta de nuevo.'
  if (/already registered|already exists/i.test(message)) {
    return 'Este correo ya está registrado. Inicia sesión o usa otro correo.'
  }
  if (/password/i.test(message) && /short|least|8/i.test(message)) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  if (/invalid email/i.test(message)) {
    return 'El correo electrónico no es válido.'
  }
  return message
}

export default function Registro() {
  const [searchParams] = useSearchParams()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const origenRegistro = searchParams.get('origen')?.trim() || 'jeeljel_com'

  useEffect(() => {
    document.body.classList.add('page-auth')
    return () => document.body.classList.remove('page-auth')
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setConfirmPasswordError('')

    if (!acceptTerms) {
      setError('Debes aceptar los Términos de Uso y el Aviso de Privacidad para continuar.')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nombre: nombre.trim(),
            phone: phone.trim() || null,
          },
        },
      })

      if (signUpError) {
        setError(formatAuthError(signUpError.message))
        return
      }

      const user = authData.user
      if (!user) {
        setError('Registro iniciado. Revisa tu correo para confirmar la cuenta.')
        setSuccess(true)
        return
      }

      setSuccess(true)
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
        {success ? (
          <div className="auth-success">
            <h1 className="auth-success__title">¡Bienvenido a JeelJel Kaanab!</h1>
            <p className="auth-success__text">
              Tu cuenta ha sido creada. Ya puedes explorar el ecosistema.
            </p>
            <a
              className="auth-success__cta"
              href="https://ikannaat.jeeljel.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              ¡Explora Ikan Naat IA (Beta)!
            </a>
          </div>
        ) : (
          <>
            <h1 className="auth-page__title">CREAR CUENTA</h1>
            <p className="auth-page__subtitle">Una cuenta para todo el ecosistema JeelJel Kaanab</p>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="registro-nombre">
                  Nombre completo
                </label>
                <input
                  id="registro-nombre"
                  className="auth-form__input"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="registro-email">
                  Correo electrónico
                </label>
                <input
                  id="registro-email"
                  className="auth-form__input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="registro-password">
                  Contraseña (mínimo 8 caracteres)
                </label>
                <div className="auth-form__input-wrap">
                  <input
                    id="registro-password"
                    className="auth-form__input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-form__eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="registro-confirm-password">
                  Confirmar contraseña
                </label>
                <div className="auth-form__input-wrap">
                  <input
                    id="registro-confirm-password"
                    className="auth-form__input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (confirmPasswordError) setConfirmPasswordError('')
                    }}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-form__eye"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="auth-form__field-error" role="alert">
                    {confirmPasswordError}
                  </p>
                )}
              </div>

              <div className="auth-form__field">
                <label className="auth-form__label" htmlFor="registro-phone">
                  Teléfono (opcional)
                </label>
                <input
                  id="registro-phone"
                  className="auth-form__input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              <label className="auth-form__checkbox">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <span>
                  Acepto los{' '}
                  <Link to="/terminos" target="_blank" rel="noopener noreferrer">
                    Términos de Uso
                  </Link>{' '}
                  y el{' '}
                  <Link to="/privacidad" target="_blank" rel="noopener noreferrer">
                    Aviso de Privacidad
                  </Link>{' '}
                  de JeelJel Kaanab
                </span>
              </label>

              {error && (
                <p className="auth-form__error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="auth-form__submit" disabled={loading}>
                {loading ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </form>

            <p className="auth-form__footer">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
