import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from '../api/tmdb';

/**
 * GenreFilter Component
 * Can render either as a sidebar filter (default) or a horizontal pill selector.
 * 
 * @param {Object} props
 * @param {number|null} props.selectedGenreId Current selected genre ID
 * @param {Function} props.onGenreChange Callback when selected genre changes
 * @param {boolean} [props.isDisabled] Disable interaction (e.g., when search is active)
 * @param {'sidebar'|'horizontal'} [props.layout] Layout orientation
 */
export default function GenreFilter({ selectedGenreId, onGenreChange, isDisabled = false, layout = 'sidebar' }) {
  const { data: genres, isLoading, error } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
  });

  // Render horizontal pill layout for mobile devices
  if (layout === 'horizontal') {
    return (
      <div className={`w-full overflow-x-auto flex items-center gap-2.5 py-4 scrollbar-none ${
        isDisabled ? 'opacity-30 pointer-events-none' : 'opacity-100'
      }`}>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-9 w-24 bg-brand-darkCard animate-pulse rounded-full shrink-0 border border-brand-darkBorder/60"
            />
          ))
        ) : error ? (
          <p className="text-xs text-accent-red shrink-0">Failed to load genres.</p>
        ) : (
          <>
            <button
              onClick={() => onGenreChange(null)}
              disabled={isDisabled}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide shrink-0 transition-all duration-300 transform active:scale-95 ${
                selectedGenreId === null
                  ? 'bg-brand-amber text-brand-darkBg shadow-lg shadow-brand-amber/15 font-bold'
                  : 'bg-brand-darkCard text-text-secondary hover:bg-brand-darkBorder/40 hover:text-brand-warmWhite border border-brand-darkBorder'
              } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              All Movies
            </button>
            {genres?.map((genre) => (
              <button
                key={genre.id}
                onClick={() => onGenreChange(genre.id)}
                disabled={isDisabled}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide shrink-0 transition-all duration-300 transform active:scale-95 ${
                  selectedGenreId === genre.id
                    ? 'bg-brand-amber text-brand-darkBg shadow-lg shadow-brand-amber/15 font-bold'
                    : 'bg-brand-darkCard text-text-secondary hover:bg-brand-darkBorder/40 hover:text-brand-warmWhite border border-brand-darkBorder'
                } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {genre.name}
              </button>
            ))}
          </>
        )}
      </div>
    );
  }

  // Default desktop sidebar layout
  return (
    <aside className={`w-[200px] bg-brand-darkBg border-r border-brand-darkBorder flex flex-col h-full overflow-y-auto py-6 shrink-0 transition-all duration-300 ${
      isDisabled ? 'opacity-30 pointer-events-none' : 'opacity-100'
    }`}>
      <h2 className="font-sans font-medium text-[11px] tracking-[0.15em] text-text-muted uppercase mb-4 px-5">
        Genres
      </h2>
      <div className="flex flex-col gap-0.5">
        {isLoading ? (
          // Loading Skeleton
          Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="h-[36px] w-full bg-brand-darkCard/45 animate-pulse border-l-[3px] border-transparent mb-1"
            />
          ))
        ) : error ? (
          <p className="text-xs text-accent-red px-5">Failed to load genres.</p>
        ) : (
          <>
            <button
              onClick={() => onGenreChange(null)}
              disabled={isDisabled}
              className={`w-full text-left py-2.5 px-5 border-l-[3px] transition-all duration-300 text-[14px] font-sans ${
                selectedGenreId === null
                  ? 'bg-brand-darkCard border-brand-amber text-brand-amber font-semibold'
                  : 'bg-transparent border-transparent text-text-secondary hover:bg-brand-darkCard/60 hover:text-brand-warmWhite'
              } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              All Movies
            </button>
            {genres?.map((genre) => (
              <button
                key={genre.id}
                onClick={() => onGenreChange(genre.id)}
                disabled={isDisabled}
                className={`w-full text-left py-2.5 px-5 border-l-[3px] transition-all duration-300 text-[14px] font-sans ${
                  selectedGenreId === genre.id
                    ? 'bg-brand-darkCard border-brand-amber text-brand-amber font-semibold'
                    : 'bg-transparent border-transparent text-text-secondary hover:bg-brand-darkCard/60 hover:text-brand-warmWhite'
                } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {genre.name}
              </button>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
