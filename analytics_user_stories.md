# User Stories — Analytics & Observability
# App Lễ hội Quán Thế Âm 2026

**Quy ước Effort:** XS (2-4h) · S (4-8h) · M (8-16h) · L (16-24h)

---

## Epic 0 — Foundation

### US-AN-0.1: Analytics Abstraction Layer
**Là** developer,  
**tôi muốn** có một file trung gian duy nhất cho mọi tracking call,  
**để** component không phụ thuộc trực tiếp vào vendor và có thể đổi tool sau này mà không sửa component.

**Acceptance Criteria:**
- [ ] Tạo `src/utils/analytics.js` export các hàm wrapper tường minh: `trackAppOpened()`, `trackFilterApplied()`, `trackEventDetailViewed()`, `trackDirectionsRequested()`, `trackFeatureEngaged()`, `trackErrorEncountered()`
- [ ] Mọi hàm wrapper tự động inject context chung: `app_version`, `festival_day`, `language`, `platform`
- [ ] `festival_day` được tính từ ngày thực tế: trả về `1–4` trong lễ hội, `null` ngoài lễ hội
- [ ] Trong môi trường `development` (`import.meta.env.DEV`): chỉ `console.log` event, không gửi lên PostHog
- [ ] Toàn bộ codebase không có lời gọi `posthog.capture()` trực tiếp — chỉ dùng qua wrapper
- [ ] Có JSDoc comment cho mỗi hàm nêu rõ câu hỏi kinh doanh mà event đó trả lời

**Effort:** S (4-8h)  
**Phụ thuộc:** Không  
**Ghi chú:** Task này phải hoàn thành trước mọi US khác trong Epic này.

---

### US-AN-0.2: Sentry Setup
**Là** developer,  
**tôi muốn** tích hợp Sentry vào app,  
**để** mọi lỗi JavaScript và API failure được ghi nhận real-time trong 4 ngày lễ hội.

**Acceptance Criteria:**
- [ ] Install `@sentry/react`, cấu hình DSN từ environment variable (`VITE_SENTRY_DSN`) — không hardcode trong source
- [ ] Wrap toàn bộ `<App />` bằng `Sentry.ErrorBoundary` với fallback UI thân thiện (không hiện stack trace cho người dùng cuối)
- [ ] Sentry chỉ active khi `import.meta.env.PROD === true` — không gửi error trong development
- [ ] Cấu hình `tracesSampleRate: 0.2` (20% performance traces) để không ảnh hưởng tốc độ
- [ ] Bổ sung Sentry context khi user xem event: `Sentry.setContext("current_event", { event_id, event_name })` — giúp biết user đang làm gì khi crash
- [ ] Test: throw error thủ công trong dev, tắt PROD guard tạm thời, verify event xuất hiện trên Sentry dashboard trong vòng 30 giây
- [ ] Cấu hình alert email khi có error mới xuất hiện lần đầu

**Effort:** S (4-8h)  
**Phụ thuộc:** US-AN-0.1  
**Ghi chú:** Sentry phải xong trước PostHog — bug tracking ưu tiên hơn analytics.

---

### US-AN-0.3: PostHog Setup
**Là** developer,  
**tôi muốn** tích hợp PostHog vào app,  
**để** có nền tảng thu thập custom events cho toàn bộ analytics strategy.

**Acceptance Criteria:**
- [ ] Install `posthog-js`, khởi tạo với API key từ `VITE_POSTHOG_KEY` — không hardcode
- [ ] Cấu hình `persistence: "localStorage"` — không dùng cookies
- [ ] Disable autocapture (`autocapture: false`) — chỉ track manual events đã định nghĩa, không track click bừa bãi
- [ ] Disable session recording mặc định (`sessionRecording: { maskAllInputs: true }`) — bật lại khi cần debug cụ thể
- [ ] PostHog chỉ khởi tạo sau khi user đã thấy analytics notice (check `localStorage.getItem('analytics_acknowledged')`)
- [ ] Verify trên PostHog dashboard: event `app_opened` xuất hiện khi mở app
- [ ] Cấu hình PostHog project timezone: Asia/Ho_Chi_Minh

**Effort:** S (4-8h)  
**Phụ thuộc:** US-AN-0.1, US-AN-0.2 (thứ tự triển khai), US-AN-1.1 (notice phải có trước khi PostHog init)

---

## Epic 1 — Analytics Notice

### US-AN-1.1: Contextual Inline Notice
**Là** người dùng mở app lần đầu,  
**tôi muốn** được thông báo ngắn gọn về việc app thu thập dữ liệu ẩn danh,  
**để** tôi biết điều này mà không bị làm phiền hoặc chặn luồng sử dụng.

**Acceptance Criteria:**
- [ ] Notice chỉ hiển thị nếu `localStorage.getItem('analytics_acknowledged')` chưa tồn tại
- [ ] Vị trí: ngay dưới Location Filter chips, trên danh sách sự kiện — inline, không overlay
- [ ] Timing: xuất hiện sau 800ms kể từ khi event list render xong lần đầu, không xuất hiện trước
- [ ] Animation xuất hiện: slide down + fade in (duration 250ms, ease-out)
- [ ] Nội dung: icon 🔒 (hoặc SVG lock `accent-brown`) + text + nút "OK"
- [ ] Copy (vi): *"App thu thập dữ liệu dùng app ẩn danh để cải thiện trải nghiệm."*
- [ ] Nút "OK": tap → animation collapse height về 0 (duration 200ms) → set `analytics_acknowledged = true` → PostHog khởi tạo
- [ ] Auto-dismiss: nếu user scroll khiến notice ra khỏi viewport hoàn toàn, sau 5 giây tự set flag (không collapse animation vì đã out of view)
- [ ] Sau khi dismiss: space được giải phóng, event list slide lên mượt mà
- [ ] Thiết kế: nền `cream-dark` (#F0EBE0), text `warm-muted`, không có border đặc biệt, không dùng màu cảnh báo
- [ ] Không có: countdown timer, link "Chính sách bảo mật", nút "Từ chối"
- [ ] Đã dịch sang EN/KR/JP trong file i18n tương ứng

**Effort:** S (4-8h)  
**Phụ thuộc:** US-AN-0.1, i18n setup (task 0.6 trong roadmap gốc)

---

## Epic 2 — Custom Events

### US-AN-2.1: Track App Opened
**Là** product owner,  
**tôi muốn** biết traffic phân bổ thế nào theo từng ngày lễ hội và tỷ lệ người dùng quay lại,  
**để** đánh giá ngày nào app được dùng nhiều nhất và mức độ retention trong 4 ngày.

**Acceptance Criteria:**
- [ ] Event `app_opened` được gửi một lần duy nhất mỗi khi app khởi động (không gửi lại khi user quay từ background về foreground)
- [ ] Properties: `day_of_festival` (1-4 hoặc null), `language`, `is_returning` (boolean — true nếu đã có `analytics_acknowledged` trong localStorage từ session trước)
- [ ] Sampling: 100%
- [ ] Gọi từ `App.jsx` trong `useEffect` một lần duy nhất sau khi PostHog đã khởi tạo
- [ ] Verify: mở app 3 lần liên tiếp → PostHog chỉ nhận 3 events, không nhận nhiều hơn

**Effort:** XS (2-4h)  
**Phụ thuộc:** US-AN-0.3

---

### US-AN-2.2: Track Filter Applied
**Là** product owner,  
**tôi muốn** biết người dùng filter theo ngày và địa điểm nào nhiều nhất, và khi nào họ nhận được 0 kết quả,  
**để** phát hiện UX bug (filter combination không có sự kiện) và ưu tiên địa điểm/ngày nổi bật năm sau.

**Acceptance Criteria:**
- [ ] Event `filter_applied` gửi mỗi khi user thay đổi Day Filter hoặc Location Filter
- [ ] Properties: `filter_type` ("day" | "location"), `value` (giá trị cụ thể, ví dụ "05/04" hoặc "chua-quan-the-am"), `result_count` (số sự kiện sau khi lọc)
- [ ] Sampling: 50% — implement bằng `if (Math.random() > 0.5) return` trước khi gọi wrapper
- [ ] `result_count: 0` phải được capture 100% bất kể sampling — đây là signal bug, không được bỏ sót
- [ ] Không gửi event khi filter reset về "Tất cả" (giá trị mặc định khi đổi ngày)
- [ ] Verify: tap lần lượt 4 ngày + 3 địa điểm → PostHog nhận xấp xỉ 3-4 events (50% sampling)

**Effort:** XS (2-4h)  
**Phụ thuộc:** US-AN-0.3, T1 DayFilter, T2 LocationFilter (roadmap gốc)

---

### US-AN-2.3: Track Event Detail Viewed
**Là** product owner,  
**tôi muốn** biết sự kiện nào được xem nhiều nhất và vị trí của chúng trong danh sách,  
**để** hiểu sự kiện nào thực sự thu hút người dùng và liệu các sự kiện ở cuối list có bị "vô hình" không.

**Acceptance Criteria:**
- [ ] Event `event_detail_viewed` gửi khi user tap vào EventCard để xem EventDetail
- [ ] Properties: `event_id`, `event_name`, `location_id`, `day`, `time_group` ("ongoing" | "upcoming" | "ended"), `position_in_list` (0-based index trong danh sách đang hiển thị sau filter)
- [ ] Sampling: 50%
- [ ] `position_in_list` tính theo danh sách thực tế đang hiển thị (sau filter), không phải vị trí tuyệt đối trong toàn bộ schedule
- [ ] Không gửi event khi modal đóng
- [ ] Verify: tap EventCard thứ 3 trong danh sách → `position_in_list: 2`

**Effort:** XS (2-4h)  
**Phụ thuộc:** US-AN-0.3, T4 EventCard, T5 EventDetail (roadmap gốc)

---

### US-AN-2.4: Track Directions Requested
**Là** product owner,  
**tôi muốn** biết bao nhiêu người dùng thực sự tap "Chỉ đường" và từ điểm nào trong app,  
**để** đo conversion rate thực sự của app (từ xem → đi đến địa điểm) và so sánh hiệu quả giữa tab Chương trình và tab Bản đồ.

**Acceptance Criteria:**
- [ ] Event `directions_requested` gửi mỗi khi user tap nút "Chỉ đường" ở bất kỳ đâu trong app
- [ ] Properties: `source` ("event_detail" | "map_pin"), `location_id`, `location_name`, `event_id` (null nếu từ map pin), `day`, `time_group` (null nếu từ map pin)
- [ ] Sampling: **100%** — không được sample event này
- [ ] Event gửi **trước** khi deep link mở Google Maps (không bị block nếu Maps mở ngay)
- [ ] Verify: tap "Chỉ đường" từ EventDetail → event xuất hiện trên PostHog dashboard trước khi Google Maps mở

**Effort:** XS (2-4h)  
**Phụ thuộc:** US-AN-0.3, T5 EventDetail, M2 LocationPopup (roadmap gốc)

---

### US-AN-2.5: Track Feature Engaged
**Là** product owner,  
**tôi muốn** biết secondary features nào được dùng thực sự và feature nào bị mở rồi đóng ngay,  
**để** quyết định giữ, cải thiện, hoặc loại bỏ từng feature trong roadmap năm sau.

**Acceptance Criteria:**
- [ ] Event `feature_engaged` gửi cho các feature: `map_tab`, `weather_widget`, `qr_code`, `share`, `favorite`, `quiz`, `checkin`
- [ ] Properties: `feature` (tên feature), `action` ("opened" | "used" | "dismissed")
- [ ] Định nghĩa rõ từng action:
  - `map_tab` — opened: chuyển sang tab Bản đồ; không có used/dismissed
  - `weather_widget` — opened: widget hiện; used: user tap để xem thêm; dismissed: user đóng trong vòng 3 giây
  - `qr_code` — opened: component render; used: QR load thành công
  - `share` — opened: tap nút share; used: Web Share API thành công hoặc copy link thành công
  - `favorite` — used: toggle on; dismissed: toggle off (bỏ yêu thích)
  - `checkin` — opened: user bắt đầu; used: check-in thành công; dismissed: thoát trước khi hoàn tất
- [ ] Sampling: 100%
- [ ] Không gửi event khi feature fail do lỗi (lỗi đó được track qua `error_encountered`)

**Effort:** S (4-8h)  
**Phụ thuộc:** US-AN-0.3, toàn bộ feature trong Tuần 3 (roadmap gốc)

---

### US-AN-2.6: Track Error Encountered
**Là** developer,  
**tôi muốn** biết lỗi xảy ra trong bối cảnh nào của lễ hội (ngày nào, người dùng đang làm gì),  
**để** bổ sung cho Sentry stack trace bằng thông tin business context, giúp reproduce và fix nhanh hơn.

**Acceptance Criteria:**
- [ ] Event `error_encountered` gửi cho các loại lỗi: `api_failure` (Open-Meteo, QR server), `geolocation_denied`, `map_load_fail`, `data_parse_error`
- [ ] Properties: `error_type`, `context` (tên API hoặc component cụ thể), `day_of_festival`
- [ ] Sampling: **100%**
- [ ] Event gửi trong catch block, sau khi đã gọi `Sentry.captureException()` — không thay thế Sentry
- [ ] Không gửi event cho lỗi do user action (ví dụ: user tự tắt location permission — đó là `geolocation_denied`, không phải lỗi app)
- [ ] Verify: tắt mạng, mở weather widget → `error_encountered` với `error_type: "api_failure"`, `context: "open-meteo"` xuất hiện trên PostHog

**Effort:** XS (2-4h)  
**Phụ thuộc:** US-AN-0.3, US-AN-0.2

---

## Epic 3 — Dashboard & Monitoring

### US-AN-3.1: PostHog Conversion Funnel
**Là** product owner,  
**tôi muốn** thấy funnel từ mở app đến tap Chỉ đường,  
**để** biết chính xác người dùng rời bỏ ở bước nào và có bằng chứng rõ ràng về giá trị của app.

**Acceptance Criteria:**
- [ ] Tạo Funnel trên PostHog với 4 bước theo thứ tự: `app_opened` → `filter_applied` → `event_detail_viewed` → `directions_requested`
- [ ] Funnel có thể filter theo `day_of_festival` để so sánh giữa các ngày
- [ ] Funnel có thể filter theo `language` để so sánh hành vi người dùng trong nước vs quốc tế
- [ ] Conversion window: 30 phút (phù hợp với thời gian dùng app trong một lần ghé thăm địa điểm)
- [ ] Dashboard được lưu và đặt tên rõ ràng: "Funnel — Xem đến Đi"

**Effort:** XS (2-4h)  
**Phụ thuộc:** US-AN-2.1, US-AN-2.2, US-AN-2.3, US-AN-2.4

---

### US-AN-3.2: PostHog Feature Adoption Dashboard
**Là** product owner,  
**tôi muốn** thấy tổng quan adoption của từng feature theo từng ngày lễ hội,  
**để** quyết định feature nào cần cải thiện hoặc loại bỏ trong phiên bản năm sau.

**Acceptance Criteria:**
- [ ] Tạo Bar Chart: số lần `feature_engaged` theo `feature`, breakdown theo `action` (stacked: opened / used / dismissed)
- [ ] Tạo Time Series: `feature_engaged` theo giờ trong ngày — phát hiện peak usage giờ nào
- [ ] Tạo bảng: tỷ lệ `used / opened` cho mỗi feature (conversion rate nội bộ của từng feature)
- [ ] Dashboard lưu tên: "Feature Adoption"
- [ ] Tất cả charts có thể filter theo `day_of_festival`

**Effort:** XS (2-4h)  
**Phụ thuộc:** US-AN-2.5

---

### US-AN-3.3: Sentry Alert Configuration
**Là** developer,  
**tôi muốn** nhận thông báo ngay khi có lỗi mới hoặc lỗi xảy ra với tần suất cao,  
**để** có thể phản ứng và fix trong vòng vài giờ trong 4 ngày lễ hội.

**Acceptance Criteria:**
- [ ] Alert 1 — Lỗi mới: gửi email ngay khi một `error.type` chưa từng xuất hiện trước đó được ghi nhận
- [ ] Alert 2 — Lỗi lặp: gửi email khi cùng một lỗi xảy ra hơn 10 lần trong 30 phút
- [ ] Alert 3 — API failure spike: gửi email khi `api_failure` events tăng đột biến (>20 trong 10 phút)
- [ ] Tất cả alerts gửi đến ít nhất 2 email (developer + project manager)
- [ ] Test alert trước ngày khai mạc: verify email nhận được trong vòng 2 phút

**Effort:** XS (2-4h)  
**Phụ thuộc:** US-AN-0.2

---

## Tổng hợp Effort

| Story | Mô tả ngắn | Effort |
|---|---|---|
| US-AN-0.1 | Analytics abstraction layer | S (4-8h) |
| US-AN-0.2 | Sentry setup | S (4-8h) |
| US-AN-0.3 | PostHog setup | S (4-8h) |
| US-AN-1.1 | Inline analytics notice | S (4-8h) |
| US-AN-2.1 | Track app opened | XS (2-4h) |
| US-AN-2.2 | Track filter applied | XS (2-4h) |
| US-AN-2.3 | Track event detail viewed | XS (2-4h) |
| US-AN-2.4 | Track directions requested | XS (2-4h) |
| US-AN-2.5 | Track feature engaged | S (4-8h) |
| US-AN-2.6 | Track error encountered | XS (2-4h) |
| US-AN-3.1 | Funnel dashboard | XS (2-4h) |
| US-AN-3.2 | Feature adoption dashboard | XS (2-4h) |
| US-AN-3.3 | Sentry alert config | XS (2-4h) |
| **Tổng** | | **~36-64 giờ** |

---

## Thứ tự triển khai

```
Sprint Analytics (song song Tuần 4 — Polish phase)
│
├── Ngày 1-2: Foundation
│   ├── US-AN-0.1 Abstraction layer ★ (unblock tất cả)
│   ├── US-AN-0.2 Sentry setup
│   └── US-AN-3.3 Sentry alerts
│
├── Ngày 3-4: Tracking + Notice
│   ├── US-AN-1.1 Inline notice (phải trước PostHog init)
│   ├── US-AN-0.3 PostHog setup
│   ├── US-AN-2.1 app_opened
│   ├── US-AN-2.4 directions_requested (KPI số 1, ưu tiên nhất)
│   └── US-AN-2.6 error_encountered
│
├── Ngày 5: Remaining Events
│   ├── US-AN-2.2 filter_applied
│   ├── US-AN-2.3 event_detail_viewed
│   └── US-AN-2.5 feature_engaged
│
└── Ngày 6: Dashboard + Dry Run
    ├── US-AN-3.1 Funnel dashboard
    ├── US-AN-3.2 Feature adoption dashboard
    └── Dry run toàn bộ trên mobile thật
```

---

## Sơ đồ phụ thuộc

```
US-AN-0.1 Abstraction Layer ★
    ├── US-AN-0.2 Sentry ──── US-AN-3.3 Alerts
    │                    └─── US-AN-2.6 Error tracking
    │
    ├── US-AN-1.1 Notice
    │       │
    │       └── US-AN-0.3 PostHog
    │               ├── US-AN-2.1 app_opened
    │               ├── US-AN-2.2 filter_applied
    │               ├── US-AN-2.3 event_detail_viewed
    │               ├── US-AN-2.4 directions_requested ← KPI #1
    │               └── US-AN-2.5 feature_engaged
    │                       │
    │               US-AN-3.1 Funnel (←2.1,2.2,2.3,2.4)
    │               US-AN-3.2 Feature Adoption (←2.5)
```
