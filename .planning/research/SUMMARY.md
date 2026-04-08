# Project Research Summary

**Project:** Lunch Roulette
**Domain:** Location-based restaurant roulette web app (client-side SPA)
**Researched:** 2026-04-08
**Confidence:** MEDIUM-HIGH

## Executive Summary

Lunch Roulette is a client-side single-page application that combines real restaurant data from Google Places API with an engaging spinning wheel UI. The expert approach for this type of product is a zero-backend SPA built with React 19 + Vite + TypeScript + Tailwind CSS v4, using a custom HTML5 Canvas wheel with requestAnimationFrame-driven animation. The key differentiator versus existing food roulette apps is the combination of real nearby restaurant data with a polished, physics-based wheel interaction -- most competitors offer one or the other, but not both.

The recommended approach is a 3-phase build: foundation (types, services, geolocation, mock data), features (canvas wheel, API integration, result display), and integration/polish (wire everything together, mobile refinement, celebration effects). Mock data should be built before real API integration to ensure the demo always works regardless of API key availability or quota issues. The entire scope targets 30-40 minutes of build time, so every decision must favor simplicity.

The primary risks are: (1) CORS blocking direct REST calls to Google Places API from the browser -- the app must use the Google Maps JavaScript API `importLibrary('places')` approach instead, which contradicts the initial STACK.md recommendation of raw fetch; (2) geolocation silently failing without proper error handling; and (3) canvas rendering blurry on Retina displays. All three have straightforward mitigations documented in the pitfalls research.

## Key Findings

### Recommended Stack

The stack is fully constrained by the project definition: React 19, Vite 8, TypeScript 6, Tailwind CSS v4. All versions verified against npm registry. No state management library needed -- React useState with prop drilling is correct for ~5 components and ~7 pieces of state. The spinning wheel should be a custom Canvas implementation (~150-200 lines) for full control over deceleration physics.

**Core technologies:**
- React 19.2.4: UI framework -- confirmed constraint, stable with excellent ecosystem
- Vite 8.0.7: Build tool -- near-instant HMR, zero-config for React+TS
- TypeScript 6.0.2: Type safety -- catches bugs at compile time
- Tailwind CSS 4.2.2: Styling -- CSS-first config in v4, no config file needed
- canvas-confetti 1.9.4: Celebration effect -- lightweight (<5KB gzipped), zero-dependency

**Critical stack decision:** Do NOT use raw fetch for Google Places API. Use Google Maps JS API with `importLibrary('places')` to avoid CORS issues (see Pitfalls). This means adding a script tag for the Maps JS API loader rather than the zero-dependency approach initially suggested.

### Expected Features

**Must have (table stakes):**
- Location detection via Geolocation API with graceful fallback
- Category/cuisine filter (Korean, Chinese, Japanese, Western, etc.)
- Canvas spinning wheel with smooth exponential deceleration
- Result card with name, rating, distance, price level
- Re-spin button (users reject ~40% of random picks)
- Mobile-responsive layout (primary use case is phone)
- Loading, error, and empty states
- Mock data fallback for demo reliability

**Should have (add if time permits):**
- Winner reveal animation (confetti) -- low effort, high delight
- Distance radius slider -- feeds API parameter directly
- Navigation link (open in Google Maps / Naver Map)
- Session-only exclude list

**Defer (v2+):**
- User accounts, history, group voting, AI recommendations, dark mode, map view -- all are anti-features that would blow the scope

### Architecture Approach

A 3-layer client-side SPA: Presentation (5 React components), State/Hook layer (3 custom hooks), and Service layer (Places API client + mock provider). All state lives in the App component. The app follows a step-based flow: select category -> spin wheel -> view result. A service abstraction pattern with automatic mock fallback ensures the app works with or without an API key.

**Major components:**
1. App.tsx -- flow orchestration via step state machine ('select' | 'spin' | 'result')
2. RouletteWheel.tsx + useRoulette hook -- Canvas wheel with requestAnimationFrame animation loop
3. useRestaurants hook + service layer -- data fetching with automatic mock/real provider switching
4. CategorySelector.tsx -- filter UI driving restaurant search
5. ResultCard.tsx -- winner display with actionable info

### Critical Pitfalls

1. **CORS on Places API** -- Direct REST fetch calls are blocked by CORS. Must use Google Maps JS API `importLibrary('places')` instead. Decide this in Phase 1 before writing any API code.
2. **Geolocation silent failure** -- Always provide error callback with explicit 10s timeout. Handle PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT. Build mock fallback first.
3. **Canvas blurry on Retina** -- Scale canvas by `window.devicePixelRatio`. Set CSS size separately from canvas pixel dimensions.
4. **API key exposure in client bundle** -- Restrict key in Google Cloud Console (HTTP referrer + API scope). Set daily quota limit (100 requests/day). Never commit .env.
5. **Field mask omission** -- Places API (New) requires explicit field mask. Request only displayed fields to control billing.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation
**Rationale:** Types, services, and geolocation are dependencies for everything else. Mock data must exist before real API integration so the demo always works. The CORS decision must be made here.
**Delivers:** Project scaffold, type definitions, mock data provider, geolocation hook with error handling, category constants, basic layout shell
**Addresses:** Mock data fallback, location detection, mobile-responsive layout shell
**Avoids:** Geolocation silent failure (Pitfall 1), CORS approach decision (Pitfall 8), API key exposure setup (Pitfall 2)

### Phase 2: Core Features
**Rationale:** The roulette wheel and API integration are the two highest-complexity features. They can be built in parallel once foundation exists. The wheel is the hero interaction -- it must feel right.
**Delivers:** Canvas spinning wheel with exponential deceleration, Google Places API integration (via JS API), category selector wired to data fetching, restaurant data flowing into wheel segments
**Addresses:** Spinning wheel animation, Places API integration, category filter, result card display
**Avoids:** Canvas HiDPI blurriness (Pitfall 4), poor spin animation feel (Pitfall 5), wrong field mask (Pitfall 3), empty API results (Pitfall 7)

### Phase 3: Integration and Polish
**Rationale:** Wire all pieces together in the App component. Add the re-spin flow, loading/error states, and celebration effects. Mobile refinement.
**Delivers:** Complete end-to-end flow (select -> spin -> result -> re-spin), loading and error states, confetti on winner, mobile viewport fixes
**Addresses:** Re-spin button, loading/error states, winner reveal animation, mobile viewport issues
**Avoids:** Mobile viewport issues (Pitfall 6)

### Phase Ordering Rationale

- Types and mock data come first because every other component depends on the Restaurant type contract and needs data to render during development
- The CORS approach for Places API must be decided in Phase 1 because it affects whether we load the Google Maps JS API script or use raw fetch -- this changes the service layer implementation
- Wheel and API integration are grouped in Phase 2 because they are independent of each other but both depend on Phase 1 types and services
- Integration is last because it requires all components to exist before wiring them together
- This mirrors the architecture research's build order: Foundation -> Features -> Integration

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (API Integration):** The CORS pitfall contradicts the STACK.md recommendation of using raw fetch. Phase planning must resolve whether to use Google Maps JS API `importLibrary('places')` or set up a Vite dev proxy. This is the single most important technical decision.
- **Phase 2 (Roulette Wheel):** Canvas animation with proper easing, HiDPI support, and winner detection is the most complex code. Worth reviewing reference implementations during planning.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Standard Vite + React + TypeScript scaffolding with well-documented patterns
- **Phase 3:** Standard React state management and component composition

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm registry. Constraints from PROJECT.md. |
| Features | MEDIUM | Based on training data analysis of competitors, not live verification. Feature landscape is stable for this domain. |
| Architecture | HIGH | Well-established patterns for client-side SPAs. Component structure is straightforward. |
| Pitfalls | MEDIUM | CORS pitfall is critical and contradicts STACK.md. Geolocation and Canvas pitfalls are well-documented. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **CORS resolution:** STACK.md recommends raw fetch to Places API, but PITFALLS.md warns this will fail due to CORS. Must resolve during Phase 2 planning -- either use Google Maps JS API or a Vite dev proxy. Recommendation: use Google Maps JS API since it works in both dev and production.
- **Google Places API (New) vs. legacy:** Research references both the new REST API and the JS API approach. Need to confirm which Places library version is available via `importLibrary('places')` and whether it supports Nearby Search with the same parameters.
- **API key availability:** The project may or may not have a Google API key available. Mock data fallback is critical path -- build it first, treat real API as enhancement.

## Sources

### Primary (HIGH confidence)
- npm registry (direct version queries, 2026-04-08)
- Vite, React, TypeScript, Tailwind CSS official documentation

### Secondary (MEDIUM confidence)
- Google Places API (New) documentation (training data, not live-verified)
- HTML5 Canvas API / MDN Web Docs
- Competitor analysis: Yelp Surprise Me, Food Roulette apps, WTF Should I Eat, EatRandom

### Tertiary (LOW confidence)
- CORS behavior of Places API (New) REST endpoint -- needs live validation

---
*Research completed: 2026-04-08*
*Ready for roadmap: yes*
