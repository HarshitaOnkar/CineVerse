import { useEffect, useState } from 'react'
import { Hero } from './components/Hero'
import { MovieRow } from './components/MovieRow'
import type { Movie } from './api/tmdb'
import { getLoggedInUser, logout, isOfflineMode } from './api/auth'
import {
  getPopularMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getTrendingMovies,
  getMartySupremeBackdropUrl,
} from './api/tmdb'
import './App.css'

function App() {
  const [heroBackdropUrl, setHeroBackdropUrl] = useState<string | null>(null)
  const [trending, setTrending] = useState<Movie[]>([])
  const [popular, setPopular] = useState<Movie[]>([])
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([])
  const [topRated, setTopRated] = useState<Movie[]>([])
  const [upcoming, setUpcoming] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [headerScrolled, setHeaderScrolled] = useState(false)

  useEffect(() => {
    const hasKey = Boolean(import.meta.env.VITE_TMDB_API_KEY)
    if (!hasKey) {
      setLoading(false)
      setError('api_key')
      return
    }

    async function load() {
      try {
        setError(null)
        const [
          trendingRes,
          popularRes,
          nowPlayingRes,
          topRatedRes,
          upcomingRes,
          martyBackdropUrl,
        ] = await Promise.all([
          getTrendingMovies('week'),
          getPopularMovies(1),
          getNowPlayingMovies(1),
          getTopRatedMovies(1),
          getUpcomingMovies(1),
          getMartySupremeBackdropUrl(),
        ])
        setTrending(trendingRes.results)
        setPopular(popularRes.results)
        setNowPlaying(nowPlayingRes.results)
        setTopRated(topRatedRes.results)
        setUpcoming(upcomingRes.results)
        setHeroBackdropUrl(martyBackdropUrl)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load movies')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (error === 'api_key') {
    return (
      <div className="app">
        <header className="app-header scrolled">
          <span className="logo">CineVerse</span>
        </header>
        <div className="api-key-prompt">
          <h2>TMDB API key required</h2>
          <p>
            Get a free API key from{' '}
            <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer">
              The Movie Database
            </a>
            , then create a <code>.env</code> file in the project root:
          </p>
          <code>VITE_TMDB_API_KEY=your_api_key_here</code>
          <p style={{ marginTop: '1rem' }}>Restart the dev server after adding the key.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="app">
        <header className="app-header scrolled">
          <span className="logo">CineVerse</span>
        </header>
        <div className="loading">
          <div className="loading-spinner" />
          <p>Loading movies…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header scrolled">
          <span className="logo">CineVerse</span>
        </header>
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const showOfflineBanner = isOfflineMode() && !getLoggedInUser()

  return (
    <div className={`app ${showOfflineBanner ? 'with-offline-banner' : ''}`}>
      {showOfflineBanner && (
        <div className="app-offline-banner">
          Using offline mode — start the backend to save to the database.
        </div>
      )}
      <header className={`app-header ${headerScrolled ? 'scrolled' : ''} ${showOfflineBanner ? 'with-banner' : ''}`}>
        <span className="logo">CineVerse</span>
        <nav className="nav">
          <a href="#trending">Trending</a>
          <a href="#popular">Popular</a>
          <a href="#now-playing">Now Playing</a>
          <a href="#top-rated">Top Rated</a>
          <a href="#upcoming">Upcoming</a>
        </nav>
        <div className="app-header-user">
          <span className="app-header-username">{getLoggedInUser()}</span>
          <button type="button" className="app-header-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <Hero backdropUrl={heroBackdropUrl} />

      <div className="rows">
        <div id="trending">
          <MovieRow title="Trending Now" movies={trending} />
        </div>
        <div id="popular">
          <MovieRow title="Popular on CineVerse" movies={popular} />
        </div>
        <div id="now-playing">
          <MovieRow title="Now Playing" movies={nowPlaying} />
        </div>
        <div id="top-rated">
          <MovieRow title="Top Rated" movies={topRated} />
        </div>
        <div id="upcoming">
          <MovieRow title="Upcoming" movies={upcoming} />
        </div>
      </div>
    </div>
  )
}

export default App
