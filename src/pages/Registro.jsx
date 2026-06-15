import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import mosaico from '../assets/mosaicos/Tlaloc.png'
import logoIkanNaat from '../assets/Logo_Ika_Naat_sin_fondo_sin_letras.png'
import logoOllin from '../assets/Logo_JeelJel_Kanaabcon_balon_sin_fondo.png'
import logoIzydra from '../assets/Logo_Izydra_OS_Sin_fondo.png'
import logoVirtyou from '../assets/Logo_virtyou_sin_fondo.png'
import logoInkognito from '../assets/Logo_inkognito_sin_fondo.png'
import { supabase } from '../lib/supabaseClient'
import './AuthPage.css'

const SUCCESS_APP_BTN_STYLE = {
  width: '200px',
  height: '48px',
  fontSize: '14px',
  padding: '12px',
}

const SUCCESS_APP_LOGO_STYLE = {
  position: 'absolute',
  right: '-8px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '70px',
  height: '70px',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  opacity: 1,
  filter: 'brightness(1.2)',
}

const SUCCESS_APP_LABEL_STYLE = {
  position: 'relative',
  zIndex: 1,
}

const PROXIMAS_APPS = [
  { name: 'Izydra OS', logo: logoIzydra },
  { name: 'Virtyou', logo: logoVirtyou },
  { name: 'Inkógnito', logo: logoInkognito },
]

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
  const returnTo = searchParams.get('return') || null
  const origenParam = searchParams.get('origen') || 'jeeljel_com'
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
          <div className="registro-success">
            <h2>¡Bienvenido a JeelJel Kaanab!</h2>
            <p>Tu cuenta ha sido creada. Ya puedes explorar el ecosistema.</p>

            <div className="registro-success__apps">

              {/* Ikan Naat — activa */}
              <a
                href="https://ikannaat.jeeljel.com"
                className="registro-success__app-btn registro-success__app-btn--primary"
                style={SUCCESS_APP_BTN_STYLE}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className="registro-success__app-btn-logo"
                  style={{
                    ...SUCCESS_APP_LOGO_STYLE,
                    backgroundImage: `url(${logoIkanNaat})`,
                  }}
                />
                <span style={SUCCESS_APP_LABEL_STYLE}>Explorar Ikan Naat IA (Beta)</span>
              </a>

              {/* Ollin Deportes — activa */}
              <a
                href="/ollin-deportes"
                className="registro-success__app-btn registro-success__app-btn--secondary"
                style={SUCCESS_APP_BTN_STYLE}
              >
                <div
                  className="registro-success__app-btn-logo"
                  style={{
                    ...SUCCESS_APP_LOGO_STYLE,
                    backgroundImage: `url(${logoOllin})`,
                  }}
                />
                <span style={SUCCESS_APP_LABEL_STYLE}>Ollin Deportes</span>
              </a>

              {/* Próximamente */}
              <div className="registro-success__apps-proximos">
                <span className="registro-success__proximos-label">Próximamente</span>
                <div className="registro-success__proximos-grid">
                  {PROXIMAS_APPS.map(({ name, logo }) => (
                    <div
                      key={name}
                      className="registro-success__app-btn registro-success__app-btn--disabled"
                      style={SUCCESS_APP_BTN_STYLE}
                    >
                      <div
                        className="registro-success__app-btn-logo"
                        style={{
                          ...SUCCESS_APP_LOGO_STYLE,
                          backgroundImage: `url(${logo})`,
                        }}
                      />
                      <span style={SUCCESS_APP_LABEL_STYLE}>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón volver — solo si hay returnTo */}
            {returnTo && (
              <a
                href={returnTo}
                className="registro-success__volver"
              >
                ← Volver al partido (ya puedes escribir en el chat)
              </a>
            )}
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
