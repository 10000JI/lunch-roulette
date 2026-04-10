import { useState } from 'react';
import { useLocation } from './hooks/useLocation';
import { useRestaurants } from './hooks/useRestaurants';
import { CategorySelector } from './components/CategorySelector';
import { RouletteWheel } from './components/RouletteWheel';
import { ResultCard } from './components/ResultCard';
import { RestaurantList } from './components/RestaurantList';
import type { Category, Restaurant, SortMode } from './types/restaurant';

function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('popularity');
  const [radius, setRadius] = useState<number>(1000);

  const { location, error: locationError, isLoading: locationLoading } = useLocation();
  const { restaurants, isLoading: restaurantsLoading, error: restaurantsError } = useRestaurants(
    location?.lat ?? null,
    location?.lng ?? null,
    selectedCategory,
    sortMode,
    radius
  );

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col items-center px-4 py-6 pb-safe">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">점심 룰렛</h1>
      <p className="text-sm text-gray-400 mb-6">오늘 뭐 먹지?</p>

      {/* Location status */}
      {locationLoading && <LoadingSpinner message="위치를 찾고 있어요..." />}
      {locationError && <p className="text-xs text-gray-400 mb-2">{locationError}</p>}

      {/* Category selector */}
      <div className="w-full max-w-md mb-6">
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelect={(cat) => {
            setSelectedCategory(cat);
            setWinner(null);
          }}
        />
      </div>

      {/* Sort mode + radius controls */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            sortMode === 'popularity'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
          }`}
          onClick={() => setSortMode('popularity')}
        >
          🔥 인기순
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            sortMode === 'distance'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
          }`}
          onClick={() => setSortMode('distance')}
        >
          📍 거리순
        </button>
        <span className="text-gray-300 text-xs leading-6">|</span>
        {[100, 200, 500, 1000].map((r) => (
          <button
            key={r}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              radius === r
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => setRadius(r)}
          >
            {r >= 1000 ? `${r / 1000}km` : `${r}m`}
          </button>
        ))}
      </div>

      {/* Loading state for restaurants */}
      {restaurantsLoading && <LoadingSpinner message="식당을 찾고 있어요..." />}
      {restaurantsError && (
        <p className="text-red-500 text-sm mb-4">{restaurantsError}</p>
      )}

      {/* Roulette wheel */}
      <RouletteWheel
        restaurants={restaurants}
        onResult={(w) => setWinner(w)}
        isVisible={selectedCategory !== null && !restaurantsLoading}
      />

      {/* Restaurant list below wheel */}
      {selectedCategory && !restaurantsLoading && (
        <RestaurantList restaurants={restaurants} />
      )}

      {/* Result modal */}
      {winner && (
        <ResultCard
          restaurant={winner}
          onClose={() => setWinner(null)}
        />
      )}
    </div>
  );
}

export default App;
