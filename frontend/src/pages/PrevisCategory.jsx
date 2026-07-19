import { useParams } from 'react-router-dom'
import { useState } from 'react'
import QuickChips from '../components/QuickChips'
import SavedResponseModal from '../components/SavedResponseModal'
import './PrevisCategory.css'

const titles = {
  'camera-angles': 'Camera Angles',
  'lens-recommendations': 'Lens Recommendations',
  'camera-movement': 'Camera Movement',
  'blocking': 'Blocking',
  'lighting-setup': 'Lighting Setup',
  'equipment': 'Equipment',
}

const CATEGORY_PLACEHOLDERS = {
  'camera-angles': 'A tense two-person standoff in a narrow corridor — one figure at each end, dim overhead lighting...',
  'lens-recommendations': 'An intimate conversation between two old friends in a cramped apartment kitchen, late evening...',
  'camera-movement': 'A detective walks through a crime scene for the first time, taking in every detail of a ransacked living room...',
  'blocking': 'Three characters argue over a table in a dimly lit bar — shifting alliances, one person hiding something...',
  'lighting-setup': 'A lone figure sits in a confessional booth, light filtering through wooden slats, dust in the air...',
  'equipment': 'An outdoor chase through a crowded market at golden hour — handheld energy, tight corners, and open spaces...',
}

const CATEGORY_CHIPS = {
  'camera-angles': ['Low angle', 'High angle', 'Eye-level', 'Dutch angle', 'Bird\'s-eye', 'Over-the-shoulder', 'Worm\'s-eye'],
  'lens-recommendations': ['24mm wide', '35mm', '50mm', '85mm portrait', '100mm macro', 'Anamorphic', 'Zoom lens'],
  'camera-movement': ['Tracking shot', 'Dolly zoom', 'Pan left', 'Tilt up', 'Steadicam', 'Handheld', 'Crane shot', 'Static'],
  'blocking': ['Foreground', 'Background', 'Stage left', 'Stage right', 'Crosses frame', 'Turns away', 'Faces camera'],
  'lighting-setup': ['Key light', 'Fill light', 'Backlight', 'Practical', 'Soft box', 'Hard light', 'Rim light', 'Natural'],
  'equipment': ['Tripod', 'Gimbal', 'Dolly track', 'C-stand', 'Reflector', 'Diffusion panel', 'LED panel', 'Fog machine'],
}

function PrevisCategory() {
  const { category } = useParams()
  const [sceneText, setSceneText] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [saveContent, setSaveContent] = useState(null)

  const generate = async () => {
    if (!sceneText.trim()) return
    setLoading(true)
    setOutput('')

    try {
      const response = await fetch('/api/previs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: sceneText, category }),
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

  const placeholder = CATEGORY_PLACEHOLDERS[category] || 'Paste your scene or describe it here...'
  const chips = CATEGORY_CHIPS[category] || []
  const categoryTitle = titles[category] || category

  return (
    <div className="previs-cat-page">
      <p className="previs-cat-eyebrow">Pre-Vis & Scene Prep</p>
      <h1 className="previs-cat-title">{categoryTitle}</h1>

      <textarea
        className="previs-cat-textarea"
        placeholder={placeholder}
        value={sceneText}
        onChange={(e) => setSceneText(e.target.value)}
      />
      <div className="previs-cat-chips-wrap">
        <QuickChips
          chips={chips}
          onInsert={(chip) => setSceneText((prev) => prev + (prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : '') + chip + ' ')}
        />
      </div>
      <button className="previs-cat-generate" onClick={generate} disabled={loading}>
        {loading ? 'Generating...' : `Generate ${categoryTitle}`}
      </button>

      {output && (
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
          <div className="previs-cat-output">{output}</div>
        </>
      )}

      {saveContent && (
        <SavedResponseModal
          content={saveContent}
          onClose={() => setSaveContent(null)}
          title={categoryTitle}
          subtitle="Pre-Visualization & Scene Prep"
        />
      )}
    </div>
  )
}

export default PrevisCategory