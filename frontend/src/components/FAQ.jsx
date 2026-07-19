import { useState } from 'react'
import './FAQ.css'

const faqs = [
  {
    question: 'What is Velvet Pavilion?',
    answer: 'Velvet Pavilion is an AI-powered pre-production studio built for filmmakers, directors, screenwriters, and students — anyone who wants to plan a film thoroughly before stepping on set, regardless of experience level.',
  },
  {
    question: 'How does it plan films?',
    answer: 'You start with a single idea, and Velvet Pavilion\u2019s four tools guide it through every stage of pre-production — from a formatted screenplay, to a shot-by-shot breakdown, to technical planning, to a complete visual style guide — until you have everything a crew needs before filming begins.',
  },
  {
    question: 'What are the four tools?',
    answer: 'Script Generator turns a story idea into a formatted screenplay scene. AI Storyboard breaks a scene into a written shot-by-shot sequence. Pre-Visualization & Scene Prep produces a technical planning document covering camera angles, lenses, blocking, lighting, and equipment. Style & Cinematography Brief defines the film\u2019s visual identity — color palette, mood, lens choices, and references.',
  },
  {
    question: 'Need filmmaking experience to use?',
    answer: 'No. The tools are designed to guide you with clear, structured output, so you don\u2019t need prior filmmaking knowledge to get useful, professional-quality planning documents.',
  },
  {
    question: 'Does it generate storyboard images?',
    answer: 'Currently, Velvet Pavilion provides detailed written visual planning and technical guidance — shot descriptions, camera work, and style direction — rather than generated storyboard images or video.',
  },
  {
    question: 'Can I edit or export output?',
    answer: 'You can regenerate or adjust your inputs at any time to refine the output. Dedicated editing and export tools are planned for a future update.',
  },
  {
    question: 'What features are coming next?',
    answer: 'Planned enhancements include AI-generated storyboard imagery, exportable documents, and expanded customization for genre and visual style — building on the written planning tools available today.',
  },
]
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="faq-wrap">
      <h2 className="faq-heading">Frequently Asked Questions</h2>

      <div className="faq-list">
        {faqs.map((item, index) => (
          <div
            key={item.question}
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
            onClick={() => toggle(index)}
          >
            <div className="faq-question">
              <span>{item.question}</span>
              <span className="faq-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ