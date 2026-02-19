import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login, signup, setLoggedInUser, clearOfflineMode } from '../api/auth'
import '../styles/Auth.css'

type Tab = 'login' | 'signup'

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  username?: string
  phone?: string
}

const IconEmail = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const IconLock = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconUser = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconPhone = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const tab: Tab = location.pathname === '/signup' ? 'signup' : 'login'
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const validateLogin = (): boolean => {
    const next: FormErrors = {}
    if (!loginUsername.trim()) next.username = 'Username is required'
    if (!loginPassword) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const validateSignup = (): boolean => {
    const next: FormErrors = {}
    if (!signupUsername.trim()) next.username = 'Username is required'
    if (!signupEmail.trim()) next.email = 'Email is required'
    if (!signupPhone.trim()) next.phone = 'Phone is required'
    if (!signupPassword) next.password = 'Password is required'
    else if (signupPassword.length < 6) next.password = 'Password must be at least 6 characters'
    if (signupPassword !== signupConfirmPassword) next.confirmPassword = 'Passwords must match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validateLogin()) return
    setSubmitting(true)
    try {
      const data = await login({ username: loginUsername, password: loginPassword })
      if (data.success && data.username) {
        if (!data.offline) clearOfflineMode()
        setLoggedInUser(data.username)
        navigate('/cineverse', { replace: true })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setSubmitError(msg)
      if (msg.includes('Please sign up')) {
        setTimeout(() => navigate('/signup'), 1500)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)
    if (!validateSignup()) return
    setSubmitting(true)
    try {
      const data = await signup({
        username: signupUsername,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
      })
      if (data.success && data.username) {
        if (!data.offline) clearOfflineMode()
        setSubmitSuccess('Account created. Please log in.')
        setLoginUsername(signupUsername)
        setLoginPassword('')
        navigate('/login', { replace: true })
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setSubmitting(false)
    }
  }

  const clearErrors = () => {
    setErrors({})
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-inner">
          {/* Left: visual + welcome overlay */}
          <div className="auth-card-left">
            <div className="auth-visual">
              <div className="auth-visual-shape auth-visual-circle" />
              <div className="auth-visual-shape auth-visual-wave" />
              <div className="auth-visual-shape auth-visual-reel" />
            </div>
            <div className="auth-welcome-overlay">
              <p className="auth-welcome-title">Welcome to CineVerse!</p>
              <p className="auth-welcome-sub">Login to explore</p>
              <div className="auth-welcome-dots" aria-hidden>
                <span className="active" />
                <span />
                <span />
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="auth-card-right">
            <h1 className="auth-heading">
              {tab === 'login' ? 'Login your account!' : 'Create your account!'}
            </h1>

            {submitError && (
              <p className="auth-submit-error" role="alert">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="auth-submit-success" role="status">{submitSuccess}</p>
            )}
            <div className="tabs">
              <div
                role="button"
                tabIndex={0}
                className={`tab ${tab === 'login' ? 'active' : ''}`}
                onClick={() => { clearErrors(); navigate('/login') }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { clearErrors(); navigate('/login') } }}
              >
                Login
              </div>
              <div
                role="button"
                tabIndex={0}
                className={`tab ${tab === 'signup' ? 'active' : ''}`}
                onClick={() => { clearErrors(); navigate('/signup') }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { clearErrors(); navigate('/signup') } }}
              >
                Sign up
              </div>
            </div>

            <div className="auth-forms">
              <form
                className={`auth-form auth-form--login ${tab === 'login' ? 'auth-form--visible' : ''}`}
                onSubmit={handleLogin}
                noValidate
              >
                <div className="auth-field">
                  <div className="auth-input-wrap">
                    <IconUser />
                    <input
                      type="text"
                      placeholder="Username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      onFocus={() => setErrors((e) => ({ ...e, username: undefined }))}
                      autoComplete="username"
                    />
                  </div>
                  {errors.username && <span className="auth-error">{errors.username}</span>}
                </div>
                <div className="auth-field">
                  <div className="auth-input-wrap">
                    <IconLock />
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onFocus={() => setErrors((e) => ({ ...e, password: undefined }))}
                      autoComplete="current-password"
                    />
                  </div>
                  {errors.password && <span className="auth-error">{errors.password}</span>}
                </div>
                <a href="#" className="auth-forgot">Forgot password?</a>
                <button type="submit" className="auth-btn" disabled={submitting}>
                  {submitting ? 'Signing in…' : 'Continue'}
                </button>
              </form>

              <form
                className={`auth-form auth-form--signup ${tab === 'signup' ? 'auth-form--visible' : ''}`}
                onSubmit={handleSignup}
                noValidate
              >
                <div className="auth-field">
                  <div className="auth-input-wrap">
                    <IconUser />
                    <input
                      type="text"
                      placeholder="Username"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      onFocus={() => setErrors((e) => ({ ...e, username: undefined }))}
                      autoComplete="username"
                    />
                  </div>
                  {errors.username && <span className="auth-error">{errors.username}</span>}
                </div>
                <div className="auth-field">
                  <div className="auth-input-wrap">
                    <IconEmail />
                    <input
                      type="email"
                      placeholder="Email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      onFocus={() => setErrors((e) => ({ ...e, email: undefined }))}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <span className="auth-error">{errors.email}</span>}
                </div>
                <div className="auth-field">
                  <div className="auth-input-wrap">
                    <IconPhone />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      onFocus={() => setErrors((e) => ({ ...e, phone: undefined }))}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.phone && <span className="auth-error">{errors.phone}</span>}
                </div>
                <div className="auth-field">
                  <div className="auth-input-wrap">
                    <IconLock />
                    <input
                      type="password"
                      placeholder="Password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      onFocus={() => setErrors((e) => ({ ...e, password: undefined, confirmPassword: undefined }))}
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.password && <span className="auth-error">{errors.password}</span>}
                </div>
                <div className="auth-field">
                  <div className="auth-input-wrap">
                    <IconLock />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      onFocus={() => setErrors((e) => ({ ...e, confirmPassword: undefined }))}
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
                </div>
                <button type="submit" className="auth-btn" disabled={submitting}>
                  {submitting ? 'Creating account…' : 'Sign up'}
                </button>
              </form>
            </div>

            <p className="auth-switch">
              {tab === 'login' ? (
                <>Don&apos;t have an account? <button type="button" className="auth-link" onClick={() => { clearErrors(); navigate('/signup') }}>Sign up</button></>
              ) : (
                <>Already have an account? <button type="button" className="auth-link" onClick={() => { clearErrors(); navigate('/login') }}>Login</button></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
