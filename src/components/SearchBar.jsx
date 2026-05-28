import { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

/**
 * SearchBar component for typing search queries.
 * Debounces query changes by 400ms before emitting.
 * 
 * @param {Object} props
 * @param {Function} props.onSearch Callback when debounced query changes
 * @param {string} [props.placeholder] Optional placeholder text
 */
export default function SearchBar({ onSearch, placeholder = 'Search for movies...' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Emit the debounced search query up to the parent
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="w-[280px] focus-within:w-[360px] transition-all duration-300 ease-in-out relative">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 text-text-secondary group-focus-within:text-brand-amber"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Text Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 bg-brand-darkCard text-brand-warmWhite placeholder-text-muted rounded-full border border-brand-darkBorder focus:border-brand-amber/80 focus:outline-none focus:ring-1 focus:ring-brand-amber/30 transition-all duration-300 text-sm font-normal shadow-lg"
      />

      {/* Clear Button */}
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-brand-warmWhite transition-colors duration-150"
          aria-label="Clear search query"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
