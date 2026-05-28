import axios from 'axios';

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

tmdb.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  };
  return config;
});

export const fetchGenres = async () => {
  const response = await tmdb.get('/genre/movie/list');
  return response.data.genres;
};

export const fetchMoviesByGenre = async (genreId, page = 1) => {
  const response = await tmdb.get('/discover/movie', {
    params: {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      page,
    },
  });
  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await tmdb.get('/search/movie', {
    params: {
      query,
      page,
    },
  });
  return response.data;
};

export const fetchMovieDetails = async (movieId) => {
  const response = await tmdb.get(`/movie/${movieId}`);
  return response.data;
};

export const fetchMovieCredits = async (movieId) => {
  const response = await tmdb.get(`/movie/${movieId}/credits`);
  return response.data;
};

export default tmdb;
