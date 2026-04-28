import useSearch from './useSearch';

export function useSeries(query) {
  return useSearch(query, 'series');
}
