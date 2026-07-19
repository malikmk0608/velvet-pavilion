import { useNavigate } from 'react-router-dom'
import vpLogo from '../assets/vp-logo.png'
import './Navbar.css'

function Navbar({ onMenuClick, onAccountClick, onHelpClick, user }) {
  const navigate = useNavigate()

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-btn menu-btn" aria-label="Menu" onClick={onMenuClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
        <button className="brand-btn" onClick={() => navigate('/')}>
          <img src={vpLogo} alt="Velvet Pavilion" className="brand-mark" />
          <span className="navbar-logo">Velvet Pavilion</span>
        </button>
      </div>

      <div className="navbar-icons">
        <button className="icon-btn" data-tooltip="Help" aria-label="Help" onClick={onHelpClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
          </svg>
        </button>

        <button
          className="icon-btn account-btn"
          data-tooltip={user ? `@${user.username}` : 'Account'}
          aria-label="Account"
          onClick={onAccountClick}
        >
          {user ? (
            user.photoURL ? (
              <img src={user.photoURL} alt="" className="nav-avatar-img" />
            ) : (
              <span className="nav-avatar-letter">{user.username?.[0]?.toUpperCase()}</span>
            )
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 20c1.2-3.5 4-5 6.5-5s5.3 1.5 6.5 5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}

export default Navbar