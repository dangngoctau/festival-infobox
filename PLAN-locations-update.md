# Plan: Hierarchical Locations with Zone-Based Filtering

## Context

Replace the current flat 7-location model with a **hierarchical sub-location model** based on verified GPS data from `locations-list.md`. Each specific venue becomes its own map pin, grouped under a parent zone. Filter chips work by zone. Each event maps to its specific sub-location.

---

## 1. New Data Model

### Zones (5) — for filter chips & color coding

| Zone ID | Name | Color |
|---|---|---|
| `chua` | Khuôn viên Chùa | #B8860B |
| `su-van-hanh` | Đường Sư Vạn Hạnh | #2E5A88 |
| `hoa-quy` | Công viên Hòa Quý | #4A6741 |
| `song-co-co` | Sông Cổ Cò | #6A3D7D |
| `mieu-huyen-tran` | Miếu Huyền Trân | #9B5E6E |

### Venue locations (13) — each a pin on the map

| # | ID | Name | Zone | lat | lng |
|---|---|---|---|---|---|
| 1 | `le-dai` | Lễ đài | chua | 15.999184 | 108.255525 |
| 2 | `san-khau-chinh` | Sân khấu chính · Thư viện · Bảo tàng | chua | 15.998845 | 108.254554 |
| 3 | `trien-lam-chua` | Khu triển lãm — Khuôn viên Chùa | chua | 15.998534 | 108.254366 |
| 4 | `dao-trang` | Trại Đạo Tràng · Thuyền Trà | chua | 15.998778 | 108.254151 |
| 5 | `san-khau-dan-gian` | Sân khấu trò chơi dân gian | su-van-hanh | 15.999179 | 108.256883 |
| 6 | `gian-hang-ocop` | Gian hàng OCOP | su-van-hanh | 15.999154 | 108.256758 |
| 7 | `trien-lam-anh` | Triển lãm nhiếp ảnh | su-van-hanh | 15.999408 | 108.256929 |
| 8 | `da-my-nghe` | Trưng bày đá mỹ nghệ · Thư pháp | su-van-hanh | 15.999245 | 108.256447 |
| 9 | `chua-thai-son` | Chùa Thái Sơn | su-van-hanh | 15.999834 | 108.257502 |
| 10 | `dieu-nghe-thuat` | CV Bến Du Thuyền Đầm Sen | hoa-quy | 15.997965 | 108.252082 |
| 11 | `dua-thuyen` | Sân khấu đua thuyền | song-co-co | 16.00080 | 108.25150 |
| 12 | `mieu-huyen-tran` | Miếu thờ Huyền Trân | mieu-huyen-tran | 16.004967 | 108.253805 |
| 13 | `dieu-hanh` | Diễu hành xe hoa | su-van-hanh | *(same as parking_02)* | |

### locations.json entry format

```json
{
  "id": "le-dai",
  "name": "Lễ đài",
  "nameEn": "Ceremonial Platform",
  "shortName": "Lễ đài",
  "shortNameEn": "Ceremonial Platform",
  "zone": "chua",
  "lat": 15.999184,
  "lng": 108.255525,
  "type": "venue",
  "description": "Lễ đài chính — nơi tổ chức lễ khai kinh, hoa đăng thiền hành",
  "descriptionEn": "Main ceremonial platform — sutra opening, lantern meditation"
}
```

Zone metadata (name, color, icon) stored in a new `zones.json` or added to `festivalConfig.js`.

---

## 2. Event → Sub-location Mapping (all 40 events)

### Day 1 (d1-01 to d1-18)
| Event | Title | New locationId |
|---|---|---|
| d1-01 | Lễ khai kinh | `le-dai` |
| d1-02 | Lân Sư Rồng & Hội thao dân gian | `san-khau-dan-gian` |
| d1-03 | Điêu khắc đá & Đá mỹ nghệ | `da-my-nghe` |
| d1-04 | Triển lãm nhiếp ảnh | `trien-lam-anh` |
| d1-05 | Ký họa màu nước & Thư pháp | `da-my-nghe` |
| d1-06 | Gian hàng OCOP | `gian-hang-ocop` |
| d1-07 | Trình diễn diều | `dieu-nghe-thuat` |
| d1-08 | Triển lãm "Quan Âm mùa lễ hội" | `trien-lam-chua` |
| d1-09 | Nhảy sạp & Trò chơi dân gian | `san-khau-dan-gian` |
| d1-10 | Trưng bày sách & Thi Review sách | `san-khau-chinh` (Thư viện Vạn Hạnh) |
| d1-11 | Ẩm thực chay Đà Nẵng | `trien-lam-chua` |
| d1-12 | Lễ tưởng niệm Huyền Trân | `mieu-huyen-tran` |
| d1-13 | Lễ tế Xuân | `san-khau-chinh` |
| d1-14 | Khai mạc Lễ hội | `san-khau-chinh` |
| d1-15 | Diễu hành xe hoa | `dieu-hanh` |
| d1-16 | Múa rối cạn & nước | `san-khau-dan-gian` |
| d1-17 | Văn nghệ chào mừng | `san-khau-chinh` |
| d1-18 | Hoa đăng Thiền hành | `le-dai` |

### Day 2 (d2-01 to d2-11)
| Event | Title | New locationId |
|---|---|---|
| d2-01 | Hội Cờ làng & Cà kheo | `san-khau-dan-gian` |
| d2-02 | Tranh thiếu nhi | `trien-lam-chua` |
| d2-03 | Diều nghệ thuật | `dieu-nghe-thuat` |
| d2-04 | Pháp đàn Đại bi · Thuyết pháp | `san-khau-chinh` |
| d2-05 | Bài chòi & Dân ca | `san-khau-dan-gian` |
| d2-06 | Diễu hành xe hoa | `dieu-hanh` |
| d2-07 | Thuyết giảng Phật pháp | `san-khau-chinh` |
| d2-08 | Lễ Quán đảnh | `le-dai` |
| d2-09 | Khánh thành Trụ Kinh | `le-dai` |
| d2-10 | Văn nghệ chào mừng | `san-khau-chinh` |
| d2-11 | Hoa đăng & Lửa trại | `le-dai` |

### Day 3 (d3-01 to d3-10)
| Event | Title | New locationId |
|---|---|---|
| d3-01 | Lễ vía Đức Bồ tát QTA | `le-dai` |
| d3-02 | Lễ Quán đảnh | `le-dai` |
| d3-03 | Đua thuyền truyền thống | `dua-thuyen` |
| d3-04 | Diều nghệ thuật | `dieu-nghe-thuat` |
| d3-05 | Pháp đàn · Thiền tọa | `san-khau-chinh` |
| d3-06 | Bài chòi & Dân ca | `san-khau-dan-gian` |
| d3-07 | Diễu hành xe hoa | `dieu-hanh` |
| d3-08 | Chương trình nghệ thuật | `san-khau-chinh` |
| d3-09 | Hoa đăng Thiền hành | `le-dai` |
| d3-10 | Lửa trại truyền thống | `le-dai` |

### Day 4 (d4-01 to d4-02)
| Event | Title | New locationId |
|---|---|---|
| d4-01 | Đi bộ vì Hòa bình | `san-khau-dan-gian` |
| d4-02 | Lễ Bế mạc | `san-khau-dan-gian` |

---

## 3. Amenities Update

Update `amenities.json` GPS with verified data from `locations-list.md`:

| ID | Type | New lat, lng | Source |
|---|---|---|---|
| wc_01 | wc | 15.997854, 108.254437 | ✅ A Hoài (WC-1, phía Tây Chùa) |
| wc_02 | wc | 15.999630, 108.254682 | ✅ A Hoài (WC-2, giữa SVH) |
| wc_03 | wc | 15.999393, 108.257679 | ✅ A Hoài (WC-3, đầu SVH) |
| parking_01 | parking_car | ~15.99970, ~108.25830 | ❌ Estimated (Bãi xe 1) |
| parking_02 | parking_bike | ~15.99950, ~108.25870 | ❌ Estimated (Bãi xe 2) |

Add new: Bãi xe BTC (#12): 15.998339, 108.254221 (type: parking_car, zone: chua)
Add new: Cổng chào SVH: ~15.99660, ~108.25900 (type: info/wayfinding)

Remove provisional amenities that don't have verified GPS or match the new data.

---

## 4. Files to Modify

### Data files
| File | Change |
|------|--------|
| `src/data/locations.json` | Complete rewrite — 12 sub-locations with `zone` field |
| `src/data/schedule.json` | Update all 40 events' `locationId` to sub-location IDs |
| `src/data/amenities.json` | Update GPS coords, add/remove entries |
| `src/data/colorMap.js` | Rewrite: zone-based colors + zone→sublocation lookup |
| `src/data/festivalConfig.js` | Update mapCenter, add zones config |
| `src/data/categories.json` | Check if any location refs need updating |

### Components
| File | Change |
|------|--------|
| `src/components/timeline/FilterBar.jsx` | Filter by `zone` instead of `locationId`. Chips = 5 zones. |
| `src/components/timeline/EventCard.jsx` | Show sub-location name (from new locationMap) |
| `src/components/timeline/EventDetail.jsx` | Show sub-location name + zone info for wayfinding |
| `src/components/map/FestivalMap.jsx` | Render 12 venue pins (colored by zone). Remove old pinSymbols. |
| `src/components/icons/LocationPin.jsx` | Rewrite symbols for 12 sub-locations OR simplify to zone-colored pins |
| `src/components/map/PlacesTab.jsx` | Group venues by zone |
| `src/components/map/VenueCard.jsx` | Show zone label on cards |
| `src/components/landing/FeaturedEvents.jsx` | Use new locationMap |
| `src/components/timeline/AmenityChips.jsx` | Use new sub-location lat/lng for proximity |

### Hooks
| File | Change |
|------|--------|
| `src/hooks/useFilters.js` | Change `selectedLocationId` → `selectedZone`, filter events by zone |

### Styles
| File | Change |
|------|--------|
| `src/index.css` | Remove old `--color-loc-*` vars, add zone-based vars |

### i18n
| File | Change |
|------|--------|
| `src/i18n/vi.json` | Add zone names + sub-location names |
| `src/i18n/en.json` | Add zone names + sub-location names |

---

## 5. Verification

1. `npm run dev` — no errors
2. **Map**: 13 venue pins + amenity pins, all at correct GPS, colored by zone
3. **Filter chips**: 5 zone chips, filtering shows all events in that zone
4. **Event card**: Shows specific sub-location name (e.g., "Lễ đài" not just "Khuôn viên Chùa")
5. **Event detail**: Shows sub-location + zone for wayfinding context
6. **Directions**: Navigates to specific sub-location GPS
7. **PlacesTab**: Venues grouped by zone
8. **Amenities**: Updated GPS pins on map
