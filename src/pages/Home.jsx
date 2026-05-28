import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchGenres, fetchMoviesByGenre, searchMovies } from '../api/tmdb';
import GenreFilter from '../components/GenreFilter';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';

// Curated iconic cinematic backdrop images from TMDB
const HERO_BACKDROPS = [
  { name: 'La La Land', url: 'https://image.tmdb.org/t/p/original/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg' },
  { name: 'Interstellar', url: 'https://image.tmdb.org/t/p/original/5XNQBqnBwPA9yT0jZ0p3s8bbLh0.jpg' },
  { name: 'Blade Runner 2049', url: 'https://image.tmdb.org/t/p/original/mVr0UiqyltcfqxbAUcLl9zWL8ah.jpg' },
  { name: 'Dune: Part Two', url: 'https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg' }
];

/**
 * Home Page Component
 * Main landing page featuring a stunning 100vh hero and premium dark grid browsing.
 */
export default function Home() {
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [backdropIndex, setBackdropIndex] = useState(0);
  
  const mainContentRef = useRef(null);

  // Auto-cycle hero backdrops for cinematic atmosphere
  useEffect(() => {
    const timer = setInterval(() => {
      setBackdropIndex((prev) => (prev + 1) % HERO_BACKDROPS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Fetch genres
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
  });

  // Query movies
  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: searchQuery 
      ? ['movies', 'search', searchQuery, currentPage] 
      : ['movies', 'genre', selectedGenreId, currentPage],
    queryFn: () => 
      searchQuery 
        ? searchMovies(searchQuery, currentPage) 
        : fetchMoviesByGenre(selectedGenreId, currentPage),
    placeholderData: keepPreviousData,
  });

  const movies = data?.results || [];
  const activeGenre = genres?.find((g) => g.id === selectedGenreId);

  // Dynamic header title text
  const titleText = searchQuery
    ? `Search Results for "${searchQuery}"`
    : activeGenre
    ? `${activeGenre.name} Movies`
    : 'Popular Movies';

  // Smooth scroll helper (memoized)
  const scrollToBrowse = useCallback(() => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Memoized handlers to prevent child effect triggers
  const handleGenreChange = useCallback((genreId) => {
    setSelectedGenreId(genreId);
    setCurrentPage(1);
    scrollToBrowse();
  }, [scrollToBrowse]);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (query) {
      scrollToBrowse();
    }
  }, [scrollToBrowse]);

  // Update page title dynamically
  useEffect(() => {
    if (searchQuery) {
      document.title = `Weekend Movies | Search: ${searchQuery}`;
    } else if (activeGenre) {
      document.title = `Weekend Movies | ${activeGenre.name}`;
    } else {
      document.title = 'Weekend Movies | Popular';
    }
  }, [searchQuery, activeGenre]);

  // TMDB strictly limits discover pages to 500
  const totalPages = Math.min(data?.total_pages || 1, 500);

  return (
    <div className="min-h-screen bg-brand-darkBg text-brand-warmWhite overflow-x-hidden flex flex-col font-sans">
      {/* 1. Cinematic 100vh Hero Section */}
      <section className="h-screen w-full relative flex flex-col justify-between overflow-hidden shrink-0">
        
        {/* Layered Backdrops with smooth fade transitions */}
        {HERO_BACKDROPS.map((bd, idx) => (
          <div
            key={bd.name}
            className={`absolute inset-0 transition-all duration-1500 ease-in-out transform ${
              idx === backdropIndex ? 'opacity-25 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={bd.url}
              alt={bd.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Ambient sunset gradient overlays matching screenshot 1 color tone */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(14, 13, 12, 0.4) 0%, rgba(242, 137, 100, 0.18) 45%, rgba(200, 85, 75, 0.22) 75%, #0B0A09 100%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-darkBg/60 via-transparent to-brand-darkBg/60 z-10 pointer-events-none" />

        {/* Top Navbar */}
        <header className="w-full px-8 md:px-12 py-6 flex items-center justify-between relative z-20 bg-gradient-to-b from-brand-darkBg/50 to-transparent">
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => handleGenreChange(null)}>
            {/* Cinematic clapperboard logo */}
            <svg className="w-9 h-9 text-brand-warmWhite" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {/* Tilted clapper top (open) */}
              <path d="M4 8.5L18.5 4l1.5 3L5.5 11.5z" fill="currentColor" fillOpacity="0.15" />
              <path d="M8.5 7.2l1.1 2.2" />
              <path d="M12.5 6l1.1 2.2" />
              <path d="M16.5 4.8l1.1 2.2" />
              
              {/* Bottom slate */}
              <path d="M4 11.5h16V18c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-6.5z" fill="currentColor" fillOpacity="0.15" />
              
              {/* Inner details (lines) */}
              <path d="M8 15h8" />
              <path d="M8 18h4" />
            </svg>
            <h1 className="font-display font-semibold text-2xl md:text-3xl tracking-wide text-brand-warmWhite">
              Weekend Movies
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-warmWhite/80">
            <button onClick={() => { handleGenreChange(null); }} className="hover:text-brand-amber transition-colors duration-200">Home</button>
            <button onClick={scrollToBrowse} className="hover:text-brand-amber transition-colors duration-200">Browse</button>
            <button onClick={scrollToBrowse} className="hover:text-brand-amber transition-colors duration-200">FAQ</button>
            <button onClick={scrollToBrowse} className="hover:text-brand-amber transition-colors duration-200">Policies</button>
          </nav>
        </header>

        {/* Center Main Hero content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto relative z-20 mb-12">
          {/* Centered pushpin icon container */}
          <div className="mb-7 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
            <svg className="w-5 h-5 text-brand-warmWhite/90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2zM9.8 14l1.2-1.2V4h2v8.8l1.2 1.2H9.8z"/>
            </svg>
          </div>

          {/* Heading */}
          <h2 className="font-sans font-extrabold text-[42px] md:text-[66px] leading-[1.08] tracking-tight text-brand-warmWhite max-w-3xl mb-6">
            Your Next Favorite Movie Starts Here
          </h2>

          {/* Description */}
          <p className="font-sans text-sm md:text-base text-text-secondary max-w-xl mb-8 leading-relaxed opacity-90 font-medium">
            Discover hidden gems, explore cinematic masterpieces, and find your next story — all in one seamless app.
          </p>

          {/* White Pill Button */}
          <button
            onClick={scrollToBrowse}
            className="px-7 py-3 bg-brand-warmWhite hover:bg-brand-amber text-brand-darkBg font-sans font-bold rounded-full text-xs tracking-wider uppercase shadow-xl hover:shadow-[0_12px_30px_rgba(245,166,35,0.25)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Explore Now
          </button>
        </div>

        {/* Bottom Editorial details row matching first screenshot layout */}
        <div className="w-full px-8 md:px-12 py-5 hidden md:flex items-center justify-between text-[10px] font-sans tracking-[0.2em] text-text-muted/50 uppercase relative z-20 border-t border-white/[0.03]">
          <span>Hero Concept</span>
          <span>Illia V. Design</span>
          <span>2026</span>
        </div>
      </section>

      {/* 2. Main Browsing Section (Grid + Filters) */}
      <main 
        ref={mainContentRef}
        id="browse" 
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 scroll-mt-4 flex flex-col gap-10"
      >
        {/* Title, Search and Category filters layout */}
        <div className="flex flex-col gap-6 border-b border-brand-darkBorder pb-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <h2 className="font-display font-semibold text-[32px] md:text-[40px] text-brand-warmWhite leading-tight">
                {titleText}
              </h2>
              <div className="h-[3px] w-12 bg-brand-amber rounded-full" />
            </div>
            <div className="flex items-center justify-between md:justify-end gap-4">
              {!isLoading && !error && movies.length > 0 && (
                <span className="font-sans font-semibold text-xs text-text-muted tracking-wider uppercase mr-2">
                  Page {currentPage} of {totalPages}
                </span>
              )}
              <SearchBar onSearch={handleSearchChange} />
            </div>
          </div>

          {/* Horizontal Genre pills selector */}
          <GenreFilter
            selectedGenreId={selectedGenreId}
            onGenreChange={handleGenreChange}
            isDisabled={!!searchQuery}
            layout="horizontal"
          />
        </div>

        {/* Movie Results Grid or Error Message */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-5 rounded-full bg-accent-red/10 text-accent-red mb-5 border border-accent-red/20">
              <svg
                className="w-10 h-10"
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
            <h3 className="text-xl font-display font-semibold text-brand-warmWhite">Unable to load movies</h3>
            <p className="text-sm text-text-secondary max-w-sm mt-3 leading-relaxed">
              There was a problem communicating with TMDB. Please check your internet connection or API keys.
            </p>
          </div>
        ) : (
          <div className={`transition-opacity duration-300 ${isPlaceholderData ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <MovieGrid movies={movies} isLoading={isLoading} searchQuery={searchQuery} genres={genres} />
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && !error && movies.length > 0 && (
          <div className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-brand-darkBorder">
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                scrollToBrowse();
              }}
              disabled={currentPage === 1}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-brand-darkCard/40 text-text-muted border-brand-darkBorder cursor-not-allowed opacity-55'
                  : 'bg-brand-darkCard text-text-secondary border-brand-darkBorder hover:bg-brand-darkBorder/40 hover:text-brand-warmWhite shadow-md'
              }`}
            >
              Previous
            </button>
            
            <span className="text-xs text-text-secondary font-semibold tracking-widest uppercase">
              Page <span className="text-brand-warmWhite font-bold">{currentPage}</span> of{' '}
              <span className="text-brand-warmWhite font-bold">{totalPages}</span>
            </span>

            {currentPage < totalPages && (
              <button
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                  scrollToBrowse();
                }}
                className="px-6 py-2.5 bg-brand-amber hover:bg-brand-amber/90 text-brand-darkBg font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-brand-amber/15 transition-all duration-300 transform active:scale-95"
              >
                Next
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-darkCard border-t border-brand-darkBorder py-12 px-8 text-center text-xs text-text-muted tracking-widest uppercase mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Weekend Movies. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-warmWhite transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-brand-warmWhite transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-brand-warmWhite transition-colors duration-200">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
