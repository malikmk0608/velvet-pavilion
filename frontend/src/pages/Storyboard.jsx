import { useState } from 'react'
import QuickChips from '../components/QuickChips'
import SavedResponseModal from '../components/SavedResponseModal'
import './Storyboard.css'

const STORYBOARD_CHIPS = ['INT.', 'EXT.', 'NIGHT', 'DAY', 'CLOSE-UP on', 'WIDE SHOT of', 'Camera pans to', 'OVER-THE-SHOULDER', 'POV —', 'TRACKING SHOT', 'TWO-SHOT']

function parseShots(text) {
  const regex = /(\d+)\.\s*\[([^\]]+)\]\s*([^]*?)(?=\n\d+\.\s*\[|$)/g
  const shots = []
  let match
  while ((match = regex.exec(text)) !== null) {
    shots.push({
      number: match[1],
      type: match[2].trim(),
      description: match[3].trim(),
    })
  }
  return shots
}

function Storyboard() {
  const [sceneText, setSceneText] = useState('')
  const [rawOutput, setRawOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [saveContent, setSaveContent] = useState(null)

  const generate = async () => {
    if (!sceneText.trim()) return
    setLoading(true)
    setRawOutput('')

    try {
      const response = await fetch('/api/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: sceneText }),
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let text = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value)
        setRawOutput(text)
      }
    } catch (err) {
      setRawOutput('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const shots = parseShots(rawOutput)

  return (
    <div className="storyboard-page">
      <div className="storyboard-header">
        <p className="storyboard-eyebrow">AI Storyboard</p>
        <h1 className="storyboard-title">Break a scene into shots</h1>
      </div>

      <div className="storyboard-input-block">
        <textarea
          className="storyboard-textarea"
          placeholder={"INT. WAREHOUSE — NIGHT\n\nA single bulb swings overhead, casting restless shadows. MARCUS steps through the doorway, his footsteps echoing off the concrete floor..."}
          value={sceneText}
          onChange={(e) => setSceneText(e.target.value)}
        />
        <QuickChips
          chips={STORYBOARD_CHIPS}
          onInsert={(chip) => setSceneText((prev) => prev + (prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : '') + chip + ' ')}
        />
        <button className="storyboard-generate" onClick={generate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Storyboard'}
        </button>
      </div>

      {shots.length > 0 && (
        <>
          <div className="output-toolbar">
            <button className="output-download-btn" onClick={() => setSaveContent(rawOutput)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15V3" strokeLinecap="round" />
              </svg>
              Download as PDF
            </button>
          </div>
          <div className="frame-grid">
            {shots.map((shot) => (
              <div key={shot.number} className="frame-card">
                <div className="frame-top">
                  <span className="frame-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="2" y="6" width="15" height="12" rx="2" />
                      <path d="M17 10l5-3v10l-5-3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="frame-type">{shot.type}</span>
                </div>
                <p className="frame-description">{shot.description}</p>
                <div className="frame-footer">SHOT {shot.number}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {loading && shots.length === 0 && (
        <p className="storyboard-loading">Writing the shot list...</p>
      )}

      {saveContent && (
        <SavedResponseModal
          content={saveContent}
          onClose={() => setSaveContent(null)}
          title="Storyboard Breakdown"
          subtitle="Shot-by-Shot Sequence"
        />
      )}
    </div>
  )
}

export default Storyboard