import type { Restaurant } from '../types/restaurant';
import { CATEGORIES } from '../constants/categories';

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
  if (restaurants.length === 0) return null;

  return (
    <div className="w-full max-w-md mt-6">
      <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">
        주변 식당 ({restaurants.length}개)
      </h2>
      <div className="space-y-2">
        {restaurants.map((r) => {
          const cat = CATEGORIES.find(c => c.id === r.category);
          const emoji = cat?.emoji ?? '';
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' ' + r.address)}`;
          const stars = '\u2605'.repeat(Math.round(r.rating)) + '\u2606'.repeat(5 - Math.round(r.rating));
          return (
            <a
              key={r.id}
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all active:scale-[0.98]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {emoji} {r.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="text-yellow-500">{stars}</span>
                    <span>{r.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-xs text-gray-500">
                    {r.distance !== undefined ? `${r.distance}m` : ''}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
