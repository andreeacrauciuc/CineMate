import useSearch from './useSearch';

export function useMovies(query) {
  return useSearch(query, 'movie');
}
