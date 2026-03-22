# Implementation Plan: Bản đồ số Lễ hội Quán Thế Âm 2026

## Context
Project is 100% documented (CLAUDE.md) but 0% coded. Today is 2026-03-22, festival starts 2026-04-04 (13 days). Build a mobile-first React web app from scratch. Each phase has a test checkpoint — fix all issues before moving on.

**Key decision:** Include a time simulation input (Phases 3-11) since we're building before the festival and can't test time-dependent features with real time.

---

## PHASE 1: Project Scaffolding (Vite + React + Tailwind)
**Goal:** Empty React app with warm color palette visible in browser.

**Create:**
- `package.json` — via `npm create vite@latest . -- --template react`
- `vite.config.js` — base path for GitHub Pages
- `tailwind.config.js` — full theme from CLAUDE.md §7.3 (warm colors, Be Vietnam Pro, loc/cat tokens, screens)
- `postcss.config.js` — Tailwind + autoprefixer
- `index.html` — Be Vietnam Pro Google Font link
- `src/index.css` — Tailwind directives + `bg-warm-bg text-warm-text`
- `src/main.jsx` — React entry
- `src/App.jsx` — placeholder heading + 6 colored boxes to verify palette

---

## PHASE 2: Data Layer
**Goal:** All 41 events + 6 locations importable and verified.

**Create:**
- `src/data/locations.json` — 6 locations (id, name, shortName, lat, lng, color, etc.)
- `src/data/schedule.json` — ~41 events from CLAUDE.md §4 (Day1 ~18, Day2 ~11, Day3 ~10, Day4 ~2)
- `src/data/colorMap.js` — exports `locationColors` + `categoryColors`
- `src/data/festivalConfig.js` — festival metadata from §7.5

**Update:** `src/App.jsx` — render event counts, location names + colors for visual verification

---

## PHASE 3: Utility Hooks + Utils
**Goal:** Core logic (filters, time grouping, breakpoint) working with debug UI.

**Create:**
- `src/utils/timeUtils.js` — `isFestivalDay`, `getCurrentDayIndex`, `isBeforeFestival`, `isAfterFestival`, `estimateEndTime`
- `src/utils/deepLink.js` — `getDirectionsUrl(lat, lng, label)`
- `src/hooks/useBreakpoint.js` — `{ isMobile }` at 768px threshold
- `src/hooks/useFilters.js` — `{ selectedDay, selectedLocationId, setDay, setLocation, filteredEvents }`
- `src/hooks/useTimeGroup.js` — `{ ongoing, upcoming, ended }` with 60s refresh

**Update:** `src/App.jsx` — debug UI: breakpoint display, 4 day buttons, group counts, time simulator input

---

## PHASE 4: Header + EmptyState
**Goal:** Visual header and pre/post-festival state handling.

**Create:**
- `src/components/layout/Header.jsx` — banner with festival name, tagline, dates (gradient bg placeholder)
- `src/components/layout/EmptyState.jsx` — countdown (before) / ended message (after) + Add to Calendar

**Update:** `src/App.jsx` — Header at top, EmptyState when outside festival dates

---

## PHASE 5: DayFilter + LocationFilter
**Goal:** Styled filter bar, functional with warm theme.

**Create:**
- `src/components/timeline/DayFilter.jsx` — 4 buttons with day labels, gold accent on selected
- `src/components/timeline/LocationFilter.jsx` — horizontal scrolling chips, color-coded, "Tất cả" default

**Update:** `src/App.jsx` — wire filters to useFilters hook

---

## PHASE 6: EventCard + EventList
**Goal:** Main timeline view with 3 auto-grouped sections.

**Create:**
- `src/components/timeline/EventCard.jsx` — text-only: time, title, location tag with color
- `src/components/timeline/EventList.jsx` — 3 sections: Đang diễn ra / Sắp tới / Đã kết thúc

**Update:** `src/App.jsx` — replace debug list with EventList

---

## PHASE 7: EventDetail Modal
**Goal:** Tap card → full detail modal with directions button.

**Create:**
- `src/components/timeline/EventDetail.jsx` — modal: title, time, location, category, description, "Chỉ đường" button, close X + backdrop

**Update:** `src/App.jsx` — selected event state; `EventCard.jsx` — onClick prop

---

## PHASE 8: FestivalMap + LocationPopup
**Goal:** Map with 6 colored pins and popups.

**Install:** `react-leaflet leaflet`

**Create:**
- `src/components/map/FestivalMap.jsx` — MapContainer + 6 colored circle markers (DivIcon)
- `src/components/map/LocationPopup.jsx` — name + description + "Chỉ đường" button

**Update:** `src/index.css` — import Leaflet CSS; `src/App.jsx` — render map below timeline

---

## PHASE 9: TabNav + Mobile Tab Switching
**Goal:** Mobile bottom tab bar switches between Schedule and Map.

**Create:**
- `src/components/layout/TabNav.jsx` — fixed bottom bar: "Chương trình" + "Bản đồ"

**Update:** `src/App.jsx` — activeTab state, conditional render, TabNav hidden on desktop

---

## PHASE 10: ResponsiveLayout (2-Column Desktop)
**Goal:** Tablet/desktop: timeline left + sticky map right.

**Create:**
- `src/components/layout/ResponsiveLayout.jsx` — mobile: 1 col; tablet: 55/45 split; desktop: 60/40 split

**Update:** `src/App.jsx` — wrap in ResponsiveLayout; `FestivalMap.jsx` — `invalidateSize()` on resize

---

## PHASE 11: i18n (Vietnamese + English)
**Goal:** Full bilingual UI with language toggle.

**Install:** `react-i18next i18next i18next-browser-languagedetector`

**Create:**
- `src/i18n/vi.json` — all UI strings in Vietnamese
- `src/i18n/en.json` — English translations
- `src/i18n/i18n.js` — i18next config with browser detection, fallback 'vi'

**Update:** `src/main.jsx` — import i18n; `src/App.jsx` — language toggle (VI/EN); all components — wrap strings with `t()`

---

## PHASE 12: Polish + QR + Weather + Deploy
**Goal:** Production-ready, deployed to GitHub Pages.

**Create:**
- `src/components/layout/WeatherWidget.jsx` — Open-Meteo API, graceful fallback
- `src/components/layout/QRCode.jsx` — api.qrserver.com, hidden on error
- `.github/workflows/deploy.yml` — build + deploy to gh-pages
- `public/icons/` — favicon

**Update:** `vite.config.js` — base path; `index.html` — meta tags; `App.jsx` — add widgets, remove time simulator

---

## Notes
- **No React Router** — tab switching via state, avoids GitHub Pages SPA issues
- **Custom DivIcon markers** — avoids Leaflet broken-icon bundler issue
- **`100dvh`** for map sticky height — handles mobile browser chrome
- **schedule.json is single source of truth** — update JSON to reuse next year
