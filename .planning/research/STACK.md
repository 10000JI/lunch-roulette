# Stack Research

**Domain:** Location-based restaurant roulette web app (SPA)
**Researched:** 2026-04-08
**Confidence:** HIGH (core stack confirmed by PROJECT.md constraints; versions verified via npm registry)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.4 | UI framework | Confirmed in project constraints. React 19 is stable with improved performance and excellent ecosystem. |
| Vite | 8.0.7 | Build tool / dev server | Confirmed in constraints. Near-instant HMR, native ESM, zero-config for React+TS. Vite 8 is current stable. |
| TypeScript | 6.0.2 | Type safety | Confirmed in constraints. TS 6.x is current stable, catches bugs at compile time. |
| Tailwind CSS | 4.2.2 | Utility-first CSS | Confirmed in constraints. v4 uses CSS-first config (no tailwind.config.js), faster builds, native @theme directive. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vitejs/plugin-react | 6.0.1 | Vite React integration | Always -- required for JSX transform and React Fast Refresh. |
| @tailwindcss/vite | 4.2.2 | Tailwind CSS Vite plugin | Always -- Tailwind v4 integrates via Vite plugin instead of PostCSS. |
| canvas-confetti | 1.9.4 | Confetti celebration effect | On roulette result -- lightweight (< 5KB gzipped), zero-dependency. |

### Google Places API Integration

Use native `fetch` directly. The Places API (New) is a simple REST API. No SDK wrapper needed.

**Rationale:** This app does NOT display a map. Adding @googlemaps/js-api-loader (72KB) would be unnecessary overhead.

**API endpoints needed:**
- `POST https://places.googleapis.com/v1/places:searchNearby` -- find restaurants by location + type
- Fields: places.displayName, places.rating, places.priceLevel, places.location, places.formattedAddress

### Spinning Wheel (Roulette)

| Approach | Recommendation | Why |
|----------|---------------|-----|
| Custom Canvas implementation | **RECOMMENDED** | Full control over appearance, animation, easing. ~150-200 lines. |
| spin-wheel (5.0.2) | Acceptable alternative | Well-maintained. Use if time is very tight. |
| react-custom-roulette (1.4.1) | DO NOT USE | Abandoned since April 2023. No React 19 support. |

## Installation

```bash
npm create vite@latest lunch-roulette -- --template react-ts
npm install tailwindcss @tailwindcss/vite
npm install canvas-confetti
npm install -D @types/canvas-confetti
```

### Vite Config

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Tailwind v4 Setup

```css
/* src/index.css */
@import "tailwindcss";
```

No tailwind.config.js needed in v4.

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| react-custom-roulette | Abandoned since April 2023 | Custom Canvas wheel or spin-wheel v5 |
| Google Maps JavaScript API (full) | 200KB+ bundle for map rendering not needed | Direct REST calls via fetch |
| PostCSS + autoprefixer | Tailwind v4 uses @tailwindcss/vite plugin directly | @tailwindcss/vite plugin |
| Create React App (CRA) | Officially deprecated | Vite with react-ts template |
| Axios | 13KB for calls fetch handles natively | Native fetch API |
| Redux/Zustand/Jotai | Overkill. ~3 pieces of state total | React useState + prop drilling |

## Stack Patterns by Variant

**If API key available:** Use fetch to call Google Places API (New) Nearby Search endpoint.
**If API key NOT available:** Use hardcoded mock data (~10 restaurants). Same data shape as API response.
**If time extremely tight:** Skip canvas-confetti, use spin-wheel v5 instead of custom canvas.

## Sources

- npm registry (direct npm view queries) -- all versions verified 2026-04-08
- Google Places API (New) documentation
- Tailwind CSS v4 release documentation

---
*Stack research for: Lunch Roulette*
*Researched: 2026-04-08*
