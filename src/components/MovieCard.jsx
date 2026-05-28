import { useNavigate } from 'react-router-dom';

/**
 * MovieCard Component
 * Displays movie details including poster, title, release year, and star rating.
 * Navigates to the details page on click.
 * 
 * @param {Object} props
 * @param {Object} props.movie The movie object from TMDB API
 */
export default function MovieCard({ movie, genres }) {
  const navigate = useNavigate();

  if (!movie) return null;

  const { id, title, poster_path, release_date, vote_average, overview } = movie;
  
  // Extract release year
  const releaseYear = release_date ? release_date.split('-')[0] : 'N/A';
  
  // Format rating
  const rating = typeof vote_average === 'number' ? vote_average.toFixed(1) : 'N/A';
  
  // Poster image URL
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : null;

  // Resolve first genre for the tagline
  const firstGenre = movie.genre_ids && genres
    ? genres.find((g) => g.id === movie.genre_ids[0])?.name
    : null;

  // Resolve top 2 genres for the footer
  const genreTags = movie.genre_ids && genres
    ? movie.genre_ids
        .slice(0, 2)
        .map((id) => genres.find((g) => g.id === id)?.name)
        .filter(Boolean)
        .join(' ✦ ')
    : '';

  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-brand-darkCard border border-brand-darkBorder rounded-[20px] overflow-hidden shadow-xl cursor-pointer transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-brand-amber/35 transition-all duration-500 ease-out"
    >
      {/* Poster Image Container with Gradient Fade */}
      <div className="relative aspect-[2/3] w-full bg-brand-darkBg flex items-center justify-center overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${title} Poster`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center bg-brand-darkBg text-text-muted w-full h-full border-b border-brand-darkBorder/40">
            <svg
              className="w-12 h-12 text-text-muted/40 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span className="text-xs font-medium text-text-secondary px-3 line-clamp-2">
              {title}
            </span>
          </div>
        )}

        {/* Cinematic gradient fade from bottom of poster to dark content area */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-darkCard via-transparent to-transparent opacity-100" />
      </div>

      {/* Movie Details Content Area */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-3 bg-brand-darkCard relative z-10">
        <div className="flex flex-col flex-grow">
          {/* Small Serif Tagline: Genre & Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="font-display italic text-xs text-brand-amber font-medium">
              {firstGenre || 'Feature Film'}
            </span>
            <span className="text-text-muted text-[10px]">&bull;</span>
            <span className="font-sans text-[11px] font-semibold text-brand-warmWhite/90 flex items-center gap-0.5">
              ★ {rating}
            </span>
          </div>

          {/* Large Bold Serif Movie Title */}
          <h3 
            className="font-display font-semibold text-brand-warmWhite text-[20px] md:text-[22px] leading-tight mb-2.5 group-hover:text-brand-amber transition-colors duration-300 line-clamp-1" 
            title={title}
          >
            {title}
          </h3>

          {/* Truncated Description */}
          <p className="text-xs md:text-[13px] text-text-secondary leading-relaxed line-clamp-2 mb-4 font-sans font-normal opacity-85">
            {overview || 'No description available. Experience the full story and credits on the details page.'}
          </p>

          {/* View Details Pill Button */}
          <div className="mt-auto">
            <span className="inline-flex items-center justify-center px-5 py-1.5 border border-brand-warmWhite/15 hover:border-brand-warmWhite/40 bg-white/[0.02] hover:bg-white/[0.06] rounded-full text-[11px] font-sans tracking-wide text-brand-warmWhite/90 group-hover:border-brand-amber/40 group-hover:text-brand-amber transition-all duration-300">
              View Details
            </span>
          </div>
        </div>

        {/* Elegant Footer Details */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-brand-darkBorder/60 text-[10px] md:text-[11px] font-sans tracking-widest text-text-muted uppercase">
          <span>
            {releaseYear}
          </span>
          <span className="truncate max-w-[65%] text-right font-medium text-text-muted/80">
            {genreTags || 'Cinema'}
          </span>
        </div>
      </div>
    </div>
  );
}
