import { useEffect, useState } from 'react';
import { useLocation } from './hooks/useLocation';
import { getRestaurantProvider } from './services/placesApi';
import type { Restaurant } from './types/restaurant';

function App() {
  const { location, error: locationError, isLoading: locationLoading } = useLocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    async function fetchRestaurants() {
      setDataLoading(true);
      setDataError(null);
      try {
        const provider = getRestaurantProvider();
        // If location available, use it. Otherwise mock provider ignores coords anyway.
        const lat = location?.lat ?? 37.4979;
        const lng = location?.lng ?? 127.0276;
        const results = await provider.searchNearby(lat, lng);
        setRestaurants(results);
      } catch (err) {
        setDataError('식당 데이터를 불러오는데 실패했습니다.');
        console.error('Failed to fetch restaurants:', err);
      } finally {
        setDataLoading(false);
      }
    }

    // Fetch when location resolves OR when location fails (use mock fallback)
    if (!locationLoading) {
      fetchRestaurants();
    }
  }, [location, locationLoading]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Lunch Roulette</h1>

      {/* Location status */}
      <div className="mb-4 p-3 rounded-lg bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 mb-1">위치 상태</h2>
        {locationLoading && <p className="text-gray-600">위치 감지 중...</p>}
        {locationError && <p className="text-red-600">{locationError}</p>}
        {location && (
          <p className="text-green-600">
            위치 감지 완료: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
        )}
      </div>

      {/* Restaurant data status */}
      <div className="p-3 rounded-lg bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 mb-1">
          식당 데이터 ({restaurants.length}개)
        </h2>
        {dataLoading && <p className="text-gray-600">데이터 로딩 중...</p>}
        {dataError && <p className="text-red-600">{dataError}</p>}
        {restaurants.length > 0 && (
          <ul className="space-y-1">
            {restaurants.map(r => (
              <li key={r.id} className="text-sm text-gray-700">
                {r.name} -- {r.rating} | {r.category} | {r.address}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
