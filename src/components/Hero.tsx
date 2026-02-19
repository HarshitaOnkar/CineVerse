import './Hero.css'

const HERO_TITLE = 'MARTY SUPREME'
const HERO_DESCRIPTION =
  'An epic tale of ambition and power. Experience the story that defines a generation.'

interface HeroProps {
  backdropUrl: string | null
}

export function Hero({ backdropUrl }: HeroProps) {
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
          <button type="button" className="btn btn-primary">
            ▶ Play Now
          </button>
          <button type="button" className="btn btn-secondary">
            ℹ More Info
          </button>
        </div>
      </div>
    </section>
  )
}
