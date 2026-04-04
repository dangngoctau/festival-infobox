# Xác minh tọa độ GPS

Tất cả tọa độ trong dự án là **ước lượng** dựa trên địa chỉ và sơ đồ BTC. Cần xác minh tại thực địa hoặc qua Google Maps trước khi deploy.

---

## Cách xác minh

1. Mở Google Maps → chuột phải (hoặc nhấn giữ trên mobile) → **"What's here?"** → copy tọa độ
2. Hoặc: `https://www.google.com/maps?q=LAT,LNG` — xem pin có đúng vị trí không

---

## 1. Địa điểm tổ chức (`src/data/locations.json`)

| ID | Tên | Lat | Lng | Ghi chú |
|---|---|---|---|---|
| `chua` | Khuôn viên Chùa Quán Thế Âm | 15.9975 | 108.2635 | Trung tâm khuôn viên chùa |
| `san-khau` | Sân khấu chính | 15.9972 | 108.2631 | Rất sát Chùa — kiểm tra có chồng pin không |
| `su-van-hanh` | Đường Sư Vạn Hạnh | 15.9965 | 108.2618 | Giữa đoạn đường lễ hội |
| `hoa-quy` | Công viên Hòa Quý – Đồng Nò | 15.9850 | 108.2550 | Cách khu chính ~2km |
| `song-co-co` | Sông Cổ Cò | 15.9960 | 108.2600 | Đoạn sông gần khu lễ hội |
| `dieu-hanh` | Tuyến diễu hành xe hoa | 15.9970 | 108.2500 | Điểm đại diện trên tuyến đường |
| `mieu-huyen-tran` | Miếu Huyền Trân Công Chúa | 15.9977 | 108.2638 | Trong khuôn viên chùa |

**Khi thay đổi:** Sửa trực tiếp `lat`/`lng` trong `src/data/locations.json`. Các file khác tham chiếu location qua `locationId`, không lưu tọa độ riêng.

---

## 2. Cổng chào lễ hội (`src/data/festivalConfig.js` → `gateCoords`)

| Tên | Lat | Lng | Ghi chú |
|---|---|---|---|
| Cổng chào Sư Vạn Hạnh × Lê Văn Hiến | 15.9955 | 108.2650 | Lối vào chính, gần bãi xe và trạm bus |

**Khi thay đổi:** Sửa `gateCoords` trong `src/data/festivalConfig.js`. PracticalInfo trên landing page đọc từ đây cho link "Chỉ đường đến cổng chào".

---

## 3. Tâm bản đồ (`src/data/festivalConfig.js` → `mapCenter`)

| Tên | Lat | Lng | Ghi chú |
|---|---|---|---|
| Tâm bản đồ lễ hội | 15.9965 | 108.2615 | Trung bình các địa điểm chính |

**Khi thay đổi:** Sửa `mapCenter` trong `src/data/festivalConfig.js`. Ảnh hưởng:
- Vị trí mặc định của bản đồ (`FestivalMap.jsx`)
- Tọa độ API thời tiết trong `PracticalInfo.jsx` (đọc `mapCenter`)

**Lưu ý:** `WeatherWidget.jsx` (header) đang **hardcode** tọa độ `latitude=15.9975&longitude=108.2635` thay vì đọc từ config. Nếu đổi `mapCenter`, cần cập nhật cả URL trong `src/components/layout/WeatherWidget.jsx` dòng 6.

---

## 4. Tiện ích (`src/data/amenities.json`)

Tất cả amenities đều có `"provisional": true` — đánh dấu chưa xác minh.

| ID | Tên | Lat | Lng | Loại |
|---|---|---|---|---|
| `wc_01` | WC - Cổng chính Chùa | 15.9977 | 108.2639 | wc |
| `wc_02` | WC - Sư Vạn Hạnh | 15.9962 | 108.2612 | wc |
| `wc_03` | WC - Hòa Quý | 15.9852 | 108.2553 | wc |
| `parking_01` | Bãi ô tô - Chùa | 15.9980 | 108.2642 | parking_car |
| `parking_02` | Bãi xe máy - Sư Vạn Hạnh | 15.9958 | 108.2610 | parking_bike |
| `parking_03` | Bãi xe máy - Hòa Quý | 15.9847 | 108.2545 | parking_bike |
| `medical_01` | Trạm y tế lễ hội | 15.9973 | 108.2628 | medical |
| `medical_02` | Trạm y tế Hòa Quý | 15.9855 | 108.2548 | medical |
| `water_01` | Nước uống - Chùa | 15.9974 | 108.2633 | water |
| `water_02` | Nước uống - Sư Vạn Hạnh | 15.9967 | 108.2620 | water |
| `info_01` | Quầy thông tin BTC | 15.9970 | 108.2625 | info |
| `atm_01` | ATM Vietcombank | 15.9960 | 108.2605 | atm |

**Khi thay đổi:** Sửa `lat`/`lng` trong `src/data/amenities.json`. Sau khi xác minh xong, bỏ trường `"provisional": true`.

---

## Tổng hợp: file nào chứa tọa độ GPS

| File | Chứa gì | Ghi chú |
|---|---|---|
| `src/data/locations.json` | 7 địa điểm tổ chức | Nguồn chính cho bản đồ + popup |
| `src/data/festivalConfig.js` | `gateCoords`, `mapCenter` | Link chỉ đường + tâm bản đồ + API thời tiết |
| `src/data/amenities.json` | 12 tiện ích (WC, bãi xe, y tế...) | Tất cả `provisional: true` |
| `src/components/layout/WeatherWidget.jsx` | Hardcode trong URL API | ⚠️ Nên chuyển sang đọc từ `festivalConfig.mapCenter` |
