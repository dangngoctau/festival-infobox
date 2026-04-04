# QUAN THE AM FESTIVAL 2026 — DIGITAL MAP
# Ngu Hanh Son, Da Nang

---

## 1. PROJECT OVERVIEW

### Purpose

Mobile-first web app for the Quan The Am (Avalokiteshvara) Festival — a **National Intangible Cultural Heritage** (recognized 2021). Since 2023 the festival is organized at city level by the Da Nang People's Committee. In 2000 it was ranked among the 15 largest festivals in Vietnam.

### Tech Stack

- Frontend: **React** (Vite + static build)
- Styling: **Tailwind CSS v4** (`@tailwindcss/vite` plugin, `@theme` block in `index.css`)
- State: React useState / useCallback / useMemo + localStorage (favorites)
- Maps: React-Leaflet + OpenStreetMap (free, no API key)
- Directions: deep link to Google Maps app
- QR: api.qrserver.com (free)
- Weather: Open-Meteo API (free, no key)
- i18n: react-i18next (Vietnamese + English)
- Analytics: PostHog (product analytics) + Sentry (error tracking)
- Hosting: GitHub Pages (free, supports custom domain + HTTPS)
- Cost: domain only (~200–500k VND/year for .vn)

### Architecture

```
React (Vite) → Static Build → GitHub Pages
│
├── src/
│   ├── components/
│   │   ├── icons/                      ★ Reusable icon components
│   │   │   ├── AmenityIcon.jsx         (amenity type → Lucide icon)
│   │   │   ├── CategoryIcon.jsx        (event category → styled icon)
│   │   │   ├── PracticalIcon.jsx       (practical info section icons)
│   │   │   ├── LocationPin.jsx         (custom SVG map pin)
│   │   │   └── index.js               (barrel export)
│   │   │
│   │   ├── landing/                    ★ Landing page (shown before/after festival)
│   │   │   ├── LandingPage.jsx         (orchestrator — hero + featured + categories + info)
│   │   │   ├── HeroSection.jsx         (full-viewport hero + countdown/status + CTA)
│   │   │   ├── SplashImage.jsx         (wrapper for SVG/photo background)
│   │   │   ├── SplashSVG.jsx           (SVG illustration with star, lantern, water animations)
│   │   │   ├── TransitionZone.jsx      (gradient bridge hero → content)
│   │   │   ├── FeaturedEvents.jsx      (featured events — changes by festival phase)
│   │   │   ├── CategoryHighlights.jsx  (5 category cards — read-only category overview)
│   │   │   ├── CategoryCard.jsx        (single category card with icon + event count)
│   │   │   ├── PracticalInfo.jsx       (address, transport, practical tips)
│   │   │   ├── FooterCTA.jsx           (bottom CTA to enter schedule)
│   │   │   └── OptImage.jsx            (responsive image with WebP + JPEG fallback)
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.jsx              (festival banner + tagline + date + WeatherWidget + Back)
│   │   │   ├── TabNav.jsx              (Schedule ↔ Map toggle, hidden on ≥768px)
│   │   │   ├── EmptyState.jsx          (shown outside festival dates)
│   │   │   ├── ResponsiveLayout.jsx    (1-col mobile / 2-col tablet+)
│   │   │   ├── QRCode.jsx              (QR code via api.qrserver.com)
│   │   │   ├── WeatherWidget.jsx       (weather via Open-Meteo API)
│   │   │   ├── ShareButton.jsx         (native share / clipboard fallback)
│   │   │   └── AnalyticsNotice.jsx     (one-time analytics consent banner)
│   │   │
│   │   ├── timeline/
│   │   │   ├── DayFilter.jsx           (4 day buttons)
│   │   │   ├── FilterBar.jsx           (scrollable chips — toggle location/category + favorites)
│   │   │   ├── EventList.jsx           (3 groups: Ongoing/Upcoming/Ended + timeline rail)
│   │   │   ├── EventCard.jsx           (time, title, venue + color tag + favorite button)
│   │   │   ├── EventDetail.jsx         (modal with details + Directions button, optional image)
│   │   │   ├── EventDetailHeader.jsx   (detail modal header with status + favorite + close)
│   │   │   └── ShareEventButton.jsx    (share individual event)
│   │   │
│   │   ├── map/
│   │   │   ├── FlatMapView.jsx         (main map view — zones + utilities + GPS)
│   │   │   ├── PlacesTab.jsx           (places tab wrapper for mobile)
│   │   │   ├── ZoneMap.jsx             (Leaflet map with zone markers + fly-to)
│   │   │   ├── ZoneMarker.jsx          (pulsing zone marker on overview)
│   │   │   ├── ZoneDrillDown.jsx       (expanded zone with numbered pins)
│   │   │   ├── NumberedPin.jsx         (custom SVG pin with route number)
│   │   │   ├── PinCard.jsx             (venue info card in pin list)
│   │   │   ├── PinListPanel.jsx        (scrollable list of pins per zone)
│   │   │   ├── ControlBar.jsx          (map controls: WC, parking, reset toggles)
│   │   │   ├── MapControls.jsx         (ResizeHandler + ZoomWatcher utilities)
│   │   │   ├── VenueCard.jsx           (venue summary card)
│   │   │   ├── UtilityPin.jsx          (WC/parking pin marker)
│   │   │   ├── AmenityCard.jsx         (amenity info card)
│   │   │   ├── AmenityPopup.jsx        (amenity map popup)
│   │   │   ├── FestivalMap.jsx         (legacy map placeholder)
│   │   │   └── LocationPopup.jsx       (venue popup with Directions button)
│   │   │
│   ├── hooks/
│   │   ├── useTimeGroup.js             (group events: Ongoing/Upcoming/Ended, updates every 60s)
│   │   ├── useFilters.js               (day + location/category filter state + live counts)
│   │   ├── useBreakpoint.js            (isMobile <768px, isDesktop ≥1024px)
│   │   ├── useFavorites.js             (favorite events, persisted to localStorage)
│   │   ├── useGPS.js                   (geolocation API wrapper)
│   │   ├── useMapHighlight.js          (pin highlight state for map ↔ list sync)
│   │   ├── useScrollReveal.js          (IntersectionObserver fade-in on scroll)
│   │   ├── useUtilities.js             (WC/parking toggle state + filtered pins)
│   │   └── useZones.js                 (zone drill-down navigation state)
│   │
│   ├── data/
│   │   ├── locations.json              (20 locations: 13 venues + 1 gate + 3 parking + 3 restrooms)
│   │   ├── schedule.json               (41 bilingual events, 6 categories, 5 category groups)
│   │   ├── schedule.v1.json            (v1.0 backup)
│   │   ├── categories.json             (5 category groups for landing page highlights)
│   │   ├── amenities.json              (amenity points: medical, water, info, etc.)
│   │   ├── utilities.json              (WC + parking locations with coordinates)
│   │   ├── zones.json                  (5 map zones with nested pins)
│   │   ├── colorMap.js                 (color system: locations + categories + zones + labels)
│   │   ├── amenityMap.js               (amenity type → icon + bilingual labels)
│   │   ├── pinSymbols.js               (custom SVG pin symbols per venue + zone)
│   │   └── festivalConfig.js           (centralized config: name, dates, coordinates, splash mode)
│   │
│   ├── i18n/
│   │   ├── vi.json, en.json
│   │   └── i18n.js
│   │
│   ├── utils/
│   │   ├── deepLink.js                 (open Google Maps / Apple Maps)
│   │   ├── timeUtils.js                (phase detection, countdown, endTime estimation)
│   │   ├── analytics.js                (PostHog + Sentry event tracking)
│   │   ├── posthogInit.js              (PostHog lazy initialization)
│   │   ├── i18nEvent.js                (language change event helper)
│   │   └── geoUtils.js                 (distance calculations, bearing)
│   │
│   ├── App.jsx                         (routing landing↔schedule, time simulator, state orchestration)
│   ├── main.jsx
│   └── index.css                       (Tailwind @theme tokens + custom animations)
│
├── public/
│   └── icons/
│
├── index.html
├── vite.config.js                      (includes @tailwindcss/vite plugin)
└── package.json
```

---

## 2. FESTIVAL INFORMATION

- **Lunar date:** 19th day of the 2nd lunar month, annually
- **Location:** Chùa Quán Thế Âm (Avalokiteshvara Pagoda) and Sư Vạn Hạnh Street, Ngũ Hành Sơn District, Da Nang
- **Duration:** 4 days (April 4–7, 2026 = 17th–20th of 2nd lunar month, Year of Bính Ngọ)
- **Scale:** Tens of thousands of residents, Buddhist devotees, and tourists (domestic and international)

### Organizing Committee's "5 No's" Policy

1. No theft, robbery, or social evils
2. No begging or disguised begging
3. No littering, no food safety violations
4. No soliciting, price gouging, or coercing visitors
5. No animal release rituals or superstitious practices

---

## 3. UX DESIGN

### Core Question

> "What's happening now, and where?" — answer in under 3 seconds.

### Interface Architecture — 2 Views

The app has 2 main views, toggled via `currentView` state in App.jsx:

**1. Landing Page** (default on open)
- Full-viewport hero with SVG splash (stars, lanterns, water ripples) + countdown/status by phase
- Featured events — highlighted events, changes by phase (before/during/after festival)
- Category highlights — 5 cards (1 primary + 4 secondary), read-only category overview
- Practical info — address, transport, practical tips
- Language toggle (VI/EN) on hero
- During festival: if user has entered schedule before (sessionStorage), opens schedule directly

**2. Schedule View** (on CTA tap or during festival)

**Mobile (< 768px):** 1 column + 2 bottom tabs — "Schedule" (default) and "Map".

**Tablet & Desktop (≥ 768px):** No tabs. 2 columns — timeline left (50–55%), map sticky right (45–50%).

Rationale: The festival has only 5–6 main venue clusters in close proximity (pins overlap on mobile). The map is weak at showing the time dimension while the primary need is "what's happening now." The map serves as a **wayfinding aid**, not the primary browse interface.

### Schedule — Left Column (Timeline)

- **Day filter:** 4 buttons (Apr 4–7), defaults to today, outside festival defaults to first day
- **FilterBar:** horizontally scrollable chips with drag-to-scroll:
  - Toggle button: **Location** ↔ **Category** mode
  - "All" chip + chips by location or category (depending on mode), with live event counts
  - Favorites chip (❤️) — filter to favorited events only
  - Each chip has a synced color (chip → card tag → map pin)
- **Event list:** Auto-groups into 3 sections — Ongoing (highlighted) / Upcoming / Ended (faded/collapsed)
- **Timeline rail:** Vertical rail left of list — different node sizes by state (ongoing/upcoming/ended), connecting segments
- **Event card:** Text-only — time, title, venue + color tag + favorite button (♥). No thumbnail images
- **Tap card:** Detail modal — description, organizing body, optional illustration, "Directions" button (deep link to Google Maps)

### Schedule — Right Column (Map)

- Zone-based map with 5 zones, each containing numbered venue pins
- Custom SVG pins with venue-specific symbols
- Utility toggles: WC, parking markers
- GPS location support
- Tap pin → popup with name + "Directions" button
- On tablet/desktop: sticky, viewport height (`100dvh`), doesn't scroll with list

### Header

- **Header.jsx:** gradient background (brown→gold→brown) + name + tagline + date + WeatherWidget
- Back button → return to Landing page
- Debug toolbar (hidden, requires `?debug=1`): time simulator + analytics test + error test

### Images

- **Header + EmptyState:** Real photos from the Organizing Committee / Da Nang Dept. of Culture (Ngũ Hành Sơn, Pagoda, past festivals)
- **EventCard:** Text-only, no images
- **EventDetail:** Optional `image` field in schedule.json — show if present, modal is complete without it. Never show placeholder images

### Color Palette

**Background & text:** Warm, serene tones — light turmeric yellow (background), deep brown (primary text), ivory (card background). No pure black, no cool tones.

**Accents:** Warm gold `#C8A35A` (primary buttons, highlights), earth brown `#6B4226` (headings), moss green `#4A6741` ("Ongoing" status).

**Location colors (functional):** Muted warm tones, not bright — synced across filter chips → card tags → map pins.

| Venue | Color |
|---|---|
| Lễ đài (Ceremonial Platform) | Deep red `#8B2500` |
| Chùa QTA (Pagoda Main Stage) | Dark goldenrod `#B8860B` |
| SK Dân gian (Folk Games Stage) | Steel blue `#2E5A88` |
| CV Đầm Sen (Dam Sen Park) | Moss green `#4A6741` |
| Sông Cổ Cò (Co Co River) | Deep purple `#6A3D7D` |
| Diễu hành (Float Parade Route) | Earth orange `#B5651D` |
| + 8 more venue-specific colors | See colorMap.js |

### Event Categories

| Category | Vietnamese | English | Examples |
|---|---|---|---|
| `ceremony` | Lễ nghi | Ceremonies | Sutra opening, Commemoration, Abhisheka, Spring Prayer |
| `dharma` | Phật pháp | Dharma | Dharma talks, Great Compassion Assembly, Meditation |
| `folk` | Dân gian | Folk Culture | Bamboo dance, stilts, boat race, kites, Bài Chòi |
| `exhibition` | Triển lãm | Exhibitions | Photography, fine art, calligraphy, stone sculpture |
| `culinary` | Ẩm thực chay | Vegetarian Cuisine | Vegetarian food fair, OCOP products |
| `art` | Nghệ thuật | Performing Arts | Lion–Dragon dance, puppetry, lantern ceremony, shows |

### Category Groups (5 groups, used in FilterBar category mode + landing CategoryHighlights)

| Group ID | Maps from | Icon |
|---|---|---|
| `buddhist-ceremony` | ceremony + dharma | 🙏 |
| `performing-arts` | art | 🎭 |
| `exhibition` | exhibition | 🖼️ |
| `folk-culture` | folk | 🎪 |
| `cuisine` | culinary | 🍜 |

### Design Principles

- Entire primary flow: no more than 2–3 taps
- Large fonts, high contrast, no complex gestures — friendly to older users
- 2 filter layers: day + (location OR category), toggle to switch mode
- Color system synced throughout: chip → tag → pin
- Responsive layout, not responsive features — same feature set at all sizes
- Never display placeholder images — show if available, hide if not

### User Flows

> **Before festival:** Open app → Landing (countdown + overview) → tap CTA → Schedule view.

> **During festival (first visit):** Open app → Landing → tap CTA → Schedule (sessionStorage remembers).

> **During festival (return visit):** Open app → straight to Schedule → today's "Ongoing" events.

> **Mobile schedule:** Scroll "Ongoing" → "Upcoming" → tap card → detail + Directions → switch to Map tab if needed.

> **Tablet/Desktop schedule:** Timeline left + map right → scroll list → tap card → detail + Directions → glance at map for orientation.

> **From Landing:** Tap CTA "Xem chương trình" or "View full schedule" → enter Schedule view.

---

## 4. DETAILED 4-DAY SCHEDULE

*(Source: Official program from the 2026 Organizing Committee, Document #57/CTr-BTC)*

### DAY 1 — Apr 4, 2026 (17/02 Lunar) — OPENING

| Time | Event (VN) | Event (EN) | Venue |
|---|---|---|---|
| 07:00 | Lễ khai kinh · Thượng phan | Sutra Opening · Banner Raising | Chùa QTA |
| 08:00 | Lân Sư Rồng & Hội thao dân gian | Lion–Dragon Dance & Folk Sports | SK Dân gian |
| 09:00 | Điêu khắc đá & Đá mỹ nghệ | Stone Sculpture & Stonecraft | Đá mỹ nghệ |
| 09:30 | Triển lãm nhiếp ảnh nghệ thuật | Art Photography Exhibition | TL Nhiếp ảnh |
| 09:30 | Ký họa màu nước & Thư pháp | Watercolor Sketching & Calligraphy | Đá mỹ nghệ |
| 10:00 | Gian hàng OCOP | OCOP Product Fair | Gian hàng OCOP |
| 10:00–17:30 | Trình diễn diều nghệ thuật | Artistic Kite Flying | CV Đầm Sen |
| 14:30 | Triển lãm "Quan Âm mùa lễ hội" | "Quan Am in Festival Season" | Chùa QTA |
| 15:00–21:00 | Nhảy sạp & Trò chơi dân gian | Bamboo Dance & Folk Games | SK Dân gian |
| 15:00 | Trưng bày sách & Thi Review sách | Book Display & Review Contest | Chùa QTA |
| 15:30 | Ẩm thực chay Đà Nẵng | Da Nang Vegetarian Cuisine | Chùa QTA |
| 16:00–17:00 | Lễ tưởng niệm Huyền Trân Công Chúa | Princess Huyền Trân Memorial | Miếu Huyền Trân |
| 16:00–17:00 | Lễ tế Xuân cầu Quốc thái Dân an | Spring Prayer for National Peace | Chùa QTA |
| 17:30 | **Khai mạc Lễ hội** | **Festival Opening Ceremony** | Chùa QTA |
| 18:00–20:00 | Diễu hành xe hoa | Floral Float Parade | City routes |
| 18:30 | Múa rối cạn & Múa rối nước | Rod & Water Puppet Show | SK Dân gian |
| 19:30 | Văn nghệ chào mừng Lễ hội | Festival Welcome Show | Chùa QTA |
| 20:00 | Hoa đăng Thiền hành | Lantern Ceremony & Walking Meditation | Chùa QTA |

### DAY 2 — Apr 5, 2026 (18/02 Lunar)

| Time | Event (VN) | Event (EN) | Venue |
|---|---|---|---|
| 07:30 | Hội Cờ làng & Thi đi cà kheo | Village Chess & Stilt Walking | SK Dân gian |
| 08:30 | Tranh thiếu nhi "Nét đẹp NHS" | Children's Art "Beauty of NHS" | TL Thiếu nhi |
| 10:00–17:30 | Trình diễn diều nghệ thuật | Artistic Kite Flying | CV Đầm Sen |
| 14:00 | Pháp đàn Đại bi · Thuyết pháp | Great Compassion Assembly · Dharma Talk | Chùa QTA |
| 16:00–21:00 | Bài chòi & Dân ca miền Trung | Bài Chòi & Central Folk Songs | SK Dân gian |
| 18:00–20:00 | Diễu hành xe hoa | Floral Float Parade | City routes |
| 18:30 | Thuyết giảng Phật pháp | Dharma Lecture | Chùa QTA |
| 19:00 | Lễ Quán đảnh Quán Âm | Abhisheka Ceremony | Chùa QTA |
| 19:30 | Khánh thành Trụ Kinh Pháp Luân | Dharma Wheel Sutra Pillar | Chùa QTA |
| 20:00 | Văn nghệ chào mừng Lễ hội | Festival Celebration Show | Chùa QTA |
| 20:30 | Hoa đăng & Lửa trại | Floating Lanterns & Bonfire | Chùa QTA |

### DAY 3 — Apr 6, 2026 (19/02 Lunar) — MAIN CEREMONY

| Time | Event (VN) | Event (EN) | Venue |
|---|---|---|---|
| 07:00–09:00 | **Lễ vía Đức Bồ tát Quán Thế Âm** (live on DanangTV) | **Avalokiteshvara Commemoration** | Lễ đài |
| 09:00 | Lễ Quán đảnh Quán Âm (with delegations from India, Japan, Thailand) | Abhisheka Ceremony | Chùa QTA |
| 09:30 | Đua thuyền truyền thống | Traditional Boat Race | Sông Cổ Cò |
| 10:00–17:30 | Trình diễn diều nghệ thuật | Artistic Kite Flying | CV Đầm Sen |
| 14:00–15:00 | Pháp đàn · Thiền tọa · Thuyết pháp | Dharma Assembly · Meditation · Talk | Chùa QTA |
| 16:00–21:00 | Bài chòi & Dân ca miền Trung | Bài Chòi & Central Folk Songs | SK Dân gian |
| 18:00–20:00 | Diễu hành xe hoa | Floral Float Parade | City routes |
| 19:00 | Chương trình nghệ thuật | Arts Performance | Chùa QTA |
| 20:00 | Hoa đăng Thiền hành | Lantern Ceremony & Walking Meditation | Chùa QTA |
| 21:00 | Lửa trại truyền thống | Traditional Bonfire | Chùa QTA |

### DAY 4 — Apr 7, 2026 (20/02 Lunar) — CLOSING

| Time | Event (VN) | Event (EN) | Venue |
|---|---|---|---|
| 07:00–08:30 | Đi bộ vì Hòa bình 2026 | Walk for Peace 2026 | SK Dân gian |
| 09:30 | **Lễ Bế mạc** | **Closing Ceremony** | SK Dân gian |

---

## 5. VENUES

### Primary Venues (13 event venues + 1 gate)

| # | ID | Name (VN) | Name (EN) | Type | Color |
|---|---|---|---|---|---|
| 1 | `le-dai` | Lễ đài Chùa QTA | Ceremonial Platform | venue | `#8B2500` |
| 2 | `chua` | Chùa QTA — Sân khấu chính | Pagoda — Main Stage | venue | `#B8860B` |
| 3 | `trienlam-thieunhi` | Triển lãm tranh thiếu nhi | Children's Art Exhibition | venue | `#C06080` |
| 4 | `dao-trang` | Trại Đạo Tràng — Thuyền Trà | Dharma Camp — Tea Boat | landmark | `#8B6914` |
| 5 | `mieu-huyen-tran` | Miếu thờ Huyền Trân Công Chúa | Princess Huyen Tran Shrine | venue | `#9B5E6E` |
| 6 | `chua-thai-son` | Chùa Thái Sơn | Thai Son Pagoda | landmark | `#7B6B5A` |
| 7 | `sk-dan-gian` | Sân khấu trò chơi dân gian | Folk Games Stage | venue | `#2E5A88` |
| 8 | `ocop` | Gian hàng OCOP | OCOP Trade Pavilion | venue | `#D4760A` |
| 9 | `trienlam-anh` | Triển lãm nhiếp ảnh | Photography Exhibition | venue | `#5A8F7B` |
| 10 | `da-my-nghe` | Đá mỹ nghệ & Thư pháp | Stone Craft & Calligraphy | venue | `#7B8B6F` |
| 11 | `dam-sen` | CV Bến Du Thuyền Đầm Sen | Dam Sen Marina Park | venue | `#4A6741` |
| 12 | `song-co-co` | Sông Cổ Cò | Co Co River | venue | `#6A3D7D` |
| 13 | `dieu-hanh` | Các tuyến đường chính TP | City Main Routes | venue | `#B5651D` |
| 14 | `cong-chao` | Cổng chào SVH | Su Van Hanh Gate | gate | `#A08060` |

### Utility Locations (3 restrooms + 3 parking)

| ID | Type | Name (EN) |
|---|---|---|
| `wc-1` | restroom | Restroom 1 (near Pagoda) |
| `wc-2` | restroom | Restroom 2 (mid SVH St.) |
| `wc-3` | restroom | Restroom 3 (SVH entrance) |
| `bai-xe-btc` | parking | Organizer Parking |
| `bai-xe-1` | parking | Visitor Parking 1 |
| `bai-xe-2` | parking | Visitor Parking 2 |

### Zone System (5 map zones)

| Zone ID | Name (EN) | Primary Venue | Key Pins |
|---|---|---|---|
| `chua` | Pagoda Grounds | chua | le-dai, chua, trienlam-thieunhi, dao-trang, bai-xe-btc |
| `svh` | Su Van Hanh Street | sk-dan-gian | mieu-huyen-tran, ocop, trienlam-anh, da-my-nghe, cong-chao |
| `song` | Co Co River | song-co-co | song-co-co |
| `cv` | Dam Sen Park | dam-sen | dam-sen |
| `cong` | City Routes | dieu-hanh | dieu-hanh |

Venues 1–7 are clustered very close together — pins overlap on mobile. The zone system groups them for easier navigation.

---

## 6. FEATURE LIST & ROADMAP

### Completed ✅

| ID | Feature |
|---|---|
| 0.0–0.7 | Project init, data files, hooks, colorMap, Tailwind config, i18n |
| H1–H2 | Header, EmptyState |
| T1–T5 | DayFilter, FilterBar, EventList, EventCard, EventDetail |
| M1–M5 | FestivalMap, LocationPopup, TabNav, QRCode, WeatherWidget |
| R1–R4 | Responsive: useBreakpoint, 2-column layout, sticky map |
| L1–L3 | Landing: hero + featured + categories + practical info, SplashSVG, CategoryHighlights |
| F1–F2 | Favorites (localStorage), FilterBar category mode |
| A9 | react-i18next integration (vi/en) |
| — | Time simulator (debug, requires ?debug=1) |
| — | Zone-based map with drill-down, numbered pins, utility toggles |
| — | PostHog analytics + Sentry error tracking |
| — | Share button (native share API / clipboard fallback) |
| — | GPS geolocation support |
| — | v1.1 data update: 41 bilingual events from official PDF #57/CTr-BTC |

### Remaining (not yet implemented)

| ID | Feature | Effort |
|---|---|---|
| R5 | Shared state selectedLocationId — link map ↔ timeline | S |
| R6 | Map highlight on card select + card auto-scroll on pin tap | M |
| R8 | EventDetail variant — inline expand on desktop instead of modal | S |
| — | Test suite (responsive, accessibility, cross-browser) | M |

---

## 7. SYSTEM DESIGN

### 7.1. Data Schema

#### locations.json (20 locations)

```json
{
  "id": "le-dai",
  "type": "venue",            // "venue" | "landmark" | "gate" | "parking" | "restroom"
  "name": "Lễ đài Chùa Quán Thế Âm",
  "shortName": "Lễ đài",
  "nameEn": "Ceremonial Platform",
  "shortNameEn": "Ceremonial Platform",
  "icon": "🏛️",
  "color": "#8B2500",
  "primary": true,            // primary venues shown more prominently
  "lat": 15.999184,
  "lng": 108.255525,
  "address": "Khuôn viên Chùa Quán Thế Âm, Hòa Hải, Ngũ Hành Sơn",
  "addressEn": "Quan The Am Pagoda grounds, Hoa Hai, Ngu Hanh Son",
  "description": "Lễ đài chính — nơi tổ chức Lễ vía Đức Bồ tát Quán Thế Âm",
  "descriptionEn": "Main ceremonial platform — site of the Avalokiteshvara Commemoration"
}
```

#### schedule.json (41 events)

```json
{
  "id": "d1-01",
  "title": "Lễ khai kinh · Thượng phan",
  "titleOfficial": "Lễ khai kinh Thượng phan, Thượng kỳ, Thượng phướn",
  "titleEn": "Sutra Opening · Banner Raising",
  "date": "2026-04-04",
  "lunarDate": "17/02 Âm lịch",
  "dayIndex": 0,
  "startTime": "07:00",
  "endTime": null,
  "locationId": "chua",
  "category": "ceremony",
  "cat": "buddhist-ceremony",
  "leadOrg": "Chùa Quán Thế Âm",
  "leadOrgEn": "Quan The Am Pagoda",
  "partnerOrgs": ["Sở Dân tộc và Tôn giáo", "BTS Giáo hội Phật giáo VN thành phố"],
  "partnerOrgsEn": ["Department of Ethnic and Religious Affairs", "Da Nang Buddhist Sangha Executive Board"],
  "image": null,
  "isFeatured": false,
  "description": "Nghi thức thượng kỳ, thượng phướn mở đầu bốn ngày lễ hội...",
  "descriptionEn": "Opening rite of the four-day festival..."
}
```

**ID rule:** `d{dayIndex+1}-{2-digit sequence}` → d1-01, d1-02... d4-02.

**endTime rule:** Events with explicit time ranges (10:00–17:30) have endTime set. Events with only a start time have endTime = null; frontend estimates 2 hours (see `estimateEndTime` in timeUtils.js).

**category (6 values):** `ceremony` | `dharma` | `folk` | `exhibition` | `culinary` | `art`

**cat (5 category groups):** `buddhist-ceremony` | `performing-arts` | `exhibition` | `folk-culture` | `cuisine` — used for FilterBar category mode and CategoryHighlights. Mapping: ceremony+dharma → buddhist-ceremony, art → performing-arts, folk → folk-culture, culinary → cuisine, exhibition → exhibition.

#### categories.json (5 groups)

```json
{
  "id": "buddhist-ceremony",
  "icon": "🙏",
  "featuredEvents": ["d3-01"],
  "isPrimary": true,
  "accentColor": "#C8A35A",
  "description": "Tâm điểm tín ngưỡng — lễ vía, quán đảnh, thuyết pháp, hoa đăng thiền hành",
  "descriptionEn": "Heart of the faith — commemoration, abhisheka, dharma talks, lantern walking meditation"
}
```

#### amenities.json

```json
{
  "id": "medical_01",
  "type": "medical",          // medical | water | info | accessible | wifi | photo_spot | ...
  "name": "Trạm y tế lễ hội",
  "name_en": "First Aid Station",
  "lat": 15.9990,
  "lng": 108.2555,
  "note": "Hoạt động cả 4 ngày lễ hội",
  "note_en": "Open during all 4 festival days"
}
```

#### utilities.json

```json
{
  "id": "wc-1",
  "type": "wc",               // "wc" | "parking"
  "name": "Nhà vệ sinh",
  "nameEn": "Restroom",
  "lat": 15.997854,
  "lng": 108.254437,
  "color": "#E85D75"
}
```

#### zones.json

```json
{
  "id": "chua",
  "name": "Khuôn viên Chùa",
  "nameEn": "Pagoda Grounds",
  "icon": "🛕",
  "primaryLocationId": "chua",
  "zoneColor": "#C8A35A",
  "centerLat": 15.998868,
  "centerLng": 108.254587,
  "pins": [
    {
      "id": "pin-le-dai",
      "routeNumber": 8,
      "name": "Lễ đài — Lễ vía Đức Bồ tát",
      "nameEn": "Ceremonial Platform — Bodhisattva Commemoration",
      "time": "07:00–09:00 ngày 06/04",
      "timeEn": "07:00–09:00 on Apr 6",
      "lat": 15.999184,
      "lng": 108.255525,
      "locationId": "le-dai",
      "locationColor": "#8B2500"
    }
  ]
}
```

### 7.2. Component Interface

#### Hooks

```typescript
// useBreakpoint.js
// Returns: { isMobile: boolean, isDesktop: boolean }
// isMobile: width < 768px. isDesktop: width >= 1024px. Listens to resize.

// useFilters.js
// Input: now (Date), initialFilter ({ mode, value } | null — from landing deep link)
// Returns: { selectedDay, selectedLocationId, filterMode, selectedCategoryId,
//            setDay, setLocation, toggleFilterMode, setCategory, filteredEvents,
//            activeLocationCounts, activeCategoryCounts }
// filteredEvents: filters schedule.json by day + (location OR category by filterMode)
// activeLocationCounts / activeCategoryCounts: event counts per filter for current day

// useTimeGroup.js
// Input: filteredEvents (from useFilters), timeOffset (number, ms offset from real time)
// Returns: { ongoing: Event[], upcoming: Event[], ended: Event[] }
// Logic:
//   - ongoing: startTime <= now <= endTime (or startTime <= now < startTime + 2h if endTime null)
//   - upcoming: startTime > now
//   - ended: endTime < now (or startTime + 2h < now if endTime null)
//   - Updates every 60 seconds + on visibility change

// useFavorites.js
// Storage: localStorage key "festival-qta-2026-favorites"
// Returns: { favorites: Set<string>, loaded: boolean, toggleFavorite(id), isFavorite(id) }

// useGPS.js
// Returns: { position: {lat, lng} | null, accuracy, loading, error, requestLocation() }

// useMapHighlight.js
// Returns: { highlightedPinId, highlightFromMap(id), highlightFromList(id), clearHighlight() }

// useScrollReveal.js
// Returns: { ref: RefObject, visible: boolean }
// Uses IntersectionObserver with 0.15 threshold

// useUtilities.js
// Returns: { showWC, showParking, menuOpen, wcPins[], parkingPins[],
//            toggleWC, toggleParking, toggleMenu, closeMenu }

// useZones.js
// Input: selectedLocationId (string)
// Returns: { activeZoneId, highlightedPinId, activeZone, activeZonePins[],
//            drillDown(zoneId), back(), highlightPin(pinId) }
```

#### Components — key props

```
Header            — { onBack, activeTab, onToggleDebug, onToggleLanguage, selectedDay, dayEvents }

LandingPage       — { now, landingOngoing[], landingUpcoming[], onEnterSchedule }
HeroSection       — { now, onEnterSchedule }
FeaturedEvents    — { now, ongoing[], upcoming[] }
CategoryHighlights — { onEnterSchedule }
PracticalInfo     — { now }
FooterCTA         — { onEnterSchedule }

DayFilter         — { selectedDay, onDayChange, now }
FilterBar         — { filterMode, onToggleMode, selectedLocationId, onLocationChange,
                      selectedCategoryId, onCategoryChange, showFavorites,
                      onToggleFavorites, favoritesCount, activeLocationCounts, activeCategoryCounts }
EventList         — { ongoing, upcoming, ended, onEventClick, isFavorite, onToggleFavorite,
                      favLoaded, showFavorites, selectedDay, filterMode, festivalPhase }
EventCard         — { event, onClick, isFavorite, onToggleFavorite, favLoaded, timeStatus, filterMode }
EventDetail       — { event, onClose, timeStatus, isFavorite, onToggleFavorite, favLoaded }

FlatMapView       — { className }   // main map, uses useZones + useUtilities + useGPS internally
ZoneDrillDown     — { zone, pins, highlightedPinId, onPinHighlight, onBack, expanded, onToggleExpand }
ControlBar        — { showOverview, onResetView, showWC, showParking, wcCount, parkingCount,
                      menuOpen, onToggleWC, onToggleParking, onToggleMenu, onCloseMenu }

TabNav            — { activeTab, onTabChange }  // hidden when isMobile = false
ShareButton       — { source, variant, selectedDay, dayEvents }
AnalyticsNotice   — { onAcknowledged }
```

#### State flow

```
App.jsx
├── useState(currentView) → "landing" | "schedule"
├── useBreakpoint() → isMobile
├── useFavorites() → favorites, toggleFavorite, isFavorite
├── useFilters(now, initialFilter) → selectedDay, filterMode, selectedLocationId,
│                                     selectedCategoryId, filteredEvents,
│                                     activeLocationCounts, activeCategoryCounts
├── displayEvents = showFavorites ? (day + favorites filter) : filteredEvents
├── useTimeGroup(displayEvents, timeOffset) → ongoing, upcoming, ended
├── Analytics: PostHog (initPostHog) + Sentry (trackAppOpened, trackFilterApplied, etc.)
│
├── [Landing View] (currentView === "landing")
│   └── LandingPage ← now, landingOngoing, landingUpcoming, onEnterSchedule
│       ├── HeroSection (splash + countdown + CTA)
│       ├── FeaturedEvents (featured events by phase)
│       ├── CategoryHighlights (read-only cards) → "View full schedule" CTA
│       ├── PracticalInfo
│       └── FooterCTA
│
├── [Schedule View] (currentView === "schedule")
│   ├── Header ← onBack, activeTab, onToggleDebug, onToggleLanguage, selectedDay, dayEvents
│   ├── AnalyticsNotice ← onAcknowledged
│   ├── DayFilter ← selectedDay, setDay, now
│   ├── FilterBar ← filterMode, locations/categories, favorites, counts
│   ├── EventList ← ongoing, upcoming, ended, favorites
│   │   └── EventCard (each card) → tap → EventDetail (modal)
│   │
│   └── [Map] (tab on mobile, right column on tablet+)
│       └── FlatMapView (uses useZones, useUtilities, useGPS internally)
│           ├── ZoneMap + ZoneMarker (overview)
│           ├── ZoneDrillDown + NumberedPin (drill-down)
│           ├── ControlBar (WC/parking toggles)
│           └── UtilityPin (WC/parking markers)
│
└── TabNav (only visible when isMobile = true, in schedule view)
```

### 7.3. Tailwind Config

**Tailwind v4** — no `tailwind.config.js`. All design tokens in `src/index.css` via `@theme` block:

```css
@import "tailwindcss";
@import "leaflet/dist/leaflet.css";

@theme {
  /* Warm background & text */
  --color-warm-bg: #FFF8F0;
  --color-warm-card: #FFFDF7;
  --color-warm-text: #3E2723;
  --color-warm-muted: #795548;

  /* Cream palette (landing page) */
  --color-cream-light: #FFFDF8;
  --color-cream: #F5F0E8;
  --color-cream-dark: #F0EBE0;

  /* Bronze tones */
  --color-bronze: #D4B896;
  --color-bronze-dark: #8B6F47;

  /* Night tones (hero overlay) */
  --color-night-warm: #2C1810;
  --color-night-purple: #1a0f2e;

  /* Accent */
  --color-accent-gold: #C8A35A;
  --color-accent-brown: #6B4226;
  --color-accent-green: #4A6741;

  /* Location colors (14 venues, synced with colorMap.js) */
  --color-loc-le-dai: #8B2500;
  --color-loc-chua: #B8860B;
  --color-loc-trienlam-thieunhi: #C06080;
  --color-loc-dao-trang: #8B6914;
  --color-loc-mieu-huyen-tran: #9B5E6E;
  --color-loc-chua-thai-son: #7B6B5A;
  --color-loc-sk-dan-gian: #2E5A88;
  --color-loc-ocop: #D4760A;
  --color-loc-trienlam-anh: #5A8F7B;
  --color-loc-da-my-nghe: #7B8B6F;
  --color-loc-dam-sen: #4A6741;
  --color-loc-song-co-co: #6A3D7D;
  --color-loc-dieu-hanh: #B5651D;
  --color-loc-cong-chao: #A08060;

  /* Category colors (6 event types) */
  --color-cat-ceremony: #C8A35A;
  --color-cat-dharma: #8B6914;
  --color-cat-folk: #2E7D32;
  --color-cat-exhibition: #2E5A88;
  --color-cat-culinary: #E65100;
  --color-cat-art: #6A3D7D;

  /* Font */
  --font-sans: "Be Vietnam Pro", system-ui, sans-serif;

  /* Timeline rail */
  --color-rail-muted: #C4B5A4;
  --color-rail-ongoing: #4A6741;

  /* Breakpoints */
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
}
```

**Custom animations** (defined in index.css after @theme):
- `rail-pulse` — timeline rail node glow
- `lantern-float` — floating lantern (translateY -85vh)
- `star-twinkle`, `lantern-flicker`, `water-ripple` — splash SVG animations
- `zone-pulse` — zone marker pulsing ring
- `pin-bounce` — pin highlight bounce (scale 1→1.5→0.9→1)
- `pin-glow` — staggered hoa đăng warm glow on pins
- `menu-slide-up` — menu entrance
- `hero-ken-burns` — 25s zoom+pan on hero image
- `hero-float-up` — floating light particles
- `share-pulse` — share button attention pulse (2 cycles)
- `heart-pop` — favorite toggle animation
- All animations respect `prefers-reduced-motion: reduce`

Vite config uses `@tailwindcss/vite` plugin (not PostCSS).

### 7.4. Festival Config

File: `src/data/festivalConfig.js`

```javascript
const festivalConfig = {
  version: '1.2.0',
  festivalName: 'Lễ hội Quán Thế Âm',
  location: 'Ngũ Hành Sơn, Đà Nẵng',
  year: 2026,
  lunarYear: 'Bính Ngọ',
  tagline: 'Di sản văn hóa phi vật thể quốc gia',
  startDate: '2026-04-04',
  endDate: '2026-04-07',
  lunarDates: ['17/02', '18/02', '19/02', '20/02'],
  dayLabels: ['Khai mạc', 'Ngày 2', 'Lễ chính', 'Bế mạc'],
  dates: ['2026-04-04', '2026-04-05', '2026-04-06', '2026-04-07'],
  gateCoords: { lat: 16.000484, lng: 108.259449 },
  mapCenter: { lat: 15.9995, lng: 108.2560 },
  mapZoom: 16,
  languages: ['vi', 'en'],
  splashMode: 'svg',                // 'svg' | 'photo'
  splashPhoto: '/images/splash.jpg', // used when splashMode === 'photo'
  dayTaglines: [
    'Sáng khai kinh, chiều khai hội, tối hoa đăng',
    'Cà kheo rộn ràng, kinh kệ an nhiên',
    'Ngày vía Bồ tát — tâm điểm lễ hội',
    'Đi bộ vì hòa bình, khép lại mùa lễ',
  ],
}
```

### 7.5. API & Deep Link Specs

#### Open-Meteo (Weather)

```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=15.9975
  &longitude=108.2635
  &current=temperature_2m,weather_code
  &timezone=Asia/Ho_Chi_Minh
  &forecast_days=1

Response: { current: { temperature_2m: 28.5, weather_code: 3 } }
Weather code mapping: 0=clear, 1-3=partly cloudy, 45-48=fog, 51-67=rain, 80-82=showers
Fallback: show "No weather data" if API fails. Never blocks UI.
```

#### QR Code (api.qrserver.com)

```
GET https://api.qrserver.com/v1/create-qr-code/
  ?size=200x200
  &data=https://lehoi-quantheam.vn

Returns: PNG image. Use directly in <img src="...">.
Fallback: hide QR on error.
```

#### Deep Link — Google Maps Directions

```javascript
// utils/deepLink.js
export function getDirectionsUrl(lat, lng, label) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}
// Usage: window.open(getDirectionsUrl(15.9975, 108.2635, "Chùa Quán Thế Âm"))
```

---

## 8. LARGE SCREEN SUPPORT (TABLET + DESKTOP)

### Target Users

| Group | Device | Need |
|---|---|---|
| Pre-visit planning | Desktop/laptop | Browse all 4 days, plan itinerary |
| Organizing committee & volunteers | Tablet/laptop on-site | Monitor progress — need timeline and map simultaneously |
| Press, KOLs, photographers | Laptop | Select events — need organizer details, duration, venue |
| Info kiosks at festival | Large fixed screens | Auto-display, large fonts |

### Responsive Layout — 3 Breakpoints

| Breakpoint | Size | Layout |
|---|---|---|
| Mobile | < 768px | 1 column + 2 tabs (unchanged) |
| Tablet | 768px – 1024px | 2 columns: timeline 50% / map 50%, no tabs |
| Desktop | > 1024px | 2 columns: timeline 55% / map 45%, no tabs |

### Not Planned

- Separate desktop UI (parallel codebase)
- Show all 4 days simultaneously on desktop (40+ events is too much; keep DayFilter)
- Add a 3rd filter layer (day + location/category toggle is enough for 10–17 events/day)
- Map as primary interface on desktop (pin overlap is still an issue)

---

## 9. COMPARISON: MAP-CENTRIC (V1) vs TIMELINE + MAP (V2)

| Criteria | V1 — Map-Centric | V2 — Timeline + Map Support |
|---|---|---|
| Answer "what's happening now?" | Slow (tap pin, read popup) | Fast (visible on open) |
| Answer "where is it?" | Good | Good (Map tab/column) |
| Handle overlapping pins | Complex (clustering, zoom) | Not needed (pins in separate tab/column) |
| Show time dimension | Weak | Strong (auto-grouped by time) |
| Large screen support | Needs redesign | Natural responsive layout (2 columns) |
| Elderly-friendly | Medium (requires zoom, small tap targets) | High (vertical scroll, large fonts) |
| Reuse next year | Low (monolithic code) | High (component-based, update JSON data) |

---

## 10. DESIGN SYSTEM

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for the reusable design system — color tokens, typography, layout, component patterns, animation, accessibility, and state architecture. **Always follow these rules when building new screens or components.**
