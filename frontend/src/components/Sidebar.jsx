import { useNavigate } from 'react-router-dom'
import './Sidebar.css'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Script Generator', path: '/script-generator' },
  { label: 'AI Storyboard', path: '/storyboard' },
  { label: 'Pre-Vis & Scene Prep', path: '/previs' },
  { label: 'Style & Cinematography Brief', path: '/style' },
]

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()

  const handleNav = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">Velvet Pavilion</span>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <button
              key={link.label}
              className="sidebar-link"
              onClick={() => handleNav(link.path)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar