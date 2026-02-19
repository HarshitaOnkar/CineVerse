import { useState } from 'react'
import './Hero.css'

const HERO_TITLE = 'MARTY SUPREME'
const HERO_DESCRIPTION =
  'An epic tale of ambition and power. Experience the story that defines a generation.'

interface HeroProps {
  backdropUrl: string | null
}

export function Hero({ backdropUrl }: HeroProps) {
  const [modal, setModal] = useState<'play' | 'info' | null>(null)

  return (
    <section className="hero">
      {backdropUrl && (
        <div
          className="hero-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}
      <div className="hero-content">
        <span className="hero-trending-label">TRENDING NOW</span>
        <h1 className="hero-title">{HERO_TITLE}</h1>
        <p className="hero-overview">{HERO_DESCRIPTION}</p>
        <div className="hero-buttons">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setModal('play')}
          >
            ▶ Play Now
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setModal('info')}
          >
            ℹ More Info
          </button>
        </div>
      </div>

      {modal && (
        <div
          className="hero-modal-overlay"
          onClick={() => setModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hero-modal-title"
        >
          <div
            className="hero-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="hero-modal-close"
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 id="hero-modal-title" className="hero-modal-title">{HERO_TITLE}</h2>
            {modal === 'play' && (
              <p className="hero-modal-text">
                Playback will start shortly. This feature is coming soon.
              </p>
            )}
            {modal === 'info' && (
              <p className="hero-modal-text">{HERO_DESCRIPTION}</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
