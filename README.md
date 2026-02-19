# CineVerse — Netflix-style frontend

A Netflix-style movie browser built with React and [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

## Features

- **Hero banner** — Featured movie with backdrop, title, overview, and actions
- **Horizontal rows** — Trending Now, Popular, Now Playing, Top Rated, Upcoming
- **Dark theme** — Netflix-like layout and styling
- **Responsive** — Scrollable rows and clear typography

## Setup

1. **Get a TMDB API key** (free):
   - Sign up at [themoviedb.org](https://www.themoviedb.org/)
   - Go to [Settings → API](https://www.themoviedb.org/settings/api) and request an API key (choose “Developer”)

2. **Configure the app** (optional):
   - A `.env` file with a TMDB API key is already set up. To use your own key, set `VITE_TMDB_API_KEY=your_api_key_here` in `.env`.

3. **Install and run**:

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Data source

Movie data and images are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
