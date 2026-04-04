# Expand Locations from Organizer's Site Map

## Context

The `locations-list.md` contains 20 verified GPS points from the official organizer's site map (source: "A Hoai" + Google/Apple Maps). The current `locations.json` has 7 grouped locations with estimated GPS (up to 1.4km off). Expanding to all individual points for accurate wayfinding.

**Scope:** Replace 7 grouped locations with 20 individual points. Reassign all 41 events. Update all dependent files.

---

## Current State — 7 locations

| id | name | shortName | type | lat | lng |
|---|---|---|---|---|---|
| `chua` | Khuôn viên Chùa Quán Thế Âm | Khuôn viên Chùa | venue | 15.9975 | 108.2635 |
| `san-khau` | Sân khấu chính | Sân khấu chính | venue | 15.9972 | 108.2631 |
| `su-van-hanh` | Đường Sư Vạn Hạnh | Đ. Sư Vạn Hạnh | venue | 15.9965 | 108.2618 |
| `hoa-quy` | Công viên Hòa Quý – Đồng Nò | CV Hòa Quý | venue | 15.985 | 108.255 |
| `song-co-co` | Sông Cổ Cò | Sông Cổ Cò | venue | 15.996 | 108.26 |
| `dieu-hanh` | Các tuyến đường chính TP | Diễu hành xe hoa | venue | 15.997 | 108.25 |
| `mieu-huyen-tran` | Miếu thờ Huyền Trân công chúa | Miếu Huyền Trân | venue | 15.9977 | 108.2638 |

---

## Target State — 20 locations

### Khuôn viên Chùa (5 points)

| # | id | type | name | shortName | nameEn | shortNameEn | icon | color | primary | lat | lng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| #8 | `le-dai` | venue | Lễ đài Chùa Quán Thế Âm | Lễ đài | Ceremonial Platform | Ceremonial Platform | 🏛️ | #8B2500 | true | 15.999184 | 108.255525 |
| #9 | `chua` | venue | Chùa Quán Thế Âm — Sân khấu chính | Chùa QTA | Quan The Am Pagoda — Main Stage | Pagoda Main Stage | 🛕 | #B8860B | true | 15.998845 | 108.254554 |
| #10 | `trienlam-thieunhi` | venue | Triển lãm tranh thiếu nhi | TL Tranh thiếu nhi | Children's Art Exhibition | Children's Art | 🎨 | #C06080 | false | 15.998534 | 108.254366 |
| #11 | `dao-trang` | landmark | Trại Đạo Tràng — Thuyền Trà | Đạo Tràng | Dharma Camp — Tea Boat | Dharma Camp | 🍵 | #8B6914 | false | 15.998778 | 108.254151 |
| #12 | `bai-xe-btc` | parking | Bãi xe Ban Tổ chức | Bãi xe BTC | Organizer Parking | Organizer Parking | 🅿️ | #888888 | false | 15.998339 | 108.254221 |

### Đường Sư Vạn Hạnh (6 points)

| # | id | type | name | shortName | nameEn | shortNameEn | icon | color | primary | lat | lng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| #2 | `mieu-huyen-tran` | venue | Miếu thờ Huyền Trân Công Chúa | Miếu Huyền Trân | Princess Huyen Tran Shrine | Huyen Tran Shrine | 🏛️ | #9B5E6E | false | 15.999892 | 108.257604 |
| #3 | `chua-thai-son` | landmark | Chùa Thái Sơn | Chùa Thái Sơn | Thai Son Pagoda | Thai Son Pagoda | ⛩️ | #7B6B5A | false | 15.999834 | 108.257502 |
| #4 | `sk-dan-gian` | venue | Sân khấu trò chơi dân gian | SK Dân gian | Folk Games Stage | Folk Stage | 🎪 | #2E5A88 | true | 15.999179 | 108.256883 |
| #5 | `ocop` | venue | Gian hàng OCOP Sở Công Thương | Gian hàng OCOP | OCOP Trade Pavilion | OCOP Pavilion | 🛒 | #D4760A | false | 15.999154 | 108.256758 |
| #6 | `trienlam-anh` | venue | Triển lãm nhiếp ảnh | TL Nhiếp ảnh | Photography Exhibition | Photo Exhibition | 📷 | #5A8F7B | false | 15.999408 | 108.256929 |
| #7 | `da-my-nghe` | venue | Trưng bày đá mỹ nghệ & thư pháp | Đá mỹ nghệ | Stone Craft & Calligraphy | Stone & Calligraphy | 🪨 | #7B8B6F | false | 15.999245 | 108.256447 |

### Khu vực khác (3 points)

| # | id | type | name | shortName | nameEn | shortNameEn | icon | color | primary | lat | lng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| #13 | `dam-sen` | venue | Công viên Bến Du Thuyền Đầm Sen | CV Đầm Sen | Dam Sen Marina Park | Dam Sen Park | 🪁 | #4A6741 | false | 15.997965 | 108.252082 |
| #14 | `song-co-co` | venue | Sân khấu đua thuyền Sông Cổ Cò | Sông Cổ Cò | Co Co River Boat Race Stage | Co Co River | 🚣 | #6A3D7D | false | 16.001654 | 108.253021 |
| — | `dieu-hanh` | venue | Các tuyến đường chính TP | Diễu hành xe hoa | City Main Routes | Float Parade Route | 🚗 | #B5651D | false | 15.997 | 108.25 |

### Tiện ích (6 points)

| # | id | type | name | shortName | nameEn | shortNameEn | icon | color | primary | lat | lng |
|---|---|---|---|---|---|---|---|---|---|---|---|
| #15 | `cong-chao` | gate | Cổng chào đường Sư Vạn Hạnh | Cổng chào | Su Van Hanh Gate | SVH Gate | 🚩 | #A08060 | false | 16.000484 | 108.259449 |
| #16 | `bai-xe-1` | parking | Bãi xe du khách 1 | Bãi xe 1 | Visitor Parking 1 | Parking 1 | 🅿️ | #888888 | false | 16.001015 | 108.259383 |
| #17 | `bai-xe-2` | parking | Bãi xe du khách 2 | Bãi xe 2 | Visitor Parking 2 | Parking 2 | 🅿️ | #888888 | false | 16.000528 | 108.259938 |
| #18 | `wc-1` | restroom | Nhà vệ sinh 1 (gần Chùa) | WC-1 | Restroom 1 (near Pagoda) | WC-1 | 🚻 | #666666 | false | 15.997854 | 108.254437 |
| #19 | `wc-2` | restroom | Nhà vệ sinh 2 (giữa đường SVH) | WC-2 | Restroom 2 (mid SVH St.) | WC-2 | 🚻 | #666666 | false | 15.999630 | 108.254682 |
| #20 | `wc-3` | restroom | Nhà vệ sinh 3 (đầu đường SVH) | WC-3 | Restroom 3 (SVH entrance) | WC-3 | 🚻 | #666666 | false | 15.999393 | 108.257679 |

### Each location object also includes (to fill during implementation):
- `address` — street address
- `description` / `descriptionEn` — short description of the location

---

## ID Changes Summary

| Action | Old ID | New ID | Reason |
|---|---|---|---|
| **Kept** | `chua` | `chua` | Now specifically #9 (main building + stage) |
| **Kept** | `mieu-huyen-tran` | `mieu-huyen-tran` | GPS updated |
| **Kept** | `song-co-co` | `song-co-co` | GPS updated |
| **Kept** | `dieu-hanh` | `dieu-hanh` | No GPS change (mobile route) |
| **Renamed** | `hoa-quy` | `dam-sen` | Actual place name |
| **Removed** | `san-khau` | — | Absorbed into `chua` (#9) |
| **Removed** | `su-van-hanh` | — | Split into `sk-dan-gian`, `ocop`, `trienlam-anh`, `da-my-nghe` |
| **New** | — | `le-dai` | #8 Ceremonial platform |
| **New** | — | `sk-dan-gian` | #4 Folk games stage |
| **New** | — | `ocop` | #5 OCOP trade pavilion |
| **New** | — | `trienlam-anh` | #6 Photography exhibition |
| **New** | — | `da-my-nghe` | #7 Stone craft & calligraphy |
| **New** | — | `trienlam-thieunhi` | #10 Children's art |
| **New** | — | `dao-trang` | #11 Dharma camp (landmark, no scheduled events) |
| **New** | — | `bai-xe-btc` | #12 Organizer parking |
| **New** | — | `chua-thai-son` | #3 Tourist landmark |
| **New** | — | `cong-chao`, `bai-xe-1`, `bai-xe-2`, `wc-1`–`wc-3` | Amenities |

---

## Event Reassignment (41 events)

### Day 1 — 18 events

| Event ID | Title | Old locationId | New locationId |
|---|---|---|---|
| d1-01 | Lễ khai kinh Thượng phan | `chua` | `chua` ✓ |
| d1-02 | Lân Sư Rồng & Hội thao dân gian | `san-khau` | **`sk-dan-gian`** |
| d1-03 | Điêu khắc đá & Đá mỹ nghệ Non Nước | `su-van-hanh` | **`da-my-nghe`** |
| d1-04 | Triển lãm nhiếp ảnh | `su-van-hanh` | **`trienlam-anh`** |
| d1-05 | Ký họa màu nước & thư pháp "Tâm và Đức" | `su-van-hanh` | **`da-my-nghe`** |
| d1-06 | Gian hàng OCOP | `su-van-hanh` | **`ocop`** |
| d1-07 | Trình diễn diều nghệ thuật | `hoa-quy` | **`dam-sen`** |
| d1-08 | Triển lãm mỹ thuật "Quan Âm mùa lễ hội" | `chua` | `chua` ✓ |
| d1-09 | Nhảy sạp, trò chơi dân gian | `su-van-hanh` | **`sk-dan-gian`** |
| d1-10 | Review sách — Thư viện Vạn Hạnh | `chua` | `chua` ✓ |
| d1-11 | Ẩm thực chay Đà Nẵng | `chua` | `chua` ✓ |
| d1-12 | Lễ tưởng niệm Huyền Trân Công Chúa | `mieu-huyen-tran` | `mieu-huyen-tran` ✓ |
| d1-13 | Lễ tế Xuân cầu Quốc thái Dân an | `san-khau` | **`chua`** |
| d1-14 | Khai mạc Lễ hội | `san-khau` | **`chua`** |
| d1-15 | Diễu hành xe hoa | `dieu-hanh` | `dieu-hanh` ✓ |
| d1-16 | Múa rối cạn & múa rối nước | `su-van-hanh` | **`sk-dan-gian`** |
| d1-17 | Nghệ thuật chào mừng Lễ hội | `san-khau` | **`chua`** |
| d1-18 | Hoa đăng Thiền hành | `chua` | `chua` ✓ |

### Day 2 — 11 events

| Event ID | Title | Old locationId | New locationId |
|---|---|---|---|
| d2-01 | Hội Cờ làng + cà kheo | `su-van-hanh` | **`sk-dan-gian`** |
| d2-02 | Triển lãm tranh thiếu nhi "Nét đẹp Ngũ Hành Sơn" | `chua` | **`trienlam-thieunhi`** |
| d2-03 | Trình diễn diều nghệ thuật | `hoa-quy` | **`dam-sen`** |
| d2-04 | Pháp đàn Đại bi, Thuyết pháp | `san-khau` | **`chua`** |
| d2-05 | Bài chòi, dân ca Khu 5 | `su-van-hanh` | **`sk-dan-gian`** |
| d2-06 | Diễu hành xe hoa | `dieu-hanh` | `dieu-hanh` ✓ |
| d2-07 | Thuyết giảng chủ đề Lễ hội | `san-khau` | **`chua`** |
| d2-08 | Lễ Quán đảnh Quán Âm | `chua` | `chua` ✓ |
| d2-09 | Khánh thành Trụ Kinh chuyển Pháp Luân | `chua` | `chua` ✓ |
| d2-10 | Chương trình nghệ thuật | `san-khau` | **`chua`** |
| d2-11 | Hoa đăng, lửa trại | `chua` | `chua` ✓ |

### Day 3 — 10 events

| Event ID | Title | Old locationId | New locationId |
|---|---|---|---|
| d3-01 | Lễ vía Đức Bồ tát Quán Thế Âm | `chua` | **`le-dai`** |
| d3-02 | Lễ Quán đảnh Quán Âm | `chua` | `chua` ✓ |
| d3-03 | Hội Đua thuyền truyền thống | `song-co-co` | `song-co-co` ✓ |
| d3-04 | Trình diễn diều nghệ thuật | `hoa-quy` | **`dam-sen`** |
| d3-05 | Pháp đàn đại bi, thiền tọa, thuyết pháp | `san-khau` | **`chua`** |
| d3-06 | Bài chòi, dân ca Khu 5 | `su-van-hanh` | **`sk-dan-gian`** |
| d3-07 | Diễu hành xe hoa | `dieu-hanh` | `dieu-hanh` ✓ |
| d3-08 | Chương trình nghệ thuật | `san-khau` | **`chua`** |
| d3-09 | Hoa đăng Thiền hành | `chua` | `chua` ✓ |
| d3-10 | Lửa trại truyền thống | `chua` | `chua` ✓ |

### Day 4 — 2 events

| Event ID | Title | Old locationId | New locationId |
|---|---|---|---|
| d4-01 | Đi bộ vì hòa bình 2026 | `su-van-hanh` | **`sk-dan-gian`** |
| d4-02 | Lễ Bế mạc | `san-khau` | **`sk-dan-gian`** |

### Event count per new location

| locationId | Events | % |
|---|---|---|
| `chua` | 19 | 46% |
| `sk-dan-gian` | 8 | 20% |
| `dam-sen` | 3 | 7% |
| `dieu-hanh` | 3 | 7% |
| `da-my-nghe` | 2 | 5% |
| `le-dai` | 1 | 2% |
| `ocop` | 1 | 2% |
| `trienlam-anh` | 1 | 2% |
| `trienlam-thieunhi` | 1 | 2% |
| `mieu-huyen-tran` | 1 | 2% |
| `song-co-co` | 1 | 2% |
| **Total** | **41** | |

---

## Files to Modify

| # | File | Changes |
|---|---|---|
| 1 | `src/data/locations.json` | Rewrite: 7 → 20 locations with verified GPS, new IDs, types |
| 2 | `src/data/schedule.json` | Update `locationId` for 25 of 41 events |
| 3 | `src/data/colorMap.js` | Remove `san-khau`, `su-van-hanh`, `hoa-quy`. Add 13 new entries |
| 4 | `src/components/icons/LocationPin.jsx` | Add SVG symbols for 6 new venue IDs + amenity icons |
| 5 | `src/index.css` | Remove 3 old Tailwind tokens, add 13 new `--color-loc-*` tokens |
| 6 | `src/data/festivalConfig.js` | Update `mapCenter` to ~15.9990, 108.2555 |
| 7 | `src/components/map/FestivalMap.jsx` | Render amenity pins (parking, WC, gate) differently from venue pins |
| 8 | `src/data/categories.json` | Verify `featuredEvents` IDs still valid |
| 9 | `src/components/timeline/FilterBar.jsx` | Verify works with 11 venue chips (was 7) |
| 10 | `src/components/places/PlacesTab.jsx` | Handle new location types (landmark, parking, restroom, gate) |

No changes needed for: `EventCard.jsx`, `EventDetail.jsx`, `FeaturedEvents.jsx`, `CategoryHighlights.jsx`, `LocationPopup.jsx` — these read from `locations.json` dynamically via `locationMap[event.locationId]`.

---

## Verification

1. `npm run build` — JSON valid, no compile errors
2. Dev mode checks:
   - **Map:** 20 pins at correct positions (venue pins large, amenity pins small)
   - **FilterBar location mode:** 11 venue chips with correct colors
   - **Event cards:** Each event shows correct location tag + color
   - **Event detail:** Correct location name, address, directions GPS
   - **Directions:** Tap "Chỉ đường" → Google Maps opens at verified GPS
   - **Map center:** Loads centered on venue cluster
   - **PlacesTab:** Groups by type (venues, landmarks, amenities)
   - **EN mode:** All 20 locations show English names
   - **No broken references:** No event uses a removed locationId (`san-khau`, `su-van-hanh`, `hoa-quy`)
