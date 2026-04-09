import { useEffect, useState } from 'react';
import type { Category, Restaurant } from '../types/restaurant';
import { getRestaurantProvider } from '../services/placesApi';

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
}

export function useRestaurants(
  lat: number | null,
  lng: number | null,
  category: Category | null
): UseRestaurantsReturn {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setRestaurants([]);
      return;
    }

    let cancelled = false;
    async function fetchRestaurants() {
      setIsLoading(true);
      setError(null);
      try {
        const provider = getRestaurantProvider();
        const useLat = lat ?? 37.4979;
        const useLng = lng ?? 127.0276;
        const results = await provider.searchNearby(useLat, useLng, category);
        if (!cancelled) {
          const filtered = results
            .filter(r => r.category === category)
            .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
          setRestaurants(filtered);
        }
      } catch {
        if (!cancelled) {
          setError('식당 데이터를 불러오는데 실패했습니다.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchRestaurants();
    return () => { cancelled = true; };
  }, [lat, lng, category]);

  return { restaurants, isLoading, error };
}
