# Pitfalls Research

**Domain:** Location-based restaurant roulette web app (React + Vite + TypeScript)
**Researched:** 2026-04-08
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Geolocation API Requires HTTPS and User Permission -- Fails Silently in Dev

`navigator.geolocation.getCurrentPosition()` silently fails without error callback. On mobile testing via LAN IP, it breaks immediately.

**How to avoid:**
1. Always provide error callback to `getCurrentPosition`
2. Handle all 3 error codes: PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT
3. Set explicit `timeout` option (10000ms) -- default is infinity
4. Build mock data fallback FIRST

**Phase:** Phase 1 (Foundation)

---

### Pitfall 2: Google Places API Key Exposed in Frontend

`VITE_` prefixed vars are bundled into client-side code. Places API costs $32/1000 requests.

**How to avoid:**
1. Restrict API key in Google Cloud Console (HTTP referrer + API scope)
2. Set daily quota limit (100 requests/day)
3. Never commit `.env` to git

**Phase:** Phase 1 (Foundation)

---

### Pitfall 3: Field Mask Omission -- Empty Responses or Excessive Billing

Places API (New) `fieldMask` is REQUIRED. Requesting `*` multiplies cost across all field categories.

**How to avoid:**
1. Request ONLY displayed fields: displayName, rating, priceLevel, location, types
2. Create a constant `FIELD_MASK` string
3. Document field-to-pricing-tier mapping

**Phase:** Phase 2 (API Integration)

---

### Pitfall 4: Canvas Blurry on High-DPI / Retina Displays

Canvas renders at 1x resolution by default. Looks blurry on modern phones and MacBooks.

**How to avoid:**
```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = displayWidth * dpr;
canvas.height = displayHeight * dpr;
canvas.style.width = `${displayWidth}px`;
canvas.style.height = `${displayHeight}px`;
ctx.scale(dpr, dpr);
```

**Phase:** Phase 2 (Roulette UI)

---

### Pitfall 5: Spin Animation Without Proper Easing = Unnatural Feel

Linear deceleration feels mechanical. Physical wheels decelerate exponentially.

**How to avoid:**
```typescript
velocity *= 0.985; // exponential friction each frame
```
Do NOT use CSS transitions for Canvas content.

**Phase:** Phase 2 (Roulette UI)

---

### Pitfall 6: Mobile Viewport and Touch Issues

Missing `touch-action: none`, `100vh` includes URL bar area, no `preventDefault()` on touch events.

**How to avoid:**
1. `touch-action: none` on canvas container
2. Use `dvh` instead of `100vh`
3. Size wheel relative to viewport: `Math.min(window.innerWidth * 0.85, 400)`

**Phase:** Phase 1 (Foundation) + Phase 2 (Roulette UI)

---

### Pitfall 7: Nearby Search Returns Zero Results

Wrong `includedTypes`, radius too small, no `languageCode` set.

**How to avoid:**
1. Use `includedTypes: ['restaurant']` as base, filter subcategories from response `types`
2. Start with radius 1000m, fallback to 2000m if < 3 results
3. Set `languageCode: 'ko'` explicitly

**Phase:** Phase 2 (API Integration)

---

### Pitfall 8: CORS Error When Calling Places API Directly from Browser

Google REST APIs don't include CORS headers for browser origins.

**How to avoid:**
Use Google Maps JavaScript API with `importLibrary('places')`, NOT direct REST calls.

```typescript
// WRONG: Direct REST call (CORS blocked)
fetch('https://places.googleapis.com/v1/places:searchNearby', { ... })

// RIGHT: Use Maps JS API Places library
const { Place } = await google.maps.importLibrary('places');
```

**Phase:** Phase 1 (Foundation) -- decide approach before writing API code

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Geolocation silent failure | Phase 1 | Error callback fires with mock data on permission deny |
| API key exposure | Phase 1 | `.env` in `.gitignore`, key restrictions in Cloud Console |
| CORS on Places API | Phase 1 | Decide JS API vs. proxy approach upfront |
| Canvas HiDPI blurriness | Phase 2 | Screenshot comparison on Retina vs 1x display |
| Poor spin animation feel | Phase 2 | Verify exponential deceleration curve |
| Wrong Places API field mask | Phase 2 | Field mask constant matches displayed fields only |
| Empty API results | Phase 2 | Test with 3+ locations and all categories |
| Mobile viewport issues | Phase 1 + Phase 3 | Test on real device |

---
*Pitfalls research for: Lunch Roulette*
*Researched: 2026-04-08*
