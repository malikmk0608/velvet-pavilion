import { useNavigate } from 'react-router-dom'
import './Landing.css'
import ToolsGrid from '../components/ToolsGrid'
import FAQ from '../components/FAQ'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-fade" />
        <div className="hero-content">
          <p className="hero-eyebrow">A pre-production studio</p>
          <h1 className="hero-title">Velvet Pavilion</h1>
          <p className="hero-tagline">
            From first idea to production-ready plan,<br />
            before a single frame is shot.
          </p>
          <button className="hero-cta" onClick={() => navigate('/script-generator')}>
            Start Creating
          </button>
        </div>
      </section>

      <section className="next-section">
        <ToolsGrid />
        <FAQ />
      </section>
    </div>
  )
}

export default Landing