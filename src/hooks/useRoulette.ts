import { useRef, useState, useEffect, useCallback } from 'react';
import type { Restaurant } from '../types/restaurant';
import { CATEGORIES } from '../constants/categories';

const PASTEL_COLORS = [
  '#FFB3BA', // pastel pink
  '#BAFFC9', // pastel green
  '#BAE1FF', // pastel blue
  '#FFFFBA', // pastel yellow
  '#E8BAFF', // pastel purple
  '#FFD9BA', // pastel orange
  '#BAFFEF', // pastel teal
  '#FFC9DE', // pastel rose
];

const MAX_SEGMENTS = 20;

function getCategoryEmoji(category: string): string {
  const cat = CATEGORIES.find((c) => c.id === category);
  return cat?.emoji ?? '';
}

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '\u2026';
}

function brightenColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brighten = (c: number) => Math.min(255, c + Math.round((255 - c) * 0.5));
  return `rgb(${brighten(r)}, ${brighten(g)}, ${brighten(b)})`;
}

function drawWheel(
  canvas: HTMLCanvasElement,
  segments: Restaurant[],
  currentAngle: number,
  highlightIndex?: number,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const radius = Math.min(cx, cy) - 10;

  if (segments.length === 0) {
    ctx.clearRect(0, 0, rect.width, rect.height);
    return;
  }

  const segCount = segments.length;
  const segAngle = (2 * Math.PI) / segCount;

  // Draw segments
  for (let i = 0; i < segCount; i++) {
    const startAngle = currentAngle + i * segAngle - Math.PI / 2;
    const endAngle = startAngle + segAngle;

    const colorIndex = i % PASTEL_COLORS.length;
    const baseColor = PASTEL_COLORS[colorIndex];
    const fillColor = highlightIndex === i ? brightenColor(baseColor) : baseColor;

    // Segment fill
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // White border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text: emoji + name
    const midAngle = startAngle + segAngle / 2;
    const textRadius = radius * 0.65;
    const tx = cx + Math.cos(midAngle) * textRadius;
    const ty = cy + Math.sin(midAngle) * textRadius;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(midAngle + Math.PI / 2);

    const emoji = getCategoryEmoji(segments[i].category);
    const name = truncateText(segments[i].name, 8);
    const label = `${emoji} ${name}`;

    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  // Pointer: triangle at top center pointing down
  const pointerWidth = 20;
  const pointerHeight = 25;
  ctx.beginPath();
  ctx.moveTo(cx - pointerWidth / 2, cy - radius - 5);
  ctx.lineTo(cx + pointerWidth / 2, cy - radius - 5);
  ctx.lineTo(cx, cy - radius + pointerHeight - 5);
  ctx.closePath();
  ctx.fillStyle = '#EF4444';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export interface UseRouletteReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  spin: () => void;
  isSpinning: boolean;
  winner: Restaurant | null;
  reset: () => void;
}

export function useRoulette(
  segments: Restaurant[],
  onComplete: (winner: Restaurant) => void,
): UseRouletteReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const segmentsRef = useRef(segments);
  const onCompleteRef = useRef(onComplete);

  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Restaurant | null>(null);

  // Keep refs in sync
  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const drawCurrent = useCallback((highlightIndex?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Limit segments for performance (T-02-03 mitigation)
    const limited = segmentsRef.current.slice(0, MAX_SEGMENTS);
    drawWheel(canvas, limited, angleRef.current, highlightIndex);
  }, []);

  const animate = useCallback(() => {
    angleRef.current += velocityRef.current;
    velocityRef.current *= 0.985;
    angleRef.current %= Math.PI * 2;

    drawCurrent();

    if (velocityRef.current > 0.001) {
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete - determine winner
      const segs = segmentsRef.current.slice(0, MAX_SEGMENTS);
      const segCount = segs.length;
      if (segCount === 0) {
        setIsSpinning(false);
        return;
      }

      const normalizedAngle = ((2 * Math.PI) - (angleRef.current % (2 * Math.PI))) % (2 * Math.PI);
      const winnerIndex = Math.floor((normalizedAngle / (2 * Math.PI)) * segCount) % segCount;

      // Highlight winner segment
      drawCurrent(winnerIndex);
      setIsSpinning(false);

      // Delay before calling onComplete
      setTimeout(() => {
        const winnerRestaurant = segs[winnerIndex];
        setWinner(winnerRestaurant);
        onCompleteRef.current(winnerRestaurant);
      }, 500);
    }
  }, [drawCurrent]);

  const spin = useCallback(() => {
    const segs = segmentsRef.current.slice(0, MAX_SEGMENTS);
    if (segs.length === 0) return;

    velocityRef.current = 0.3 + Math.random() * 0.2;
    setIsSpinning(true);
    setWinner(null);
    animFrameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const reset = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    setWinner(null);
    setIsSpinning(false);
    angleRef.current = 0;
    drawCurrent();
  }, [drawCurrent]);

  // Redraw when segments change
  useEffect(() => {
    drawCurrent();
  }, [segments, drawCurrent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return { canvasRef, spin, isSpinning, winner, reset };
}
