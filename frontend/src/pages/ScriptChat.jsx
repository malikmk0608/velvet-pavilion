import { useParams } from 'react-router-dom'
import { useState } from 'react'
import QuickChips from '../components/QuickChips'
import SavedResponseModal from '../components/SavedResponseModal'
import './ScriptChat.css'

const GENRE_PLACEHOLDERS = {
  action: 'A rooftop chase across the skyline at dusk — two figures leaping between buildings...',
  drama: 'A mother sits across from her estranged son in a quiet diner, neither speaking...',
  comedy: 'A nervous best man realizes he grabbed the wrong speech at the wedding reception...',
  horror: 'The power cuts. A child\'s music box begins playing from the empty room upstairs...',
  thriller: 'A detective finds a photograph in the suspect\'s apartment — of herself, taken yesterday...',
  historical: 'A young soldier writes a letter home by candlelight on the eve of battle...',
  romance: 'Two strangers reach for the same book in a rain-soaked secondhand shop...',
  'sci-fi': 'The last human astronaut wakes from cryo-sleep to find the ship AI has rewritten its own orders...',
}

const SCRIPT_CHIPS = ['INT.', 'EXT.', 'CUT TO:', 'FADE IN:', 'CONTINUOUS', '(V.O.)', '(O.S.)', 'DISSOLVE TO:', 'NIGHT', 'DAY', 'LATER', 'FLASHBACK']

function ScriptChat() {
  const { genre } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [saveContent, setSaveContent] = useState(null)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_text: input,
          genre: genre,
        }),
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiText = ''

      setMessages((prev) => [...prev, { role: 'ai', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        aiText += decoder.decode(value)
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'ai', content: aiText }
          return updated
        })
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const placeholder = GENRE_PLACEHOLDERS[genre] || `Describe your ${genre} scene idea...`
  const genreLabel = genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : ''

  return (
    <div className="chat-page">
      <div className="chat-header">
        <p className="chat-genre-label">{genre} Script</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">Describe a scene idea to start writing.</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            {msg.content}
            {msg.role === 'ai' && msg.content && !loading && (
              <button
                className="output-save-btn"
                onClick={() => setSaveContent(msg.content)}
                title="Download as PDF"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 15V3" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <QuickChips
        chips={SCRIPT_CHIPS}
        onInsert={(chip) => setInput((prev) => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + chip + ' ')}
      />

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={placeholder}
        />
        <button className="chat-send" onClick={sendMessage} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>

      {saveContent && (
        <SavedResponseModal
          content={saveContent}
          onClose={() => setSaveContent(null)}
          title={`${genreLabel} Screenplay`}
          subtitle="Script Generator Output"
        />
      )}
    </div>
  )
}

export default ScriptChat