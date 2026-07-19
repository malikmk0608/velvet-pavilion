import { useNavigate } from 'react-router-dom'
import anglesImg from '../assets/previs-angles.jpg'
import lensImg from '../assets/previs-lens.jpg'
import movementImg from '../assets/previs-movement.jpg'
import blockingImg from '../assets/previs-blocking.jpg'
import lightingImg from '../assets/previs-lighting.jpg'
import equipmentImg from '../assets/previs-equipment.jpg'
import './Previs.css'

const categories = [
  {
    slug: 'camera-angles',
    title: 'CAMERA ANGLES',
    image: anglesImg,
    description: 'The physical position of the camera relative to the subject — high, low, eye-level, or Dutch. Camera angle shapes how powerful, vulnerable, or unsettled a character feels to the audience.',
  },
  {
    slug: 'lens-recommendations',
    title: 'LENS RECOMMENDATIONS',
    image: lensImg,
    description: 'The specific lens used for a shot changes the sense of space and intimacy — wide lenses exaggerate depth, telephoto lenses compress it. Lens choice shapes how a scene physically feels.',
  },
  {
    slug: 'camera-movement',
    title: 'CAMERA MOVEMENT',
    image: movementImg,
    description: 'Whether the camera stays still or moves — panning, tracking, dollying, or handheld — changes the emotional energy of a scene, from calm and composed to urgent and alive.',
  },
  {
    slug: 'blocking',
    title: 'BLOCKING',
    image: blockingImg,
    description: 'Where actors physically stand and move within a scene. Blocking guides the audience\u2019s eye and reveals relationships and power dynamics without a word of dialogue.',
  },
  {
    slug: 'lighting-setup',
    title: 'LIGHTING SETUP',
    image: lightingImg,
    description: 'The placement and quality of light on set defines mood — harsh side-lighting for drama, soft even light for warmth. Lighting is one of the most powerful mood-setting tools in filmmaking.',
  },
  {
    slug: 'equipment',
    title: 'EQUIPMENT',
    image: equipmentImg,
    description: 'The physical gear — tripods, gimbals, specific lights — needed to actually execute a shot. Equipment choices turn a creative plan into something a crew can physically deliver.',
  },
]

function Previs() {
  const navigate = useNavigate()

  return (
    <div className="previs-page">
      <div className="previs-header">
        <p className="previs-eyebrow">Pre-Visualization & Scene Prep</p>
        <h1 className="previs-title">Plan the technical setup</h1>
      </div>

      <div className="previs-list">
        {categories.map((cat, index) => {
          const isReversed = index % 2 === 1
          const delay = `${0.4 + index * 0.15}s`

          return (
            <button
              key={cat.slug}
              className={`previs-row ${isReversed ? 'reverse' : ''}`}
              onClick={() => navigate(`/previs/${cat.slug}`)}
            >
              <div
                className="previs-row-text"
                style={{ animationDelay: delay }}
              >
                <h3 className="previs-row-title">{cat.title}</h3>
                <p className="previs-row-desc">{cat.description}</p>
              </div>
              <div
                className="previs-row-image"
                style={{ backgroundImage: `url(${cat.image})`, animationDelay: delay }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Previs