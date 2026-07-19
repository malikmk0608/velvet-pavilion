import { useNavigate } from 'react-router-dom'
import scriptImg from '../assets/script-generator.jpg'
import storyboardImg from '../assets/storyboard.jpg'
import styleImg from '../assets/style-cinematography.jpg'
import './ToolsGrid.css'

const tools = [
  {
    title: 'Script Generator',
    description: 'Turn a story idea into a formatted screenplay scene.',
    className: 'card-script',
    image: scriptImg,
  },
  {
    title: 'AI Storyboard',
    description: 'A written shot-by-shot breakdown — framing, composition, and scene flow for every beat.',
    className: 'card-storyboard',
    image: storyboardImg,
  },
  {
    title: 'Pre-Visualization & Scene Prep',
    description: 'A technical planning document — camera angles, lenses, blocking, lighting, and equipment.',
    className: 'card-previs',
  },
  {
    title: 'Style & Cinematography Brief',
    description: 'A written style guide with color palette, mood, lens choices, and references.',
    className: 'card-style',
    image: styleImg,
  },
]

function ToolsGrid() {
  const navigate = useNavigate()

  return (
    <div className="tools-grid-wrap">
      <p className="tools-eyebrow">Four tools. Any order.</p>
<h2 className="tools-heading">Everything before the first frame</h2>

<div className="tools-grid">
  {tools.map((tool, index) => (
    <div
      key={tool.title}
      className={`tool-card ${tool.className}`}
      style={{ animationDelay: `${index * 0.12}s` }}
            onClick={() => {
              if (tool.className === 'card-script') navigate('/script-generator')
              if (tool.className === 'card-storyboard') navigate('/storyboard')
              if (tool.className === 'card-previs') navigate('/previs')
              if (tool.className === 'card-style') navigate('/style')
            }}
          >
            {tool.image ? (
              <img src={tool.image} alt="" className="tool-card-photo" />
            ) : tool.className === 'card-previs' ? (
              <div className="tool-card-art previs-diagram">
                <svg viewBox="0 0 300 220" className="previs-svg">
                  <rect x="20" y="20" width="260" height="150" fill="none" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                  <circle cx="150" cy="95" r="3" fill="var(--color-gold)" />
                  <line x1="150" y1="95" x2="60" y2="40" stroke="var(--color-text-muted)" strokeWidth="1" opacity="0.6" />
                  <line x1="150" y1="95" x2="240" y2="40" stroke="var(--color-text-muted)" strokeWidth="1" opacity="0.6" />
                  <line x1="150" y1="95" x2="150" y2="170" stroke="var(--color-text-muted)" strokeWidth="1" opacity="0.6" />
                  <rect x="45" y="25" width="30" height="20" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />
                  <rect x="225" y="25" width="30" height="20" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />
                  <rect x="135" y="155" width="30" height="20" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />
                  <path d="M140 90 L160 90 L160 80 L170 95 L160 110 L160 100 L140 100 Z" fill="var(--color-text)" opacity="0.85" />
                </svg>
              </div>
            ) : (
              <div className="tool-card-art" />
            )}
            <div className="tool-card-text">
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ToolsGrid