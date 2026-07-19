import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import LoginModal from './components/LoginModal'
import AIAssistant from './components/AIAssistant'
import Landing from './pages/Landing'
import ScriptGenerator from './pages/ScriptGenerator'
import ScriptChat from './pages/ScriptChat'
import Storyboard from './pages/Storyboard'
import Previs from './pages/Previs'
import PrevisCategory from './pages/PrevisCategory'
import StyleBrief from './pages/StyleBrief'
import StyleCategory from './pages/StyleCategory'


function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vp_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Persist user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('vp_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('vp_user')
    }
  }, [user])

  const handleRegister = (newUser) => {
    // Save registered user credentials to localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('vp_registered') || '[]')
    registeredUsers.push(newUser)
    localStorage.setItem('vp_registered', JSON.stringify(registeredUsers))
  }

  const handleLogin = (email) => {
    // Look up registered user by email
    const registeredUsers = JSON.parse(localStorage.getItem('vp_registered') || '[]')
    const found = registeredUsers.find((u) => u.email === email)
    if (found) {
      setUser(found)
      setLoginOpen(false)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setUser(null)
    setLoginOpen(false)
  }

  return (
    <>
      <ScrollToTop />
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        onAccountClick={() => setLoginOpen(true)}
        onHelpClick={() => setAiOpen((prev) => !prev)}
        user={user}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        onPhotoChange={(photoURL) => setUser((prev) => ({ ...prev, photoURL }))}
      />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/script-generator" element={<ScriptGenerator />} />
        <Route path="/script-generator/:genre" element={<ScriptChat />} />
        <Route path="/storyboard" element={<Storyboard />} />
        <Route path="/previs/:category" element={<PrevisCategory />} />
        <Route path="/previs" element={<Previs />} />
        <Route path="/style" element={<StyleBrief />} />
        <Route path="/style/:category" element={<StyleCategory />} />
      </Routes>

      <AIAssistant isOpen={aiOpen} onToggle={setAiOpen} />
    </>
  )
}

export default App