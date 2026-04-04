# Implementation Plan: 5-Zone Clustered Map (Epic M)

## Context

The current `FestivalMap.jsx` renders 12+ individual venue markers with custom SVG DivIcons, plus amenity markers with chip-based filtering. With 16 pins at close proximity, markers overlap and confuse first-time visitors. The user stories in `user-stories-zone-map.md` replace this with a **5-zone clustering approach**: default view shows 5 large zone markers, tap to drill-down into individual pins within a zone, with independent utility layers (WC, parking) and GPS.

This is a **full replacement** of the current map component, not a refactor — the architectural model changes from flat markers to a two-level state machine (zone view / detail view).

---

## Implementation Steps

### Step 0: Data Layer (US-M.0) — ~2h

**Create `src/data/zones.json`** — 5 zones referencing existing location IDs from `locations.json`:

```
Zone "chua" (Khuôn viên Chùa) → pins: le-dai, chua, trienlam-thieunhi, dao-trang
Zone "svh" (Đường Sư Vạn Hạnh) → pins: sk-dan-gian, trienlam-anh, da-my-nghe, ocop, mieu-huyen-tran, chua-thai-son
Zone "song-co-co" (Sông Cổ Cò) → pins: song-co-co
Zone "dam-sen" (CV Đầm Sen) → pins: dam-sen
Zone "cong-bai-xe" (Cổng & Bãi xe) → pins: cong-chao, bai-xe-1, bai-xe-2
```

Each zone: `id, name, nameEn, shortName, shortNameEn, icon (emoji), zoneColor, centerLat, centerLng, pins[{locationId}]`.
Center coords = average of pin lat/lng.

**Create `src/data/utilities.json`** — WC and parking data (separate from zones):
- WC: 3 entries from existing `wc-1/2/3` in `locations.json` (coords already verified)
- Parking: 3 entries: `bai-xe-btc` + `bai-xe-1` + `bai-xe-2` (coords from `locations.json`)

**Modify `src/data/colorMap.js`** — add:
```js
export const zoneColors = { chua: '#C8A35A', svh: '#4A7FB5', 'song-co-co': '#7B5EA7', 'dam-sen': '#4A6741', 'cong-bai-xe': '#D4845A' }
export const locationToZone = { 'le-dai': 'chua', 'chua': 'chua', ... } // 15 entries
```

**Modify `src/index.css`** — add to `@theme`:
```css
--color-zone-chua: #C8A35A;
--color-zone-svh: #4A7FB5;
--color-zone-song: #7B5EA7;
--color-zone-cv: #4A6741;
--color-zone-cong: #D4845A;
```
Add `@keyframes zone-pulse` animation (3s box-shadow expand) + `.zone-marker-pulse` class + reduced-motion override.

**Modify `src/i18n/vi.json` and `en.json`** — add `"zoneMap"` key block with ~15 strings (back button, toggles, GPS states, directions, ARIA labels).

**Verify:** `npm run dev` compiles. New JSON files importable.

---

### Step 1: Hooks — ~3h

**Create `src/hooks/useZones.js`**
```
Input: selectedLocationId (from useFilters)
State: view ('zones'|'detail'), activeZoneId (string|null)
Returns: { view, activeZoneId, activeZone, activePins, drillDown(zoneId), backToZones() }
```
- Resolves pin coordinates from `locations.json` via a module-level `locationMap`
- `activePins` via `useMemo` keyed on `activeZoneId`
- `useEffect` watches `selectedLocationId` → auto drill-down to containing zone via `locationToZone` lookup
- `dieu-hanh` has no zone → gracefully ignored

**Create `src/hooks/useUtilityLayers.js`**
```
State: wcVisible (bool), parkingVisible (bool) — default false
Storage: sessionStorage persistence
Returns: { wcVisible, parkingVisible, toggleWC(), toggleParking() }
```

**Create `src/hooks/useGeolocation.js`**
```
State: position ({lat,lng,accuracy}|null), status ('idle'|'loading'|'success'|'error'), errorMessage
Returns: { position, status, errorMessage, requestPosition() }
```
- Single-shot `navigator.geolocation.getCurrentPosition`, enableHighAccuracy, timeout 8s
- No continuous tracking (saves battery)

---

### Step 2: Zone View — ZoneMap + ZoneMarker (US-M.1) — ~5h

**Create `src/components/map/ZoneMap.jsx`** — main container, replaces FestivalMap

Props: `{ className?, selectedLocationId? }`

Internal component tree:
```
ZoneMap
├── MapContainer (center 15.9995/108.2560, zoom 16)
│   ├── TileLayer (OSM + warm filter from current FestivalMap)
│   ├── ResizeHandler (reuse pattern from FestivalMap.jsx:14-27)
│   ├── MapController (new — imperative flyTo/flyToBounds on view changes)
│   ├── {view==='zones' && zones.map → ZoneMarker}
│   ├── {view==='detail' && activePins.map → PinMarker}
│   ├── {wcVisible && wcData.map → UtilityPin}
│   ├── {parkingVisible && parkingData.map → UtilityPin}
│   └── {gps.position && GpsMarker}
├── {view==='detail' && BackToZonesButton}
├── UtilityToggleBar (absolute bottom center)
├── {selectedPin && PinDetailSheet}
└── {gpsToast && Toast}
```

Hooks used inside: `useZones(selectedLocationId)`, `useUtilityLayers()`, `useGeolocation()`

Keyboard: Escape → close sheet > back to zones (layered handling)

**Create `src/components/map/ZoneMarker.jsx`** — props: `{ zone, onClick }`
- Leaflet `Marker` with `DivIcon` 56x56px
- HTML: circle bg `zoneColor/20`, border 2.5px solid `zoneColor`, emoji 20px center, count badge 20x20 top-right
- CSS class `zone-marker-pulse`
- `role="button"`, `aria-label="{name}, {count} điểm"`, `tabindex="0"`
- Separate `Marker` below for label text (DivIcon, 10px semibold, `zoneColor`, text-shadow cream)
- Click + Enter/Space → `onClick(zone.id)`

**Create `src/components/map/MapController.jsx`** — headless, uses `useMap()`
- On drill-down: `map.flyToBounds(pinBounds, { padding: [50,50], maxZoom: 18, duration: 0.6, easeLinearity: 0.3 })`
- On back-to-zones: `map.flyTo(center, 16, { duration: 0.6 })`
- Detects `prefers-reduced-motion` → duration 0.2s

**Verify:** 5 zone markers visible at zoom 16, non-overlapping. Pulse animation runs. Keyboard nav works (Tab through markers, Enter/Space to select).

---

### Step 3: Detail View — PinMarker + BackToZones (US-M.2) — ~3h

**Create `src/components/map/PinMarker.jsx`** — props: `{ location, onClick }`
- Leaflet `Marker` with circular DivIcon (24px) for keyboard accessibility (not `CircleMarker`)
- Fill: `location.color` (from locations.json — **location color, not zone color**)
- Border: 2.5px solid `#FFFDF8` (cream)
- `role="button"`, `aria-label`, `tabindex="0"`
- Tooltip with `location.shortName`

**Create `src/components/map/BackToZonesButton.jsx`** — props: `{ onClick }`
- Absolute positioned top-left over map, z-1000
- Pill shape: `rounded-full bg-warm-card text-warm-text font-medium text-xs shadow-warm`
- `aria-label` from i18n
- Escape key also triggers back (handled in parent ZoneMap)

**Verify:** Tap zone → flyToBounds → pins appear with correct location colors. "← Tất cả khu vực" button returns to zone view. Cross-tab: select location in Schedule tab, switch to Map → auto drill-down.

---

### Step 4: Pin Detail Bottom Sheet (US-M.3) — ~3h

**Create `src/components/map/PinDetailSheet.jsx`** — props: `{ location, events, onClose }`

Reuses visual pattern from `EventDetail.jsx` (src/components/timeline/EventDetail.jsx):
- Overlay: black/50
- Mobile: `fixed inset-x-0 bottom-0 rounded-t-xl max-h-[50vh]`
- Tablet+: `fixed inset-0 items-center rounded-xl max-w-lg`
- Handle bar (36x4px bronze/50)
- Close button top-right

Content:
1. Location color dot + location name (h2)
2. Address
3. Description (bilingual via `getLocationText`)
4. Today's events at this location (compact rows: time + title) — filtered from `schedule.json` by `dayIndex === selectedDay && locationId === pin.id`
5. Sticky footer: "Chỉ đường" button → `getDirectionsUrl(lat, lng)` from `src/utils/deepLink.js`

Behaviors: body scroll lock, Escape close, focus trap, overlay tap dismiss.

**Verify:** Tap pin → sheet opens with location info + today's events. Directions button opens Google Maps. All dismiss methods work.

---

### Step 5: Utility Layers (US-M.4/M.5) — ~3h

**Create `src/components/map/UtilityToggleBar.jsx`** — props from hooks
- Absolute positioned bottom center of map container (not viewport-fixed), z-1000
- Flex row, rounded-full, bg `warm-card/95`, backdrop-blur, shadow
- 3 buttons: WC toggle, Parking toggle, GPS button
- Toggle inactive: transparent bg, warm-text, colored indicator dot (WC=#E85D75, Parking=#D4845A)
- Toggle active: warm-text bg, cream-light text
- GPS button: shows status text ("Tôi ở đây" / "Đang tìm...")
- min-h 48px touch targets, `aria-pressed`

**Create `src/components/map/UtilityPin.jsx`** — props: `{ item, type, onClick }`
- DivIcon 32x32px, emoji center (🚻 or 🅿️), colored border, warm-card bg, shadow
- Independent of zone/detail view (always visible when toggled on)
- Tap → mini bottom sheet: name + directions button

**Create `src/components/map/GpsMarker.jsx`** — props: `{ position }`
- Accuracy ring: `Circle` with fillOpacity 0.08, stroke #4285F4
- User dot: `CircleMarker` radius 8, fill #4285F4, white stroke 3px
- Auto-open Popup: "Bạn đang ở đây" + accuracy

GPS error toast: inline in ZoneMap, `absolute top-3 left-1/2`, auto-dismiss 3s, `aria-live="polite"`.

**Verify:** WC toggle shows/hides 3 pink pins. Parking toggle shows/hides 3 orange pins. Both work in zone and detail views. GPS shows blue dot on success, toast on failure.

---

### Step 6: Integration — ~2h

**Modify `src/App.jsx`**:
- Line 28: `import FestivalMap` → `import ZoneMap from './components/map/ZoneMap'`
- Line 226: `const mapContent = <ZoneMap className="h-full" selectedLocationId={selectedLocationId} />`
- Line 336: Pass `selectedLocationId` to PlacesTab: `<PlacesTab now={now} selectedDay={selectedDay} selectedLocationId={selectedLocationId} />`

**Modify `src/components/map/PlacesTab.jsx`**:
- Replace `FestivalMap` import with `ZoneMap`
- Remove venues/amenities mode toggle (amenities now toggled on map via UtilityToggleBar)
- Remove `AmenityCard` import and rendering
- Accept `selectedLocationId` prop, pass to `ZoneMap`
- Keep venue card list below map

**Verify:** Full flow — Mobile: Map tab shows 5 zones, drill-down works, bottom sheet works, utility toggles work. Desktop: ZoneMap in sticky right column. Cross-tab sync: select location chip in Schedule → Map auto-drills to containing zone.

---

### Step 7: Cleanup — ~1h

- Remove `FestivalMap` import from `App.jsx` (already done in Step 6)
- Verify no remaining imports of `FestivalMap`, `LocationPopup`, `AmenityPopup`, `AmenityCard`
- Keep old files in repo (don't delete) until zone map is stable — they serve as reference
- Remove `amenityMap.js` import from `PlacesTab` if no longer used there

---

## Files Summary

### New files (10)
| File | Purpose |
|------|---------|
| `src/data/zones.json` | 5 zone definitions with pin references |
| `src/data/utilities.json` | WC (3) + Parking (3) data |
| `src/hooks/useZones.js` | Zone drill-down state machine |
| `src/hooks/useUtilityLayers.js` | WC/Parking toggle with sessionStorage |
| `src/hooks/useGeolocation.js` | GPS single-shot positioning |
| `src/components/map/ZoneMap.jsx` | Main map container (replaces FestivalMap) |
| `src/components/map/ZoneMarker.jsx` | Zone DivIcon marker + label |
| `src/components/map/MapController.jsx` | Imperative flyTo/flyToBounds |
| `src/components/map/PinMarker.jsx` | Location-colored pin (DivIcon for a11y) |
| `src/components/map/PinDetailSheet.jsx` | Bottom sheet for pin tap |
| `src/components/map/BackToZonesButton.jsx` | "← All zones" pill button |
| `src/components/map/UtilityToggleBar.jsx` | WC/Parking/GPS floating bar |
| `src/components/map/UtilityPin.jsx` | WC/Parking DivIcon marker |
| `src/components/map/GpsMarker.jsx` | Blue GPS dot + accuracy ring |

### Modified files (6)
| File | Change |
|------|--------|
| `src/data/colorMap.js` | Add `zoneColors`, `locationToZone` exports |
| `src/index.css` | Add zone color tokens + `zone-pulse` animation |
| `src/i18n/vi.json` | Add `"zoneMap"` string block |
| `src/i18n/en.json` | Add `"zoneMap"` string block |
| `src/App.jsx` | Swap FestivalMap → ZoneMap, pass selectedLocationId |
| `src/components/map/PlacesTab.jsx` | Swap FestivalMap → ZoneMap, remove amenity toggle |

### Existing files to reuse (patterns, not modify)
| File | What to reuse |
|------|---------------|
| `src/components/map/FestivalMap.jsx:14-27` | `ResizeHandler` pattern |
| `src/components/map/FestivalMap.jsx` | Warm tile URL + CSS filter |
| `src/components/timeline/EventDetail.jsx` | Bottom sheet visual pattern (overlay, modal sizes, scroll lock, CTA footer) |
| `src/utils/deepLink.js` | `getDirectionsUrl(lat, lng)` |
| `src/utils/i18nEvent.js` | `getLocationText(location, field, language)` |

---

## Key Design Decisions

1. **New component, not refactor** — FestivalMap has flat markers + Leaflet popups; ZoneMap has zone/detail state machine + bottom sheets. A refactor would leave dead code and convoluted branching.

2. **zones.json references locationIds** — pins resolve coordinates from `locations.json` at render time. No coordinate duplication.

3. **PinDetailSheet separate from EventDetail** — different data schemas (location vs event). Same visual pattern, different component. Keeps both simple.

4. **PinMarker uses DivIcon, not CircleMarker** — Leaflet CircleMarker (SVG path) doesn't support `tabindex`/keyboard focus. DivIcon with circular CSS provides both visual appearance and accessibility.

5. **`dieu-hanh` excluded from zones** — float parade route has no fixed location. Events with this locationId gracefully have no map pin.

6. **UtilityToggleBar is `absolute` within map container** — not `fixed` to viewport. This avoids z-index conflicts with mobile TabNav (z-40).

---

## Verification Plan

After each step, run `npm run dev` and verify:

1. **Data** (Step 0): App compiles, no import errors
2. **Hooks** (Step 1): Console.log drill-down/back state transitions
3. **Zone view** (Step 2): 5 markers visible, pulse animation, keyboard nav
4. **Detail view** (Step 3): Fly to pins, correct colors, back button, cross-tab sync
5. **Bottom sheet** (Step 4): Tap pin → sheet with events, directions, dismiss
6. **Utility layers** (Step 5): Toggle WC/parking pins, GPS blue dot
7. **Integration** (Step 6): Full mobile + desktop flow end-to-end
8. **Cross-browser**: Test on Chrome + Safari mobile (primary audience)
9. **Accessibility**: Tab navigation, screen reader labels, reduced motion
10. **Responsive**: Mobile (360px), tablet (768px), desktop (1024px+)
