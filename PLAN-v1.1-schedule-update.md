# Tạo mới dữ liệu từ Chương trình chính thức #57/CTr-BTC (23/03/2026)

## Context

Văn bản chính thức số 57/CTr-BTC ngày 23/03/2026 do Phó Chủ tịch UBND TP Đà Nẵng ký. Tạo mới hoàn toàn `schedule.json` từ PDF thay vì sửa file cũ. Đồng thời tách event d1-12 (2 lễ song song tại 2 địa điểm khác nhau) và thêm location mới "Miếu thờ Huyền Trân".

---

## Tổng quan thay đổi

| Thay đổi | Chi tiết |
|---|---|
| schedule.json | Tạo mới 41 events từ PDF (cũ: 40, tách d1-12 thành 2) |
| locations.json | Thêm location "mieu-huyen-tran" (7 locations thay vì 6) |
| colorMap.js | Thêm color cho location mới |
| LocationPin.jsx | Thêm SVG symbol cho location mới |
| vi.json | Cập nhật 2 teaser strings |
| en.json | Cập nhật 2 teaser strings |
| festivalConfig.js | Version bump 1.0.0 → 1.1.0 |
| index.css | Thêm Tailwind token cho location mới |

---

## Bước 1: Giữ file cũ

Đổi tên `src/data/schedule.json` → `src/data/schedule.v1.json`

## Bước 2: Thêm location mới — Miếu thờ Huyền Trân

### `src/data/locations.json` — thêm entry thứ 7:

```json
{
  "id": "mieu-huyen-tran",
  "name": "Miếu thờ Huyền Trân công chúa",
  "shortName": "Miếu Huyền Trân",
  "nameEn": "Princess Huyen Tran Shrine",
  "shortNameEn": "Huyen Tran Shrine",
  "address": "Khuôn viên Chùa Quán Thế Âm, Hòa Hải, Ngũ Hành Sơn",
  "lat": 15.9977,
  "lng": 108.2638,
  "color": "#9B5E6E",
  "icon": "🏛️",
  "description": "Miếu thờ Huyền Trân Công chúa — nơi tổ chức lễ dâng hương tưởng niệm"
}
```

Color: warm rose `#9B5E6E` — phân biệt rõ với gold Chùa (#B8860B), phù hợp tone ấm.

### `src/data/colorMap.js` — thêm 1 dòng:

```js
'mieu-huyen-tran': '#9B5E6E',
```

### `src/components/icons/LocationPin.jsx` — thêm SVG symbol:

Vẽ biểu tượng miếu/shrine cho `'mieu-huyen-tran'` trong object `symbols`, theo DESIGN_SYSTEM.md:

**Quy tắc bắt buộc (Section 11):**
- Symbol nằm trong vùng tròn **center (12, 10.5), radius 7** của viewbox 24×32
- Stroke color: `#FFFDF8` (CREAM constant đã có sẵn)
- Stroke-width: 1.2–2.2px, **ít nhất 2 mức** khác nhau (brush feel)
- `stroke-linecap="round"`, `stroke-linejoin="round"` (đã có trong `<g>` wrapper)
- Fill 15–30% opacity ở 1–2 vùng chính (`fill={CREAM} fillOpacity="0.15"`)
- Tối đa 8–10 paths
- Hình tượng: shrine/miếu nhỏ — mái cong đặc trưng + cửa vòm, compact hơn icon chùa

**Template:**
```jsx
'mieu-huyen-tran': () => (
  <g stroke={CREAM} strokeLinecap="round" fill="none">
    {/* Hero stroke 2.0-2.2px — mái cong đặc trưng */}
    {/* Structure strokes 1.5-1.8px — thân miếu, cửa */}
    {/* Detail strokes 1.2-1.3px — chi tiết phụ */}
    {/* Fill: 1 vùng fill={CREAM} fillOpacity="0.15" */}
  </g>
),
```

**Checklist (từ DESIGN_SYSTEM.md Section 11.5):**
- [ ] Symbol stroke: `#FFFDF8`, width 1.2–2.2px
- [ ] Nằm trong vùng tròn (12, 10.5) r=7
- [ ] Màu pin `#9B5E6E` đã thêm vào `colorMap.js`
- [ ] Test trên map — pin mới không chồng pin cũ ở zoom mặc định

### `src/index.css` — thêm Tailwind token:

```css
--color-loc-mieu-huyen-tran: #9B5E6E;
```

## Bước 3: Tạo mới `src/data/schedule.json` — 41 events (bilingual)

Tách d1-12 cũ thành:
- **d1-12** — Lễ dâng hương tưởng niệm Huyền Trân công chúa → `locationId: "mieu-huyen-tran"`
- **d1-13** — Lễ tế Xuân cầu Quốc thái Dân an → `locationId: "san-khau"`

Renumber events ngày 1 sau d1-12:
- d1-13 cũ (Khai mạc Lễ hội) → **d1-14**
- d1-14 cũ (Diễu hành) → **d1-15**
- d1-15 cũ (Múa rối) → **d1-16**
- d1-16 cũ (Nghệ thuật) → **d1-17**
- d1-17 cũ (Hoa đăng) → **d1-18**

Ngày 2, 3, 4: IDs giữ nguyên (d2-01...d2-11, d3-01...d3-10, d4-01...d4-02).

**Tổng: 18 + 11 + 10 + 2 = 41 events**

### Schema mỗi event (mở rộng bilingual):

```json
{
  "id": "dX-XX",
  "title": "...",              // Vietnamese — từ PDF
  "titleEn": "...",            // ★ MỚI — English translation
  "date": "2026-04-0X",
  "lunarDate": "XX/02 Âm lịch",
  "dayIndex": 0-3,
  "startTime": "HH:MM",
  "endTime": "HH:MM" | null,
  "locationId": "...",
  "category": "...",
  "leadOrg": "...",            // Vietnamese — từ PDF
  "leadOrgEn": "...",          // ★ MỚI — English org name
  "partnerOrgs": [...],        // Vietnamese — từ PDF
  "partnerOrgsEn": [...],      // ★ MỚI — English partner names
  "image": null,
  "isFeatured": true/false,
  "descriptionShort": "...",   // Vietnamese (featured events only)
  "descriptionShortEn": "...", // ★ MỚI (featured events only)
  "description": "...",        // Vietnamese
  "descriptionEn": "...",      // ★ MỚI — English description
  "cat": "..."
}
```

### English Translation Guidelines (quan trọng — lễ hội di sản văn hóa quốc gia)

**Buddhist terms** — dùng thuật ngữ Phật giáo tiếng Anh chuẩn:
- Lễ vía → Commemoration Ceremony / Celebration Day
- Quán đảnh → Abhisheka (Consecration) Ceremony
- Bồ tát Quán Thế Âm → Avalokiteshvara Bodhisattva
- Pháp đàn Đại bi → Great Compassion Dharma Assembly
- Thiền tọa → Meditation / Sitting Meditation
- Thuyết pháp → Dharma Talk
- Hoa đăng Thiền hành → Lantern Ceremony & Walking Meditation
- Khai kinh → Sutra Opening Ceremony
- Thượng phan/kỳ/phướn → Banner & Flag Raising

**Cultural terms:**
- Lân Sư Rồng → Lion and Dragon Dance
- Bài chòi → Bài Chòi (UNESCO-recognized folk art, keep Vietnamese + explain)
- Cà kheo → Stilt Walking
- Nhảy sạp → Bamboo Dance
- Huyền Trân Công chúa → Princess Huyền Trân (keep Vietnamese name)
- Đua thuyền → Traditional Boat Race
- Hoa đăng → Floating Lanterns
- Lửa trại → Bonfire / Campfire
- Diều nghệ thuật → Artistic Kite Flying
- Xe hoa → Floral Float Parade

**Government organizations** — dùng tên chính thức tiếng Anh:
- Sở Văn hóa, Thể thao và Du lịch → Department of Culture, Sports and Tourism
- UBND phường Ngũ Hành Sơn → Ngu Hanh Son Ward People's Committee
- Ban Trị sự Giáo hội Phật giáo VN TP → Da Nang Buddhist Sangha Executive Board
- Liên hiệp các Hội Văn học - Nghệ thuật → Union of Literature and Arts Associations
- Sở Công Thương → Department of Industry and Trade
- Ủy ban Hòa bình → Peace Committee
- Chùa Quán Thế Âm → Quan The Am Pagoda

**Nguyên tắc:**
- Giữ nguyên tên riêng tiếng Việt cho địa danh, nhân vật lịch sử (Huyền Trân, Ngũ Hành Sơn, Cổ Cò)
- Thuật ngữ Phật giáo: dùng Pali/Sanskrit phổ biến quốc tế khi có (Abhisheka, Dharma), kèm giải thích ngắn trong description
- Tên tổ chức: dùng bản dịch chính thức nếu có, fallback sang dịch nghĩa

### Danh sách đầy đủ 41 events:

**Ngày 1 — 04/04/2026 — 18 events**

| ID | Giờ | Title | Loc | Cat | Lead Org | isFeatured |
|---|---|---|---|---|---|---|
| d1-01 | 07:00 | Lễ khai kinh Thượng phan, Thượng kỳ, Thượng phướn | chua | ceremony | Chùa Quán Thế Âm | false |
| d1-02 | 08:00 | Khai mạc hội (trình diễn nghệ thuật Lân Sư Rồng và các hoạt động văn hóa, thể thao dân gian) | san-khau | art | Sở Văn hóa, Thể thao và Du lịch | false |
| d1-03 | 09:00 | Khai mạc Cuộc thi điêu khắc đá Non Nước 2026 + Khai trương Trưng bày và biểu diễn chế tác nghệ thuật đá mỹ nghệ Non Nước | su-van-hanh | exhibition | UBND phường Ngũ Hành Sơn | false |
| d1-04 | 09:30 | Khai mạc triển lãm nhiếp ảnh chủ đề "Lễ hội Quán Thế Âm - Biểu tượng của lòng từ trong nghệ thuật" | su-van-hanh | exhibition | Liên hiệp các Hội Văn học - Nghệ thuật thành phố | false |
| d1-05 | 09:30 | Khai mạc không gian ký họa màu nước và viết thư pháp chủ đề "Tâm và Đức" | su-van-hanh | exhibition | Liên hiệp các Hội Văn học - Nghệ thuật thành phố | false |
| d1-06 | 10:00 | Khai trương gian hàng OCOP | su-van-hanh | culinary | Sở Công Thương | false |
| d1-07 | 10:00–17:30 | Trình diễn diều nghệ thuật | hoa-quy | folk | Sở Văn hóa, Thể thao và Du lịch | false |
| d1-08 | 14:30 | Khai mạc triển lãm mỹ thuật chủ đề "Quan Âm mùa lễ hội" | chua | exhibition | Liên hiệp các Hội Văn học - Nghệ thuật thành phố | false |
| d1-09 | 15:00–21:00 | Biểu diễn nhảy sạp, gian hàng trò chơi dân gian | su-van-hanh | folk | UBND phường Ngũ Hành Sơn | false |
| d1-10 | 15:00 | Trưng bày phục vụ tài nguyên thông tin, tổ chức cuộc thi Review sách cho học sinh THPT | chua | exhibition | Sở Văn hóa, Thể thao và Du lịch | false |
| d1-11 | 15:30 | Khai mạc Cuộc thi "Tinh hoa ẩm thực chay Đà Nẵng" | chua | culinary | Hiệp hội Văn hóa ẩm thực thành phố | false |
| **d1-12** | 16:00–17:00 | **Lễ dâng hương tưởng niệm Huyền Trân công chúa** | **mieu-huyen-tran** | ceremony | UBND phường Ngũ Hành Sơn | false |
| **d1-13** | 16:00–17:00 | **Lễ tế Xuân cầu Quốc thái Dân an** | **san-khau** | ceremony | UBND phường Ngũ Hành Sơn | false |
| d1-14 | 17:30 | Khai mạc Lễ hội | san-khau | ceremony | UBND phường Ngũ Hành Sơn | **true** |
| d1-15 | 18:00–20:00 | Diễu hành xe hoa chào mừng Lễ hội | dieu-hanh | art | Ban Trị sự Giáo hội Phật giáo Việt Nam thành phố | **true** |
| d1-16 | 18:30 | Khai mạc Chương trình biểu diễn múa rối cạn và múa rối nước | su-van-hanh | art | UBND phường Ngũ Hành Sơn | false |
| d1-17 | 19:30 | Chương trình nghệ thuật chào mừng Lễ hội | san-khau | art | Sở Văn hóa, Thể thao và Du lịch | false |
| d1-18 | 20:00 | Hoa đăng Thiền hành | chua | ceremony | Chùa Quán Thế Âm | **true** |

**Ngày 2 — 05/04/2026 — 11 events** (IDs d2-01..d2-11 giữ nguyên)

| ID | Giờ | Title | Loc | Cat | Lead Org | isFeatured |
|---|---|---|---|---|---|---|
| d2-01 | 07:30 | Hội Cờ làng + Hội thi đi cà kheo hỗn hợp | su-van-hanh | folk | Sở Văn hóa, Thể thao và Du lịch | false |
| d2-02 | 08:30 | Triển lãm tranh ảnh thiếu nhi tại Hội thi "Nét đẹp Ngũ Hành Sơn" | chua | exhibition | UBND phường Ngũ Hành Sơn | false |
| d2-03 | 10:00–17:30 | Trình diễn diều nghệ thuật | hoa-quy | folk | Sở Văn hóa, Thể thao và Du lịch | false |
| d2-04 | 14:00 | Pháp đàn Đại bi, Thuyết pháp | san-khau | dharma | Chùa Quán Thế Âm | false |
| d2-05 | 16:00–21:00 | Biểu diễn nghệ thuật dân gian: Giao lưu bài chòi, dân ca Khu 5 | su-van-hanh | folk | Sở Văn hóa, Thể thao và Du lịch | false |
| d2-06 | 18:00–20:00 | Diễu hành xe hoa chào mừng Lễ hội | dieu-hanh | art | Ban Trị sự Giáo hội Phật giáo Việt Nam thành phố | false |
| d2-07 | 18:30 | Thuyết giảng chủ đề Lễ hội | san-khau | dharma | Hòa thượng Thích Từ Nghiêm | false |
| d2-08 | 19:00 | Thực hiện Lễ Quán đảnh Quán Âm | chua | ceremony | Chùa Quán Thế Âm | **true** |
| d2-09 | 19:30 | Lễ cắt băng khánh thành chú nguyện: Trụ Kinh chuyển Pháp Luân | chua | ceremony | Chùa Quán Thế Âm | false |
| d2-10 | 20:00 | Chương trình nghệ thuật chào mừng Lễ hội | san-khau | art | Chùa Quán Thế Âm | false |
| d2-11 | 20:30 | Hoa đăng, lửa trại | chua | ceremony | Chùa Quán Thế Âm | false |

**Ngày 3 — 06/04/2026 — 10 events** (IDs d3-01..d3-10 giữ nguyên)

| ID | Giờ | Title | Loc | Cat | Lead Org | isFeatured |
|---|---|---|---|---|---|---|
| d3-01 | 07:00–09:00 | Lễ vía Đức Bồ tát Quán Thế Âm | chua | ceremony | UBND phường Ngũ Hành Sơn | **true** |
| d3-02 | 09:00 | Thực hiện Lễ Quán đảnh Quán Âm | chua | ceremony | Chùa Quán Thế Âm | false |
| d3-03 | 09:30 | Hội Đua thuyền truyền thống (hóa trang đoạt cờ lệnh rước Huyền Trân Công chúa trên sông Cổ Cò) | song-co-co | folk | Sở Văn hóa, Thể thao và Du lịch | **true** |
| d3-04 | 10:00–17:30 | Trình diễn diều nghệ thuật | hoa-quy | folk | Sở Văn hóa, Thể thao và Du lịch | false |
| d3-05 | 14:00–15:00 | Pháp đàn đại bi, thiền tọa, thuyết pháp | san-khau | dharma | Chùa Quán Thế Âm | false |
| d3-06 | 16:00–21:00 | Biểu diễn nghệ thuật dân gian: Giao lưu bài chòi, dân ca Khu 5 | su-van-hanh | folk | Sở Văn hóa, Thể thao và Du lịch | false |
| d3-07 | 18:00–20:00 | Diễu hành xe hoa chào mừng Lễ hội | dieu-hanh | art | Ban Trị sự Giáo hội Phật giáo Việt Nam thành phố | false |
| d3-08 | 19:00 | Chương trình nghệ thuật | san-khau | art | Liên hiệp các Hội Văn học - Nghệ thuật thành phố | false |
| d3-09 | 20:00 | Hoa đăng Thiền hành | chua | ceremony | Chùa Quán Thế Âm | false |
| d3-10 | 21:00 | Lửa trại truyền thống | chua | folk | Chùa Quán Thế Âm | false |

**Ngày 4 — 07/04/2026 — 2 events** (giữ nguyên)

| ID | Giờ | Title | Loc | Cat | Lead Org | isFeatured |
|---|---|---|---|---|---|---|
| d4-01 | 07:00–08:30 | Chương trình đi bộ vì hòa bình năm 2026 | su-van-hanh | folk | Ủy ban Hòa bình thành phố | **true** |
| d4-02 | 09:30 | Lễ Bế mạc | san-khau | ceremony | UBND phường Ngũ Hành Sơn | **true** |

## Bước 4: Thêm utility + cập nhật 4 components cho bilingual rendering

### `src/utils/i18nEvent.js` — **Tạo mới**

```js
/**
 * Resolve event field by language.
 * Falls back to Vietnamese if English field is missing.
 */
export function getEventText(event, field, language) {
  if (language === 'en') {
    const enField = `${field}En`
    return event[enField] || event[field]
  }
  return event[field]
}
```

### Components cần cập nhật (4 files):

**`src/components/timeline/EventCard.jsx`** — Lines 88, 92-95:
- Import `getEventText` + `useTranslation`
- `event.title` → `getEventText(event, 'title', i18n.language)`
- `event.descriptionShort` → `getEventText(event, 'descriptionShort', i18n.language)`

**`src/components/timeline/EventDetail.jsx`** — Lines 83, 98-101, 104-108, 111-115:
- `event.title` → `getEventText(event, 'title', i18n.language)`
- `event.description` → `getEventText(event, 'description', i18n.language)`
- `event.leadOrg` → `getEventText(event, 'leadOrg', i18n.language)`
- `event.partnerOrgs` → `language === 'en' && event.partnerOrgsEn ? event.partnerOrgsEn : event.partnerOrgs`

**`src/components/landing/FeaturedEvents.jsx`** — Line 35, 45-48:
- `event.title` → `getEventText(event, 'title', i18n.language)`
- `event.descriptionShort` → `getEventText(event, 'descriptionShort', i18n.language)`

**`src/components/landing/CategoryHighlights.jsx`** — Line 74:
- `evt.title` → `getEventText(evt, 'title', i18n.language)`

### `src/data/locations.json` — thêm trường English cho 7 locations:

Thêm `nameEn` và `shortNameEn` cho mỗi location (hiển thị trong FilterBar, EventCard tag, LocationPopup):
- "Khuôn viên Chùa Quán Thế Âm" → "Quan The Am Pagoda Grounds"
- "Sân khấu chính" → "Main Stage"
- "Đường Sư Vạn Hạnh" → "Su Van Hanh Street"
- "Công viên Hòa Quý – Đồng Nò" → "Hoa Quy – Dong No Park"
- "Sông Cổ Cò" → "Co Co River"
- "Các tuyến đường chính TP" → "City Main Routes"
- "Miếu thờ Huyền Trân công chúa" → "Princess Huyen Tran Shrine"

Components hiển thị location name (EventCard, EventDetail, FilterBar, LocationPopup, FestivalMap) cần dùng `nameEn`/`shortNameEn` khi language = 'en'.

## Bước 5: Cập nhật `categories.json` — featuredEvents IDs

Do day 1 renumbered, cần cập nhật featuredEvents:
- `performing-arts`: `["d1-02", "d1-17"]` → `["d1-02", "d1-18"]` (Hoa đăng now d1-18)
- `folk-culture`: `["d3-03", "d1-09"]` → giữ nguyên (d1-09 không đổi)
- Các group khác: IDs không bị ảnh hưởng bởi renumber

## Bước 6: Cập nhật i18n teasers

**vi.json:**
- `teaserPerformingArts`: "✦ Ngày 1: Múa rối cạn và múa rối nước" → "✦ Ngày 1: Khai mạc biểu diễn múa rối cạn và múa rối nước"
- `teaserCuisine`: "✦ Ngày 1: Tinh hoa ẩm thực chay Đà Nẵng" → "✦ Ngày 1: Cuộc thi Tinh hoa ẩm thực chay Đà Nẵng"

**en.json:**
- `teaserPerformingArts`: "✦ Day 1: Puppet show — rod puppets & water puppets" → "✦ Day 1: Opening of puppet show — rod & water puppets"
- `teaserCuisine`: "✦ Day 1: Da Nang's finest vegetarian cuisine showcase" → "✦ Day 1: Da Nang vegetarian cuisine competition"

## Bước 7: Bump version

`src/data/festivalConfig.js`: `version: '1.0.0'` → `version: '1.1.0'`

## Bước 8: Kiểm tra

1. `npm run build` — JSON hợp lệ, app compile
2. Dev mode kiểm tra:
   - Ngày 1: **18** events (was 17)
   - Ngày 2-4: 11/10/2 (unchanged)
   - d1-12 hiện "Miếu Huyền Trân" tag + warm rose color
   - d1-13 hiện "Sân khấu chính" tag + red color
   - Bản đồ: 7 pins thay vì 6
   - Landing page teasers + CategoryHighlights
   - Filter mode location: chip mới "Miếu Huyền Trân"
   - Chuyển EN: event titles, descriptions, orgs hiển thị tiếng Anh
   - Chuyển VI: hiển thị tiếng Việt gốc

---

## Files tổng kết

| # | File | Hành động |
|---|---|---|
| 1 | `src/data/schedule.json` → `schedule.v1.json` | Đổi tên giữ lại |
| 2 | `src/data/schedule.json` | **Tạo mới** — 41 events, bilingual (VI + EN) |
| 3 | `src/data/locations.json` | **Thêm** mieu-huyen-tran + `nameEn`/`shortNameEn` cho 7 locs |
| 4 | `src/data/colorMap.js` | **Thêm** 1 dòng color |
| 5 | `src/data/categories.json` | **Sửa** featuredEvents performing-arts |
| 6 | `src/components/icons/LocationPin.jsx` | **Thêm** SVG symbol mieu-huyen-tran |
| 7 | `src/index.css` | **Thêm** 1 Tailwind token |
| 8 | `src/utils/i18nEvent.js` | **Tạo mới** — getEventText() helper |
| 9 | `src/components/timeline/EventCard.jsx` | **Sửa** — bilingual title, descriptionShort |
| 10 | `src/components/timeline/EventDetail.jsx` | **Sửa** — bilingual title, desc, orgs |
| 11 | `src/components/landing/FeaturedEvents.jsx` | **Sửa** — bilingual title, descriptionShort |
| 12 | `src/components/landing/CategoryHighlights.jsx` | **Sửa** — bilingual title |
| 13 | `src/i18n/vi.json` | **Sửa** 2 teasers |
| 14 | `src/i18n/en.json` | **Sửa** 2 teasers |
| 15 | `src/data/festivalConfig.js` | **Sửa** version |

**+ Components hiển thị location name** (FilterBar, LocationPopup, FestivalMap) cần cập nhật dùng `nameEn`/`shortNameEn` khi EN — xác định chính xác khi implement.
