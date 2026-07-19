import { useRef } from 'react'
import './SavedResponseModal.css'

function SavedResponseModal({ content, onClose, title, subtitle }) {
  const contentRef = useRef(null)
  const now = new Date()
  const timestamp = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      alert('Copied to clipboard!')
    } catch {
      const range = document.createRange()
      range.selectNodeContents(contentRef.current)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      document.execCommand('copy')
      sel.removeAllRanges()
      alert('Copied to clipboard!')
    }
  }

  const handleDownload = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title || 'Velvet Pavilion'} — Export</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Inter:wght@300;400;500;600&family=Courier+Prime&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background: #0B0B0D;
            color: #EDE6DA;
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
          }

          .page {
            max-width: 800px;
            margin: 0 auto;
            padding: 0;
          }

          /* ── Hero Banner ── */
          .banner {
            background: linear-gradient(135deg, #5C1A21 0%, #3A1015 40%, #0B0B0D 100%);
            padding: 3.5rem 3rem 3rem;
            position: relative;
            overflow: hidden;
          }
          .banner::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(201, 162, 39, 0.12) 0%, transparent 70%);
            pointer-events: none;
          }
          .banner::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #C9A227, rgba(201, 162, 39, 0.3), transparent);
          }
          .brand-row {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            margin-bottom: 1.8rem;
          }
          .brand-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #C9A227, #8A6A15);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0B0B0D;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            font-size: 1rem;
          }
          .brand-name {
            font-family: 'Playfair Display', serif;
            font-style: italic;
            font-weight: 600;
            font-size: 1rem;
            color: rgba(237, 230, 218, 0.7);
            letter-spacing: 0.02em;
          }
          .banner-title {
            font-family: 'Playfair Display', serif;
            font-style: italic;
            font-weight: 700;
            font-size: 2rem;
            color: #EDE6DA;
            margin-bottom: 0.6rem;
            line-height: 1.2;
          }
          .banner-subtitle {
            font-size: 0.88rem;
            color: #C9A227;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            font-weight: 500;
          }
          .banner-meta {
            margin-top: 1.2rem;
            font-size: 0.78rem;
            color: rgba(237, 230, 218, 0.45);
            letter-spacing: 0.04em;
          }

          /* ── Content ── */
          .content-area {
            padding: 2.5rem 3rem;
            background: #0E0C0A;
          }
          .content-text {
            font-family: 'Courier Prime', 'Courier New', monospace;
            font-size: 0.92rem;
            line-height: 1.85;
            color: #EDE6DA;
            white-space: pre-wrap;
            word-break: break-word;
            padding: 2rem;
            background: linear-gradient(145deg, rgba(92, 26, 33, 0.08), rgba(23, 19, 17, 0.6));
            border: 1px solid rgba(201, 162, 39, 0.12);
            border-radius: 12px;
            position: relative;
          }
          .content-text::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background: linear-gradient(180deg, #C9A227, rgba(201, 162, 39, 0.15));
            border-radius: 3px 0 0 3px;
          }

          /* ── Footer ── */
          .doc-footer {
            padding: 2rem 3rem;
            background: #0B0B0D;
            border-top: 1px solid rgba(201, 162, 39, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .footer-left {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .footer-watermark {
            font-size: 0.68rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: rgba(201, 162, 39, 0.5);
            font-weight: 500;
          }
          .footer-url {
            font-size: 0.65rem;
            color: rgba(237, 230, 218, 0.3);
            letter-spacing: 0.04em;
          }
          .footer-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 0.8rem;
            border: 1px solid rgba(201, 162, 39, 0.2);
            border-radius: 6px;
            background: rgba(201, 162, 39, 0.05);
          }
          .footer-badge span {
            font-size: 0.72rem;
            color: #C9A227;
            font-weight: 500;
            letter-spacing: 0.04em;
          }

          @media print {
            body { background: #0B0B0D; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .banner { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .content-text { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .doc-footer { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="banner">
            <div class="brand-row">
              <div class="brand-icon">VP</div>
              <span class="brand-name">Velvet Pavilion</span>
            </div>
            <h1 class="banner-title">${title || 'AI Generated Content'}</h1>
            <p class="banner-subtitle">${subtitle || 'Pre-Production Output'}</p>
            <p class="banner-meta">${timestamp}</p>
          </div>
          <div class="content-area">
            <div class="content-text">${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</div>
          </div>
          <div class="doc-footer">
            <div class="footer-left">
              <span class="footer-watermark">Generated by Velvet Pavilion</span>
              <span class="footer-url">AI-Powered Pre-Production Studio</span>
            </div>
            <div class="footer-badge">
              <span>✦ AI Generated</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 600)
  }

  return (
    <div className="saved-overlay" onClick={onClose}>
      <div className="saved-modal" onClick={(e) => e.stopPropagation()}>
        <button className="saved-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {/* Banner preview */}
        <div className="saved-banner">
          <div className="saved-banner-glow" />
          <div className="saved-brand-row">
            <div className="saved-brand-icon">VP</div>
            <span className="saved-brand-name">Velvet Pavilion</span>
          </div>
          <h2 className="saved-banner-title">{title || 'AI Generated Content'}</h2>
          <p className="saved-banner-sub">{subtitle || 'Pre-Production Output'}</p>
          <p className="saved-banner-meta">{timestamp}</p>
        </div>

        <div className="saved-content" ref={contentRef}>
          {content}
        </div>

        <div className="saved-footer">
          <span className="saved-watermark">✦ AI Generated by Velvet Pavilion</span>
          <div className="saved-actions">
            <button className="saved-action-btn" onClick={handleCopy}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </button>
            <button className="saved-action-btn primary" onClick={handleDownload}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15V3" strokeLinecap="round" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavedResponseModal
