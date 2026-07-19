import { useParams } from 'react-router-dom'
import { useState } from 'react'
import QuickChips from '../components/QuickChips'
import SavedResponseModal from '../components/SavedResponseModal'
import './StyleCategory.css'

const titles = {
  'grading': 'Grading',
  'lighting-style': 'Lighting Style',
  'color-palette': 'Color Palette',
  'lens-philosophy': 'Lens Philosophy',
  'cinematographic-references': 'Cinematographic References',
  'camera-movement-philosophy': 'Camera Movement Philosophy',
}

const CATEGORY_PLACEHOLDERS = {
  'grading': 'Warm amber tones with crushed blacks, a faded 1970s look — think Kodak Ektachrome pushed two stops...',
  'lighting-style': 'Naturalistic lighting with heavy use of practicals — table lamps, neon signs, car headlights...',
  'color-palette': 'Deep teals and burnt sienna, with pops of faded gold — a noir-western atmosphere...',
  'lens-philosophy': 'Mostly wide-open 35mm for a shallow, intimate feel with soft background separation...',
  'cinematographic-references': 'Roger Deakins\' work on Blade Runner 2049 — vast, geometric compositions with carefully sculpted light...',
  'camera-movement-philosophy': 'Mostly locked-off and formal, with slow deliberate pushes for emotional emphasis...',
}

const STYLE_CHIPS = {
  'grading': ['Warm tones', 'Cool tones', 'Desaturated', 'High contrast', 'Crushed blacks', 'Film emulation', 'Cross-processed', 'Bleach bypass'],
  'lighting-style': ['Natural light', 'Practical lighting', 'Soft diffused', 'Hard directional', 'Chiaroscuro', 'High-key', 'Low-key', 'Motivated light'],
  'color-palette': ['Earth tones', 'Monochromatic', 'Complementary', 'Analogous', 'Muted pastels', 'Neon accents', 'Sepia', 'Teal & orange'],
  'lens-philosophy': ['Anamorphic', 'Spherical', 'Wide-open', 'Deep focus', 'Vintage glass', 'Prime only', 'Long lens', 'Ultra-wide'],
  'cinematographic-references': ['Roger Deakins', 'Emmanuel Lubezki', 'Hoyte van Hoytema', 'Bradford Young', 'Robert Richardson', 'Janusz Kamiński'],
  'camera-movement-philosophy': ['Static / locked-off', 'Handheld', 'Steadicam', 'Slow dolly', 'Whip pans', 'Long takes', 'Kinetic', 'Observational'],
}

function parseColorPalette(text) {
  const regex = /-\s*([^(]+)\s*\(#([0-9A-Fa-f]{6})\)\s*-\s*(.+)/g
  const colors = []
  let match
  while ((match = regex.exec(text)) !== null) {
    colors.push({ name: match[1].trim(), hex: `#${match[2]}`, note: match[3].trim() })
  }
  return colors
}

function StyleCategory() {
  const { category } = useParams()
  const [description, setDescription] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [saveContent, setSaveContent] = useState(null)

  const generate = async () => {
    if (!description.trim()) return
    setLoading(true)
    setOutput('')

    try {
      const response = await fetch('/api/style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: description, category }),
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let text = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value)
        setOutput(text)
      }
    } catch (err) {
      setOutput('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const colors = category === 'color-palette' ? parseColorPalette(output) : []
  const textOnly = category === 'color-palette' ? output.split('COLOR PALETTE:')[0].trim() : output
  const placeholder = CATEGORY_PLACEHOLDERS[category] || 'Describe the mood, references, or visual style you\'re going for...'
  const chips = STYLE_CHIPS[category] || []
  const categoryTitle = titles[category] || category

  return (
    <div className="style-cat-page">
      <p className="style-cat-eyebrow">Style & Cinematography Brief</p>
      <h1 className="style-cat-title">{categoryTitle}</h1>

      <textarea
        className="style-cat-textarea"
        placeholder={placeholder}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="style-cat-chips-wrap">
        <QuickChips
          chips={chips}
          onInsert={(chip) => setDescription((prev) => prev + (prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : '') + chip + ' ')}
        />
      </div>
      <button className="style-cat-generate" onClick={generate} disabled={loading}>
        {loading ? 'Generating...' : `Generate ${categoryTitle}`}
      </button>

      {textOnly && (
        <>
          <div className="output-toolbar">
            <button className="output-download-btn" onClick={() => setSaveContent(output)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15V3" strokeLinecap="round" />
              </svg>
              Download as PDF
            </button>
          </div>
          <div className="style-cat-output">{textOnly}</div>
        </>
      )}

      {colors.length > 0 && (
        <div className="style-cat-palette">
          {colors.map((c) => (
            <div key={c.hex} className="palette-swatch">
              <div className="palette-color" style={{ background: c.hex }} />
              <p className="palette-name">{c.name}</p>
              <p className="palette-hex">{c.hex}</p>
              <p className="palette-note">{c.note}</p>
            </div>
          ))}
        </div>
      )}

      {saveContent && (
        <SavedResponseModal
          content={saveContent}
          onClose={() => setSaveContent(null)}
          title={categoryTitle}
          subtitle="Style & Cinematography Brief"
        />
      )}
    </div>
  )
}

export default StyleCategory