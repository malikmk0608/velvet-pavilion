import { useNavigate } from 'react-router-dom'
import heroBg from '../assets/style-hero-bg.jpg'
import thumb1 from '../assets/style-thumb-1.jpg'
import thumb2 from '../assets/style-thumb-2.jpg'
import thumb3 from '../assets/style-thumb-3.jpg'
import thumb4 from '../assets/style-thumb-4.jpg'
import thumb5 from '../assets/style-thumb-5.jpg'
import thumb6 from '../assets/style-thumb-6.jpg'
import './StyleBrief.css'

const categories = [
  { slug: 'grading', label: 'Grading', image: thumb1, description: 'The color-grading approach — contrast, saturation, and tonal balance shaped for a consistent look.' },
  { slug: 'lighting-style', label: 'Lighting Style', image: thumb2, description: 'The film\u2019s general lighting philosophy — soft and even, or harsh and dramatic.' },
  { slug: 'color-palette', label: 'Color Palette', image: thumb3, description: 'The core colors that define the film\u2019s visual world, across sets, costumes, and grading.' },
  { slug: 'lens-philosophy', label: 'Lens Philosophy', image: thumb4, description: 'Lens choices used throughout the film and the visual character they create.' },
  { slug: 'cinematographic-references', label: 'Cinematographic References', image: thumb5, description: 'Films or cinematographers whose visual language informs this project.' },
  { slug: 'camera-movement-philosophy', label: 'Camera Movement Philosophy', image: thumb6, description: 'The film\u2019s general approach to camera motion, as a consistent signature.' },
]

function StyleBrief() {
  const navigate = useNavigate()

  return (
    <div
      className="style-hero"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="style-hero-overlay" />

      <h1 className="style-hero-title">Style & Cinematography Brief</h1>
      <p className="style-hero-intro">
        Define the visual identity of your film — six building blocks that keep every department,
        from camera to lighting to color, working toward the same look.
      </p>

      <div className="style-cards">
        {categories.map((cat, i) => (
          <button
            key={cat.slug}
            className="style-card"
            style={{ animationDelay: `${0.4 + i * 0.08}s` }}
            onClick={() => navigate(`/style/${cat.slug}`)}
          >
            <img src={cat.image} alt="" className="style-card-photo" />
            <div className="style-card-text">
              <h3>{cat.label}</h3>
              <p>{cat.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default StyleBrief