import { useEffect, useState } from 'react';
import type { Category, Restaurant, SortMode } from '../types/restaurant';
import { getRestaurantProvider } from '../services/placesApi';

const ALL_RADII = [100, 200, 500, 1000];

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
}

export function useRestaurants(
  lat: number | null,
  lng: number | null,
  category: Category | null,
  sortMode: SortMode = 'popularity',
  radius: number = 1000
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

        // 선택한 반경 이하의 모든 반경으로 호출해서 합침
        // 예: 1km 선택 → 100m, 200m, 500m, 1km 각각 호출 후 중복 제거
        const radiiToFetch = ALL_RADII.filter(r => r <= radius);
        const allFetched = await Promise.all(
          radiiToFetch.map(r => provider.searchNearby(useLat, useLng, category ?? undefined, r))
        );

        if (!cancelled) {
          // 합치고 id 기준 중복 제거
          const seen = new Set<string>();
          const merged = allFetched.flat().filter(r => {
            if (seen.has(r.id)) return false;
            seen.add(r.id);
            return true;
          });

          const sortFn = (a: Restaurant, b: Restaurant) => {
            if (sortMode === 'distance') return (a.distance ?? 0) - (b.distance ?? 0);
            return (b.rating ?? 0) - (a.rating ?? 0);
          };

          const filtered = merged
            .filter(r => r.category === category)
            .sort(sortFn);

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
  }, [lat, lng, category, sortMode, radius]);

  return { restaurants, isLoading, error };
}
