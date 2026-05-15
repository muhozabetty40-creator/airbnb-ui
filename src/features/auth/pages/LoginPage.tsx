import { useState, type FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineExclamationCircle } from 'react-icons/ai'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import './auth.css'

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [serverError, setServerError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const validateEmail = (v: string) => {
    if (!v) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter your valid email'
    return ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setServerError('')
    const err = validateEmail(email)
    setEmailError(err)
    if (err || !password) return

    try {
      await login(email, password)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setServerError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="auth-layout">
      {/* ── Left ── */}
      <div className="auth-left">
        <p className="auth-left__heading">
          Welcome back! Sign in to continue <span>joining our community!</span>
        </p>

        <div className="auth-social">
          <button type="button" className="auth-social__btn auth-social__btn--apple" disabled={loading}>
            <span className="auth-social__icon"></span>
            Sign in with Apple
          </button>
          <button type="button" className="auth-social__btn auth-social__btn--google" disabled={loading}>
            <span className="auth-social__icon">G</span>
            Sign in with Google
          </button>
        </div>

        <p className="auth-privacy">
          We won't post anything without your permission and your personal details are kept private
        </p>

        <div className="auth-divider">Or</div>

        {serverError && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#ffebee',
            border: '1px solid #ef5350',
            borderRadius: '4px',
            color: '#c62828',
            fontSize: '14px'
          }}>
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-field">
            <label className={`auth-field__label${(submitted && emailError) ? ' auth-field__label--error' : ''}`}>
              Enter Email <span className="auth-field__required">*</span>
            </label>
            <div className="auth-field__input-wrap">
              <input
                type="email"
                className={`auth-field__input${(submitted && emailError) ? ' auth-field__input--error' : ''}`}
                value={email}
                onChange={e => { setEmail(e.target.value); if (submitted) setEmailError(validateEmail(e.target.value)) }}
                autoComplete="email"
                disabled={loading}
              />
              {submitted && emailError && (
                <span className="auth-field__icon"><AiOutlineExclamationCircle size={18} color="#ff5724" /></span>
              )}
            </div>
            {submitted && emailError && <span className="auth-field__error">{emailError}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-field__label">
              Password <span className="auth-field__required">*</span>
            </label>
            <div className="auth-field__input-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                className="auth-field__input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <span className="auth-field__icon" onClick={() => setShowPw(p => !p)}>
                {showPw ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </span>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="auth-remember">
            <label className="auth-remember__check">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} disabled={loading} />
              Remember me next time
            </label>
            <Link to="/forgot-password" className="auth-remember__forgot">Forgot password?</Link>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>

      {/* ── Right ── */}
      <div className="auth-right">
        <h2 className="auth-right__title">
          Manage your<br /><span>workspace</span> with ease.
        </h2>
        <p className="auth-right__desc">
          It is a long established fact that a reader will be distracted by the readable
          content of a page when looking at its layout.
        </p>
        <div className="auth-right__illustration">
          <div className="auth-right__laptop">💻</div>
          <div className="auth-right__lock">🔒</div>
        </div>
      </div>
    </div>
  )
}
