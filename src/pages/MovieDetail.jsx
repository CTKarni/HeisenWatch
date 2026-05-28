import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetails, fetchMovieCredits } from '../api/tmdb';

/**
 * MovieDetail Page Component
 * Renders detailed information about a movie including hero backdrop,
 * poster, title, rating, runtime, overview, and top cast members.
 */
export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Scroll to top of window when movie ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  // Fetch movie details
  const { 
    data: movie, 
    isLoading: isMovieLoading, 
    error: movieError 
  } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieDetails(id),
    enabled: !!id,
  });

  // Fetch movie credits (cast)
  const { 
    data: credits, 
    isLoading: isCreditsLoading, 
    error: creditsError 
  } = useQuery({
    queryKey: ['movie', id, 'credits'],
    queryFn: () => fetchMovieCredits(id),
    enabled: !!id,
  });

  // Update document title dynamically
  useEffect(() => {
    if (movie?.title) {
      document.title = `Weekend Movies | ${movie.title}`;
    } else {
      document.title = 'Weekend Movies';
    }
  }, [movie]);

  const isLoading = isMovieLoading || isCreditsLoading;
  const isError = movieError || creditsError || (!movie && !isLoading);

  // Helper to format runtime (e.g. 125 mins -> 2h 5m)
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  // Helper to format rating vote count
  const formatVotes = (count) => {
    if (count === undefined || count === null) return '0';
    return count.toLocaleString();
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-bg text-text-primary p-8 md:p-16 flex flex-col gap-8 animate-pulse">
        {/* Back Button Skeleton */}
        <div className="h-10 w-36 bg-surface-card border border-surface-border rounded-lg" />

        {/* Hero Section Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-4">
          {/* Left Poster Skeleton */}
          <div className="w-64 md:w-80 shrink-0 aspect-[2/3] bg-surface-sidebar rounded-xl border border-surface-border" />

          {/* Right Info Skeleton */}
          <div className="flex-1 flex flex-col gap-4 py-4">
            <div className="h-10 bg-surface-border rounded-lg w-3/4" />
            <div className="h-6 bg-surface-border rounded-lg w-1/2" />
            <div className="h-6 bg-surface-border rounded-lg w-1/3" />
            <div className="h-20 bg-surface-border rounded-lg w-full mt-4" />
          </div>
        </div>

        {/* Cast Section Skeleton */}
        <div className="mt-12">
          <div className="h-8 bg-surface-border rounded-lg w-48 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-surface-sidebar" />
                <div className="h-4 bg-surface-border rounded-lg w-3/4" />
                <div className="h-3 bg-surface-border rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error page
  if (isError) {
    return (
      <div className="min-h-screen bg-surface-bg text-text-primary flex flex-col items-center justify-center p-8 text-center">
        <div className="p-4 rounded-full bg-accent-red/10 text-accent-red mb-6 border border-accent-red/20">
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
        <p className="text-text-secondary max-w-sm mb-8">
          The movie you are looking for might have been removed, or the link is broken.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-brand-amber hover:bg-brand-amber/90 text-text-primary rounded-lg font-semibold shadow-sm transition duration-200"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // Extract movie release year
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const rating = movie.vote_average !== undefined && movie.vote_average !== null ? movie.vote_average.toFixed(1) : 'N/A';
  
  // Base URLs
  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null;

  // Slice first 6 cast members
  const topCast = credits?.cast?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-brand-darkBg text-brand-warmWhite flex flex-col font-sans">
      {/* Blurred Backdrop image Hero Wrapper */}
      <div className="relative w-full flex flex-col z-10 overflow-hidden border-b border-brand-darkBorder">
        
        {/* Absolute Backdrop image layer */}
        {backdropUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={backdropUrl}
              alt={`${movie?.title || 'Movie'} Backdrop`}
              className="w-full h-full object-cover opacity-[0.25] blur-[2px] scale-102"
            />
            {/* Dark gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-darkBg via-brand-darkBg/90 to-brand-darkBg/40" />
          </div>
        )}

        {/* Content Container (Header + Hero Card overlay) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col gap-8">
          
          {/* Back Button */}
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-darkCard/80 hover:bg-brand-darkBorder text-text-secondary hover:text-brand-warmWhite border border-brand-darkBorder hover:border-brand-amber/40 shadow-lg backdrop-blur-md transition-all duration-300 transform active:scale-95"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-xs uppercase tracking-wider font-semibold">Back to Browse</span>
            </button>
          </div>

          {/* Hero Details Block */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 mt-2">
            
            {/* Left Movie Poster */}
            <div className="w-64 md:w-80 shrink-0 aspect-[2/3] bg-brand-darkCard rounded-[20px] overflow-hidden shadow-2xl border border-brand-darkBorder mx-auto lg:mx-0 flex items-center justify-center">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`${movie.title} Poster`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-text-muted w-full h-full p-6 text-center">
                  <svg
                    className="w-12 h-12 text-text-muted/40 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  <span className="text-xs text-text-secondary font-semibold px-4 text-center">
                    No Poster Available
                  </span>
                </div>
              )}
            </div>

            {/* Right Movie Details Info */}
            <div className="flex-1 flex flex-col justify-center py-2 text-center lg:text-left">
              
              {/* Title & Release Year */}
              <h1 className="text-3xl md:text-5xl font-bold text-brand-warmWhite leading-tight font-display">
                {movie.title}{' '}
                <span className="font-normal text-text-secondary text-2xl md:text-3xl ml-1">
                  ({releaseYear})
                </span>
              </h1>

              {/* Tagline */}
              {movie.tagline && (
                <p className="text-base md:text-lg italic text-brand-amber font-medium mt-2">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}

              {/* Metadata Badges & Info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-5 text-xs md:text-sm text-text-secondary">
                <span className="bg-brand-darkCard border border-brand-darkBorder px-3.5 py-1.5 rounded-lg font-bold text-brand-warmWhite/90 shadow-sm">
                  {formatRuntime(movie.runtime)}
                </span>
                
                {/* Genres Pills */}
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-brand-amber/10 border border-brand-amber/20 px-3.5 py-1.5 rounded-lg text-brand-amber font-bold text-xs shadow-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Rating Section */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mt-6">
                <div className="flex items-center gap-1.5 bg-brand-darkCard border border-brand-darkBorder px-4 py-2 rounded-xl shadow-md">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-brand-amber fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="text-sm md:text-base font-bold text-brand-warmWhite">{rating}</span>
                  <span className="text-xs md:text-sm text-text-muted font-normal">/10</span>
                </div>
                <span className="text-xs md:text-sm text-text-secondary font-medium tracking-wide">
                  &bull;&nbsp;&nbsp;{formatVotes(movie.vote_count)} votes
                </span>
              </div>

              {/* Overview */}
              <div className="mt-8">
                <h3 className="text-base md:text-lg font-bold text-brand-warmWhite border-b border-brand-darkBorder pb-2.5 mb-3 tracking-wide font-display">
                  Overview
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm md:text-base max-w-3xl font-sans opacity-90">
                  {movie.overview || 'No overview available for this movie.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Top Cast Section */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 z-10">
        <h3 className="text-xl font-bold text-brand-warmWhite mb-10 relative pl-4 font-display">
          <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-amber rounded" />
          Top Cast
        </h3>

        {topCast.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            {topCast.map((actor) => (
              <div key={actor.id} className="text-center flex flex-col items-center group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-brand-darkBorder bg-brand-darkCard shadow-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-brand-amber group-hover:scale-105">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-text-muted/40"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0 1 12.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-semibold text-brand-warmWhite line-clamp-1 group-hover:text-brand-amber transition-colors duration-200">
                  {actor.name}
                </p>
                <p className="text-xs text-text-secondary mt-1 line-clamp-1 opacity-80">
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted italic">No cast information available.</p>
        )}
      </div>
    </div>
  );
}
