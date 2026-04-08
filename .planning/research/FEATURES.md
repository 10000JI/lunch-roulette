# Feature Research

**Domain:** Location-based restaurant roulette / random food picker web app
**Researched:** 2026-04-08
**Confidence:** MEDIUM (based on training data analysis of existing products like Yelp's "Surprise Me", Food Roulette, WTF Should I Eat, EatRandom, and similar apps; no live web verification available)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Location detection | Core premise is "nearby" restaurants; manual address entry is friction | LOW | Browser Geolocation API; must handle denial gracefully with fallback |
| Category/cuisine filter | Users always have at least a broad preference (Korean, Japanese, etc.) | LOW | Predefined list; Google Places API supports `type` filtering |
| Spinning wheel animation | The "roulette" metaphor demands a visual wheel -- a plain random pick feels broken | MEDIUM | Canvas-based wheel with easing deceleration; CSS-only approaches look cheap |
| Result display with key info | After pick, users need: name, rating, distance, price range to decide if they accept | LOW | Card component pulling from Places API response fields |
| Randomness that feels fair | Users distrust rigged-feeling randomness; wheel must land on visibly different segments | LOW | Weighted random with visual correspondence to wheel segments |
| Mobile-responsive layout | Majority use case is "standing in office deciding on phone" | LOW | Tailwind responsive utilities handle this naturally |
| Loading/empty states | No restaurants found, API loading, location denied -- all need clear UI feedback | LOW | Skeleton loaders, error messages, empty state illustrations |
| Re-spin / try again | Users reject ~40% of random picks; re-spin must be one tap away | LOW | Button to re-trigger animation with same restaurant set |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Smooth, satisfying wheel physics | Most competitors have janky CSS spinners; a polished Canvas wheel with realistic deceleration feels premium | MEDIUM | Easing curve with gradual slowdown + tick sound effect sells the experience |
| Category visual design on wheel | Color-coded segments with cuisine icons make the wheel scannable and fun | MEDIUM | Each segment gets a color + optional emoji/icon for cuisine type |
| Distance radius control | Slider to set "how far am I willing to walk" (100m-2km) personalizes results | LOW | Feeds into Places API `radius` parameter |
| "Exclude" list (session-only) | "We went there yesterday" -- remove a restaurant from the wheel without page reload | LOW | Filter state in React; no persistence needed |
| Winner reveal animation | Confetti, highlight pulse, or card flip on result adds delight | LOW | Lightweight CSS animation or canvas particle effect |
| Direct navigation link | One-tap "Navigate here" opens Google Maps / Naver Map with directions | LOW | Simple URL scheme: `https://maps.google.com/?q=...` or `nmap://...` |
| Share result | "Hey team, we're going to X" -- copy link or share via KakaoTalk/messaging | LOW | Web Share API (native) with clipboard fallback |
| Multiple cuisine selection | Pick 2-3 categories at once ("Korean OR Japanese") for broader wheel | LOW | Multi-select UI; merge results into single wheel |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User accounts / login | "Save my favorites" | Massive scope increase for a lunch picker; auth, database, session management -- kills the 30-40 min budget entirely | Session-only state; localStorage for minimal persistence if needed later |
| Full restaurant reviews/details | "Show me the menu and photos" | Duplicates Naver Map / Google Maps functionality; expensive API calls for photos; cluttered UI | Link out to Google Maps / Naver Map for details |
| History / past picks | "What did we eat last week?" | Requires persistent storage (DB or localStorage); creates data management burden | Out of scope for demo; could add localStorage-based "recent 5" in v1.x |
| Group voting / multiplayer | "Let the whole team vote" | Real-time sync, WebSocket infrastructure, room management -- entirely different product | Single device, pass-the-phone, or just use the roulette as the tiebreaker |
| AI-powered recommendations | "Suggest based on my preferences" | Requires user history, preference modeling, ML pipeline -- massive overengineering for a random picker | The whole point is random; preferences are handled by category filter |
| Map view with pins | "Show all restaurants on a map" | Google Maps JS SDK integration is heavy; adds significant bundle size and complexity | Result card with "Open in Maps" link serves the navigation need |
| Dark mode | Nice polish feature | Not worth prioritizing in 30-40 min scope; can always add later | Ship light theme; add dark mode as bonus if time permits |
| Price range filter | "Only show cheap places" | Google Places API price_level data is inconsistent/missing for many restaurants, especially in Korea | Display price level when available but don't filter on it |

## Feature Dependencies

```
[Location Detection]
    +--requires--> [Geolocation API / Fallback]
    +--feeds-----> [Restaurant Search via Places API]
                       +--feeds-----> [Wheel Population]
                                          +--feeds-----> [Spin Animation]
                                                             +--feeds-----> [Result Display]

[Category Filter]
    +--feeds-----> [Restaurant Search via Places API]

[Mock Data Fallback]
    +--replaces--> [Restaurant Search via Places API] (when no API key)

[Re-spin]
    +--reuses----> [Wheel Population] (same dataset, new random)

[Distance Radius Control] --enhances--> [Restaurant Search via Places API]
[Exclude List] --modifies--> [Wheel Population]
[Navigation Link] --enhances--> [Result Display]
[Share Result] --enhances--> [Result Display]
```

### Dependency Notes

- **Wheel Population requires Restaurant Search:** Cannot build the wheel until restaurants are fetched; mock data fallback ensures wheel works without API key
- **Spin Animation requires Wheel Population:** Wheel segments must be defined before animation can run
- **Result Display requires Spin Animation:** The "winner" is determined by where the wheel stops
- **Category Filter feeds Restaurant Search:** Filter selection triggers a new API query or filters cached results
- **Mock Data replaces API Search:** Same data shape, different source -- enables development and demo without API key

## MVP Definition

### Launch With (v1)

Minimum viable product -- what's needed for the live demo to feel complete.

- [x] Location detection via Geolocation API -- core premise of "nearby"
- [x] Category filter (Korean, Chinese, Japanese, Western, etc.) -- narrows the wheel
- [x] Restaurant fetch from Google Places API (New) -- real data
- [x] Mock data fallback (10 restaurants) -- demo safety net
- [x] Canvas spinning wheel with smooth deceleration -- the hero interaction
- [x] Result card (name, rating, distance, price level) -- actionable output
- [x] Re-spin button -- essential for "nah, try again"
- [x] Mobile responsive layout -- primary use context
- [x] Loading and error states -- polish that prevents confusion

### Add After Validation (v1.x)

Features to add once core is working and demo time permits.

- [ ] Winner reveal animation (confetti/highlight) -- adds delight, low effort
- [ ] Distance radius slider -- personalizes results, feeds API parameter
- [ ] Navigation link (open in Google Maps / Naver Map) -- practical utility
- [ ] Session-only exclude list -- "not that one again"
- [ ] Multiple cuisine selection -- broader wheel options

### Future Consideration (v2+)

Features to defer until the product moves beyond demo status.

- [ ] Web Share API integration -- sharing picks with team
- [ ] localStorage recent picks (last 5) -- lightweight history
- [ ] Sound effects on wheel spin/stop -- sensory polish
- [ ] Custom restaurant additions -- "add our hidden gem"
- [ ] Dark mode -- visual preference

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Location detection | HIGH | LOW | P1 |
| Category filter | HIGH | LOW | P1 |
| Places API integration | HIGH | MEDIUM | P1 |
| Mock data fallback | MEDIUM | LOW | P1 |
| Spinning wheel animation | HIGH | MEDIUM | P1 |
| Result card display | HIGH | LOW | P1 |
| Re-spin button | HIGH | LOW | P1 |
| Mobile responsive | HIGH | LOW | P1 |
| Loading/error states | MEDIUM | LOW | P1 |
| Winner reveal animation | MEDIUM | LOW | P2 |
| Distance radius slider | MEDIUM | LOW | P2 |
| Navigation link | MEDIUM | LOW | P2 |
| Exclude list (session) | LOW | LOW | P2 |
| Multiple cuisine select | LOW | LOW | P2 |
| Share result | LOW | LOW | P3 |
| Recent picks (localStorage) | LOW | MEDIUM | P3 |
| Sound effects | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for launch (the live demo)
- P2: Should have, add if time permits in demo session
- P3: Nice to have, future consideration beyond demo

## Competitor Feature Analysis

| Feature | Yelp "Surprise Me" | Food Roulette apps | WTF Should I Eat | Our Approach |
|---------|--------------------|--------------------|-------------------|--------------|
| Location-based | Yes (uses Yelp data) | Often manual input | No (generic suggestions) | Yes, auto-detect via Geolocation |
| Visual wheel | No (just random pick) | Yes (most have one) | No (text-based) | Yes, Canvas-based smooth wheel |
| Cuisine filter | Limited | Usually yes | Yes (food type) | Yes, predefined Korean cuisine categories |
| Real restaurant data | Yes (Yelp) | Rarely (often generic food items) | No | Yes (Google Places API) |
| Rating display | Yes | Rarely | No | Yes (from Places API) |
| Distance info | Yes | Rarely | No | Yes (calculated from user location) |
| Re-spin | Yes | Usually | Yes | Yes |
| Mobile optimized | Yes (native app) | Varies | Yes (web) | Yes (responsive web) |
| No login required | No (needs Yelp) | Usually yes | Yes | Yes -- zero friction |

**Key insight:** Most "food roulette" apps either (a) use real location data but lack the fun wheel interaction, or (b) have a fun wheel but with generic food items instead of real nearby restaurants. Our approach combines both: real Places API data presented through an engaging wheel UI. This is the core differentiator.

## Sources

- Training data analysis of: Yelp Surprise Me feature, various Food Roulette mobile apps (App Store/Play Store), WTF Should I Eat (wtfshouldIeat.com), EatRandom, Random Restaurant Picker apps
- Google Places API (New) documentation (training data, not live-verified)
- General UX patterns for randomizer/picker applications

**Confidence note:** All findings are based on training data (cutoff ~early 2025). No live web verification was possible during this research session. Feature landscape for this domain is relatively stable -- restaurant picker apps haven't changed dramatically -- so MEDIUM confidence is appropriate.

---
*Feature research for: Location-based restaurant roulette web app*
*Researched: 2026-04-08*
