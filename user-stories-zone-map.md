# User Stories — Bản đồ Lễ hội (Flat Map + List)
# Lễ hội Quán Thế Âm 2026

**Concept:** Bản đồ Leaflet hiển thị tất cả 14 điểm cùng lúc (numbered pins) + danh sách cuộn phân nhóm 4 khu vực phía dưới. Một màn hình, mọi thông tin. Tap card → zoom đến pin. Toggle layer WC & Bãi xe. GPS "Tôi ở đây".

**Quy ước Effort:** XS (2-4h) · S (4-8h) · M (8-16h) · L (16-24h)

**Design System alignment:** Tuân thủ DESIGN_SYSTEM.md v1.0 + Section 11 (Icon System).

---

## Bối cảnh quyết định

### Tại sao không dùng Zone Clustering

Zone clustering (5 zone markers → tap drill-down → pin con) giải quyết chồng chéo pin nhưng tạo friction mới:
- Du khách phải tap 3 lần mới đến thông tin (zone → pin → detail)
- Không thấy tổng quan tất cả điểm cùng lúc
- Phức tạp cho người lớn tuổi
- State phức tạp (zone view ↔ detail view ↔ back)

### Tại sao chọn Flat Map + List

- **1 tap** đến mọi thông tin — cuộn list hoặc tap pin
- **1 màn hình cố định** — không chuyển view, không back
- Du khách thấy **tổng quan tất cả** ngay khi mở
- List bổ trợ cho pin chật trên map — du khách đọc list, nhìn map
- Effort thấp hơn 40% (12-22h vs 22-42h)

### Cấu trúc data

```
14 pin theo lộ trình Cổng → SVH → Chùa → Xa:
├── 🎭 Đường Sư Vạn Hạnh (7): ①Cổng chào → ②Miếu Huyền Trân → ③Chùa Thái Sơn → ④Nhiếp ảnh → ⑤Bài chòi → ⑥OCOP → ⑦Đá mỹ nghệ
├── 🛕 Khuôn viên Chùa (5): ⑧Lễ đài → ⑨Sân khấu chính → ⑩Ẩm thực chay → ⑪Tranh thiếu nhi → ⑫Đạo Tràng
├── 🚣 Sông Cổ Cò (1): ⑬Đua thuyền
└── 🪁 CV Đầm Sen (1): ⑭Diều nghệ thuật

Toggle Tiện ích (ẩn mặc định):
├── 🚻 Nhà vệ sinh × 3
└── 🅿️ Bãi xe × 3

GPS: 📍 Tôi ở đây
```

---

## Epic M — Bản đồ Lễ hội

### US-M.0: Data chuẩn bị
**Là** developer,
**tôi muốn** cấu trúc dữ liệu 14 điểm phân nhóm 4 khu vực + 6 tiện ích,
**để** bản đồ và danh sách render đúng, đồng bộ màu với tab Chương trình.

**Acceptance Criteria:**

**File `mapData.json`:**
- [ ] 4 nhóm, mỗi nhóm có: `id`, `name`, `icon`, `color` (theo colorMap), mảng `pins[]`
- [ ] Mỗi pin có: `routeNumber` (1→14), `name`, `time`, `note`, `lat`, `lng`, `locationColor`
- [ ] Nhóm "Đường SVH" gồm 7 pin: Cổng chào ① (giữ màu cam `#D4845A`) + 6 pin xanh dương ②–⑦
- [ ] Pin "Sân khấu chính" trong nhóm Chùa giữ màu đỏ `loc-san-khau` (đồng bộ cross-tab)
- [ ] Số thứ tự global 1→14 theo **lộ trình đi bộ từ cổng vào**: Cổng chào ① → dọc SVH Đông→Tây ②③④⑤⑥⑦ → rẽ vào Chùa ⑧⑨⑩⑪⑫ → điểm xa ⑬⑭
- [ ] Thứ tự trong list nhóm theo zone (SVH trước vì cổng vào, Chùa sau, điểm xa cuối) nhưng giữ nguyên số route

**File `utilities.json`:**
- [ ] WC: 3 vị trí, tất cả ghi **"Nhà vệ sinh"** (không mô tả vị trí — bản đồ đã hiển thị)
- [ ] Bãi xe: 3 vị trí — "Bãi xe Ban Tổ chức", "Bãi xe · Phía Bắc cổng chào", "Bãi xe · Gần đường Lê Văn Hiến"

**Effort:** XS (2-4h)
**Phụ thuộc:** locations.json (0.1), schedule.json (0.2), colorMap.js (0.4)

---

### US-M.0b: Rà soát mô tả địa điểm
**Là** du khách đọc thông tin trên app,
**tôi muốn** mô tả chính xác và phù hợp ngữ cảnh lễ hội tín ngưỡng,
**để** tôi tìm đúng nơi cần đến.

**Acceptance Criteria:**

**Rà soát chính xác (đối chiếu A Hoài / hiện trường):**
- [ ] Mỗi pin kiểm tra: tên, mô tả hướng/vị trí có đúng thực tế
- [ ] Lễ đài (#8): giữ trong nhóm Chùa, bổ sung note **"Phía Đông khuôn viên, hướng ra đường SVH"** — tránh du khách đi lạc vào sâu Chùa

**Nguyên tắc mô tả:**
- [ ] WC: tất cả ghi "Nhà vệ sinh", không mô tả thêm — bản đồ đã hiển thị vị trí
- [ ] Không dùng "trái/phải" — dùng Bắc/Nam/Đông/Tây hoặc landmark gần nhất
- [ ] Bãi xe: mô tả theo landmark ("Phía Bắc cổng chào", "Gần đường Lê Văn Hiến")

**Effort:** XS (2-4h)
**Phụ thuộc:** US-M.0, khảo sát hiện trường
**Ghi chú:** Hoàn thành trước release — mô tả sai = du khách đi lạc.

---

### US-M.1: Bản đồ + Danh sách (màn hình chính)
**Là** du khách tại lễ hội,
**tôi muốn** mở bản đồ và thấy ngay tất cả địa điểm vừa trên map vừa trong danh sách,
**để** tôi biết mọi thứ ở đâu mà không cần tap nhiều lần.

**Acceptance Criteria:**

**Layout — 1 màn hình cố định:**
- [ ] Mobile: bản đồ chiếm 45% trên, danh sách cuộn chiếm 55% dưới
- [ ] Tablet+ (≥768px): bản đồ 50% trái (sticky), danh sách 50% phải (scrollable) — theo design system Section 4
- [ ] Không có zone view / detail view — 1 state duy nhất

**Bản đồ Leaflet:**
- [ ] OpenStreetMap tile, center (15.9995, 108.2560), zoom 17
- [ ] Tile CSS filter warm tone: `saturate(0.7) sepia(0.15) brightness(1.02)`
- [ ] Zoom control: góc trên phải
- [ ] Attribution: icon ℹ️ nhỏ (16×16px) góc phải dưới, opacity 0.4, tap hiện "© OpenStreetMap contributors" — tuân thủ ODbL license
- [ ] `ResizeObserver` gọi `map.invalidateSize()` khi container thay đổi

**14 Numbered Pin Markers (đánh số theo lộ trình từ cổng vào):**
- [ ] DivIcon hình tròn 26×26px, nền = `locationColor`, chữ trắng bold = số thứ tự route (1→14)
- [ ] Thứ tự: Cổng ① → dọc SVH Đông→Tây ②③④⑤⑥⑦ → rẽ vào Chùa ⑧⑨⑩⑪⑫ → Sông Cổ Cò ⑬ → CV Đầm Sen ⑭
- [ ] Du khách nhìn bản đồ: số nhỏ ở cổng (Đông), số lớn dần vào sâu (Tây), ⑬⑭ là điểm xa
- [ ] Viền: 2px solid `#FFFDF8`
- [ ] Shadow: `0 2px 6px rgba(0,0,0,0.25)`
- [ ] Staggered glow animation: mỗi pin có vòng sáng nhẹ nhấp nháy (box-shadow 0→6px), duration random 2.5-4.5s, delay random 0-3s — giống hoa đăng lung linh lệch pha
- [ ] `prefers-reduced-motion: reduce` → tắt glow animation
- [ ] Zone labels mờ (opacity 0.5) hiển thị tên khu vực dưới cụm pin — chỉ cho nhóm ≥2 pin

**Danh sách cuộn (List Panel):**
- [ ] Phân nhóm 4 khu vực, **thứ tự theo lộ trình**: Đường SVH (①–⑦, vì cổng vào ở đây) → Khuôn viên Chùa (⑧–⑫) → Sông Cổ Cò (⑬) → CV Đầm Sen (⑭)
- [ ] Mỗi card gồm: số thứ tự (vòng tròn `locationColor`) + tên (bold 12px) + thời gian (10px, nâu đồng) + ghi chú (9px, nâu nhạt) + nút "🧭 Chỉ đường"
- [ ] Card có `border-left: 3px solid locationColor` — đồng bộ màu pin trên bản đồ
- [ ] Reuse pattern từ EventCard (task T4 roadmap gốc)

**Tương tác 2 chiều Map ↔ List:**
- [ ] Tap pin trên map → card tương ứng highlight (nền vàng nhạt #FFF0D6) + smooth scroll đến
- [ ] Tap card trong list → bản đồ `flyTo` zoom 18 + pin bounce (scale 1→1.5→1, 0.5s) + pin nổi lên (z-index offset 1000)
- [ ] Chỉ 1 card highlight tại 1 thời điểm
- [ ] Tap pin trên map không zoom — chỉ highlight card (giữ context tổng quan)

**Nút "Tổng quan":**
- [ ] Xuất hiện ở góc trên trái map khi zoom ≠ 17 (quá gần hoặc quá xa mức mặc định)
- [ ] Tap → `flyTo` center + zoom 17, clear highlight
- [ ] Style: pill, nền `warm-card`, chữ `warm-text`, font 11px, shadow nhẹ
- [ ] Ẩn khi zoom = 17

**Deep link chỉ đường:**
- [ ] Nút "🧭 Chỉ đường" trên mỗi card: `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}&travelmode=walking`
- [ ] iOS: detect platform, ưu tiên Apple Maps (dùng `deepLink.js`)
- [ ] Mở tab mới, không thay thế app
- [ ] `event.stopPropagation()` để không trigger card highlight

**Accessibility:**
- [ ] List panel có `role="list"`, mỗi card có `role="listitem"`
- [ ] Zone group header có `role="heading"`, `aria-level="3"`
- [ ] Mỗi pin marker: `role="button"`, `aria-label="{số}. {tên sự kiện}"`
- [ ] Tab navigation qua cards + pins, focus ring visible
- [ ] Nút "Chỉ đường": `aria-label="Chỉ đường đến {tên}"`
- [ ] Nút "Tổng quan": `aria-label="Xem tổng quan bản đồ"`

**Effort:** M (8-16h)
**Phụ thuộc:** US-M.0, deepLink.js (roadmap gốc)
**Reuse:** EventCard pattern (T4), deepLink.js (utils)

---

### US-M.2: Toggle Tiện ích (WC + Bãi xe)
**Là** du khách tại lễ hội,
**tôi muốn** tìm nhà vệ sinh hoặc bãi xe khi cần,
**để** tôi không mất thời gian hỏi đường.

**Acceptance Criteria:**

**Nút "⋯ Tiện ích":**
- [ ] Nằm trong thanh điều khiển nổi phía dưới bản đồ (nút duy nhất — GPS đã loại bỏ)
- [ ] Style: pill, nền `warm-card`, chữ `warm-text`, font 11px
- [ ] Tap → popover menu trượt lên (animation 0.2s ease-out)
- [ ] `aria-expanded="true/false"`, `aria-label="Tiện ích"`

**Popover menu:**
- [ ] 2 mục: "Nhà vệ sinh" (chấm hồng #E85D75 + checkbox) + "Bãi đỗ xe" (chấm cam #D4845A + checkbox)
- [ ] `role="menu"`, mỗi item `role="menuitemcheckbox"`, `aria-checked`
- [ ] Tap ngoài hoặc tap lại nút → đóng menu
- [ ] `prefers-reduced-motion` → menu hiện ngay, không animation

**Pin WC (3 vị trí):**
- [ ] DivIcon tròn 28×28px, icon 🚻, viền hồng (#E85D75) 2px, nền `warm-card`
- [ ] Tọa độ: (15.997854, 108.254437), (15.999630, 108.254682), (15.999393, 108.257679)
- [ ] Tap → Leaflet popup: "Nhà vệ sinh" + nút "🧭 Chỉ đường"
- [ ] Hiện trên mọi zoom level (LayerGroup independent)
- [ ] Mặc định: ẩn

**Pin Bãi xe (3 vị trí):**
- [ ] DivIcon tròn 28×28px, icon 🅿️, viền cam (#D4845A) 2px, nền `warm-card`
- [ ] Tọa độ: BTC (15.998339, 108.254221), DK1 (16.001015, 108.259383), DK2 (16.000528, 108.259938)
- [ ] Tap → popup: tên + nút "🧭 Chỉ đường"
- [ ] Mặc định: ẩn

**Effort:** S (4-8h)
**Phụ thuộc:** US-M.1

---

### ~~US-M.3: GPS — "Tôi ở đây"~~ → **Loại bỏ**

**Lý do:** Khu vực lễ hội chỉ trong bán kính ~300m. Du khách đứng bất kỳ đâu trong lễ hội đều nhìn thấy các điểm xung quanh. Numbered pins + danh sách + nút "Chỉ đường" (deep link Google Maps) đã đủ cho wayfinding. GPS thêm complexity (permission prompt, error handling, 3 trạng thái khoảng cách) mà giá trị thực tế thấp cho khu vực nhỏ.

**Nếu cần bổ sung sau:** Có thể thêm lại như story riêng trong sprint tương lai nếu du khách phản hồi cần.

---

## Tổng hợp Effort

| Story | Effort | Phụ thuộc |
|---|---|---|
| US-M.0 Data chuẩn bị | XS (2-4h) | colorMap, locations, schedule |
| US-M.0b Rà soát mô tả | XS (2-4h) | US-M.0, hiện trường |
| US-M.1 Bản đồ + Danh sách | M (8-16h) | US-M.0, deepLink.js |
| US-M.2 Toggle Tiện ích | S (4-8h) | US-M.1 |
| ~~US-M.3 GPS~~ | ~~XS (2-4h)~~ | Loại bỏ — khu vực nhỏ |
| **Tổng** | | **~16-32 giờ** |

---

## Thứ tự triển khai

```
Sprint 1 (3-4 ngày): Core
├── US-M.0 Data chuẩn bị ★ unblock tất cả
├── US-M.0b Rà soát mô tả (song song)
└── US-M.1 Bản đồ + Danh sách

Sprint 2 (1-2 ngày): Features + QA
├── US-M.2 Toggle Tiện ích (WC + Bãi xe)
└── QA: mobile 360px, cross-tab sync, accessibility
```

---

## Sơ đồ phụ thuộc

```
colorMap.js (0.4) ──────┐
locations.json (0.1) ────┤
schedule.json (0.2) ─────┤
                         └── US-M.0 Data ──── US-M.1 Bản đồ + Danh sách
                                │                      │
                         US-M.0b Rà soát            US-M.2
                         (song song)              Tiện ích
                                                     │
                                               deepLink.js
```

---

## So sánh với phiên bản Zone Clustering

| Tiêu chí | Zone Clustering (v1) | **Flat Map + List (v2)** |
|---|---|---|
| Stories | 6 stories + 2 sub | **3 stories + 1 sub** |
| Effort | 22-42 giờ | **16-32 giờ** |
| Components | 10 | **5** |
| State complexity | useZones + drill-down + view toggle | **Chỉ highlight index** |
| Tap đến thông tin | 3 tap | **1 tap** |
| Tổng quan tất cả điểm | Tap 5 zone | **Cuộn list** |
| Chồng chéo pin | Không | **Zoom 18 khi tap card** |
| Người lớn tuổi | 3 view phức tạp | **1 màn hình cố định** |
| Animation | Zone pulse | **Staggered pin glow** |

---

## Bổ sung Design System

### Section 5.5 — Map Markers: Numbered Pin

```
- Type: DivIcon, 26×26px circle
- Background: locationColor
- Content: route number 1→14 (11px, bold, white)
- Numbering: theo lộ trình đi bộ từ cổng vào (Đông→Tây→xa)
  Cổng①→SVH②③④⑤⑥⑦→Chùa⑧⑨⑩⑪⑫→Sông⑬→CV⑭
- Border: 2px solid cream-light (#FFFDF8)
- Shadow: 0 2px 6px rgba(0,0,0,0.25)
- Glow: staggered box-shadow animation, 2.5-4.5s random duration, 0-3s random delay
- Bounce on highlight: scale 1→1.5→1, 0.5s
- Z-index offset 1000 when highlighted
- Reduced motion: no glow, no bounce
```

### Section 5.9 — Utility Toggle Menu

```
Trigger: "⋯ Tiện ích" pill button
Popover: warm-card bg, 12px rounded, shadow
Items: checkbox toggle + colored dot + label
ARIA: role="menu", menuitemcheckbox, aria-checked
Dismiss: tap outside or tap trigger
Animation: slide-up 0.2s ease-out (reduced motion: none)
```

### Section 5.10 — Map + List Layout

```
Mobile: map 45% top + list 55% bottom (fixed, no view switching)
Tablet+: map 50% left sticky + list 50% right scrollable
List zone order: SVH (cổng vào) → Chùa → Sông Cổ Cò → CV Đầm Sen
List groups: sticky zone headers with icon + name + count
Pin numbering: theo lộ trình đi bộ, không theo zone
Map ↔ List sync: tap pin → highlight card, tap card → flyTo zoom 18 + bounce pin
```

### Section 6 — Animation: Đăng ký mới

| Name | Duration | Easing | Effect | Usage |
|---|---|---|---|---|
| `pin-glow` | 2.5-4.5s (random) | ease-in-out | box-shadow 0→6px, staggered | Pin idle, giống hoa đăng |
| `pin-bounce` | 0.5s | ease | scale 1→1.5→0.9→1 | Pin khi highlight |
| `menu-slide-up` | 0.2s | ease-out | translateY 6→0, opacity 0→1 | Utility menu |

Reduced motion: tắt `pin-glow`, `pin-bounce`. Giữ `menu-slide-up` nhưng không animation.

### Section 9 — Hooks

**`useMapHighlight()`**
```
State: { activeIndex: number | null }
Returns: { activeIndex, highlightFromMap(idx), highlightFromList(idx), clearHighlight }
Logic:
- highlightFromMap: set activeIndex, scroll card vào view
- highlightFromList: set activeIndex, flyTo zoom 18 + bounce pin + z-index
- clearHighlight: reset activeIndex, z-index tất cả pin
```

**`useUtilityLayers()`**
```
State: { wcVisible: boolean, parkingVisible: boolean, menuOpen: boolean }
Returns: { ...state, toggleWC, toggleParking, toggleMenu, closeMenu }
```

### Kiến trúc component

```
src/components/map/
├── FestivalMap.jsx          (Leaflet container, warm tile, split layout)
├── NumberedPin.jsx          (DivIcon 26px, glow, bounce)
├── PinListPanel.jsx         (Scrollable list, zone group headers)
├── PinCard.jsx              (Card with number, reuse EventCard pattern)
└── UtilityMenuButton.jsx    (⋯ Tiện ích trigger + popover + WC/Parking pins)

src/hooks/
├── useMapHighlight.js       (pin ↔ card sync)
└── useUtilityLayers.js      (WC/Parking/menu toggle)
```

---

## Acceptance Criteria chung

**Responsive (Section 4):**
- [ ] Mobile (<768px): map 45% top, list 55% bottom
- [ ] Tablet+ (≥768px): map 50% left sticky, list 50% right

**Accessibility (Section 8):**
- [ ] Semantic HTML: `<section>`, `<button>`, `role="list"`, `role="menu"`
- [ ] Tất cả icon-only elements có `aria-label`
- [ ] `Tab` navigate, `Enter`/`Space` activate, `Escape` close menu
- [ ] Color contrast ≥ WCAG AA
- [ ] Touch target ≥ 48×48px
- [ ] `prefers-reduced-motion` respected

**Performance:**
- [ ] Tile cache qua Service Worker
- [ ] 14 pins render < 100ms
- [ ] Map ↔ List sync < 50ms
- [ ] FlyTo animation < 400ms

**Tương thích:**
- [ ] Deep link: Google Maps (Android) + Apple Maps (iOS)
- [ ] GPS fail → graceful degrade, không block UI
- [ ] Tile fail → placeholder "Đang tải bản đồ...", retry 3 lần

---

*Cập nhật: 28/03/2026*
*Validated: leaflet-flat-map interactive prototype*
*Alignment: DESIGN_SYSTEM.md v1.0 + Section 11 Icon System*
