import MovieCard from './MovieCard';

/**
 * MovieGrid Component
 * Renders a responsive grid of MovieCards.
 * Shows loading skeleton cards while fetching.
 * Shows specific empty state messages based on search query or browse modes.
 * 
 * @param {Object} props
 * @param {Array} props.movies Array of movie objects
 * @param {boolean} props.isLoading Loading state indicator
 * @param {string} [props.searchQuery] Current search query, if any
 */
export default function MovieGrid({ movies, isLoading, searchQuery, genres }) {
  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 animate-pulse">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-brand-darkCard border border-brand-darkBorder rounded-[20px] overflow-hidden shadow-sm"
          >
            {/* Poster image placeholder */}
            <div className="aspect-[2/3] w-full bg-brand-darkBg" />
            
            {/* Movie Details placeholder */}
            <div className="p-5 flex flex-col flex-grow justify-between gap-3">
              <div>
                <div className="h-3 bg-brand-darkBorder rounded w-1/3 mb-2" />
                <div className="h-5 bg-brand-darkBorder rounded w-3/4 mb-2.5" />
                <div className="h-3 bg-brand-darkBorder rounded w-full mb-1" />
                <div className="h-3 bg-brand-darkBorder rounded w-2/3" />
              </div>
              
              <div className="h-6 bg-brand-darkBorder rounded-full w-24 mt-2" />

              <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-brand-darkBorder/60">
                <div className="h-3 bg-brand-darkBorder rounded w-1/5" />
                <div className="h-3 bg-brand-darkBorder rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render empty state
  if (!movies || movies.length === 0) {
    const emptyTitle = searchQuery ? 'No search results' : 'No movies available';
    const emptyMessage = searchQuery 
      ? `No movies found for '${searchQuery}' — try a different title`
      : 'No movies found for this genre right now';

    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="p-5 rounded-full bg-brand-darkCard text-text-muted mb-5 border border-brand-darkBorder">
          <svg
            className="w-12 h-12"
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
        </div>
        <h3 className="text-xl font-display font-semibold text-brand-warmWhite">{emptyTitle}</h3>
        <p className="text-sm text-text-secondary max-w-sm mt-3 leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // Render movie grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} genres={genres} />
      ))}
    </div>
  );
}
