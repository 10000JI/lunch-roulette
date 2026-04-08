# Architecture Research

**Domain:** Location-based restaurant finder with roulette UI (client-side SPA)
**Researched:** 2026-04-08
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌────────────┐  ┌───────────┐              │
│  │ Category  │  │  Roulette  │  │  Result   │              │
│  │ Selector  │  │   Wheel    │  │   Card    │              │
│  └─────┬─────┘  └─────┬──────┘  └─────┬─────┘              │
│        │              │              │                      │
├────────┴──────────────┴──────────────┴──────────────────────┤
│                     State / Hook Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ useLocation  │  │ useRestaurants│ │ useRoulette  │      │
│  │   (geo)     │  │  (places)    │  │  (spin logic)│      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                 │                                 │
├─────────┴─────────────────┴─────────────────────────────────┤
│                     Service Layer                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ Places API   │  │ Mock Data    │                         │
│  │   Client     │  │  Provider    │                         │
│  └──────┬───────┘  └──────┬───────┘                         │
│         │                 │                                 │
├─────────┴─────────────────┴─────────────────────────────────┤
│                     External APIs                            │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │ Browser Geolocation  │  │ Google Places (New)  │         │
│  └──────────────────────┘  └──────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

This is a **client-side only SPA** with no backend. All API calls go directly from the browser to Google Places API (New). This is the correct architecture for a 30-40 minute demo project -- adding a backend server would be unnecessary complexity.

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| App | Top-level layout, orchestrates flow between steps | React component with state machine (category -> spin -> result) |
| CategorySelector | Display category buttons, emit selection | Stateless component receiving categories as props |
| RouletteWheel | Canvas-based spinning wheel animation | HTML5 Canvas with requestAnimationFrame for smooth deceleration |
| ResultCard | Show selected restaurant details | Stateless card with name, rating, distance, price level |
| useLocation | Get browser geolocation coordinates | Custom hook wrapping navigator.geolocation.getCurrentPosition |
| useRestaurants | Fetch/filter restaurants by category and location | Custom hook calling Places API service or mock fallback |
| useRoulette | Spin physics: start velocity, deceleration, winner selection | Custom hook managing animation state and final selection index |
| PlacesApiClient | HTTP calls to Google Places API (New) | Service module with nearbySearch using fetch |
| MockDataProvider | Hardcoded ~10 restaurants for demo fallback | Static JSON data matching Places API response shape |

## Recommended Project Structure

```
src/
├── components/          # UI components
│   ├── App.tsx          # Root component, flow orchestration
│   ├── CategorySelector.tsx  # Category filter buttons
│   ├── RouletteWheel.tsx     # Canvas spinning wheel
│   ├── ResultCard.tsx        # Winner restaurant display
│   └── RestaurantList.tsx    # Optional: list view of candidates
├── hooks/               # Custom React hooks
│   ├── useLocation.ts   # Browser geolocation wrapper
│   ├── useRestaurants.ts # Places API data fetching + filtering
│   └── useRoulette.ts   # Spin animation physics + winner logic
├── services/            # External API interaction
│   ├── placesApi.ts     # Google Places API (New) client
│   └── mockData.ts      # Fallback restaurant data
├── types/               # TypeScript type definitions
│   └── restaurant.ts    # Restaurant, Category, Location types
├── constants/           # App-wide constants
│   └── categories.ts    # Category definitions (Korean, Chinese, etc.)
├── main.tsx             # Vite entry point
└── index.css            # Tailwind CSS entry
```

### Structure Rationale

- **components/:** Flat structure is correct for ~5 components. No need for nested folders or barrel exports at this scale.
- **hooks/:** Separating hooks from components keeps logic testable and reusable. Each hook owns one concern.
- **services/:** Isolates all external API interaction behind a consistent interface. The mock/real switch happens here, invisible to hooks.
- **types/:** Shared TypeScript interfaces prevent circular dependencies and serve as the contract between layers.

## Architectural Patterns

### Pattern 1: Service Abstraction with Mock Fallback

**What:** A single interface for restaurant data with two implementations -- real API and mock data. The hook checks for API key presence and selects the provider automatically.
**When to use:** Always -- this is critical for the demo to work without API keys.
**Trade-offs:** Tiny amount of extra code, but makes the app functional in all environments.

**Example:**
```typescript
// services/placesApi.ts
interface RestaurantProvider {
  searchNearby(lat: number, lng: number, category: string): Promise<Restaurant[]>;
}

export function getProvider(): RestaurantProvider {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  if (apiKey) {
    return new PlacesApiClient(apiKey);
  }
  return new MockDataProvider();
}
```

### Pattern 2: Canvas Animation via useRef + requestAnimationFrame

**What:** The roulette wheel uses an HTML5 Canvas element accessed through React useRef. Animation runs via requestAnimationFrame outside React's render cycle for smooth 60fps performance.
**When to use:** For any continuous animation in React. CSS animations cannot achieve the dynamic deceleration curve needed for a roulette wheel.
**Trade-offs:** More code than CSS, but gives full control over easing, segment highlighting, and winner detection.

**Example:**
```typescript
// hooks/useRoulette.ts
function useRoulette(segments: Restaurant[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);

  const spin = () => {
    velocityRef.current = 15 + Math.random() * 10; // random initial speed
    requestAnimationFrame(animate);
  };

  const animate = () => {
    angleRef.current += velocityRef.current;
    velocityRef.current *= 0.98; // deceleration friction
    drawWheel(canvasRef.current!, segments, angleRef.current);
    if (velocityRef.current > 0.1) {
      requestAnimationFrame(animate);
    } else {
      // determine winner from final angle
      const winnerIndex = getWinnerIndex(angleRef.current, segments.length);
      onComplete(segments[winnerIndex]);
    }
  };

  return { canvasRef, spin };
}
```

### Pattern 3: Step-based UI Flow (Implicit State Machine)

**What:** The app has three distinct states: (1) Select category, (2) Spin roulette, (3) View result. A simple state variable controls which view is rendered. No need for a state machine library.
**When to use:** When the app has a clear linear flow with few states.
**Trade-offs:** Simple enough for 3 states. If flow became complex (branching, back-navigation, nested states), a proper state machine library like XState would be warranted.

**Example:**
```typescript
type AppStep = 'select' | 'spin' | 'result';
const [step, setStep] = useState<AppStep>('select');
```

## Data Flow

### Request Flow

```
[User selects category]
    |
    v
[useRestaurants hook] --> [getProvider()] --> [PlacesAPI or MockData]
    |                                              |
    v                                              v
[Filter by category + sort by distance]    [Return Restaurant[]]
    |
    v
[Populate RouletteWheel segments]
    |
    v
[User clicks Spin]
    |
    v
[useRoulette hook] --> [requestAnimationFrame loop]
    |                        |
    v                        v
[Canvas redraws each frame]  [Velocity decays to 0]
    |
    v
[Winner determined from final angle]
    |
    v
[ResultCard displays winner details]
```

### State Management

No external state management library needed. React useState + custom hooks are sufficient for this scope.

```
App State:
  - step: 'select' | 'spin' | 'result'
  - selectedCategory: string | null
  - restaurants: Restaurant[]
  - winner: Restaurant | null
  - userLocation: { lat, lng } | null
  - isLoading: boolean
  - error: string | null
```

All state lives in the App component and flows down via props. This is a single-page, single-user, no-persistence app -- lifting state to App is the right call.

### Key Data Flows

1. **Geolocation flow:** App mounts -> useLocation requests browser permission -> coordinates stored in state -> passed to useRestaurants on category selection.
2. **Restaurant fetch flow:** Category selected -> useRestaurants calls provider with coords + category -> results sorted by distance -> stored in state -> passed to RouletteWheel.
3. **Spin flow:** User clicks spin -> useRoulette starts animation loop -> canvas redraws each frame -> velocity decays -> winner index calculated -> winner state set -> ResultCard renders.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Demo (current) | Client-side only, no backend, direct API calls from browser. Perfect for the 30-40 min scope. |
| Production (if ever) | Add a thin backend proxy to hide Google API key from client bundle. Rate limit API calls server-side. |
| Multi-user | Add user accounts, save history. Would need database + auth -- well beyond demo scope. |

### Scaling Priorities

1. **First bottleneck:** Google Places API quota. The free tier allows a generous number of requests, but a viral app would hit limits. Mitigation: cache results by location+category with a short TTL.
2. **Second bottleneck:** API key exposure in client bundle. For a demo this is acceptable. For production, proxy through a backend.

## Anti-Patterns

### Anti-Pattern 1: Calling Google Places API on Every Render

**What people do:** Put the API call in useEffect with dependencies that change frequently, causing repeated fetches.
**Why it's wrong:** Wastes API quota, causes flickering UI, and can trigger rate limits.
**Do this instead:** Fetch only when category selection changes. Use a loading state to prevent duplicate requests. Consider a simple in-memory cache keyed by `${lat},${lng},${category}`.

### Anti-Pattern 2: Managing Canvas Animation Through React State

**What people do:** Store animation angle in useState and re-render the component each frame.
**Why it's wrong:** React re-renders are too slow for 60fps animation. Causes janky, stuttering wheel.
**Do this instead:** Use useRef for angle and velocity. Update canvas directly via the 2D context. Only trigger a React state update when the animation completes (to set the winner).

### Anti-Pattern 3: Coupling Mock Data Shape to Component Props

**What people do:** Have mock data in a different shape than real API responses, requiring conditional mapping logic in components.
**Why it's wrong:** Components end up with branching logic for data sources, making the mock/real switch fragile.
**Do this instead:** Define a canonical `Restaurant` type. Both the Places API client and mock provider normalize data into this exact shape. Components never know which provider was used.

### Anti-Pattern 4: Over-engineering State Management

**What people do:** Reach for Redux, Zustand, or Context for a small app with 5 components.
**Why it's wrong:** Adds boilerplate and complexity for zero benefit when prop drilling is only 1-2 levels deep.
**Do this instead:** useState in App, pass props down. When the component tree is flat (which it is here), this is the simplest and most maintainable approach.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Browser Geolocation API | `navigator.geolocation.getCurrentPosition()` | Must handle permission denied gracefully. Show manual location input or default coordinates as fallback. HTTPS required. |
| Google Places API (New) | REST fetch to `https://places.googleapis.com/v1/places:searchNearby` | Use `X-Goog-Api-Key` header. Request fields mask to minimize response size and cost. Category mapping: app categories (Korean, Chinese, etc.) must map to Places API type codes. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Components <-> Hooks | Props + return values | Hooks return data and handler functions. Components are purely presentational where possible. |
| Hooks <-> Services | Async function calls | Hooks call service functions, handle loading/error states. Services return Promise<Restaurant[]>. |
| Services <-> Types | Shared interfaces | The Restaurant type is the contract. Services transform API responses into this shape. |

## Build Order (Dependencies)

The following build order respects component dependencies:

1. **Types + Constants** (no dependencies) -- Define Restaurant, Category, Location types. Define category list.
2. **Services** (depends on Types) -- PlacesApiClient and MockDataProvider. Can be tested independently.
3. **useLocation hook** (depends on Types) -- Browser geolocation. Independent of other hooks.
4. **useRestaurants hook** (depends on Services, Types) -- Fetching + filtering logic. Needs services layer.
5. **CategorySelector component** (depends on Constants) -- Pure UI, no data dependencies.
6. **RouletteWheel + useRoulette** (depends on Types) -- Canvas rendering + spin physics. Core UX feature.
7. **ResultCard component** (depends on Types) -- Pure UI for winner display.
8. **App component** (depends on everything) -- Wire all pieces together, manage flow state.

**Implication for phases:** Steps 1-3 are foundation (can be built in parallel). Steps 4-7 are features (can be built in parallel once foundation exists). Step 8 is integration. This suggests a 3-phase approach: Foundation -> Features -> Integration+Polish.

## Sources

- Google Places API (New) documentation: https://developers.google.com/maps/documentation/places/web-service/nearby-search
- HTML5 Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- React hooks patterns: React official documentation
- Confidence based on well-established patterns for client-side SPAs with external API integration

---
*Architecture research for: Location-based restaurant roulette (Lunch Roulette)*
*Researched: 2026-04-08*
