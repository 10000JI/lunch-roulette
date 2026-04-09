import { useEffect } from 'react';
import type { Restaurant } from '../types/restaurant';
import { useRoulette } from '../hooks/useRoulette';

interface RouletteWheelProps {
  restaurants: Restaurant[];
  onResult: (winner: Restaurant) => void;
  isVisible: boolean;
}

export function RouletteWheel({ restaurants, onResult, isVisible }: RouletteWheelProps) {
  const { canvasRef, spin, isSpinning, reset } = useRoulette(restaurants, onResult);

  // Reset wheel when restaurants change (new category selected)
  useEffect(() => {
    reset();
  }, [restaurants, reset]);

  if (!isVisible) return null;

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-[min(85vw,400px)] min-w-[280px] aspect-square mx-auto flex items-center justify-center">
          <p className="text-gray-400 text-lg">카테고리를 선택해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-[min(85vw,400px)] min-w-[280px] aspect-square mx-auto">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ touchAction: 'none' }}
        />
      </div>
      <button
        type="button"
        onClick={spin}
        disabled={isSpinning || restaurants.length === 0}
        className="mt-6 w-[min(85vw,400px)] min-w-[280px] mx-auto block py-4 px-8 rounded-2xl text-xl font-bold text-white bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        돌리기!
      </button>
    </div>
  );
}
