# Roadmap: Lunch Roulette

**Created:** 2026-04-08
**Phases:** 3
**Granularity:** Standard
**Coverage:** 15/15 v1 requirements mapped ✓

## Progress

| # | Phase | Goal | Requirements | Plans | Status |
|---|-------|------|--------------|-------|--------|
| 1 | Foundation and Data Layer | App detects location and fetches restaurant data (real or mock) | LOC-01, LOC-02, LOC-03, API-01, API-02 | 2 | ◐ Planning complete |
| 2 | Core Interaction | Users select category, spin wheel, see winning restaurant | CAT-01, CAT-02, RLT-01, RLT-02, RLT-03, RES-01, RES-02 | 0 | ○ Pending |
| 3 | Polish and Integration | Complete flow works on mobile/desktop with loading feedback and clean design | UI-01, UI-02, UI-03 | 0 | ○ Pending |

## Phase Details

### Phase 1: Foundation and Data Layer

**Goal:** App detects location and fetches restaurant data (real or mock)
**Requirements:** LOC-01, LOC-02, LOC-03, API-01, API-02
**UI hint:** no
**Plans:** 2 plans

Plans:
- [ ] 01-01-PLAN.md — Scaffold project, define types, create mock data provider
- [ ] 01-02-PLAN.md — Location hook, Places API service, and App integration

**Success Criteria:**
1. The app detects the user's current location via browser Geolocation API on page load
2. When location permission is denied or detection fails, a clear error message is shown to the user
3. When no API key is configured or location fails, the app seamlessly falls back to mock restaurant data (approximately 10 entries)
4. The Places API service fetches real nearby restaurant data with proper field masks when an API key is available
5. The Vite + React + TypeScript + Tailwind project builds and runs without errors

---

### Phase 2: Core Interaction

**Goal:** Users select category, spin wheel, see winning restaurant
**Requirements:** CAT-01, CAT-02, RLT-01, RLT-02, RLT-03, RES-01, RES-02
**UI hint:** yes

**Success Criteria:**
1. User can select a food category (Korean, Chinese, Japanese, Western, etc.) from a visible list
2. After selecting a category, nearby restaurants of that category populate the spinning wheel segments
3. The Canvas-based wheel spins with smooth exponential deceleration and stops on a winner
4. The wheel renders crisply on HiDPI/Retina displays without blurriness
5. The winning restaurant's detail card shows name, rating, distance, and price level with a Google Maps link

---

### Phase 3: Polish and Integration

**Goal:** Complete flow works on mobile/desktop with loading feedback and clean design
**Requirements:** UI-01, UI-02, UI-03
**UI hint:** yes

**Success Criteria:**
1. The entire select-category → spin-wheel → view-result flow works end-to-end without manual refresh
2. The layout adapts properly to mobile screen sizes (primary use case is phone)
3. Loading spinners or skeleton states appear during geolocation detection and API calls
4. The overall visual design is clean and minimal with consistent spacing and typography

---

## Requirement Coverage

| Requirement | Phase | Status |
|-------------|-------|--------|
| LOC-01 | Phase 1 | Pending |
| LOC-02 | Phase 1 | Pending |
| LOC-03 | Phase 1 | Pending |
| API-01 | Phase 1 | Pending |
| API-02 | Phase 1 | Pending |
| CAT-01 | Phase 2 | Pending |
| CAT-02 | Phase 2 | Pending |
| RLT-01 | Phase 2 | Pending |
| RLT-02 | Phase 2 | Pending |
| RLT-03 | Phase 2 | Pending |
| RES-01 | Phase 2 | Pending |
| RES-02 | Phase 2 | Pending |
| UI-01 | Phase 3 | Pending |
| UI-02 | Phase 3 | Pending |
| UI-03 | Phase 3 | Pending |

**Coverage:** 15/15 mapped ✓ | 0 unmapped

---
*Roadmap created: 2026-04-08*
*Last updated: 2026-04-08 after Phase 1 planning*
