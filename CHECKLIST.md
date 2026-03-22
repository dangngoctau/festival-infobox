# Progress Checklist: Lễ hội Quán Thế Âm 2026

> Mark `[x]` when done. Fix all issues in a phase before moving to the next.

---

## PHASE 1: Project Scaffolding
- [ ] `npm run dev` starts without errors
- [ ] Browser shows warm cream background (`#FFF8F0`)
- [ ] Heading text in brown (`#6B4226`)
- [ ] 6 colored location boxes visible and match spec
- [ ] Be Vietnam Pro font loads
- [ ] No console errors

## PHASE 2: Data Layer
- [ ] App shows correct total event count (~41)
- [ ] Events per day: Day1 ~18, Day2 ~11, Day3 ~10, Day4 ~2
- [ ] All 6 locations with correct colors displayed
- [ ] Every event has valid `locationId` and `category`
- [ ] No duplicate event IDs

## PHASE 3: Hooks + Utils
- [ ] Day buttons show correct event counts per day
- [ ] Resize below/above 768px toggles isMobile
- [ ] Simulated time `2026-04-04T09:00`: correct ongoing/upcoming/ended split
- [ ] Simulated time `2026-04-04T22:00`: most events ended
- [ ] Location filter "chua" shows only Chùa events
- [ ] Location filter "all" shows all events
- [ ] deepLink URL format correct in console

## PHASE 4: Header + EmptyState
- [ ] Header shows name, tagline, dates with warm styling
- [ ] Header text large, readable, high contrast
- [ ] EmptyState shows countdown (~13 days from 2026-03-22)
- [ ] Countdown updates live (every minute)
- [ ] "Add to Calendar" downloads .ics with correct dates
- [ ] Date override → 2026-04-08: shows "ended" message
- [ ] Date override → 2026-04-05: EmptyState hidden, events shown
- [ ] Mobile: no horizontal scroll

## PHASE 5: DayFilter + LocationFilter
- [ ] 4 day buttons with correct labels (04/04 Khai mạc, etc.)
- [ ] Selected button highlighted with gold accent
- [ ] Location chips scroll horizontally on mobile
- [ ] Each chip has correct location color
- [ ] Combined filter (Day + Location) shows correct count
- [ ] No layout overflow

## PHASE 6: EventCard + EventList
- [ ] Day 1 shows ~18 cards
- [ ] Each card: time, title, colored location tag
- [ ] Simulated time grouping: ongoing/upcoming/ended sections correct
- [ ] "Đã kết thúc" section visually dimmed
- [ ] Cards readable at 375px width, large font
- [ ] Day + location filters update list correctly

## PHASE 7: EventDetail Modal
- [ ] Tap card opens modal with full details
- [ ] Modal shows: title, time, location, category, description
- [ ] "Chỉ đường" opens Google Maps with correct coordinates
- [ ] Close via X button works
- [ ] Close via backdrop tap works
- [ ] Body scroll locked behind modal
- [ ] Modal scrollable on mobile if content long
- [ ] Multiple open/close cycles work

## PHASE 8: Map + Popups
- [ ] Map renders with OpenStreetMap tiles (no gray areas)
- [ ] 6 pins at correct positions with correct colors
- [ ] Tap pin → popup with name + directions button
- [ ] Directions button opens correct Google Maps URL
- [ ] Chùa/Sân khấu/SVH clustered close; Hòa Quý separated
- [ ] No missing marker icon errors

## PHASE 9: TabNav (Mobile)
- [ ] Mobile (< 768px): bottom tab bar visible
- [ ] Default tab = "Chương trình"
- [ ] Tap "Bản đồ": map fills screen, timeline hidden
- [ ] Tap back: timeline returns
- [ ] Desktop (≥ 768px): tab bar hidden, both visible
- [ ] No content overlap with bottom bar

## PHASE 10: ResponsiveLayout (Desktop)
- [ ] Mobile: identical to Phase 9
- [ ] Tablet (768px): two columns, no tab bar
- [ ] Desktop (1024px+): 60/40 split
- [ ] Scroll timeline: map stays sticky
- [ ] Map tiles render fully (invalidateSize works)
- [ ] Resize transitions between breakpoints correctly
- [ ] `100dvh` map height handles mobile browser chrome

## PHASE 11: i18n
- [ ] Default language = Vietnamese
- [ ] Toggle to English: all UI strings switch
- [ ] Event titles/descriptions stay Vietnamese
- [ ] Category names translated
- [ ] Toggle back: reverts correctly
- [ ] Language persists on reload (localStorage)
- [ ] No missing translation warnings in console

## PHASE 12: Polish + Deploy
- [ ] `npm run build` succeeds
- [ ] `npx serve dist` works correctly
- [ ] Weather widget shows Da Nang temp (or hidden if API down)
- [ ] QR code renders correct URL
- [ ] Meta tags present (og:title, etc.)
- [ ] GitHub Pages deploy succeeds
- [ ] Full mobile walkthrough passes
- [ ] Full tablet walkthrough passes
- [ ] No console errors in production
- [ ] Lighthouse mobile performance > 90
