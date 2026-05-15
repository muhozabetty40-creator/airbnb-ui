import { useState, type FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineExclamationCircle } from 'react-icons/ai'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import './auth.css'

interface Errors {
  name?: string
  email?: string
  username?: string
  password?: string
  confirm?: string
  phone?: string
  role?: string
}

export default function SignupPage() {
  const { register, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('GUEST')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const validate = (): Errors => {
    const e: Errors = {}
    if (!name || name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter your valid email'
    if (!username || username.length < 3) e.username = 'Username must be at least 3 characters'
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters'
    if (password !== confirm) e.confirm = 'Passwords do not match'
    if (!phone || phone.length < 7) e.phone = 'Enter a valid phone number'
    if (!role) e.role = 'Please select a role'
    return e
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setServerError('')
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0 || !agree) return

    try {
      await register(name, email, username, password, phone, role)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setServerError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="auth-layout">
      {/* ── Left ── */}
      <div className="auth-left">
        <p className="auth-left__heading">
          Create your account and start <span>joining our community!</span>
        </p>

        <div className="auth-social">
          <button type="button" className="auth-social__btn auth-social__btn--apple" disabled={loading}>
            <span className="auth-social__icon"></span>
            Sign up with Apple
          </button>
          <button type="button" className="auth-social__btn auth-social__btn--google" disabled={loading}>
            <span className="auth-social__icon">G</span>
            Sign up with Google
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
          {/* Name */}
          <div className="auth-field">
            <label className={`auth-field__label${submitted && errors.name ? ' auth-field__label--error' : ''}`}>
              Full Name <span className="auth-field__required">*</span>
            </label>
            <div className="auth-field__input-wrap">
              <input
                type="text"
                className={`auth-field__input${submitted && errors.name ? ' auth-field__input--error' : ''}`}
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                disabled={loading}
              />
              {submitted && errors.name && (
                <span className="auth-field__icon"><AiOutlineExclamationCircle size={18} color="#ff5724" /></span>
              )}
            </div>
            {submitted && errors.name && <span className="auth-field__error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className={`auth-field__label${submitted && errors.email ? ' auth-field__label--error' : ''}`}>
              Enter Email <span className="auth-field__required">*</span>
            </label>
            <div className="auth-field__input-wrap">
              <input
                type="email"
                className={`auth-field__input${submitted && errors.email ? ' auth-field__input--error' : ''}`}
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
              {submitted && errors.email && (
                <span className="auth-field__icon"><AiOutlineExclamationCircle size={18} color="#ff5724" /></span>
              )}
            </div>
            {submitted && errors.email && <span className="auth-field__error">{errors.email}</span>}
          </div>

          {/* Username */}
          <div className="auth-field">
            <label className={`auth-field__label${submitted && errors.username ? ' auth-field__label--error' : ''}`}>
              Username <span className="auth-field__required">*</span>
            </label>
            <div className="auth-field__input-wrap">
              <input
                type="text"
                className={`auth-field__input${submitted && errors.username ? ' auth-field__input--error' : ''}`}
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
              {submitted && errors.username && (
                <span className="auth-field__icon"><AiOutlineExclamationCircle size={18} color="#ff5724" /></span>
              )}
            </div>
            {submitted && errors.username && <span className="auth-field__error">{errors.username}</span>}
          </div>

          {/* Phone */}
          <div className="auth-field">
            <label className={`auth-field__label${submitted && errors.phone ? ' auth-field__label--error' : ''}`}>
              Phone Number <span className="auth-field__required">*</span>
            </label>
            <div className="auth-field__input-wrap">
              <input
                type="tel"
                className={`auth-field__input${submitted && errors.phone ? ' auth-field__input--error' : ''}`}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                autoComplete="tel"
                disabled={loading}
              />
              {submitted && errors.phone && (
                <span className="auth-field__icon"><AiOutlineExclamationCircle size={18} color="#ff5724" /></span>
              )}
            </div>
            {submitted && errors.phone && <span className="auth-field__error">{errors.phone}</span>}
          </div>

          {/* Role Selection */}
          <div className="auth-field">
            <label className={`auth-field__label${submitted && errors.role ? ' auth-field__label--error' : ''}`}>
              Account Type <span className="auth-field__required">*</span>
            </label>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
              <label style={{
                flex: 1,
                padding: '12px',
                border: role === 'GUEST' ? '2px solid #ff385c' : '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: role === 'GUEST' ? '#fff5f7' : 'transparent',
                transition: 'all 0.2s'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="GUEST"
                  checked={role === 'GUEST'}
                  onChange={e => setRole(e.target.value)}
                  disabled={loading}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontWeight: role === 'GUEST' ? '600' : '500' }}>Guest</span>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Book properties</p>
              </label>
              <label style={{
                flex: 1,
                padding: '12px',
                border: role === 'HOST' ? '2px solid #ff385c' : '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: role === 'HOST' ? '#fff5f7' : 'transparent',
                transition: 'all 0.2s'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="HOST"
                  checked={role === 'HOST'}
                  onChange={e => setRole(e.target.value)}
                  disabled={loading}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontWeight: role === 'HOST' ? '600' : '500' }}>Host</span>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>List properties</p>
              </label>
            </div>
            {submitted && errors.role && <span className="auth-field__error">{errors.role}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className={`auth-field__label${submitted && errors.password ? ' auth-field__label--error' : ''}`}>
              Password <span className="auth-field__required">*</span>
            </label>
            <div className="auth-field__input-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                className={`auth-field__input${submitted && errors.password ? ' auth-field__input--error' : ''}`}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
              <span className="auth-field__icon" onClick={() => setShowPw(p => !p)}>
                {showPw ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </span>
            </div>
            {submitted && errors.password && <span className="auth-field__error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className={`auth-field__label${submitted && errors.confirm ? ' auth-field__label--error' : ''}`}>
              Confirm Password <span className="auth-field__required">*</span>
            </label>
            <div className="auth-field__input-wrap">
              <input
                type={showConfirm ? 'text' : 'password'}
                className={`auth-field__input${submitted && errors.confirm ? ' auth-field__input--error' : ''}`}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
              <span className="auth-field__icon" onClick={() => setShowConfirm(p => !p)}>
                {showConfirm ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </span>
            </div>
            {submitted && errors.confirm && <span className="auth-field__error">{errors.confirm}</span>}
          </div>

          {/* Terms */}
          <label className="auth-remember__check" style={{ marginTop: 4 }}>
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} disabled={loading} />
            I agree to the <Link to="/terms" style={{ color: '#ff5724', marginLeft: 4 }}>Terms & Conditions</Link>
          </label>

          <button type="submit" className="auth-submit" disabled={loading || !agree}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
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
