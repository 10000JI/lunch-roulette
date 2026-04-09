import type { Restaurant } from '../types/restaurant';
import { CATEGORIES } from '../constants/categories';

interface ResultCardProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export function ResultCard({ restaurant, onClose }: ResultCardProps) {
  const categoryInfo = CATEGORIES.find(c => c.id === restaurant.category);
  const emoji = categoryInfo?.emoji ?? '';

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`;

  const filledStars = Math.round(restaurant.rating);
  const stars = Array.from({ length: 5 }, (_, i) => (i < filledStars ? '\u2605' : '\u2606')).join('');

  const priceDisplay = '\u20A9'.repeat(restaurant.priceLevel);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 mx-4 max-w-sm w-full relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
        >
          {'\u2715'}
        </button>

        <div className="space-y-3">
          {/* Restaurant name with Google Maps link */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-blue-600 hover:text-blue-800 hover:underline block"
          >
            {emoji} {restaurant.name}
          </a>

          {/* Rating display */}
          <div className="flex items-center">
            <span className="text-yellow-500">{stars}</span>
            <span className="text-gray-600 text-sm ml-1">{restaurant.rating.toFixed(1)}</span>
          </div>

          {/* Distance and price row */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">
              {restaurant.distance !== undefined ? `\uD83D\uDCCD ${restaurant.distance}m` : '\uD83D\uDCCD \uAC70\uB9AC \uC815\uBCF4 \uC5C6\uC74C'}
            </span>
            {restaurant.priceLevel > 0 && (
              <span className="text-green-600 font-medium">{priceDisplay}</span>
            )}
          </div>

          {/* Address */}
          <p className="text-gray-500 text-sm">{restaurant.address}</p>

          {/* Re-spin button */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors cursor-pointer"
          >
            {'\uB2E4\uC2DC \uB3CC\uB9AC\uAE30'}
          </button>
        </div>
      </div>
    </div>
  );
}
