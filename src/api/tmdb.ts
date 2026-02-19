const API_BASE = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p'

function getApiKey(): string {
  const key = import.meta.env.VITE_TMDB_API_KEY
  if (!key) {
    throw new Error(
      'Missing VITE_TMDB_API_KEY. Add it to .env: VITE_TMDB_API_KEY=your_key'
    )
  }
  return key
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
}

export interface MoviesResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

async function fetchTmdb<T>(path: string): Promise<T> {
  const key = getApiKey()
  const url = `${API_BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${key}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`)
  return res.json()
}

export function posterUrl(path: string | null, size: 'w342' | 'w500' | 'w780' = 'w500'): string {
  if (!path) return ''
  return `${IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return ''
  return `${IMAGE_BASE}/${size}${path}`
}

export async function getPopularMovies(page = 1): Promise<MoviesResponse> {
  return fetchTmdb(`/movie/popular?language=en-US&page=${page}`)
}

export async function getNowPlayingMovies(page = 1): Promise<MoviesResponse> {
  return fetchTmdb(`/movie/now_playing?language=en-US&page=${page}`)
}

export async function getTopRatedMovies(page = 1): Promise<MoviesResponse> {
  return fetchTmdb(`/movie/top_rated?language=en-US&page=${page}`)
}

export async function getUpcomingMovies(page = 1): Promise<MoviesResponse> {
  return fetchTmdb(`/movie/upcoming?language=en-US&page=${page}`)
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<MoviesResponse> {
  return fetchTmdb(`/trending/movie/${timeWindow}?language=en-US`)
}

export async function searchMovies(query: string): Promise<MoviesResponse> {
  const encoded = encodeURIComponent(query)
  return fetchTmdb(`/search/movie?language=en-US&query=${encoded}`)
}

/** Fetches the backdrop URL for the first movie matching "Marty Supreme". */
export async function getMartySupremeBackdropUrl(): Promise<string | null> {
  const data = await searchMovies('Marty Supreme')
  const first = data.results?.[0]
  if (!first?.backdrop_path) return null
  return backdropUrl(first.backdrop_path, 'original')
}
