# USER STORIES — UX IMPROVEMENTS
## Dựa trên review artifact Living Timeline v2

---

## US-3.1 — Vertical Timeline Rail & Highlight Events

### Bối cảnh vấn đề

Hiện tại danh sách sự kiện là **các card xếp chồng đứng** — trông giống danh sách thông thường, chưa tạo được cảm giác "dòng thời gian sống" như thiết kế đề xuất. Người dùng khó nhận biết:

- Mình đang ở **đâu trên dòng thời gian** trong ngày
- Sự kiện nào là **điểm nhấn quan trọng** (Khai mạc, Lễ vía Bồ tát, Đua thuyền) — hiện tại data có field `highlight: true` nhưng card không phân biệt gì so với sự kiện thường

### User Story

**As a** người dùng đang lướt timeline trong ngày lễ hội,
**I want** nhìn thấy một trục thời gian trực quan chạy dọc bên trái các card, với các sự kiện quan trọng được đánh dấu nổi bật,
**So that** tôi nắm được vị trí hiện tại trong ngày và không bỏ lỡ các sự kiện chính.

**Effort:** M (8-12h)

### Acceptance Criteria

**A. Timeline Rail (thanh dọc bên trái)**

- [ ] Thanh dọc 2px chạy liên tục bên trái danh sách sự kiện, kết nối tất cả card
- [ ] Mỗi card có một **node tròn** trên thanh:
  - Đang diễn ra: node filled 12px, màu `#10b981`, có ring animation nhẹ (pulse 2s loop, chỉ ring ngoài, không toàn bộ node)
  - Sắp tới: node outline 8px, border 2px, màu secondary
  - Đã kết thúc: node filled 6px, màu muted
- [ ] Thanh đổi màu theo đoạn:
  - Đoạn đã qua: màu muted (`#cbd5e1` light / `#334155` dark)
  - Đoạn đang diễn ra: màu `#10b981`, đậm hơn (3px)
  - Đoạn sắp tới: màu muted, style dashed hoặc dotted
- [ ] **Vạch "BÂY GIỜ"**: một marker ngang nhỏ trên rail tại vị trí giờ hiện tại (hoặc giờ giả lập), kèm label "Bây giờ" font 10px — giúp định vị trực quan
- [ ] Rail ẩn khi section "Đã kết thúc" đang collapsed (chỉ hiện rail cho live + upcoming)

**B. Highlight Events (sự kiện quan trọng)**

- [ ] Card có `highlight: true` thêm visual distinction:
  - Border gradient subtle bên trái (thay vì border đều) hoặc background tint nhẹ hơn card thường
  - Icon ⭐ nhỏ (12px) trước tên sự kiện
  - Node trên rail lớn hơn (14px) với viền kép (double ring)
- [ ] Không quá 3-5 sự kiện highlight mỗi ngày (data đã đảm bảo điều này)
- [ ] Highlight style nhất quán cả 3 trạng thái (live, upcoming, ended) — chỉ khác opacity khi ended

**C. Responsive & Performance**

- [ ] Rail width tổng (node + padding): 32px bên trái mỗi card
- [ ] Trên màn hình < 360px: rail thu gọn còn 24px, node nhỏ hơn 2px
- [ ] Animation dùng CSS only (`@keyframes`), không JS interval — tránh re-render
- [ ] Rail render bằng CSS `::before` / `::after` pseudo-elements hoặc absolute-positioned divs — không thêm DOM nodes phức tạp

### Layout thay đổi

```
TRƯỚC:                          SAU:
┌──────────────────┐            │
│  Card sự kiện    │            ●── ┌──────────────────┐
│                  │            │   │  Card sự kiện    │
└──────────────────┘            │   └──────────────────┘
                                │
┌──────────────────┐            ┃   ── BÂY GIỜ ──
│  Card sự kiện    │            ┃
│                  │            ◉── ┌──────────────────┐ ← live, node lớn
└──────────────────┘            ┃   │  🟢 ĐANG DIỄN RA │
                                ┃   └──────────────────┘
┌──────────────────┐            ┃
│  Card sự kiện    │            ╏
│                  │            ○── ┌──────────────────┐ ← upcoming
└──────────────────┘            ╏   │  ⭐ Lễ vía ...   │ ← highlight
                                ╏   └──────────────────┘
```

### Technical Notes

- Dùng `relative` trên container, `absolute` trên rail line — tránh ảnh hưởng scroll performance
- Section headers ("ĐANG DIỄN RA", "SẮP TỚI") nằm **trên** rail, không xuyên qua
- Khi filter location hoặc fav: rail vẫn hiển thị nhưng chỉ cho các card visible
- Timeline rail **không hiển thị** trong filter "♥ Đã lưu" xuyên ngày (vì sự kiện không liên tục trên cùng trục thời gian)

### Dependencies

Không. Chỉ thay đổi visual layer trên EventList + EventCard hiện có.

### Test Scenarios

| Scenario | Kỳ vọng |
|---|---|
| Kéo slider giờ từ 06:00 → 22:00 | Vạch "Bây giờ" di chuyển mượt trên rail, node chuyển trạng thái |
| Ngày 1 lúc 17:30 | Card "KHAI MẠC LỄ HỘI" có highlight style + node đặc biệt trên rail |
| Ngày 4 (chỉ 2 sự kiện) | Rail ngắn, không bị stretch thừa |
| Filter location "Chùa" | Rail chỉ hiển thị cho các card Chùa, không có đoạn trống giữa |
| Dark mode | Rail color, node color đổi theo palette dark |

---

## US-3.2 — Persistent Favorites (lưu giữ qua browser sessions)

### Bối cảnh vấn đề

Người dùng lưu sự kiện yêu thích trong ngày lễ hội, sau đó tắt trình duyệt (hết pin, chuyển app, khóa máy). Khi mở lại, danh sách đã lưu phải còn nguyên — nếu mất, mất luôn niềm tin vào app.

### User Story

**As a** người dùng lễ hội,
**I want** các sự kiện tôi đã lưu vẫn còn khi tắt và mở lại trình duyệt,
**So that** tôi không phải đánh dấu lại mỗi lần mở app.

**Effort:** S (4-6h)

### Acceptance Criteria

- [ ] Dữ liệu lưu bằng `localStorage` với key `festival-qta-2026-favorites`, value là JSON array of event IDs (ví dụ: `[1, 13, 29, 31]`)
- [ ] Khi app mount: đọc localStorage → parse → hydrate vào state. Nếu key không tồn tại hoặc parse lỗi → Set rỗng, không crash
- [ ] Mỗi lần toggle (lưu/bỏ lưu): ghi lại localStorage ngay lập tức, không debounce
- [ ] `loaded` flag = `true` sau khi đọc xong → tránh flash nút ♡ trước khi hydrate
- [ ] Wrap `JSON.parse` trong try-catch — data có thể bị corrupt bởi user hoặc extension
- [ ] Nếu deploy dưới dạng Claude artifact: dùng `window.storage` API (async) thay cho localStorage

### Test Scenarios

| Scenario | Kỳ vọng |
|---|---|
| Lưu 3 sự kiện → tắt browser → mở lại | 3 sự kiện vẫn có ♥, filter "Đã lưu" hiện đúng 3 |
| Lưu → xóa localStorage thủ công → reload | Set rỗng, không crash, không lỗi UI |
| localStorage chứa JSON bị corrupt | Parse fail → Set rỗng, app hoạt động bình thường |
| 2 tab mở cùng lúc, tab A lưu sự kiện | Tab B thấy khi reload (không cần sync real-time giữa tab) |

---

## TÓM TẮT

| ID | User Story | Effort | Focus | Dependencies |
|---|---|---|---|---|
| **US-3.1** | Timeline Rail & Highlight Events | M (8-12h) | Timeline UX | Không |
| **US-3.2** | Persistent Favorites | S (4-6h) | Favorites UX | US-1.1 |

**Tổng effort:** ~12-18h (2-3 ngày cho 1 developer)

### Thứ tự implement

```
US-3.2 làm trước (blocker cho mọi thứ liên quan đến Lưu)
US-3.1 làm song song hoặc sau (độc lập)
```
