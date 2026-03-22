# DỰ ÁN: BẢN ĐỒ SỐ LỄ HỘI QUÁN THẾ ÂM 2026
# Ngũ Hành Sơn, Đà Nẵng

---

## 1. TỔNG QUAN DỰ ÁN

### Mục tiêu

Ứng dụng web mobile-first cho Lễ hội Quán Thế Âm — Di sản văn hóa phi vật thể quốc gia (công nhận 2021). Từ năm 2023, lễ hội được tổ chức quy mô cấp thành phố do UBND TP Đà Nẵng chủ trì. Năm 2000 được xếp vào 15 lễ hội lớn nhất cả nước.

### Công nghệ

- Frontend: **React** (Vite + static build)
- Styling: Tailwind CSS
- State: React useState/useReducer
- Bản đồ: React-Leaflet + OpenStreetMap (miễn phí, không cần API key)
- Chỉ đường: Deep link mở Google Maps app
- QR: api.qrserver.com (miễn phí)
- Thời tiết: Open-Meteo API (miễn phí, không cần key)
- i18n: react-i18next
- Hosting: GitHub Pages (miễn phí, hỗ trợ custom domain + HTTPS)
- Chi phí: chỉ tiền domain (~200-500k VND/năm cho .vn)

### Kiến trúc

```
React (Vite) → Static Build → GitHub Pages
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TabNav.jsx            (chuyển đổi Chương trình ↔ Bản đồ, ẩn trên ≥768px)
│   │   │   ├── Header.jsx            (banner lễ hội + tagline + ngày diễn ra)
│   │   │   ├── EmptyState.jsx        (hiển thị khi ngoài thời gian lễ hội)
│   │   │   └── ResponsiveLayout.jsx  (1 cột mobile / 2 cột tablet+)
│   │   ├── timeline/
│   │   │   ├── DayFilter.jsx         (4 nút lọc ngày)
│   │   │   ├── LocationFilter.jsx    (chips cuộn ngang + hệ màu)
│   │   │   ├── EventList.jsx         (3 nhóm: Đang/Sắp/Xong)
│   │   │   ├── EventCard.jsx         (giờ, tên, địa điểm + tag màu, text-only)
│   │   │   └── EventDetail.jsx       (mô tả + nút Chỉ đường, ảnh optional)
│   │   ├── map/
│   │   │   ├── FestivalMap.jsx       (React-Leaflet, 5-6 pin cố định)
│   │   │   └── LocationPopup.jsx     (tên + nút Chỉ đường)
│   ├── hooks/
│   │   ├── useTimeGroup.js           (phân nhóm Đang/Sắp/Xong)
│   │   ├── useFilters.js             (state lọc ngày + địa điểm)
│   │   └── useBreakpoint.js          (trả về isMobile, ngưỡng 768px)
│   ├── data/
│   │   ├── locations.json            (5-6 địa điểm + tọa độ GPS)
│   │   ├── schedule.json             (40+ sự kiện, category 6 loại, image optional)
│   │   └── colorMap.js               (hệ màu địa điểm + category, tone trầm ấm)
│   ├── i18n/
│   │   ├── vi.json, en.json
│   │   └── i18n.js
│   ├── utils/
│   │   ├── deepLink.js               (mở Google Maps/Apple Maps)
│   │   └── timeUtils.js
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│   └── icons/
│
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 2. THÔNG TIN LỄ HỘI

- Ngày 19/2 Âm lịch hằng năm
- Địa điểm: Chùa Quán Thế Âm và đường Sư Vạn Hạnh, quận Ngũ Hành Sơn, Đà Nẵng
- Thời lượng: 4 ngày (04/04 – 07/04/2026, nhằm 17-20/02 Âm lịch Bính Ngọ)
- Quy mô: Hàng vạn người dân, phật tử, du khách trong và ngoài nước

### Tiêu chí "5 Không" của Ban Tổ chức

1. Không trộm cướp, tệ nạn xã hội
2. Không lang thang xin ăn, xin ăn biến tướng
3. Không xả rác, không vi phạm VSATTP
4. Không chèo kéo khách, nâng giá, ép giá
5. Không phóng sinh và mê tín dị đoan

---

## 3. THIẾT KẾ UX

### Câu hỏi cốt lõi

> "Giờ này đi xem gì, ở đâu?" — trả lời trong dưới 3 giây.

### Kiến trúc giao diện

**Mobile (< 768px):** 2 tab — "Chương trình" (mặc định) và "Bản đồ".

**Tablet & Desktop (≥ 768px):** bỏ tab, hiển thị đồng thời 2 cột — timeline bên trái (60%), bản đồ sticky bên phải (40%).

Lý do timeline làm giao diện chính: lễ hội chỉ có 5-6 địa điểm cố định nằm rất sát nhau (pin chồng chéo trên mobile), bản đồ yếu chiều thời gian trong khi nhu cầu chính là "đang diễn ra gì". Bản đồ đóng vai trò **công cụ hỗ trợ wayfinding**, không phải giao diện tra cứu.

### Cột trái — Chương trình

- **Thanh lọc ngày:** 4 nút (04–07/04), mặc định hôm nay, ngoài lễ hội mặc định ngày đầu
- **Thanh lọc địa điểm:** chip cuộn ngang, mỗi địa điểm 1 màu riêng (đồng bộ chip → tag card → pin bản đồ)
- **Danh sách sự kiện:** tự động phân 3 nhóm — Đang diễn ra (nổi bật) / Sắp tới / Đã kết thúc (mờ/thu gọn)
- **Card sự kiện:** text-only — giờ, tên, địa điểm + tag màu. Không dùng ảnh thumbnail (giữ mật độ thông tin cao)
- **Tap card:** modal chi tiết — mô tả, đơn vị tổ chức, ảnh minh họa (optional), nút "Chỉ đường" (deep link Google Maps)

### Cột phải — Bản đồ

- 5-6 pin cố định, màu đồng bộ hệ màu địa điểm
- Tap pin → popup tên + nút "Chỉ đường"
- Trên tablet/desktop: sticky, chiều cao viewport, không cuộn theo danh sách

### Header & Empty State

Không làm landing page riêng. Người dùng đến app qua QR hoặc link chia sẻ — đã biết đây là app lễ hội, cần tra cứu ngay.

- **Header.jsx:** banner ảnh Ngũ Hành Sơn/lễ hội năm trước + tên + tagline + ngày. Ảnh lấy từ BTC/Sở VHTTDL (không dùng placeholder)
- **EmptyState.jsx:** khi ngoài thời gian lễ hội — trước: countdown + tóm tắt + nút add to calendar; sau: thông báo kết thúc + hẹn năm sau

### Hình ảnh

- **Header + EmptyState:** dùng ảnh thật từ BTC/Sở VHTTDL/báo Đà Nẵng (ảnh Ngũ Hành Sơn, Chùa, lễ hội năm trước)
- **EventCard:** text-only, không cần ảnh
- **EventDetail:** trường `image` optional trong schedule.json — có ảnh thì hiển thị, không có thì modal vẫn hoàn chỉnh. Không bao giờ hiển thị placeholder

### Bảng màu

**Màu nền & chữ:** tone ấm, thanh tịnh — vàng nghệ nhạt (nền), nâu trầm (chữ chính), trắng ngà (nền card). Không dùng đen tuyền, không dùng màu lạnh.

**Màu nhấn:** gold ấm `#C8A35A` (nút chính, highlight), nâu đất `#6B4226` (chữ heading), xanh rêu `#4A6741` (trạng thái "Đang diễn ra").

**Màu địa điểm (chức năng):** dùng tone trầm ấm, không chói — đồng bộ xuyên suốt chip lọc → tag card → pin bản đồ.

| Địa điểm | Màu |
|---|---|
| Khuôn viên Chùa | Vàng nghệ |
| Sân khấu chính | Đỏ trầm |
| Đường Sư Vạn Hạnh | Xanh dương trầm |
| Công viên Hòa Quý | Xanh rêu |
| Sông Cổ Cò | Tím trầm |
| Tuyến đường TP | Cam đất |

### Phân loại sự kiện

| Category | Tên tiếng Việt | Ví dụ |
|---|---|---|
| `ceremony` | Lễ nghi | Khai kinh, Lễ vía, Quán đảnh, Lễ tế Xuân |
| `dharma` | Phật pháp | Thuyết pháp, Pháp đàn Đại bi, Thiền tọa |
| `folk` | Dân gian | Nhảy sạp, cà kheo, đua thuyền, diều, bài chòi |
| `exhibition` | Triển lãm | Nhiếp ảnh, mỹ thuật, thư pháp, điêu khắc đá |
| `culinary` | Ẩm thực chay | Tinh hoa ẩm thực chay, gian hàng OCOP |
| `art` | Nghệ thuật | Lân Sư Rồng, múa rối, hoa đăng, chương trình nghệ thuật |

### Nguyên tắc thiết kế

- Toàn bộ flow chính không quá 2-3 tap
- Font đủ lớn, tương phản cao, không gesture phức tạp — thân thiện người lớn tuổi
- Chỉ 2 lớp lọc (ngày + địa điểm), không lọc theo thể loại
- Hệ màu đồng bộ xuyên suốt chip → tag → pin
- Responsive layout, không responsive feature — mọi kích thước cùng feature set

### Flow người dùng

> **Mobile:** Mở app → "Đang diễn ra" hôm nay → lướt "Sắp tới" → tap card → chi tiết + Chỉ đường → chuyển tab Bản đồ nếu cần.

> **Tablet/Desktop:** Mở app → timeline trái + bản đồ phải → lướt danh sách → tap card → chi tiết + Chỉ đường → nhìn bản đồ phải để định hướng.

---

## 4. CHƯƠNG TRÌNH CHI TIẾT 4 NGÀY

*(Nguồn: Chương trình chính thức của Ban Tổ chức Lễ hội năm 2026)*

### NGÀY 1 — 04/04/2026 (17/02 Âm lịch) — KHAI MẠC

| Giờ | Sự kiện | Địa điểm |
|---|---|---|
| 07:00 | Lễ khai kinh Thượng phan, Thượng kỳ, Thượng phướn | Khuôn viên Chùa |
| 08:00 | Khai mạc hội (Lân Sư Rồng + văn hóa thể thao dân gian) | Sân khấu đường Sư Vạn Hạnh |
| 09:00 | Khai mạc thi điêu khắc đá Non Nước 2026 + Trưng bày chế tác đá mỹ nghệ | Đường Sư Vạn Hạnh |
| 09:30 | Triển lãm nhiếp ảnh "Lễ hội Quán Thế Âm - Biểu tượng của lòng từ trong nghệ thuật" | Đường Sư Vạn Hạnh |
| 09:30 | Không gian ký họa màu nước và viết thư pháp "Tâm và Đức" | Đường Sư Vạn Hạnh |
| 10:00 | Khai trương gian hàng OCOP | Đường Sư Vạn Hạnh |
| 10:00–17:30 | Trình diễn diều nghệ thuật | Công viên Hòa Quý – Đồng Nò |
| 14:30 | Triển lãm mỹ thuật "Quan Âm mùa lễ hội" | Khuôn viên Chùa |
| 15:00–21:00 | Nhảy sạp, trò chơi dân gian | Đường Sư Vạn Hạnh |
| 15:00 | Trưng bày tài nguyên thông tin + thi Review sách | Thư viện Vạn Hạnh – Chùa |
| 15:30 | Khai mạc "Tinh hoa ẩm thực chay Đà Nẵng" | Khuôn viên Chùa |
| 16:00–17:00 | Lễ dâng hương tưởng niệm Huyền Trân Công Chúa + Lễ tế Xuân cầu Quốc thái Dân an | Miếu thờ Huyền Trân Công Chúa / Sân khấu chính |
| 17:30 | **Khai mạc Lễ hội** | Sân khấu chính |
| 18:00–20:00 | Diễu hành xe hoa | Các tuyến đường chính thành phố |
| 18:30 | Múa rối cạn và múa rối nước | Đường Sư Vạn Hạnh |
| 19:30 | Chương trình nghệ thuật chào mừng | Sân khấu chính |
| 20:00 | Hoa đăng Thiền hành | Khuôn viên Chùa |

### NGÀY 2 — 05/04/2026 (18/02 Âm lịch)

| Giờ | Sự kiện | Địa điểm |
|---|---|---|
| 07:30 | Hội Cờ làng + Hội thi đi cà kheo | Đường Sư Vạn Hạnh |
| 08:30 | Triển lãm tranh ảnh thiếu nhi "Nét đẹp Ngũ Hành Sơn" | Khuôn viên Chùa |
| 10:00–17:30 | Trình diễn diều nghệ thuật | Công viên Hòa Quý – Đồng Nò |
| 14:00 | Pháp đàn Đại bi, Thuyết pháp | Sân khấu chính |
| 16:00–21:00 | Giao lưu bài chòi, dân ca Khu 5 | Đường Sư Vạn Hạnh |
| 18:00–20:00 | Diễu hành xe hoa | Các tuyến đường chính thành phố |
| 18:30 | Thuyết giảng chủ đề Lễ hội | Sân khấu chính |
| 19:00 | Lễ Quán đảnh Quán Âm | Khuôn viên Chùa |
| 19:30 | Khánh thành chú nguyện Trụ Kinh chuyển Pháp Luân | Khuôn viên Chùa |
| 20:00 | Chương trình nghệ thuật chào mừng | Sân khấu chính |
| 20:30 | Hoa đăng, lửa trại | Khuôn viên Chùa |

### NGÀY 3 — 06/04/2026 (19/02 Âm lịch) — LỄ CHÍNH

| Giờ | Sự kiện | Địa điểm |
|---|---|---|
| 07:00–09:00 | **Lễ vía Đức Bồ tát Quán Thế Âm** (truyền hình trực tiếp DanangTV) | Lễ đài Chùa Quán Thế Âm |
| 09:00 | Lễ Quán đảnh Quán Âm (có đoàn Phật giáo Ấn Độ, Nhật Bản, Thái Lan) | Khuôn viên Chùa |
| 09:30 | Hội Đua thuyền truyền thống (rước Huyền Trân Công Chúa) | Sông Cổ Cò |
| 10:00–17:30 | Trình diễn diều nghệ thuật | Công viên Hòa Quý – Đồng Nò |
| 14:00–15:00 | Pháp đàn đại bi, thiền tọa, thuyết pháp | Sân khấu chính |
| 16:00–21:00 | Giao lưu bài chòi, dân ca Khu 5 | Đường Sư Vạn Hạnh |
| 18:00–20:00 | Diễu hành xe hoa | Các tuyến đường chính thành phố |
| 19:00 | Chương trình nghệ thuật | Sân khấu chính |
| 20:00 | Hoa đăng Thiền hành | Khuôn viên Chùa |
| 21:00 | Lửa trại truyền thống | Khuôn viên Chùa |

### NGÀY 4 — 07/04/2026 (20/02 Âm lịch) — BẾ MẠC

| Giờ | Sự kiện | Địa điểm |
|---|---|---|
| 07:00–08:30 | Đi bộ vì hòa bình 2026 | Đường Sư Vạn Hạnh, Lê Văn Hiến |
| 09:30 | **Lễ Bế mạc** | Sân khấu đường Sư Vạn Hạnh |

---

## 5. ĐỊA ĐIỂM TỔ CHỨC

| # | Địa điểm | Màu | Vai trò | Ghi chú |
|---|---|---|---|---|
| 1 | Khuôn viên Chùa Quán Thế Âm | Vàng | Lễ nghi Phật giáo, triển lãm, hoa đăng | Địa điểm trung tâm |
| 2 | Sân khấu chính | Đỏ | Khai mạc, bế mạc, nghệ thuật, thuyết pháp | Nằm sát Chùa |
| 3 | Đường Sư Vạn Hạnh | Xanh dương | Triển lãm, trò chơi dân gian, múa rối, bài chòi | Trục đường chính lễ hội |
| 4 | Công viên Hòa Quý – Đồng Nò | Xanh lá | Trình diễn diều nghệ thuật | Cách khu vực chính ~2km |
| 5 | Sông Cổ Cò | Tím | Đua thuyền truyền thống (chỉ ngày 3) | Sự kiện đặc biệt |
| 6 | Các tuyến đường chính TP | Cam | Diễu hành xe hoa (18:00–20:00 ngày 1-3) | Tuyến di động |

Địa điểm 1, 2, 3 nằm cực kỳ sát nhau — pin chồng chéo trên mobile, bản đồ lớn hơn trên desktop giúp bớt chồng nhưng vai trò bổ trợ không đổi.

---

## 6. FEATURE LIST & ROADMAP

### Quy ước Effort

| Size | Ước lượng | Mô tả |
|---|---|---|
| XS | 2-4 giờ | Config, util đơn giản |
| S | 4-8 giờ | Component đơn, logic rõ ràng |
| M | 8-16 giờ | Feature nhiều phần, có state phức tạp |
| L | 16-24 giờ | Feature core, nhiều edge case |

### Tuần 0 — Data, Setup & Scaffolding

| ID | Tính năng | Effort | Phụ thuộc |
|---|---|---|---|
| 0.0 | Init project (Vite + React + Tailwind + React-Leaflet + react-i18next) | XS | — |
| 0.1 | locations.json (5-6 địa điểm + tọa độ GPS) | XS | — |
| 0.2 | schedule.json (40+ sự kiện 4 ngày, gắn location_id, category, trường image optional) | S | 0.1 |
| 0.3 | Hook useTimeGroup — phân nhóm thời gian thực (đang/sắp/xong) | S | 0.2 |
| 0.4 | colorMap.js — hệ màu địa điểm (tone trầm ấm) + 6 category | XS | 0.1 |
| 0.5 | Tailwind config + design tokens (bảng màu ấm, font lớn, tương phản cao, mobile-first) | S | 0.0 |
| 0.6 | i18n JSONs (vi, en) + config react-i18next | S | 0.0 |
| 0.7 | Thu thập ảnh đại diện lễ hội (2-3 ảnh từ BTC/Sở VHTTDL) cho Header + EmptyState | XS | — *(phi kỹ thuật, cần sớm)* |

### Tuần 1 — Tab Chương trình (giao diện chính)

| ID | Tính năng | Effort | Phụ thuộc |
|---|---|---|---|
| H1 | Header.jsx — banner ảnh + tên lễ hội + tagline + ngày diễn ra | XS | 0.5, 0.7 |
| H2 | EmptyState.jsx — countdown (trước lễ hội) / thông báo kết thúc (sau lễ hội) + tóm tắt + nút add to calendar | S | 0.2, 0.3, H1 |
| T1 | DayFilter.jsx — 4 nút lọc ngày, mặc định hôm nay + hook useFilters | S | 0.2 |
| T2 | LocationFilter.jsx — chips cuộn ngang + hệ màu (tích hợp useFilters) | S | 0.1, 0.4 |
| T3 | EventList.jsx — danh sách 3 nhóm tự động (dùng useTimeGroup) | L | 0.2, 0.3, T1, T2 |
| T4 | EventCard.jsx — giờ, tên, địa điểm + tag màu (text-only) | M | T3, 0.4 |
| T5 | EventDetail.jsx — modal khi tap card + ảnh optional + nút Chỉ đường (deepLink.js) | S | T4 |

### Tuần 2 — Tab Bản đồ + Responsive Layout

| ID | Tính năng | Effort | Phụ thuộc |
|---|---|---|---|
| M1 | FestivalMap.jsx — React-Leaflet + OpenStreetMap (5-6 pin cố định) | M | 0.1, 0.4 |
| M2 | LocationPopup.jsx — tên địa điểm + nút Chỉ đường (deepLink.js) | S | M1 |
| M3 | TabNav.jsx + App routing (chuyển đổi Chương trình ↔ Bản đồ) | S | T3, M1 |
| M4 | QR code component (api.qrserver.com) | XS | — |
| M5 | Weather widget component (Open-Meteo API) | XS | — |
| R1 | useBreakpoint.js — hook trả về isMobile (ngưỡng 768px, lắng nghe resize) | XS | 0.0 |
| R2 | ResponsiveLayout.jsx — mobile: 1 cột + tab; tablet+: flex row 2 cột, bản đồ sticky | S | R1, T3, M1, M3 |
| R3 | TabNav conditional render — ẩn tab trên ≥ 768px | XS | R1, M3 |
| R4 | Test responsive — tablet dọc, tablet ngang, desktop | S | R2, R3 |

### Tuần 3 — Polish + Multi-language

| ID | Tính năng | Effort | Phụ thuộc |
|---|---|---|---|
| A9 | Tích hợp react-i18next vào tất cả component (vi/en) | M | 0.6, T3, M1 |
| — | Test tổng thể (responsive, accessibility, cross-browser) | M | Tất cả |

---

## 7. SYSTEM DESIGN

### 7.1. Data Schema

#### locations.json

```json
[
  {
    "id": "chua",
    "name": "Khuôn viên Chùa Quán Thế Âm",
    "shortName": "Khuôn viên Chùa",
    "address": "48 Sư Vạn Hạnh, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng",
    "lat": 15.9975,
    "lng": 108.2635,
    "color": "#B8860B",
    "description": "Địa điểm trung tâm — lễ nghi Phật giáo, triển lãm, hoa đăng"
  },
  {
    "id": "san-khau",
    "name": "Sân khấu chính",
    "shortName": "Sân khấu chính",
    "address": "Khuôn viên Chùa Quán Thế Âm",
    "lat": 15.9972,
    "lng": 108.2631,
    "color": "#8B2500",
    "description": "Khai mạc, bế mạc, chương trình nghệ thuật, thuyết pháp"
  },
  {
    "id": "su-van-hanh",
    "name": "Đường Sư Vạn Hạnh",
    "shortName": "Đ. Sư Vạn Hạnh",
    "address": "Đường Sư Vạn Hạnh, Hòa Hải, Ngũ Hành Sơn",
    "lat": 15.9965,
    "lng": 108.2618,
    "color": "#2E5A88",
    "description": "Triển lãm, trò chơi dân gian, múa rối, bài chòi"
  },
  {
    "id": "hoa-quy",
    "name": "Công viên Hòa Quý – Đồng Nò",
    "shortName": "CV Hòa Quý",
    "address": "Khu đô thị Hòa Quý – Đồng Nò, Ngũ Hành Sơn",
    "lat": 15.9850,
    "lng": 108.2550,
    "color": "#4A6741",
    "description": "Trình diễn diều nghệ thuật — cách khu vực chính ~2km"
  },
  {
    "id": "song-co-co",
    "name": "Sông Cổ Cò",
    "shortName": "Sông Cổ Cò",
    "address": "Sông Cổ Cò, Ngũ Hành Sơn",
    "lat": 15.9960,
    "lng": 108.2600,
    "color": "#6A3D7D",
    "description": "Đua thuyền truyền thống — chỉ ngày 06/04"
  },
  {
    "id": "dieu-hanh",
    "name": "Các tuyến đường chính TP",
    "shortName": "Diễu hành xe hoa",
    "address": "Các tuyến đường chính, TP Đà Nẵng",
    "lat": 15.9970,
    "lng": 108.2500,
    "color": "#B5651D",
    "description": "Diễu hành xe hoa 18:00–20:00 ngày 1-3"
  }
]
```

**Lưu ý:** Tọa độ GPS là ước lượng dựa trên địa chỉ. Cần verify tại thực địa hoặc xác nhận từ Google Maps trước khi deploy.

#### schedule.json — cấu trúc mỗi event

```json
{
  "id": "d1-01",
  "title": "Lễ khai kinh Thượng phan, Thượng kỳ, Thượng phướn",
  "date": "2026-04-04",
  "lunarDate": "17/02 Âm lịch",
  "dayIndex": 0,
  "startTime": "07:00",
  "endTime": null,
  "locationId": "chua",
  "category": "ceremony",
  "leadOrg": "Chùa Quán Thế Âm",
  "partnerOrgs": ["Sở Dân tộc và Tôn giáo", "BTS Giáo hội Phật giáo VN thành phố"],
  "image": null,
  "isFeatured": false,
  "description": "Nghi thức mở đầu lễ hội — khai kinh, treo phan, cờ, phướn tại khuôn viên Chùa"
}
```

**Quy tắc ID:** `d{dayIndex+1}-{số thứ tự 2 chữ số}` → d1-01, d1-02... d4-02.

**Quy tắc endTime:** sự kiện có khung giờ rõ (10:00–17:30) ghi đủ. Sự kiện chỉ có giờ bắt đầu (09:00) thì endTime = null, frontend ước lượng 1-2 giờ.

**Quy tắc category:** `ceremony` | `dharma` | `folk` | `exhibition` | `culinary` | `art` — xem bảng phân loại ở section 3.

### 7.2. Component Interface

#### Hooks

```typescript
// useBreakpoint.js
// Trả về: { isMobile: boolean }
// Logic: window.innerWidth < 768 → true. Lắng nghe resize.

// useFilters.js
// State: { selectedDay: number (0-3), selectedLocationId: string | "all" }
// Trả về: { selectedDay, selectedLocationId, setDay, setLocation, filteredEvents }
// filteredEvents: lọc từ schedule.json theo day + location

// useTimeGroup.js
// Input: filteredEvents (từ useFilters), currentTime
// Trả về: { ongoing: Event[], upcoming: Event[], ended: Event[] }
// Logic:
//   - ongoing: startTime <= now <= endTime (hoặc startTime <= now < startTime + 2h nếu endTime null)
//   - upcoming: startTime > now
//   - ended: endTime < now (hoặc startTime + 2h < now nếu endTime null)
//   - Cập nhật mỗi 60 giây (setInterval)
```

#### Components — props chính

```
Header          — không props (dùng ảnh static + text cố định)
EmptyState      — không props (logic tự check ngày hiện tại vs khoảng 04-07/04)

DayFilter       — { selectedDay, onDayChange }
LocationFilter  — { selectedLocationId, onLocationChange, locations }
EventList       — { ongoing, upcoming, ended }
EventCard       — { event, colorMap }  // event = 1 object từ schedule.json
EventDetail     — { event, location, onClose }  // modal khi tap card

FestivalMap     — { locations, colorMap }
LocationPopup   — { location }  // popup khi tap pin

TabNav          — { activeTab, onTabChange }  // ẩn khi isMobile = false
ResponsiveLayout — { children }  // wrapper quyết định 1 cột vs 2 cột
```

#### State flow

```
App.jsx
├── useBreakpoint() → isMobile
├── useFilters() → selectedDay, selectedLocationId, filteredEvents
│
├── ResponsiveLayout (dùng isMobile)
│   ├── [Cột trái / Tab Chương trình]
│   │   ├── Header
│   │   ├── DayFilter ← selectedDay, setDay
│   │   ├── LocationFilter ← selectedLocationId, setLocation
│   │   └── EventList ← useTimeGroup(filteredEvents)
│   │       └── EventCard (mỗi card)
│   │           └── EventDetail (modal khi tap)
│   │
│   └── [Cột phải / Tab Bản đồ] (ẩn trên mobile khi tab != bản đồ)
│       └── FestivalMap ← locations
│           └── LocationPopup (khi tap pin)
│
└── TabNav (chỉ hiện khi isMobile = true)
```

### 7.3. Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Màu nền & chữ
        warm: {
          bg: '#FFF8F0',        // nền chính — vàng nghệ rất nhạt
          card: '#FFFDF7',      // nền card
          text: '#3E2723',      // chữ chính — nâu đậm
          muted: '#795548',     // chữ phụ — nâu nhạt
        },
        // Màu nhấn
        accent: {
          gold: '#C8A35A',      // nút chính, highlight
          brown: '#6B4226',     // heading
          green: '#4A6741',     // trạng thái "Đang diễn ra"
        },
        // Màu địa điểm (đồng bộ colorMap.js)
        loc: {
          chua: '#B8860B',      // Khuôn viên Chùa — vàng nghệ
          'san-khau': '#8B2500', // Sân khấu chính — đỏ trầm
          'su-van-hanh': '#2E5A88', // Đường SVH — xanh dương trầm
          'hoa-quy': '#4A6741', // Công viên — xanh rêu
          'song-co-co': '#6A3D7D', // Sông Cổ Cò — tím trầm
          'dieu-hanh': '#B5651D', // Diễu hành — cam đất
        },
        // Màu category
        cat: {
          ceremony: '#C8A35A',  // Lễ nghi — gold
          dharma: '#8B6914',    // Phật pháp — gold đậm
          folk: '#2E7D32',      // Dân gian — xanh lá
          exhibition: '#2E5A88', // Triển lãm — xanh dương
          culinary: '#E65100',  // Ẩm thực chay — cam
          art: '#6A3D7D',       // Nghệ thuật — tím
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Tăng kích thước mặc định cho thân thiện người lớn tuổi
        'base': ['1rem', '1.625'],     // 16px, line-height 26px
        'lg': ['1.125rem', '1.625'],   // 18px
        'xl': ['1.25rem', '1.5'],      // 20px
      },
      screens: {
        'tablet': '768px',
        'desktop': '1024px',
      },
    },
  },
  plugins: [],
}
```

### 7.4. API & Deep Link Specs

#### Open-Meteo (Weather)

```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=15.9975
  &longitude=108.2635
  &current=temperature_2m,weather_code
  &timezone=Asia/Ho_Chi_Minh
  &forecast_days=1

Response: { current: { temperature_2m: 28.5, weather_code: 3 } }
Weather code mapping: 0=trời quang, 1-3=ít mây, 45-48=sương, 51-67=mưa, 80-82=mưa rào
Fallback: hiển thị "Không có dữ liệu thời tiết" nếu API lỗi. Không block UI.
```

#### QR Code (api.qrserver.com)

```
GET https://api.qrserver.com/v1/create-qr-code/
  ?size=200x200
  &data=https://lehoi-quantheam.vn

Trả về: ảnh PNG. Dùng trực tiếp trong <img src="...">
Fallback: ẩn QR nếu lỗi.
```

#### Deep Link — Chỉ đường Google Maps

```javascript
// utils/deepLink.js
export function getDirectionsUrl(lat, lng, label) {
  const encoded = encodeURIComponent(label);
  // Ưu tiên Google Maps app trên mobile, fallback web
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=walking`;
}

// Sử dụng: window.open(getDirectionsUrl(15.9975, 108.2635, "Chùa Quán Thế Âm"))
```

### 7.5. Lễ hội config

```json
{
  "festivalName": "Lễ hội Quán Thế Âm, Ngũ Hành Sơn",
  "year": 2026,
  "lunarYear": "Bính Ngọ",
  "tagline": "Di sản văn hóa phi vật thể quốc gia",
  "startDate": "2026-04-04",
  "endDate": "2026-04-07",
  "lunarDates": ["17/02", "18/02", "19/02", "20/02"],
  "dayLabels": ["Khai mạc", "Ngày 2", "Lễ chính", "Bế mạc"],
  "mapCenter": { "lat": 15.9965, "lng": 108.2615 },
  "mapZoom": 15,
  "languages": ["vi", "en"]
}
```

---

## 8. HỖ TRỢ MÀN HÌNH LỚN (TABLET + DESKTOP)

### Nhóm người dùng

| Nhóm | Thiết bị | Nhu cầu |
|---|---|---|
| Tra cứu trước khi đến | Desktop/laptop | Xem tổng quan 4 ngày, lên kế hoạch |
| Ban tổ chức & tình nguyện viên | Tablet/laptop tại hiện trường | Giám sát tiến trình — cần thấy đồng thời timeline và bản đồ |
| Báo chí, KOL, nhiếp ảnh | Laptop | Chọn sự kiện — cần chi tiết đơn vị, thời lượng, địa điểm |
| Kiosk thông tin tại lễ hội | Màn hình lớn cố định | Hiển thị tự động, font lớn |

### Responsive layout — 3 breakpoint

| Breakpoint | Kích thước | Layout |
|---|---|---|
| Mobile | < 768px | 1 cột + 2 tab (giữ nguyên) |
| Tablet | 768px – 1024px | 2 cột: timeline 55-60% / bản đồ 40-45%, ẩn tab |
| Desktop | > 1024px | 2 cột: timeline 60-65% / bản đồ 35-40%, ẩn tab |

### Triển khai chia 2 đợt

#### Đợt 1 — Trước lễ hội (tasks R1-R4 trong roadmap Tuần 2)

Mục tiêu: trên ≥ 768px, timeline bên trái + bản đồ bên phải cùng lúc, không cần chuyển tab. Chỉ thay đổi layout, không chạm logic component.

**Checklist hoàn thành:**
1. iPad (768px+): timeline trái + bản đồ phải, không có tab
2. Điện thoại (< 768px): trải nghiệm y hệt
3. Cuộn danh sách cột trái — bản đồ cột phải đứng yên
4. Tap card → modal; tap pin → popup + chỉ đường — hoạt động đúng

**Rủi ro:**

| Rủi ro | Xử lý |
|---|---|
| React-Leaflet không tự resize khi container đổi kích thước | `map.invalidateSize()` trong useEffect hoặc ResizeObserver |
| `100vh` sai trên tablet (thanh địa chỉ trình duyệt) | Dùng `100dvh` hoặc JS fallback |
| DayFilter + LocationFilter chiếm nhiều không gian dọc | Gộp 1 hàng trên desktop nếu kịp, nếu không giữ 2 hàng |

#### Đợt 2 — Sau lễ hội (chuẩn bị năm sau)

| ID | Tính năng | Effort |
|---|---|---|
| R5 | Shared state `selectedLocationId` (React context) — liên kết 2 panel | S |
| R6 | Map highlight khi chọn card + card auto-scroll khi tap pin | M |
| R7 | EventCard responsive — thêm 1-2 dòng mô tả trên desktop | XS |
| R8 | EventDetail variant — inline expand hoặc side panel thay vì modal trên desktop | S |
| R9 | Test tương tác liên kết + responsive variants | S |

### Không làm

- Giao diện desktop riêng (tạo codebase song song)
- Hiển thị 4 ngày cùng lúc trên desktop (40+ sự kiện quá nhiều, giữ DayFilter)
- Thêm filter phức tạp hơn (mỗi ngày 10-17 sự kiện, 2 lớp lọc đủ)
- Bản đồ làm trung tâm trên desktop (pin chồng chéo vẫn tồn tại)

---

## 9. SO SÁNH VỚI PHƯƠNG ÁN BẢN ĐỒ LÀM TRUNG TÂM (V1)

| Tiêu chí | V1 — Bản đồ trung tâm | V2 — Timeline + Bản đồ hỗ trợ |
|---|---|---|
| Trả lời "đang diễn ra gì?" | Chậm (phải tap pin, đọc popup) | Nhanh (mở app là thấy) |
| Trả lời "ở đâu?" | Tốt | Tốt (tab/cột Bản đồ) |
| Xử lý pin chồng chéo | Phức tạp (clustering, zoom) | Không cần (pin tách riêng tab/cột) |
| Hiển thị chiều thời gian | Yếu | Mạnh (tự động phân nhóm) |
| Hỗ trợ màn hình lớn | Cần redesign | Responsive layout tự nhiên (2 cột) |
| Thân thiện người lớn tuổi | Trung bình (cần zoom, tap nhỏ) | Cao (cuộn dọc, font lớn) |
| Tái sử dụng năm sau | Thấp (code monolithic) | Cao (component-based, cập nhật data JSON) |
