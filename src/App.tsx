import { useState } from 'react';
import { useLocation } from './hooks/useLocation';
import { useRestaurants } from './hooks/useRestaurants';
import { CategorySelector } from './components/CategorySelector';
import { RouletteWheel } from './components/RouletteWheel';
import { ResultCard } from './components/ResultCard';
import type { Category, Restaurant } from './types/restaurant';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [winner, setWinner] = useState<Restaurant | null>(null);

  const { location, error: locationError, isLoading: locationLoading } = useLocation();
  const { restaurants, isLoading: restaurantsLoading, error: restaurantsError } = useRestaurants(
    location?.lat ?? null,
    location?.lng ?? null,
    selectedCategory
  );

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col items-center px-4 py-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">점심 룰렛</h1>

      {/* Location status - small, subtle */}
      {locationLoading && <p className="text-sm text-gray-400 mb-2">위치 감지 중...</p>}
      {locationError && <p className="text-xs text-gray-400 mb-2">{locationError}</p>}

      {/* Category selector - always visible at top */}
      <div className="w-full max-w-md mb-6">
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelect={(cat) => {
            setSelectedCategory(cat);
            setWinner(null);
          }}
        />
      </div>

      {/* Loading state for restaurants */}
      {restaurantsLoading && (
        <p className="text-gray-500 mb-4">식당 목록 불러오는 중...</p>
      )}
      {restaurantsError && (
        <p className="text-red-500 text-sm mb-4">{restaurantsError}</p>
      )}

      {/* Roulette wheel - visible when category selected and restaurants loaded */}
      <RouletteWheel
        restaurants={restaurants}
        onResult={(w) => setWinner(w)}
        isVisible={selectedCategory !== null && !restaurantsLoading}
      />

      {/* Result modal - shown when winner is set */}
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
