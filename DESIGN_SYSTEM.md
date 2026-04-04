# Reusable Design System — Event & Festival Apps

A project-agnostic design system extracted from a production festival guide app. Covers color, typography, layout, components, animation, interaction, accessibility, and state architecture. Designed for **mobile-first, time-based, multi-venue event apps**.

---

## 1. Philosophy & Principles

### Core Question
> "What's happening now, and where?" — answer in under 3 seconds.

### Rules
1. **Mobile-first, not mobile-only** — same features on all screen sizes, only layout changes.
2. **2-3 taps max** to complete any primary flow (browse → detail → directions).
3. **Text-density over imagery** — event cards are text-only; images are optional in detail views.
4. **Time is the primary axis** — events auto-group into Ongoing / Upcoming / Ended.
5. **Space is secondary** — map supports wayfinding, not browsing.
6. **Warm & accessible** — large fonts, high contrast, no complex gestures. Friendly to all ages.
7. **Data-driven** — swap JSON files to reuse for a different event. No hardcoded content in components.

---

## 2. Color System

### 4-Layer Architecture

Colors are organized in 4 layers. Each layer serves a distinct purpose and uses a naming convention for tokens.

| Layer | Purpose | Token prefix | Example |
|---|---|---|---|
| **Background & Text** | Page surfaces, body copy | `warm-*` | `warm-bg`, `warm-card`, `warm-text`, `warm-muted` |
| **Accent** | CTAs, headings, status indicators | `accent-*` | `accent-gold`, `accent-brown`, `accent-green` |
| **Location** | Venue identification — synced across chips, card tags, and map pins | `loc-*` | `loc-chua`, `loc-san-khau` |
| **Category** | Event type classification | `cat-*` | `cat-ceremony`, `cat-folk` |

### Token Reference

#### Background & Text
| Token | Hex | Usage |
|---|---|---|
| `warm-bg` | `#FFF8F0` | Page background — warm cream |
| `warm-card` | `#FFFDF7` | Card/surface background — off-white |
| `warm-text` | `#3E2723` | Primary body text — dark brown |
| `warm-muted` | `#795548` | Secondary text, captions — medium brown |

#### Accent
| Token | Hex | Usage |
|---|---|---|
| `accent-gold` | `#C8A35A` | Primary CTA, highlights, featured borders |
| `accent-brown` | `#6B4226` | Headings, time labels |
| `accent-green` | `#4A6741` | "Ongoing" status indicator |

#### Landing Page (optional, for hero/splash screens)
| Token | Hex | Usage |
|---|---|---|
| `cream-light` | `#FFFDF8` | Landing background |
| `cream` | `#F5F0E8` | Featured section background |
| `cream-dark` | `#F0EBE0` | Highlights section background |
| `bronze` | `#D4B896` | Decorative warm accent |
| `bronze-dark` | `#8B6F47` | Shadow/border warm accent |
| `night-warm` | `#2C1810` | Dark overlay on hero images |
| `night-purple` | `#1a0f2e` | Transition zone between hero and content |

#### Timeline Rail
| Token | Hex | Usage |
|---|---|---|
| `rail-muted` | `#C4B5A4` | Ended/upcoming rail segments |
| `rail-ongoing` | `#4A6741` | Active rail segments and nodes |

### Color Rules

1. **No pure black** (`#000`) — use `warm-text` (`#3E2723`) for darkest text.
2. **No cold colors** in backgrounds — all surfaces use warm cream/beige tones.
3. **Location colors sync everywhere** — the same hex appears on filter chips, card tags, and map pins. This is the primary wayfinding cue.
4. **Functional colors are earthy** — even status indicators (green for "ongoing") use muted earth tones, not saturated primaries.
5. **Opacity for variants** — use `color/8`, `color/15`, `color/20`, `color/30` for tinted backgrounds and hover states instead of creating new color tokens.

### Customization
To adapt for a different event: replace hex values in the `@theme` block (or Tailwind config). Keep the 4-layer structure and naming convention.

---

## 3. Typography

### Font
**Be Vietnam Pro** — chosen for excellent Vietnamese diacritics support, clean readability at small sizes, and a warm humanist feel. Weights: 400, 500, 600, 700.

For non-Vietnamese projects, substitute with any humanist sans-serif (Inter, Source Sans, Noto Sans).

### Scale
| Token | Size | Line-height | Usage |
|---|---|---|---|
| `text-base` | 1rem (16px) | 1.625 (26px) | Body text, card descriptions |
| `text-lg` | 1.125rem (18px) | 1.625 | Card titles, filter labels |
| `text-xl` | 1.25rem (20px) | 1.5 | Section headings |
| `text-2xl`+ | 1.5rem+ | 1.3-1.4 | Page titles, hero text |

### Weight Usage
| Weight | Tailwind | Usage |
|---|---|---|
| 400 (Regular) | `font-normal` | Body text, descriptions |
| 500 (Medium) | `font-medium` | Time labels, CTA buttons, badges |
| 600 (Semibold) | `font-semibold` | Section headers, featured event titles |
| 700 (Bold) | `font-bold` | Card titles, page headings |

### Rules
1. **Generous line-height** (1.5-1.625) for readability on mobile.
2. **No font sizes below 14px** — older users are a primary audience.
3. **Weight creates hierarchy**, not size alone — a bold 16px title next to a regular 16px subtitle is clearer than 18px vs 14px.

---

## 4. Layout System

### Breakpoints
| Name | Width | Layout |
|---|---|---|
| Mobile | < 768px | 1 column + bottom tab navigation |
| Tablet | 768px – 1024px | 2 columns (55-60% / 40-45%), tabs hidden |
| Desktop | > 1024px | 2 columns (60-65% / 35-40%), tabs hidden |

### Mobile Layout
```
┌─────────────────────┐
│      Header         │
├─────────────────────┤
│   Day Filter        │
│   Location Chips    │
├─────────────────────┤
│                     │
│   Event List        │
│   (scrollable)      │
│                     │
├─────────────────────┤
│  Tab: Schedule | Map│  ← fixed bottom, z-40
└─────────────────────┘
```

### Tablet/Desktop Layout
```
┌───────────────────────────────────────┐
│              Header                   │
├──────────────────────┬────────────────┤
│   Day Filter         │                │
│   Location Chips     │   Map          │
├──────────────────────┤   (sticky,     │
│                      │    100dvh)     │
│   Event List         │                │
│   (scrollable)       │                │
│                      │                │
└──────────────────────┴────────────────┘
```

### Spacing Conventions
| Element | Value |
|---|---|
| Page horizontal padding | `px-4` (16px) |
| Card internal padding | `p-4` to `p-5` (16-20px) |
| Section gap | `gap-3` to `gap-4` (12-16px) |
| Filter chip gap | `gap-2` (8px) |
| Container max-width (mobile) | 600px |
| Container max-width (desktop) | 1440px |
| Bottom padding (mobile, for tab nav) | `pb-16` (64px) |

### Rules
1. **Map sticky on desktop** — `position: sticky; top: 12px; height: calc(100dvh - 100px)`.
2. Use `100dvh` not `100vh` — avoids mobile browser address bar issues.
3. **No horizontal scroll on page** — only inside filter chip bars.
4. Tab nav is **fixed bottom** on mobile with `z-40`.

---

## 5. Component Patterns

### 5.1 Event Card

**Default variant:**
- Background: `warm-card`
- Border: subtle, transparent by default
- Hover: `border-accent-gold/30` glow
- Content: time (sm, accent-brown) → title (base, bold) → location tag (colored bg) + category tag

**Featured variant:**
- Background: `accent-gold/8`
- Left border: 4px solid `accent-gold`
- Same content structure

**Rules:**
- Cards are **text-only** — no thumbnail images. This maximizes information density.
- Favorite button (heart icon) positioned right, toggles on click/Enter/Space.
- Ended events: reduced opacity, grouped under collapsible section.

### 5.2 Filter Chips

- **Container**: horizontal scroll, `overflow-x-auto`, `scrollbar-none`, drag-to-scroll with cursor feedback (`grab` → `grabbing`).
- **Chip structure**: `flex-shrink-0` to prevent compression.
- **Location chip (active)**: background = location color, white text.
- **Location chip (inactive)**: same color but reduced opacity.
- **"All" chip**: solid brown when selected, gray otherwise.
- **Dividers**: `w-px` vertical lines between chip groups.
- **Max 2 filter dimensions** — don't add more. Time (day) + space (location) or category is sufficient.

### 5.3 Modal / Detail View

| Property | Mobile | Tablet+ |
|---|---|---|
| Position | `fixed inset-0`, `items-end` | `fixed inset-0`, `items-center` |
| Shape | `rounded-t-xl` (top only) | `rounded-xl` (all corners) |
| Max height | `85vh` | auto |
| Max width | full | `max-w-lg` |
| Overlay | black 50% opacity | black 50% opacity |
| Top border | 4px solid category color | 4px solid category color |

**Three-zone layout** — flex column with fixed header, scrollable content, sticky CTA footer:
- Zone 1 (header): `shrink-0` — category badge, title, time status, date, favorite toggle, close button
- Zone 2 (content): `flex-1 overflow-y-auto min-h-0` — location, description, organization, image, amenities
- Zone 3 (footer): `shrink-0` with upward shadow — CTA button always visible

**Dismiss methods** (all required):
1. Click/tap overlay background
2. Press Escape key
3. Close button (Lucide `X` icon) in top-right

**Accessibility**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title.

**On open**: lock body scroll. **On close**: restore scroll.

**Content order:**
1. Category badge (colored pill with icon)
2. Time status badge (ongoing: green pulse, ended: muted — omitted for upcoming)
3. Favorite toggle (heart icon, syncs with EventCard state)
4. Title (h2, bold)
5. Time range + formatted date (localized weekday + day/month + lunar date)
6. Location card (color-tinted background, name + address)
7. Description (if present)
8. Organization info (icon-led: Building2 for lead, Users for partners, expandable if >2)
9. Image (if present — never show placeholder)
10. Nearby amenities (compact tappable chips, all within 500m, priority-sorted: medical > wc > water > parking > info > atm)
11. CTA button (sticky footer, full-width, gold, "Get Directions" — KPI #1)

### 5.4 Timeline Rail

The vertical timeline rail runs alongside the event list, providing visual time-state feedback.

**Node sizes by state:**
| State | Size | Style |
|---|---|---|
| Ongoing + featured | w-3.5 h-3.5 | Green fill, pulsing shadow animation |
| Ongoing | w-3 h-3 | Green fill |
| Upcoming + featured | w-2.5 h-2.5 | Hollow ring (2px border, white fill) |
| Upcoming | w-2 h-2 | Hollow ring |
| Ended + featured | w-2 h-2 | Gray fill |
| Ended | w-1.5 h-1.5 | Gray fill |

**Featured indicator**: gold `ring-2` with offset around the node.

**Segment styles (vertical lines between nodes):**
| State | Style |
|---|---|
| Ongoing | Solid green, 3px width |
| Upcoming | Dashed muted, 2px width (repeating-linear-gradient) |
| Ended | Solid muted, 2px width |

**Layout**: `pl-8` left padding for rail space (shrinks to `pl-6` on screens < 360px).

### 5.5 Map Markers

- **Type**: `CircleMarker` (not icon markers — simpler, color-codeable)
- **Radius**: 12px
- **Fill**: location color from `colorMap`
- **Fill opacity**: 0.9
- **Border**: 2px white stroke
- **Popup on tap**: location name + "Get Directions" button
- **Resize handling**: `ResizeObserver` calls `map.invalidateSize()` when container changes

### 5.6 Buttons

**Primary CTA:**
- Background: `accent-gold` (hover: darken 10%)
- Text: white, `font-medium`
- Shape: full-width or pill (`rounded-full`)
- Shadow on active state

**Secondary / Back:**
- Circular (36px), background at 15% opacity
- Hover: 25% opacity

**Tab buttons (mobile nav):**
- Active: `accent-gold` text + 2px top border
- Inactive: `warm-muted` text, no border

### 5.7 Day Filter

- **Layout**: 4 equal-width buttons (`flex-1`) in a single row
- **Active**: gold background, white text, subtle shadow
- **Inactive**: card background with border, hover shows gold accent border
- **Content**: date on first line, label below (e.g., "Opening", "Day 2", "Main Day", "Closing")

---

## 6. Animation & Motion

### Animation Catalog

| Name | Duration | Easing | Effect | Usage |
|---|---|---|---|---|
| `rail-pulse` | 2s | ease-in-out | Box-shadow expand 0→5px, fade | Ongoing event timeline node |
| `fadeIn` | — | — | opacity 0→1, translateY 4px→0 | General element entry |
| `lantern-float` | variable | linear | translateY -85vh, translateX 20px, opacity fade | Landing page decoration |
| `star-twinkle` | 4-6s | ease-in-out | opacity 0.4→0.9→0.4 | Landing page stars |
| `lantern-flicker` | 3s | ease-in-out | opacity 0.75→1→0.75 | Landing page lantern glow |
| `water-ripple` | 4s | ease-out | scale 1→1.4, opacity 0.3→0 | Landing page water reflection |

### Transition Utilities
- `transition-colors` on all interactive elements (buttons, chips, cards)
- `transition-opacity` on overlays and modals

### Reduced Motion
All animations must respect `prefers-reduced-motion: reduce`:
```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
  }
  /* Purely decorative animations: display: none */
}
```

### Rules
1. **Functional animations only in schedule view** — `rail-pulse` for live status. No decorative motion.
2. **Decorative animations only in landing** — stars, lanterns, water. These are removed entirely for reduced-motion.
3. **No animation on cards or list items** — scroll performance matters more than entrance effects.
4. Use `will-change: transform` or `will-change: opacity` on animated elements.

---

## 7. Interaction Patterns

### Filtering
- **2 dimensions maximum**: Time (day buttons) + Space (location chips) or Category (toggle between modes).
- **Default state**: today's date (or first day if outside event period), all locations.
- **Mode toggle**: a single button switches between location-based and category-based filtering. Switching resets selection to "all".
- **Favorites**: independent toggle overlaid on the filter bar. Shows only hearted events for the selected day.

### Navigation
- **Two views**: Landing (immersive, browse mode) and Schedule (functional, use mode).
- **Landing → Schedule**: CTA button or category card tap.
- **Schedule → Landing**: back button in header.
- **Session memory**: once user enters schedule during event dates, don't show landing again (sessionStorage flag).

### External Actions
- **Directions**: deep link to Google Maps (or Apple Maps on iOS). Don't build in-app routing.
- **Calendar**: "Add to Calendar" generates `.ics` or deep link.
- **QR code**: external API (e.g., `api.qrserver.com`). Fallback: hide if API fails.
- **Weather**: external API (e.g., Open-Meteo). Fallback: "No weather data". Never block UI.

### Rules
1. **Never block UI on external API failure** — weather, QR, and maps are all graceful-degrade.
2. **No in-app routing or map navigation** — deep link to native map apps. Users already have Google Maps.
3. **No placeholder images** — if an image field is null, show nothing. An empty space is better than a gray box.

---

## 8. Accessibility Checklist

### Structure
- [ ] Semantic HTML: `<button>`, `<nav>`, `<section>`, `<h1>`-`<h3>`
- [ ] Heading hierarchy: one `<h1>` per view, sequential `<h2>`, `<h3>`

### Interactive Elements
- [ ] All icon-only buttons have `aria-label`
- [ ] Decorative SVGs/images have `aria-hidden="true"`
- [ ] Focus order follows visual order (no `tabindex` hacks)

### Keyboard
- [ ] `Tab` navigates all interactive elements
- [ ] `Enter` / `Space` activates buttons and toggles
- [ ] `Escape` closes modals
- [ ] No gesture-only interactions (swipe, pinch, long-press)

### Visual
- [ ] Color contrast ≥ WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] Touch targets ≥ 48px × 48px
- [ ] No information conveyed by color alone (combine with text/icon)
- [ ] `prefers-reduced-motion` respected for all animations

### Content
- [ ] Font size ≥ 14px everywhere
- [ ] Line-height ≥ 1.5 for body text
- [ ] No ALL CAPS blocks longer than 3 words

---

## 9. State Architecture (Hooks)

These hooks form the reusable state layer. They are framework-agnostic in concept — implement in React, Vue, Svelte, etc.

### `useBreakpoint()`
```
Returns: { isMobile: boolean }
Logic: window.innerWidth < 768 → true
Listens: window resize event
```
**Purpose**: toggles between tab nav (mobile) and 2-column sticky layout (tablet+).

### `useFilters()`
```
State: {
  selectedDay: number (0-based index),
  selectedLocationId: string | "all",
  filterMode: "location" | "category",
  selectedCategoryId: string | "all"
}
Returns: { ...state, setDay, setLocation, toggleFilterMode, setCategory, filteredEvents }
```
**Purpose**: central filter state. `filteredEvents` is a derived array from the full schedule, filtered by day + location/category.

**Default**: `selectedDay` = today's index during event, else 0. All locations/categories selected.

### `useTimeGroup(filteredEvents, currentTime)`
```
Returns: { ongoing: Event[], upcoming: Event[], ended: Event[] }
```
**Logic**:
- **Ongoing**: `startTime ≤ now ≤ endTime` (or `startTime ≤ now < startTime + 2h` if no endTime)
- **Upcoming**: `startTime > now`
- **Ended**: `endTime < now` (or `startTime + 2h < now` if no endTime)
- **Refresh**: every 60 seconds via `setInterval`

### `useFavorites()`
```
Returns: { favorites: Set<string>, loaded: boolean, toggleFavorite, isFavorite }
Storage: localStorage
```
**Purpose**: persist hearted events across sessions. Includes error handling for corrupt/full storage.

---

## 10. Customization Guide

### What to change per project

| Item | Where | Example |
|---|---|---|
| Color hex values | `@theme` block / Tailwind config | Swap warm browns for cool blues |
| Font family | `@theme` → `--font-sans` | "Inter" instead of "Be Vietnam Pro" |
| Event data | `schedule.json` | Different events, dates, times |
| Venue data | `locations.json` | Different venues, GPS coords |
| Categories | `colorMap.js` | "workshop", "keynote", "social" |
| Category colors | `colorMap.js` + `@theme` | Match new brand palette |
| Location colors | `colorMap.js` + `@theme` | Match venue branding |
| Landing artwork | SVG splash, hero images | Event-specific visuals |
| Day labels | Config/data | "Day 1", "Workshops", "Finals" |
| Map center & zoom | Config | Center on new venue |
| External links | Deep link utils | Apple Maps preference, etc. |

### What stays the same

| Item | Why |
|---|---|
| 4-layer color architecture | Proven separation of concerns |
| Layout breakpoints & behavior | Universal responsive pattern |
| Component patterns (card, chip, modal, rail) | Tested interaction model |
| Animation approach & reduced-motion | Accessibility compliance |
| Hook architecture | Clean state separation |
| Accessibility rules | Legal & ethical requirement |
| "2 filter dimensions max" rule | Cognitive load management |
| "No placeholder images" rule | Visual quality assurance |
| "Deep link for directions" rule | Scope control |

---

## Quick Start for a New Project

1. **Copy** the component structure, hooks, and CSS theme block.
2. **Replace** `schedule.json`, `locations.json`, and `colorMap.js` with your event data.
3. **Update** hex values in the `@theme` block to match your brand.
4. **Swap** the font family if not targeting Vietnamese users.
5. **Replace** landing page artwork (SVG splash, hero images).
6. **Update** config: event name, dates, map center, day labels.
7. **Test** responsive layout, accessibility, and reduced-motion.

# Section 11 — Icon System

> Bổ sung vào DESIGN_SYSTEM.md, đặt sau Section 10 (Customization Guide).

---

## 11. Icon System

### Philosophy

Icons trong hệ thống này theo phong cách **"Bold & Friendly Brush"** — lấy cảm hứng từ nét bút thủy mặc Đông Á nhưng ưu tiên sự rõ ràng và gần gũi hơn tính nghệ thuật. Mỗi icon phải đọc được ở 24px trên mobile mà không cần zoom.

**Nguyên tắc cốt lõi:**
1. **Rõ trước, đẹp sau** — icon phải nhận diện được trong 0.5 giây ở kích thước nhỏ nhất (24px). Chi tiết nghệ thuật chỉ thêm khi không ảnh hưởng legibility.
2. **Brush, không flat** — stroke-width biến thiên nhẹ (1.8→2.5px) tạo dấu ấn nét bút, phân biệt với icon flat generic. Đây là chi tiết nhỏ nhưng tạo identity cho toàn bộ hệ thống.
3. **Có khối, không chỉ viền** — fill 15-30% opacity ở vùng chính giúp icon có trọng lượng thị giác, không bị "rỗng" khi thu nhỏ.
4. **Ít path, nhiều ý** — tối đa 8-10 path mỗi icon. Mỗi path phải đóng góp vào nhận diện. Nếu bỏ một path mà icon vẫn nhận ra → bỏ.

---

### 11.1 Icon Grid & Sizing

#### Viewbox

| Loại | Viewbox | Ratio | Dùng cho |
|---|---|---|---|
| Category icon | `0 0 24 24` | 1:1 | Filter chips, event cards, section headings |
| Location pin | `0 0 24 32` | 3:4 | Map markers (full), filter chips (cropped) |
| Functional icon | `0 0 24 24` | 1:1 | Navigation, actions, utility |

#### Safe Area

Category & Functional: nội dung nằm trong vùng 20×20 (padding 2px mỗi bên). Location pin: nội dung symbol nằm trong vòng tròn r=9 tính từ center (12, 11) của phần đầu pin.

#### Render Sizes

| Context | Category | Location (full) | Location (dot) | Functional |
|---|---|---|---|---|
| Filter chip prefix | 18×18 | — | 18×18 | — |
| Event card | 32×32 | — | 18×18 (location tag) | 20×20 |
| Event detail badge | 20×20 | — | 18×18 | 24×24 |
| Section heading (landing) | 40-56×40-56 | — | 24×24 | — |
| Map marker | — | 32×42 | — | — |
| Tab navigation | — | — | — | 24×24 |

#### Responsive Override

Trên màn hình < 360px: category icon trong card giảm xuống 28×28, location pin trên map giảm xuống 28×37.

---

### 11.2 Stroke Rules

#### Weight Scale

| Token | Stroke-width | Vai trò | Ví dụ |
|---|---|---|---|
| `hero` | 2.2 – 2.5px | Đường chính, nhận diện đầu tiên | Thân bát, cà kheo, viền mặt nạ |
| `primary` | 1.8 – 2.0px | Đường cấu trúc chính | Cánh sen, cán búa, dải khăn |
| `secondary` | 1.3 – 1.5px | Chi tiết phụ quan trọng | Gân lá, nan đèn, vân đá |
| `detail` | 1.0 – 1.2px | Chi tiết nhỏ nhất cho phép | Hơi nước, trang trí nhẹ |

**Không bao giờ dùng stroke-width dưới 1.0px.** Ở 24px render, stroke 0.8px gần như vô hình trên màn hình mobile thực tế.

#### Stroke Properties

```
stroke-linecap: round    /* Đầu nét tròn = cảm giác bút lông */
stroke-linejoin: round   /* Góc nối mềm */
```

Hai thuộc tính này là bắt buộc trên mọi icon. Không dùng `butt` hoặc `miter` — chúng tạo cảm giác cơ khí, phá vỡ dấu ấn brush.

#### Biến thiên nét bút (Brush Feel)

Mỗi icon nên có ít nhất 2 mức stroke-width khác nhau. Ví dụ:

```
Hoa sen:  cánh chính 2.0 → cánh phụ 1.8 → cuống 1.8 → gân lá 1.3
Mặt nạ:  viền mặt 2.2 → mày 2.5 → miệng 2.0 → dải khăn 1.8
```

Sự biến thiên này là yếu tố tạo "brush feel" — nếu tất cả nét cùng 1 width, icon sẽ trông giống icon flat thông thường.

---

### 11.3 Fill Rules

#### Opacity Scale

| Token | Opacity | Vai trò | Ví dụ |
|---|---|---|---|
| `fill-strong` | 25 – 35% | Vùng trọng tâm, tạo khối rõ nhất | Nhụy sen, lưỡi đục, mắt |
| `fill-medium` | 15 – 20% | Vùng chính, tạo khối nhẹ | Cánh sen, thân bát, khuôn mặt |
| `fill-light` | 8 – 12% | Vùng nền, gợi hình | Khối đá, thân thuyền, thân xe |
| `fill-none` | 0% | Vùng phụ, chỉ dùng stroke | Đường chân, chi tiết phụ |

#### Quy tắc fill

1. **Mỗi icon có ít nhất 1 vùng fill-medium hoặc fill-strong** — đây là "anchor" thị giác, giúp icon không bị rỗng.
2. **Fill color = stroke color** (cùng `currentColor`) — không dùng màu fill khác.
3. **Không fill toàn bộ** — fill chỉ áp dụng cho 1-3 path quan trọng nhất. Icon vẫn chủ yếu stroke-based.
4. **Fill dots** (chấm tròn đặc) dùng cho điểm nhấn nhỏ: nhụy sen, mắt, tâm bánh xe. Radius: 0.6-1.2px. Fill opacity: 25-40%.

---

### 11.4 Color System cho Icons

#### Category Icons (monochrome, kế thừa currentColor)

```jsx
/* Icon tự kế thừa màu text từ parent */
<span className="text-accent-brown">
  <CategoryIcon category="buddhist" size={32} />
</span>

/* Dark mode */
<span className="text-cream dark:text-cream">
  <CategoryIcon category="buddhist" size={32} />
</span>
```

Category icons **không bao giờ** có màu riêng hardcode. Chúng luôn dùng `currentColor` để linh hoạt theo context (nền sáng, nền tối, nền màu trên chip active).

#### Location Pin Icons (màu cố định theo colorMap)

| Location | Pin fill | Symbol stroke | Viền pin |
|---|---|---|---|
| Tất cả | `colorMap[locationId]` ở 92% opacity | `#FFFDF8` (cream-light) | `#FFFDF8`, 1.5px |

Location pins **luôn** giữ màu riêng theo colorMap — đây là wayfinding cue chính, phải nhất quán ở mọi nơi (chip, card tag, map, detail modal).

#### Functional Icons

Dùng `currentColor`, giống category icons. Không có màu riêng.

---

### 11.5 Location Pin Structure

Tất cả 6 pin dùng chung **shell** (vỏ giọt nước) — chỉ khác **symbol** bên trong.

#### Shell Template

```svg
<!-- Shell — giọt nước, fill = location color -->
<path d="M12 30 C12 30, 2 17, 2 11 C2 5.5, 6.5 1, 12 1 
         C17.5 1, 22 5.5, 22 11 C22 17, 12 30, 12 30Z"
      fill="{locationColor}" fill-opacity="0.92"
      stroke="#FFFDF8" stroke-width="1.5"/>
```

#### Symbol Zone

Symbol nằm trong vùng tròn **center (12, 10.5), radius 7** của viewbox 24×32. Không vẽ symbol ra ngoài vùng này — sẽ bị cắt bởi viền pin trên visual.

#### Variant: Dot (cho filter chips)

Crop viewbox thành `0 0 24 22`, bỏ phần đuôi nhọn. Kết quả là hình tròn có symbol bên trong. CSS `border-radius: 50%` nếu cần clip thêm.

---

### 11.6 Icon Families & Extensibility

#### Hiện có

| Family | Số lượng | Style | Nguồn |
|---|---|---|---|
| Category | 5 | Custom SVG, Bold & Friendly Brush | Thiết kế riêng cho dự án |
| Location Pin | 6 | Custom SVG shell + symbol | Thiết kế riêng cho dự án |
| Functional | ~15 | Lucide Icons (library) | lucide-react, stroke-width 2 |

#### Thêm Category Icon mới

Khi cần thêm category mới (ví dụ: "Giáo dục", "Thể thao", "Âm nhạc"), tuân thủ quy trình:

**Bước 1 — Chọn hình tượng:**
- Hình tượng phải đặc trưng cho category trong ngữ cảnh văn hóa Việt Nam
- Ưu tiên hình tượng có đường cong (phù hợp brush style) hơn hình hộp/góc cạnh
- Hình tượng phải nhận diện được ở 24px — test bằng cách vẽ phác trên giấy kẻ ô 24×24

**Bước 2 — Vẽ SVG theo spec:**

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-linecap="round" stroke-linejoin="round">
  
  <!-- 1. Hero stroke (2.2-2.5px) — đường nhận diện chính -->
  <path d="..." stroke-width="2.3"/>
  
  <!-- 2. Primary strokes (1.8-2.0px) — cấu trúc -->
  <path d="..." stroke-width="1.8"/>
  
  <!-- 3. Fill anchor — 1 vùng fill 15-30% -->
  <path d="..." stroke-width="1.8" fill="currentColor" fill-opacity="0.2"/>
  
  <!-- 4. Secondary details (1.3-1.5px) — nếu cần -->
  <path d="..." stroke-width="1.3"/>
  
  <!-- 5. Fill dots — điểm nhấn nhỏ (optional) -->
  <circle cx="..." cy="..." r="0.9" fill="currentColor" fill-opacity="0.35" stroke="none"/>
</svg>
```

**Bước 3 — Checklist trước khi merge:**

- [ ] Viewbox đúng 24×24
- [ ] Stroke dùng `currentColor`, không hardcode hex
- [ ] Stroke-width tối thiểu 1.0px, hero stroke 2.2-2.5px
- [ ] Có ít nhất 2 mức stroke-width khác nhau
- [ ] Có ít nhất 1 vùng fill 15-30% opacity
- [ ] Tổng path ≤ 10
- [ ] `stroke-linecap="round"` và `stroke-linejoin="round"`
- [ ] Nội dung nằm trong safe area 20×20
- [ ] Test render ở 24px, 32px, 48px — nhận diện được ở cả 3
- [ ] Test trên nền sáng (`warm-bg`) và nền tối (`night-warm`)

#### Thêm Location Pin mới

**Bước 1:** Thêm location vào `locations.json` + `colorMap.js` (chọn màu chưa dùng, muted earth tone).

**Bước 2:** Vẽ symbol mới, nằm trong vùng tròn center (12, 10.5) radius 7:

```svg
<svg viewBox="0 0 24 32">
  <!-- Reuse shell template -->
  <path d="M12 30 C12 30, 2 17, 2 11 C2 5.5, 6.5 1, 12 1 
           C17.5 1, 22 5.5, 22 11 C22 17, 12 30, 12 30Z"
        fill="{NEW_COLOR}" fill-opacity="0.92"
        stroke="#FFFDF8" stroke-width="1.5"/>
  
  <!-- Symbol group — stroke trắng -->
  <g stroke="#FFFDF8" stroke-linecap="round" fill="none">
    <!-- Vẽ symbol ở đây, stroke 1.2-2.2px -->
  </g>
</svg>
```

**Bước 3 — Checklist:**

- [ ] Shell path giống hệt template (copy paste, không chỉnh)
- [ ] Symbol nằm trong vùng tròn (12, 10.5) r=7
- [ ] Symbol stroke: `#FFFDF8`, width 1.2-2.2px
- [ ] Fill nếu có: `#FFFDF8`, opacity 10-20%
- [ ] Màu pin mới đã thêm vào `colorMap.js`
- [ ] Test cả variant `full` và `dot`
- [ ] Test trên tile map thực tế — pin mới không chồng pin cũ ở zoom mặc định

---

### 11.7 Functional Icons (Lucide Customization)

Functional icons dùng **Lucide React** (`lucide-react@0.383.0`) với config override:

```jsx
import { MapPin, Calendar, Share2, Heart, X, ChevronDown } from "lucide-react";

/* Override mặc định: stroke-width 2, size 24 */
<MapPin size={24} strokeWidth={2} className="text-accent-brown" />
```

#### Danh sách Functional Icons

| Chức năng | Lucide icon | Ghi chú |
|---|---|---|
| Chỉ đường | `Navigation` | Dùng trong CTA "Chỉ đường" |
| Lịch | `Calendar` | Info card thời gian |
| Chia sẻ | `Share2` | Web Share API button |
| Yêu thích | `Heart` | Toggle trên event card |
| Đóng modal | `X` | Top-right detail modal |
| Tab Chương trình | `CalendarDays` | Bottom tab nav |
| Tab Bản đồ | `Map` | Bottom tab nav |
| Ngôn ngữ | `Globe` | Header, chuyển ngôn ngữ |
| Thời tiết | `CloudSun` | Weather widget |
| QR Code | `QrCode` | QR component |
| Cuộn xuống | `ChevronDown` | Hero scroll indicator |
| Quay lại | `ArrowLeft` | Header, schedule → landing |
| Di chuyển | `Bus` | Info card phương tiện |
| Filter mode | `SlidersHorizontal` | Toggle location ↔ category |
| Đang diễn ra | `Radio` | Status indicator (kèm pulse animation) |

#### Khi nào custom, khi nào giữ nguyên

**Giữ nguyên Lucide:** tất cả functional icons. Chúng phục vụ chức năng, không cần dấu ấn thương hiệu.

**Không thay Lucide bằng custom icon** trừ khi icon Lucide gây nhầm lẫn nghiêm trọng với category/location icon trong cùng UI.

---

### 11.8 Anti-patterns

| Không làm | Lý do | Thay bằng |
|---|---|---|
| Stroke-width < 1.0px | Vô hình ở 24px mobile | Tối thiểu 1.0px, ưu tiên 1.3+ |
| Fill 100% (đặc) toàn icon | Mất "brush feel", thành icon flat | Fill 15-35% ở 1-3 vùng chính |
| Stroke-width đồng nhất toàn bộ | Mất biến thiên nét bút = generic | Ít nhất 2 mức khác nhau |
| Quá 10 path trong 1 icon | Rối ở 24px, tăng file size | Gộp hoặc bỏ path phụ |
| `stroke-linecap: butt` | Đầu nét vuông = cơ khí | Luôn `round` |
| Hardcode hex trong category SVG | Không đổi được theo theme | Dùng `currentColor` |
| Chi tiết decorative < 1px | Thành noise, không thêm giá trị | Bỏ hoặc phóng to lên |
| Fill color khác stroke color | Phá vỡ monochrome consistency | Fill = stroke = `currentColor` |
| Placeholder icon khi load | Thêm layout shift | Render `null`, để space collapse |
| Dùng raster (PNG/JPG) cho icon | Không scale, không đổi màu | SVG only |

---

### 11.9 Customization for Other Events

Khi tái sử dụng hệ thống cho lễ hội/sự kiện khác:

#### Giữ nguyên (không đổi)

- Grid 24×24 / 24×32
- Stroke rules (min 1.0px, hero 2.2-2.5px, linecap/linejoin round)
- Fill rules (15-35% opacity, 1-3 vùng)
- Location pin shell template
- Functional icons (Lucide)
- Variant system (full/dot cho pins)
- Checklist quy trình thêm icon

#### Thay đổi theo dự án

| Item | Ví dụ thay đổi |
|---|---|
| Hình tượng category | Lễ hội biển: sóng, cá, thuyền buồm, san hô, hải sản |
| Hình tượng location symbol | Venue mới: nhà hát, bãi biển, bến tàu, quảng trường |
| Số lượng category | 3-7 tùy quy mô sự kiện |
| Số lượng location | 3-10 tùy số venue |
| Biến thiên brush feel | Sự kiện hiện đại: giảm biến thiên (1.8→2.0), sự kiện truyền thống: tăng biến thiên (1.5→2.5) |
| Fill opacity | Sự kiện năng động: tăng lên 25-40%, sự kiện trang nhã: giữ 10-20% |

**Không đổi "brush feel" thành flat.** Nếu dự án cần phong cách flat hoàn toàn, dùng icon library sẵn (Lucide, Phosphor) thay vì custom — tiết kiệm effort hơn.