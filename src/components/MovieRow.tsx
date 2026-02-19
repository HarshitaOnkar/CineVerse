import type { Movie } from '../api/tmdb'
import { posterUrl } from '../api/tmdb'
import './MovieRow.css'

interface MovieRowProps {
  title: string
  movies: Movie[]
}

export function MovieRow({ title, movies }: MovieRowProps) {
  if (!movies.length) return null

  return (
    <section className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-slider">
        {movies.map((movie) => (
          <article key={movie.id} className="poster-card">
            <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
              <img
                src={posterUrl(movie.poster_path) || 'https://via.placeholder.com/160x240/333/666?text=No+Image'}
                alt={movie.title}
                loading="lazy"
              />
              <figcaption>{movie.title}</figcaption>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
