import { CATEGORIES } from '../constants/categories';
import type { Category } from '../types/restaurant';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onSelect: (category: Category) => void;
}

export function CategorySelector({ selectedCategory, onSelect }: CategorySelectorProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors whitespace-nowrap border ${
              isSelected
                ? 'bg-blue-100 border-blue-400 text-blue-800'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        );
      })}
    </div>
  );
}
