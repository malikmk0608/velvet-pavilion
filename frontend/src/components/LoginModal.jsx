import { useState, useRef } from 'react'
import './LoginModal.css'

const PROFESSIONS = [
  'Director',
  'Screenwriter',
  'Cinematographer',
  'Producer',
  'Storyboard Artist',
  'Editor',
  'Production Designer',
  'Student',
  'Other',
]

function getPasswordStrength(password) {
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters.' }
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password needs at least one uppercase letter.' }
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password needs at least one lowercase letter.' }
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password needs at least one number.' }
  if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, message: 'Password needs at least one special character.' }
  return { valid: true, message: '' }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function LoginModal({ isOpen, onClose, user, onLogin, onRegister, onLogout, onPhotoChange }) {
  const [view, setView] = useState('login')
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    profession: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const activeView = user ? 'account' : view

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.firstName || !form.lastName || !form.email || !form.profession || !form.username || !form.password) {
      setError('Please fill in all required fields.')
      return
    }
    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address.')
      return
    }
    const strength = getPasswordStrength(form.password)
    if (!strength.valid) {
      setError(strength.message)
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    onRegister({
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      email: form.email,
      profession: form.profession,
      username: form.username,
    })
    setSuccess('Account created! You can now log in.')
    setView('login')
    setLoginEmail(form.email)
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!loginEmail) {
      setError('Please enter your email.')
      return
    }

    const loggedIn = onLogin(loginEmail)
    if (!loggedIn) {
      setError('No account found with this email. Please register first.')
    }
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoSelected = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onPhotoChange(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`login-modal ${activeView === 'register' ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {activeView === 'account' && (
          <>
            <h2 className="modal-title">My Account</h2>

            <div className="account-info">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoSelected}
                style={{ display: 'none' }}
              />
              <button className="account-avatar" onClick={handlePhotoClick} aria-label="Change photo">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="account-avatar-img" />
                ) : (
                  <span>{user.username?.[0]?.toUpperCase()}</span>
                )}
                <span className="avatar-edit-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <p className="account-username">@{user.username}</p>
              <p className="account-email">{user.email}</p>
              <p className="account-profession">{user.profession}</p>
            </div>

            <button className="login-submit signout-btn" onClick={onLogout}>Sign Out</button>
          </>
        )}

        {activeView === 'login' && (
          <>
            <h2 className="modal-title">Login</h2>
            {success && <p className="form-success">{success}</p>}
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <label className="field-label" htmlFor="login-email">Email</label>
              <input
                className="field-input"
                type="email"
                id="login-email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />

              <label className="field-label" htmlFor="login-password">Password</label>
              <input
                className="field-input"
                type="password"
                id="login-password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <div className="form-row">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="login-submit">Login</button>

              <p className="register-line">
                Don't have an account?{' '}
                <a href="#" className="register-link" onClick={(e) => { e.preventDefault(); setView('register'); setError(''); setSuccess('') }}>
                  Register
                </a>
              </p>
            </form>
          </>
        )}

        {activeView === 'register' && (
          <>
            <h2 className="modal-title">Create Account</h2>
            <form className="login-form register-grid" onSubmit={handleRegisterSubmit}>
              <div className="field-group">
                <label className="field-label">First Name</label>
                <input className="field-input" name="firstName" value={form.firstName} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label className="field-label">Middle Name <span className="optional-tag">(optional)</span></label>
                <input className="field-input" name="middleName" value={form.middleName} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label className="field-label">Last Name</label>
                <input className="field-input" name="lastName" value={form.lastName} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label className="field-label">Email</label>
                <input className="field-input" type="email" name="email" value={form.email} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label className="field-label">Profession</label>
                <select className="field-input" name="profession" value={form.profession} onChange={handleChange}>
                  <option value="" disabled>Select one</option>
                  {PROFESSIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Username</label>
                <input className="field-input" name="username" value={form.username} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <input className="field-input" type="password" name="password" value={form.password} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label className="field-label">Confirm Password</label>
                <input className="field-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="login-submit full-width">Register</button>

              <p className="register-line full-width">
                Already have an account?{' '}
                <a href="#" className="register-link" onClick={(e) => { e.preventDefault(); setView('login'); setError(''); setSuccess('') }}>
                  Login
                </a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginModal