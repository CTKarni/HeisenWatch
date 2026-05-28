import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from '../api/tmdb';

export default function TestApi() {
  const { data: genres, error, isLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
  });

  console.log('TestApi - Genres load state:', { isLoading, error, genres });

  if (isLoading) return <p className="text-text-secondary">Testing API - Loading genres...</p>;
  if (error) return <p className="text-accent-red">Testing API - Error: {error.message} (Check console/network. Is your API key valid?)</p>;

  return (
    <div className="p-4 bg-surface-card border border-surface-border rounded-xl mt-4 shadow-sm">
      <h3 className="font-bold text-text-primary">Successfully fetched {genres?.length} genres:</h3>
      <ul className="list-disc pl-5 mt-2 text-sm text-text-secondary">
        {genres?.slice(0, 5).map((g) => (
          <li key={g.id}>{g.name}</li>
        ))}
        {genres?.length > 5 && <li>...and {genres.length - 5} more</li>}
      </ul>
    </div>
  );
}
