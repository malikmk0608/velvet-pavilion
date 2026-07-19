import { useState, useRef, useEffect } from 'react'
import SavedResponseModal from './SavedResponseModal'
import './AIAssistant.css'

const SITE_KNOWLEDGE = {
  'what is velvet pavilion': 'Velvet Pavilion is an AI-powered pre-production studio built for filmmakers, directors, screenwriters, and students. It helps you plan a film thoroughly before stepping on set, regardless of your experience level.',
  'what tools': 'Velvet Pavilion has four core tools:\n\n1. **Script Generator** — Turn a story idea into a formatted screenplay scene across 8 genres.\n2. **AI Storyboard** — Break a scene into a shot-by-shot visual breakdown.\n3. **Pre-Visualization & Scene Prep** — Plan camera angles, lenses, blocking, lighting, and equipment.\n4. **Style & Cinematography Brief** — Define your film\'s visual identity with grading, lighting style, color palette, lens philosophy, references, and camera movement.',
  'script generator': 'The Script Generator lets you choose from 8 genres — Action, Drama, Comedy, Horror, Thriller, Historical, Romance, and Sci-Fi — then describe your scene idea. The AI writes it as a properly formatted screenplay with scene headings, action lines, character names, and dialogue.',
  'storyboard': 'The AI Storyboard takes a screenplay scene and breaks it down into a numbered shot-by-shot sequence. Each shot includes the type (WIDE, CLOSE-UP, POV, etc.) and a description of what\'s happening in the frame.',
  'previs': 'Pre-Visualization & Scene Prep covers six technical areas: Camera Angles, Lens Recommendations, Camera Movement, Blocking, Lighting Setup, and Equipment. Describe your scene and get detailed professional guidance for each area.',
  'style': 'The Style & Cinematography Brief has six building blocks: Grading, Lighting Style, Color Palette, Lens Philosophy, Cinematographic References, and Camera Movement Philosophy. Each helps define a consistent visual identity for your entire film.',
  'how to use': 'Start by navigating to any of the four tools from the home page. Enter your scene description or story idea, and the AI will generate professional-quality output. You can use the tools in any order — many filmmakers start with a script, then move to storyboard, previs, and style.',
  'genres': 'The Script Generator supports 8 genres: Action (high stakes, physical conflict), Drama (raw emotion, human conflict), Comedy (wit and warmth), Horror (dread and tension), Thriller (suspense), Historical (period narratives), Romance (connection and heart), and Sci-Fi (bold ideas, new worlds).',
  'free': 'Velvet Pavilion is designed to be accessible to everyone. The AI-powered tools provide professional-quality output to help you plan your film from first idea to production-ready.',
  'export': 'Currently you can copy the AI-generated output directly. Dedicated export and editing tools are planned for a future update.',
  'who is this for': 'Velvet Pavilion is for anyone who wants to plan a film — professional filmmakers, directors, screenwriters, film students, and complete beginners. No prior filmmaking knowledge is required.',
}

function findAnswer(question) {
  const q = question.toLowerCase().trim()
  
  for (const [key, answer] of Object.entries(SITE_KNOWLEDGE)) {
    if (q.includes(key)) return answer
  }
  
  if (q.includes('tool') || q.includes('feature') || q.includes('what can') || q.includes('do')) {
    return SITE_KNOWLEDGE['what tools']
  }
  if (q.includes('script') || q.includes('write') || q.includes('screenplay')) {
    return SITE_KNOWLEDGE['script generator']
  }
  if (q.includes('shot') || q.includes('board') || q.includes('breakdown')) {
    return SITE_KNOWLEDGE['storyboard']
  }
  if (q.includes('camera') || q.includes('lens') || q.includes('light') || q.includes('block') || q.includes('equip') || q.includes('previs') || q.includes('pre-vis')) {
    return SITE_KNOWLEDGE['previs']
  }
  if (q.includes('style') || q.includes('color') || q.includes('grade') || q.includes('cinemato') || q.includes('visual')) {
    return SITE_KNOWLEDGE['style']
  }
  if (q.includes('how') || q.includes('start') || q.includes('begin') || q.includes('use')) {
    return SITE_KNOWLEDGE['how to use']
  }
  if (q.includes('genre') || q.includes('action') || q.includes('drama') || q.includes('comedy') || q.includes('horror') || q.includes('thriller') || q.includes('romance') || q.includes('sci')) {
    return SITE_KNOWLEDGE['genres']
  }
  if (q.includes('price') || q.includes('cost') || q.includes('free') || q.includes('pay')) {
    return SITE_KNOWLEDGE['free']
  }
  if (q.includes('export') || q.includes('save') || q.includes('download') || q.includes('copy')) {
    return SITE_KNOWLEDGE['export']
  }
  if (q.includes('who') || q.includes('audience') || q.includes('beginner') || q.includes('student')) {
    return SITE_KNOWLEDGE['who is this for']
  }
  
  return null
}

function AIAssistant({ isOpen, onToggle }) {
  const [mode, setMode] = useState('ask')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedResponse, setSavedResponse] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    if (mode === 'ask') {
      const answer = findAnswer(input)
      if (answer) {
        setMessages((prev) => [...prev, { role: 'ai', content: answer }])
      } else {
        setMessages((prev) => [...prev, { 
          role: 'ai', 
          content: "I can answer questions about Velvet Pavilion's tools, genres, features, and how to use them. Try asking about the Script Generator, Storyboard, Pre-Visualization, or Style Brief!" 
        }])
      }
    } else {
      setLoading(true)
      try {
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input_text: input, mode: 'analyze' }),
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
      } catch {
        setMessages((prev) => [...prev, { role: 'ai', content: 'Unable to connect to the analysis service right now. Please make sure the backend server is running.' }])
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSave = (content) => {
    setSavedResponse(content)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setMessages([])
  }

  return (
    <>
      <button
        className={`ai-fab ${isOpen ? 'active' : ''}`}
        onClick={() => onToggle(!isOpen)}
        aria-label="AI Assistant"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 2C6.48 2 2 5.58 2 10c0 2.24 1.12 4.26 2.94 5.66L4 20l4.34-1.5C9.5 18.82 10.72 19 12 19c5.52 0 10-3.58 10-8s-4.48-8-10-8z" strokeLinejoin="round" />
            <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
            <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
          </svg>
        )}
      </button>

      <div className={`ai-panel ${isOpen ? 'open' : ''}`}>
        <div className="ai-panel-header">
          <div className="ai-panel-brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.6">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>Velvet AI</span>
          </div>
          <div className="ai-mode-tabs">
            <button
              className={`ai-mode-tab ${mode === 'ask' ? 'active' : ''}`}
              onClick={() => switchMode('ask')}
            >
              Ask Velvet
            </button>
            <button
              className={`ai-mode-tab ${mode === 'analyze' ? 'active' : ''}`}
              onClick={() => switchMode('analyze')}
            >
              Analyze Writing
            </button>
          </div>
        </div>

        <div className="ai-messages">
          {messages.length === 0 && (
            <div className="ai-welcome">
              {mode === 'ask' ? (
                <>
                  <p className="ai-welcome-title">Ask anything about Velvet Pavilion</p>
                  <div className="ai-suggestions">
                    <button onClick={() => { setInput('What tools does Velvet Pavilion have?'); }}>What tools are available?</button>
                    <button onClick={() => { setInput('How do I use the Script Generator?'); }}>How to use Script Generator?</button>
                    <button onClick={() => { setInput('What genres are supported?'); }}>What genres are supported?</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="ai-welcome-title">Paste your writing for AI analysis</p>
                  <p className="ai-welcome-sub">Get suggestions for scene direction, character development, visual ideas, and tone refinements.</p>
                </>
              )}
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`ai-msg ${msg.role}`}>
              <div className="ai-msg-content">{msg.content}</div>
              {msg.role === 'ai' && msg.content && (
                <button className="ai-save-btn" onClick={() => handleSave(msg.content)} title="Save response">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <path d="M17 21v-8H7v8M7 3v5h8" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-input-row">
          <input
            className="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={mode === 'ask' ? 'Ask about Velvet Pavilion...' : 'Paste your scene or script here...'}
          />
          <button className="ai-send" onClick={handleSend} disabled={loading}>
            {loading ? (
              <span className="ai-send-loading" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {savedResponse && (
        <SavedResponseModal
          content={savedResponse}
          onClose={() => setSavedResponse(null)}
          mode={mode}
        />
      )}
    </>
  )
}

export default AIAssistant
