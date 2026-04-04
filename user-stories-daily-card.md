# User Stories — Daily Schedule Share Card
# Lễ hội Quán Thế Âm 2026

**Concept:** Card tổng quan chương trình 1 ngày, tối ưu cho chia sẻ digital (Zalo, Facebook, Instagram). Sự kiện nhóm theo Sáng/Chiều/Tối, highlight ★ cho sự kiện chính, gom sự kiện cùng giờ. Tỷ lệ 4:5, auto-generate từ schedule.json.

**Quy ước Effort:** XS (2-4h) · S (4-8h) · M (8-16h) · L (16-24h)

**Design System alignment:** Tuân thủ DESIGN_SYSTEM.md v1.0. Bổ sung design system ở cuối tài liệu.

**Quan hệ với Epic S (Single Event Card):** Hai loại card phục vụ hai mục đích khác nhau — Daily Card = "hôm nay có gì" (overview), Single Event Card (US-S series) = "sự kiện này hay lắm" (highlight). Chia sẻ chung component nền, typography tokens, và share flow.

---

## Nguyên tắc thiết kế

### Đúng

- **4:5 ratio** (1080×1350px) — tối ưu feed social
- **Nhóm 3 khung giờ** Sáng ☀ / Chiều 🌤 / Tối 🌙 — mắt scan khung giờ quan tâm trong 2 giây
- **Highlight ★ tối đa 4-5 sự kiện/ngày** — "nếu chỉ đi được vài cái thì đi cái nào"
- **Gom sự kiện cùng giờ** thành 1 dòng (dấu ·) — tiết kiệm chiều dọc
- **Ảnh header thu gọn ~38%** — đủ mood, nhường chỗ cho nội dung
- **Dot indicator 4 ngày** — người nhận biết đây là 1/4

### Không

- **Không QR code** — digital share, không scan được từ cùng điện thoại
- **Không liệt kê đơn vị tổ chức** — card cho du khách, không phải báo cáo nội bộ
- **Không hiện tất cả sự kiện nguyên gốc** — gom + rút gọn tên để fit 4:5 mà vẫn đọc được
- **Không cùng chiều dọc cho mọi ngày** — Ngày 4 chỉ 2 sự kiện, card tự co lại gọn

---

## Epic D — Daily Schedule Share Card

### US-D.0: Schedule Data Enhancement — Time Groups & Highlights
**Là** developer,
**tôi muốn** schedule.json hỗ trợ nhóm thời gian và đánh dấu sự kiện nổi bật,
**để** card tự generate nhóm Sáng/Chiều/Tối và highlight đúng sự kiện.

**Acceptance Criteria:**

**Bổ sung schedule.json:**
- [ ] Mỗi event có field `time_group`: `"morning"` | `"afternoon"` | `"evening"` — phân theo quy tắc:
  - `morning`: trước 12:00
  - `afternoon`: 12:00–17:59
  - `evening`: 18:00 trở đi
- [ ] Mỗi event có field `highlight`: `boolean` — BTC chọn tối đa 4-5 sự kiện/ngày
- [ ] Mỗi event có field `short_name`: `string` — tên rút gọn cho card share (≤ 35 ký tự), ví dụ: "Lân Sư Rồng & Khai mạc hội" thay vì "Khai mạc hội (trình diễn nghệ thuật Lân Sư Rồng và các hoạt động văn hóa, thể thao dân gian)"
- [ ] Mỗi event có field `merge_key`: `string | null` — events cùng `merge_key` và cùng `start_time` gom thành 1 dòng trên card (nối bằng dấu ·). Ví dụ: event "Nhiếp ảnh" và "Ký họa · Thư pháp" cùng 09:30 → `merge_key: "0930-art"`

**Highlight mặc định cho từng ngày:**

| Ngày | Sự kiện highlight |
|---|---|
| Ngày 1 | Lân Sư Rồng & Khai mạc hội · Khai mạc Lễ hội · Diễu hành xe hoa · Hoa đăng Thiền hành |
| Ngày 2 | Diễu hành xe hoa · Lễ Quán đảnh Quán Âm · Hoa đăng · Lửa trại |
| Ngày 3 | Lễ vía Đức Bồ tát · Lễ Quán đảnh (quốc tế) · Đua thuyền sông Cổ Cò · Diễu hành xe hoa · Hoa đăng Thiền hành |
| Ngày 4 | Đi bộ vì hòa bình · Lễ Bế mạc |

**Effort:** XS (2-4h)
**Phụ thuộc:** schedule.json (0.2)

---

### US-D.1: Daily Card Template — Photo Header + Grouped Schedule
**Là** người dùng muốn chia sẻ chương trình ngày cho bạn bè,
**tôi muốn** card hiện tổng quan sự kiện theo nhóm sáng/chiều/tối với highlight rõ ràng,
**để** bạn bè tôi scan được nhanh "hôm nay có gì hay" mà không cần đọc hết.

**Acceptance Criteria:**

**Card wrapper:**
- [ ] Kích thước: 1080×1350px (4:5), scale responsive khi preview trong app
- [ ] `border-radius: 16px`, `overflow: hidden`
- [ ] Decorative border: 1px `accent-gold/10`, inset 8px, `border-radius: 10px`
- [ ] Bottom accent: dải 3px gradient ngang `accent-gold`, opacity 50%

**Photo header (~38% chiều cao card):**
- [ ] **Nếu có ảnh ngày** (`day.image`): ảnh full-width, `object-fit: cover`
- [ ] **Nếu không có ảnh**: gradient atmospheric theo mood ngày (xem US-D.2)
- [ ] Gradient fade từ dưới lên: ảnh/gradient → `cream-light` (#FFFDF8), chiếm 60% chiều cao photo section — text overlay đọc được trên mọi ảnh
- [ ] Brand badge góc trên trái: "🪷 Quán Thế Âm 2026", nền blur `rgba(44,24,16,0.55)`, viền `accent-gold/20`, rounded-full, font 8px uppercase

**Photo overlay (nằm ở đáy photo section, trên gradient fade):**
- [ ] Day label: "Ngày X — {Tên ngày}", font 10px, `accent-gold`, uppercase, letter-spacing 1.5px, gạch ngang 16px phía trước
- [ ] Title: câu mô tả ngắn gợi cảm xúc (ví dụ: "18 sự kiện từ sáng đến đêm"), font Playfair Display 700 26px, màu `warm-text`
- [ ] Meta: "Thứ X · DD/MM · DD/MM Âm lịch", font 11px, màu `warm-muted`

**Schedule content (nền `cream-light`, chiếm ~55% card):**
- [ ] Chia tối đa 3 nhóm: Sáng ☀ / Chiều 🌤 / Tối 🌙
- [ ] Nếu nhóm không có sự kiện → ẩn nhóm đó (Ngày 4 chỉ có Sáng)
- [ ] Mỗi nhóm:
  - Label: icon + tên, font 9px, uppercase, letter-spacing 1.2px, màu `#C4B5A4`, đường kẻ gradient sau text
  - Danh sách event rows bên dưới

**Event row (mỗi sự kiện 1 dòng):**
- [ ] Layout: thời gian (38px cố định, right-align, font 11px semibold `accent-brown`) + tên sự kiện (font 11.5px, `warm-text`)
- [ ] **Row thường**: font-weight 400
- [ ] **Row highlight ★**: font-weight 600, nền tinted `accent-gold/8`, viền trái 2px `accent-gold`, padding 4px 8px, border-radius 6px, thời gian đổi màu `accent-gold`, ký hiệu ★ sau tên (font 8px, `accent-gold`)
- [ ] **Row gom**: events cùng `merge_key` + `start_time` nối bằng " · " trong cùng 1 dòng. Ví dụ: "09:30 Nhiếp ảnh · Ký họa · Thư pháp"

**Bottom bar:**
- [ ] Trái: domain URL, font 9px, màu `#C4B5A4`
- [ ] Phải: "4 ngày" + 4 dot indicator (6×6px tròn) — dot ngày hiện tại màu `accent-gold`, còn lại `#E8DFD2`

**Effort:** M (8-16h)
**Phụ thuộc:** US-D.0, US-S.0 (shared tokens)

---

### US-D.2: Day → Gradient Mapping
**Là** developer,
**tôi muốn** mỗi ngày lễ hội có gradient riêng khi không có ảnh,
**để** card vẫn đẹp và phân biệt được ngày nào.

**Acceptance Criteria:**
- [ ] Mapping 4 ngày → gradient:

| Ngày | Gradient (160deg) | Mood |
|---|---|---|
| Ngày 1 — Khai mạc | `#1a0f2e → #3E2723 → #5D4037 → #8B6F47` | Tím đêm → nâu ấm, khai mở |
| Ngày 2 | `#2d1a00 → #4a2800 → #6B4226 → #C8A35A` | Vàng đồng, trang nghiêm |
| Ngày 3 — Lễ chính | `#0d0a1a → #1a0f2e → #2C1810 → #5D4037 → #C8A35A` | Tối sâu → rực rỡ, cao trào |
| Ngày 4 — Bế mạc | `#1a1a2e → #16213e → #2d6a6a → #4A6741` | Xanh tĩnh lặng, kết thúc |

- [ ] Fallback nếu ngày ngoài range → gradient Ngày 1

**Effort:** XS (2-4h)
**Phụ thuộc:** US-D.1

---

### US-D.3: Smart Event Merging & Name Shortening
**Là** developer,
**tôi muốn** logic tự gom sự kiện cùng giờ và rút gọn tên,
**để** 18 sự kiện Ngày 1 fit trong card 4:5 mà mỗi dòng vẫn đọc được.

**Acceptance Criteria:**

**Merge logic:**
- [ ] Events cùng `merge_key` + cùng `start_time` → gom 1 dòng, nối tên bằng " · "
- [ ] Nếu tên gom > 45 ký tự → truncate với "…"
- [ ] Highlight: nếu ≥1 event trong nhóm gom có `highlight: true` → cả dòng gom là highlight
- [ ] Events không có `merge_key` → hiện riêng, không gom

**Name shortening:**
- [ ] Ưu tiên dùng `short_name` nếu có
- [ ] Nếu `short_name` không có → dùng `name`, truncate ở 40 ký tự với "…"
- [ ] Không bao giờ hiện đơn vị tổ chức trên card share

**Line budget:**
- [ ] Target: ≤ 15 dòng event (không tính label nhóm) cho card Ngày 1 (nhiều nhất)
- [ ] Nếu vượt 15 dòng sau khi gom → gom thêm events cùng giờ (bỏ `merge_key` constraint), ưu tiên giữ highlight riêng

**Effort:** S (4-8h)
**Phụ thuộc:** US-D.0, US-D.1

---

### US-D.4: Day Card Subtitle — Context-Aware
**Là** BTC lễ hội,
**tôi muốn** dòng title trên mỗi card phản ánh đúng đặc trưng ngày đó,
**để** người nhận card cảm nhận được "vibe" của ngày mà không cần đọc danh sách.

**Acceptance Criteria:**
- [ ] Mỗi ngày có `day_subtitle` trong config:

| Ngày | Subtitle |
|---|---|
| Ngày 1 — Khai mạc | "18 sự kiện từ sáng đến đêm" |
| Ngày 2 | "11 sự kiện · Lễ Quán đảnh & Lửa trại" |
| Ngày 3 — Lễ chính | "Lễ vía Đức Bồ tát Quán Thế Âm" |
| Ngày 4 — Bế mạc | "Đi bộ vì hòa bình & Bế mạc" |

- [ ] Subtitle hiện dưới day label, font Playfair Display 700, 26px, `warm-text`
- [ ] Data lấy từ config (không hardcode trong component), dễ thay đổi năm sau
- [ ] Số lượng sự kiện tự đếm từ schedule.json (filtered by day, sau khi merge)

**Effort:** XS (2-4h)
**Phụ thuộc:** US-D.1

---

### US-D.5: Nút Share Daily Card
**Là** người dùng đang xem tab Chương trình,
**tôi muốn** share card tổng quan ngày cho nhóm chat,
**để** cả nhóm biết hôm nay lễ hội có gì mà lên kế hoạch.

**Acceptance Criteria:**

**Trigger:**
- [ ] Nút "Chia sẻ ngày" trên thanh DayFilter (task T1 roadmap gốc), cạnh 4 nút lọc ngày
- [ ] Style: icon Share2 (Lucide) 18px, nền transparent, màu `accent-gold`, tap target 44×44px
- [ ] Tooltip/aria-label: "Chia sẻ chương trình ngày {X}"

**Share flow (reuse từ US-S.3, US-S.4):**
- [ ] Tap → generate daily card image (html2canvas, offscreen 1080×1350px)
- [ ] Loading: spinner thay icon, 1-2s
- [ ] Preview modal (reuse US-S.5): card居中, nút "Gửi ngay" + nút "✕"
- [ ] Web Share API:
  - `title`: "Lễ hội Quán Thế Âm 2026 — Ngày {X}"
  - `text`: "Ngày {X} · {subtitle} · {date}. Chi tiết: {domain}"
  - `files`: [card PNG blob]
- [ ] Fallback: download ảnh + copy text

**Effort:** S (4-8h)
**Phụ thuộc:** US-D.1, US-S.4 (Card-to-Image Generation), US-S.5 (Preview), T1 DayFilter

---

### US-D.6: Bộ 4 Card cho BTC truyền thông
**Là** BTC lễ hội,
**tôi muốn** export sẵn bộ 4 card PNG (mỗi ngày 1 card) chất lượng cao,
**để** đội truyền thông dùng ngay cho Facebook page, Zalo OA, báo chí mà không cần vào app.

**Acceptance Criteria:**
- [ ] Trang admin/tool (hoặc script build) render 4 card ở 1080×1350px, export PNG
- [ ] Chất lượng: 2x (2160×2700px render, scale down) — sắc nét trên mọi thiết bị
- [ ] Filename convention: `lehoi-2026-ngay1-khai-mac.png`, `lehoi-2026-ngay2.png`...
- [ ] Output folder hoặc zip download
- [ ] Chạy lại được khi BTC cập nhật schedule → card tự cập nhật

**Effort:** S (4-8h)
**Phụ thuộc:** US-D.1, US-S.4
**Ghi chú:** Có thể implement bằng Puppeteer script chạy local thay vì trong app — đơn giản hơn, BTC chỉ cần chạy 1 lần.

---

## Tổng hợp Effort

| Story | Effort | Phụ thuộc chính |
|---|---|---|
| US-D.0 Schedule Data Enhancement | XS (2-4h) | schedule.json |
| US-D.1 Daily Card Template | M (8-16h) | US-D.0, US-S.0 |
| US-D.2 Day → Gradient Mapping | XS (2-4h) | US-D.1 |
| US-D.3 Smart Merging & Shortening | S (4-8h) | US-D.0, US-D.1 |
| US-D.4 Day Card Subtitle | XS (2-4h) | US-D.1 |
| US-D.5 Nút Share Daily Card | S (4-8h) | US-D.1, US-S.4, US-S.5 |
| US-D.6 Bộ 4 Card cho BTC | S (4-8h) | US-D.1, US-S.4 |
| **Tổng** | | **~28-48 giờ** |

---

## Thứ tự triển khai

```
Sprint 1 (3-4 ngày): Data + Template
├── US-D.0 Schedule Data Enhancement ★ unblock tất cả
├── US-D.1 Daily Card Template
├── US-D.2 Day → Gradient Mapping
└── US-D.4 Day Card Subtitle

Sprint 2 (2-3 ngày): Logic + Share
├── US-D.3 Smart Merging & Shortening
├── US-D.5 Nút Share Daily Card
└── US-D.6 Bộ 4 Card cho BTC

QA: test 4 ngày render đúng, test Ngày 4 (2 events)
    co lại gọn, test share Zalo/Facebook thật,
    test font loading + html2canvas rendering
```

---

## Sơ đồ phụ thuộc

```
schedule.json (0.2) ───── US-D.0 Data Enhancement
                               │
US-S.0 Shared Tokens ─────┐   │
                           └── US-D.1 Daily Card Template
                                    │
                        ┌───────────┼───────────┐
                        │           │           │
                   US-D.2       US-D.3      US-D.4
                   Gradient     Merging     Subtitle
                   Mapping      Logic
                        │           │
                        └─────┬─────┘
                              │
              US-S.4 ────── US-D.5 Nút Share
              Image Gen        │
                  │        US-S.5
                  │        Preview
                  │            │
                  └──────── US-D.6 BTC Export
```

---

## Shared Components giữa Epic S và Epic D

| Component | Epic S (Single Event) | Epic D (Daily) | Chia sẻ |
|---|---|---|---|
| Design tokens (font, color) | US-S.0 | US-D.1 | ✅ Dùng chung `share-title`, `share-info` tokens |
| Card-to-Image render | US-S.4 | US-D.5, US-D.6 | ✅ Cùng html2canvas logic, khác input component |
| Preview modal | US-S.5 | US-D.5 | ✅ Cùng modal, khác card bên trong |
| Share flow (Web Share API) | US-S.3 | US-D.5 | ✅ Cùng `useShare()` hook |
| Photo header | US-S.1 (full bleed) | US-D.1 (38% height) | ⚠️ Khác layout, nhưng chung gradient + overlay logic |
| Brand badge | US-S.1 | US-D.1 | ✅ Cùng component, cùng style |

**Đề xuất:** Tạo `useShare()` hook chung xử lý generate → preview → Web Share API → fallback. Cả Epic S và Epic D gọi hook này với card component khác nhau.

---

## Bổ sung Design System

### Section 5.11 — Daily Schedule Card (mới)

```
Type: Composite card, 4:5 ratio (1080×1350px)
Border-radius: 16px
Structure: Photo header (38%) + Schedule content (55%) + Bottom bar (7%)

Photo header:
- Image or day gradient, full-width
- Gradient fade to cream-light (#FFFDF8), 60% height from bottom
- Brand badge: top-left, blur bg, accent-gold/20 border
- Overlay text: day label (10px uppercase gold) + subtitle (Playfair 26px) + meta (11px muted)

Schedule content:
- Background: cream-light (#FFFDF8)
- Time groups: ☀ Sáng / 🌤 Chiều / 🌙 Tối
- Group label: 9px uppercase, #C4B5A4, gradient line after
- Event row: 38px time (right-align, accent-brown) + name (11.5px, warm-text)
- Highlight row: accent-gold/8 bg, 2px gold left border, ★ suffix
- Merged row: names joined by " · "
- Line budget: ≤ 15 event rows

Bottom bar:
- Left: domain URL (9px, #C4B5A4)
- Right: "4 ngày" + 4 dot indicators (6px circles, active = accent-gold)

Không có: QR code, đơn vị tổ chức, badge miễn phí
```

### Section 9 — Hooks: Thêm shared hook

**`useShare(cardRef, metadata)`**
```
Params: {
  cardRef: React ref to card DOM node,
  metadata: { title: string, text: string }
}
Returns: {
  share(): Promise<void>,
  isGenerating: boolean,
  showPreview: boolean,
  previewBlob: Blob | null,
  confirmShare(): Promise<void>,
  dismissPreview(): void
}
Logic:
1. share() → render cardRef offscreen at 1080×1350 → html2canvas → blob
2. Set showPreview=true, previewBlob=blob
3. confirmShare() → Web Share API with files:[blob]
4. Fallback: download blob + copy metadata.text to clipboard
```

Dùng chung cho cả Single Event Card (US-S.3) và Daily Card (US-D.5).

---

## Data cần bổ sung vào schedule.json

```json
{
  "days": [
    {
      "day_number": 1,
      "date": "2026-04-04",
      "lunar_date": "17/02",
      "label": "Khai mạc",
      "subtitle": "18 sự kiện từ sáng đến đêm",
      "image": null,
      "dot_index": 0
    }
  ],
  "events": [
    {
      "id": "d1-lan-su-rong",
      "day": 1,
      "start_time": "08:00",
      "end_time": "09:00",
      "name": "Khai mạc hội (trình diễn Lân Sư Rồng...)",
      "short_name": "Lân Sư Rồng & Khai mạc hội",
      "time_group": "morning",
      "highlight": true,
      "merge_key": null,
      "location_id": "svh",
      "category_id": "folk"
    },
    {
      "id": "d1-nhiep-anh",
      "day": 1,
      "start_time": "09:30",
      "name": "Triển lãm nhiếp ảnh...",
      "short_name": "Nhiếp ảnh",
      "time_group": "morning",
      "highlight": false,
      "merge_key": "d1-0930-art",
      "location_id": "svh",
      "category_id": "exhibition"
    },
    {
      "id": "d1-ky-hoa",
      "day": 1,
      "start_time": "09:30",
      "name": "Không gian ký họa màu nước và viết thư pháp...",
      "short_name": "Ký họa · Thư pháp",
      "time_group": "morning",
      "highlight": false,
      "merge_key": "d1-0930-art",
      "location_id": "svh",
      "category_id": "exhibition"
    }
  ]
}
```

---

## Câu hỏi mở cho BTC

1. **Ảnh header các ngày:** BTC có ảnh chụp đặc trưng cho từng ngày không? (lễ khai mạc, đua thuyền, hoa đăng, đi bộ) — nếu có, card sẽ đẹp hơn gradient rất nhiều.
2. **Subtitle ngày 2:** "Lễ Quán đảnh & Lửa trại" đã đúng trọng tâm chưa? BTC có muốn nhấn mạnh sự kiện khác?
3. **Sự kiện gom:** Danh sách merge hiện tại dựa trên phân tích cùng giờ + cùng tính chất. BTC review và xác nhận nhóm gom có hợp lý?

---

*Cập nhật: 02/04/2026*
*Alignment: DESIGN_SYSTEM.md v1.0*
*Liên quan: User Stories — Shareable Event Card (Epic S)*
