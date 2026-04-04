# User Stories — Shareable Event Card
# Lễ hội Quán Thế Âm 2026

**Concept:** Mỗi sự kiện trong schedule.json tự động generate một card hình ảnh 4:5 tối ưu cho chia sẻ Zalo/Facebook. Card kể câu chuyện bằng thị giác — atmospheric background, typography có dấu ấn văn hóa, thông tin vừa đủ để người nhận quyết định tham dự.

**Quy ước Effort:** XS (2-4h) · S (4-8h) · M (8-16h) · L (16-24h)

**Design System alignment:** Tuân thủ DESIGN_SYSTEM.md v1.0. Các bổ sung cho design system được ghi ở cuối tài liệu.

---

## Nguyên tắc thiết kế card share

### Đúng

- **4:5 ratio** (1080×1350px) — tối ưu cho Facebook feed, Zalo, Instagram
- **Ảnh thật hoặc gradient atmospheric** làm nền full-bleed, overlay gradient từ dưới lên
- **Serif cho title** (Playfair Display) — dấu ấn văn hóa, phân biệt với UI sans-serif
- **Một câu mô tả gợi cảm xúc** — không liệt kê đơn vị tổ chức
- **Thông tin tối thiểu:** tên sự kiện, ngày/giờ, địa điểm, domain URL
- **Decorative tinh tế:** viền mỏng, divider hoa sen, bokeh ánh nến — đủ "craft feel"

### Không

- **Không QR code** — người nhận xem ảnh trên chính điện thoại, không scan được. QR chỉ dùng khi in ấn (poster, standee) — nằm ngoài scope card share digital
- **Không badge "Miễn phí vào cửa"** — lễ hội Phật giáo public, ai cũng biết, badge chiếm chỗ mà không thêm giá trị
- **Không logo đơn vị tổ chức** — card phục vụ du khách, không phải báo cáo nội bộ
- **Không quá 3 dòng thông tin** dưới title — card là "poster", không phải "tờ rơi"

---

## Epic S — Shareable Event Card

### US-S.0: Card Template & Design Tokens
**Là** developer,
**tôi muốn** có một card template chuẩn với design tokens riêng cho share context,
**để** mọi sự kiện generate card nhất quán mà chỉ cần swap data.

**Acceptance Criteria:**
- [ ] Card component nhận props: `event` object từ schedule.json
- [ ] Kích thước cố định: 1080×1350px (4:5), scale down responsive khi preview trong app
- [ ] Design tokens bổ sung vào Tailwind config / CSS:
  - `share-bg-overlay`: `rgba(44,24,16,0.85)` — gradient overlay cho ảnh nền
  - `share-title`: font-family `Playfair Display`, 700, 28px (scale theo card size)
  - `share-subtitle`: font-family `Playfair Display`, 500 italic, 14px
  - `share-info`: font-family `Be Vietnam Pro`, 500, 12px
  - `share-brand`: font-family `Be Vietnam Pro`, 600, 9-10px, uppercase, letter-spacing 0.5px
- [ ] Font load: Playfair Display (500, 700) + Be Vietnam Pro (400, 500, 600, 700) — từ Google Fonts, preload
- [ ] Card wrapper: `overflow: hidden`, `border-radius: 16px`

**Effort:** XS (2-4h)
**Phụ thuộc:** US-0.1 (Warm Palette), schedule.json (0.2)

---

### US-S.1: Card Layout — Atmospheric Background + Content
**Là** người dùng muốn chia sẻ sự kiện,
**tôi muốn** card có hình ảnh đẹp và thông tin rõ ràng,
**để** bạn bè tôi dừng lại khi lướt feed và hiểu ngay sự kiện là gì.

**Acceptance Criteria:**

**Background layer (z-index thấp nhất):**
- [ ] **Nếu sự kiện có ảnh** (`event.image`): ảnh full-bleed, `object-fit: cover`, chiếm toàn bộ card
- [ ] **Nếu không có ảnh**: gradient atmospheric theo category (xem mapping ở US-S.2)
- [ ] Gradient overlay từ dưới lên: transparent → `share-bg-overlay` 85%, chiếm 60-65% chiều cao card — đảm bảo text dưới luôn đọc được
- [ ] Decorative bokeh layer (5 vùng tròn radial gradient, `accent-gold` opacity 20-40%, animation float nhẹ)
- [ ] Hoa đăng bay (3 emoji 🏮, animation bay lên chậm) — chỉ hiện khi `prefers-reduced-motion: no-preference`

**Branding layer (góc trên):**
- [ ] Góc trên trái: badge "🪷 Lễ hội Quán Thế Âm 2026" — nền blur `rgba(44,24,16,0.5)`, viền `accent-gold/20`, rounded-full, padding 6px 12px
- [ ] Góc trên phải: badge ngày "NGÀY X · DD/MM" — nền `accent-gold` 90%, chữ `night-warm`, rounded-full, font-weight 700, font-size 10px

**Content layer (nửa dưới, trên gradient overlay):**
- [ ] Category label: uppercase, letter-spacing 1.5px, màu `accent-gold`, font-size 10px, có gạch ngang 20px phía trước
- [ ] Tên sự kiện: `share-title`, màu `cream-light`, line-height 1.25, text-shadow `0 2px 20px rgba(0,0,0,0.4)`, tối đa 3 dòng
- [ ] Subtitle: `share-subtitle`, màu `bronze`, line-height 1.5, tối đa 2 dòng — lấy từ `event.description_short`
- [ ] Info row (2 dòng):
  - Dòng 1: icon 📅 trong circle (28px, nền `accent-gold/15`, viền `accent-gold/25`) + ngày dương + ngày âm + giờ
  - Dòng 2: icon 📍 trong circle + tên địa điểm
- [ ] Divider: đường ngang gradient mờ, chính giữa có ký hiệu ✦ (màu `accent-gold/35`)
- [ ] Bottom: domain URL centered — font-size 10px, màu `#C4B5A4`

**Decorative layer:**
- [ ] Viền mỏng 1px `accent-gold/15` cách rìa card 12px, border-radius 8px, góc trên-trái và dưới-phải có accent vuông 32px
- [ ] Dải vàng 4px ở đáy card: gradient ngang từ transparent → `accent-gold` → transparent, opacity 50%

**Accessibility:**
- [ ] Alt text tự sinh: "Card sự kiện: {tên sự kiện}, {ngày}, {giờ}, {địa điểm}"
- [ ] `prefers-reduced-motion: reduce` → tắt bokeh, hoa đăng, smoke animation — card vẫn hiện đầy đủ nội dung

**Effort:** M (8-16h)
**Phụ thuộc:** US-S.0, schedule.json (0.2)

---

### US-S.2: Category → Gradient Mapping
**Là** developer,
**tôi muốn** mỗi category sự kiện có gradient atmospheric riêng,
**để** card không có ảnh vẫn đẹp và phân biệt được loại sự kiện.

**Acceptance Criteria:**
- [ ] Mapping 5 category → gradient:

| Category | Gradient | Mood |
|---|---|---|
| Lễ Phật giáo (`buddhist`) | `#2d1a00 → #4a2800 → #6B4226 → #8B6F47 → #C8A35A` | Vàng đồng ấm, trang nghiêm |
| Nghệ thuật (`art`) | `#1a0f2e → #2C1810 → #3E2723 → #5D4037 → #8B6F47` | Tím đêm → nâu, huyền bí |
| Dân gian (`folk`) | `#2C1810 → #5D4037 → #D4845A → #C8A35A → #8B6F47` | Cam ấm, vui tươi |
| Triển lãm (`exhibition`) | `#1a0f2e → #2C1810 → #3E2723 → #5D4037 → #8B6F47` | Tối → ấm, trầm lắng |
| Thể thao (`sport`) | `#1a1a2e → #16213e → #1a3a4a → #2d6a6a → #4A6741` | Xanh sâu, sông nước |

- [ ] Gradient direction: `160deg` (chéo nhẹ) — tạo chiều sâu, tránh flat
- [ ] Data: bổ sung `category_id` vào mỗi event trong schedule.json nếu chưa có
- [ ] Fallback: nếu category không khớp → dùng gradient "Nghệ thuật" (tím đêm, versatile nhất)

**Effort:** XS (2-4h)
**Phụ thuộc:** US-S.1, schedule.json (0.2)

---

### US-S.3: Nút Share trên EventDetail
**Là** người dùng đang xem chi tiết sự kiện trong app,
**tôi muốn** bấm một nút để chia sẻ card hình ảnh đẹp cho bạn bè,
**để** tôi không phải screenshot rồi crop thủ công.

**Acceptance Criteria:**

**Trigger:**
- [ ] Nút "Chia sẻ" trên EventDetail modal (task T5 roadmap gốc) và PinDetailSheet (US-M.3)
- [ ] Style: icon Share2 (Lucide) + text "Chia sẻ", nằm cạnh nút "Chỉ đường"
- [ ] Nút phụ: outline `accent-gold`, chữ `accent-gold`, rounded-full

**Flow chia sẻ:**
- [ ] Tap "Chia sẻ" → generate card image từ event data (xem US-S.4)
- [ ] Loading state: spinner nhỏ thay icon, text đổi thành "Đang tạo..."
- [ ] Thành công → gọi **Web Share API** với:
  - `title`: tên sự kiện
  - `text`: "{tên sự kiện} — {ngày} {giờ} tại {địa điểm}. Chi tiết: {domain URL}"
  - `files`: [card image as Blob]
- [ ] Web Share API không hỗ trợ (desktop browser cũ) → fallback: download ảnh + copy text vào clipboard, toast "Đã tải ảnh & copy link"
- [ ] Error → toast "Không thể chia sẻ, thử lại", ẩn sau 3s, **không block UI**

**Effort:** S (4-8h)
**Phụ thuộc:** US-S.1, T5 EventDetail (roadmap gốc), B5 Share button (roadmap gốc)
**Ghi chú:** Story này thay thế task B5 trong roadmap gốc — cùng vị trí nút, nhưng share ảnh card thay vì share link thuần.

---

### US-S.4: Card-to-Image Generation
**Là** developer,
**tôi muốn** render card component thành file ảnh PNG,
**để** người dùng share được ảnh thật qua Zalo/Facebook thay vì link.

**Acceptance Criteria:**

**Phương án render:**
- [ ] **Ưu tiên:** `html2canvas` hoặc tương đương — render DOM node thành canvas → export PNG blob
- [ ] Card component render ẩn (offscreen div, `position: fixed; left: -9999px`) ở kích thước chuẩn 1080×1350px
- [ ] Sau khi render xong → `canvas.toBlob('image/png')` → truyền vào Web Share API
- [ ] Cleanup: remove offscreen div sau khi export

**Xử lý font:**
- [ ] Playfair Display + Be Vietnam Pro phải load xong trước khi render (dùng `document.fonts.ready`)
- [ ] Nếu font chưa load sau 3s → render với system serif/sans-serif fallback, không block

**Performance:**
- [ ] Thời gian generate < 2s trên thiết bị mid-range (Snapdragon 600 series)
- [ ] Không prerender tất cả 40+ card — chỉ render on-demand khi user tap "Chia sẻ"
- [ ] Cache card đã render trong session (key = `event_id`) — tap lại không render lại

**Fallback nếu html2canvas fail:**
- [ ] Chia sẻ text-only qua Web Share API: "{tên sự kiện}\n{ngày} {giờ}\n{địa điểm}\n{domain URL}"
- [ ] Toast: "Chia sẻ dạng text — ảnh không khả dụng trên thiết bị này"

**Effort:** M (8-16h)
**Phụ thuộc:** US-S.1
**Thư viện:** html2canvas hoặc modern-screenshot (lightweight hơn, ~15KB)
**Rủi ro:** html2canvas không render CSS filter, backdrop-filter, một số animation. Cần test kỹ — nếu bokeh/blur không render, fallback về gradient thuần (vẫn đẹp).

---

### US-S.5: Card Preview trước khi share
**Là** người dùng,
**tôi muốn** xem trước card sẽ trông như thế nào trước khi gửi,
**để** tôi yên tâm ảnh đẹp và đúng thông tin.

**Acceptance Criteria:**
- [ ] Sau khi generate xong (US-S.4), hiện modal preview toàn màn hình:
  - Nền tối overlay (black 70%)
  - Card ảnh居中, scale fit màn hình (max 85vw, max 80vh), có shadow
  - Nút "Gửi ngay" — nền `accent-gold`, full-width dưới card, trigger Web Share API
  - Nút "✕" góc trên phải — đóng preview, quay lại EventDetail
- [ ] Responsive: trên tablet+, card không chiếm quá 400px width
- [ ] Dismiss: tap overlay, nút ✕, hoặc Escape

**Effort:** S (4-8h)
**Phụ thuộc:** US-S.4

---

### US-S.6: Card cho 3 sự kiện Featured (Landing Page)
**Là** BTC lễ hội,
**tôi muốn** 3 sự kiện nổi bật có card share sẵn trên landing page,
**để** truyền thông và người dùng dễ dàng lấy ảnh đẹp chia sẻ mà không cần vào app.

**Acceptance Criteria:**
- [ ] Section "Không thể bỏ lỡ" (US-3.1 Landing Page) — mỗi highlight card có icon share nhỏ ở góc
- [ ] Tap icon → generate + preview card share cho sự kiện đó (reuse US-S.4, US-S.5)
- [ ] 3 sự kiện mặc định:
  - Lễ vía Đức Bồ tát Quán Thế Âm (gradient `buddhist`)
  - Diễu hành xe hoa (gradient `folk`)
  - Hội đua thuyền sông Cổ Cò (gradient `sport`)
- [ ] Nếu BTC cung cấp ảnh thật cho 3 sự kiện này → dùng ảnh thật thay gradient

**Effort:** XS (2-4h)
**Phụ thuộc:** US-S.4, US-3.1 (Landing Page)

---

## Tổng hợp Effort

| Story | Effort | Phụ thuộc chính |
|---|---|---|
| US-S.0 Card Template & Tokens | XS (2-4h) | US-0.1, schedule.json |
| US-S.1 Card Layout | M (8-16h) | US-S.0 |
| US-S.2 Category → Gradient | XS (2-4h) | US-S.1 |
| US-S.3 Nút Share trên EventDetail | S (4-8h) | US-S.1, T5 |
| US-S.4 Card-to-Image Generation | M (8-16h) | US-S.1 |
| US-S.5 Card Preview | S (4-8h) | US-S.4 |
| US-S.6 Card cho Featured (Landing) | XS (2-4h) | US-S.4, US-3.1 |
| **Tổng** | | **~32-58 giờ** |

---

## Thứ tự triển khai

```
Sprint 1 (3-4 ngày): Template + Layout
├── US-S.0 Card Template & Tokens ★ unblock tất cả
├── US-S.1 Card Layout — atmospheric bg + content
└── US-S.2 Category → Gradient Mapping

Sprint 2 (3-4 ngày): Generation + Share Flow
├── US-S.4 Card-to-Image Generation
├── US-S.5 Card Preview
├── US-S.3 Nút Share trên EventDetail
└── US-S.6 Card cho Featured (Landing)

QA: test share Zalo/Facebook thật trên Android + iOS,
    test fallback desktop, test font loading edge cases
```

---

## Sơ đồ phụ thuộc

```
US-0.1 Warm Palette ──┐
schedule.json (0.2) ───┤
                       └── US-S.0 Template & Tokens
                                │
                           US-S.1 Card Layout
                                │
                     ┌──────────┼──────────┐
                     │          │          │
                US-S.2      US-S.4     (ảnh thật
                Gradient    Image Gen   từ BTC)
                Mapping        │
                          ┌────┴────┐
                          │         │
                     US-S.5      US-S.3
                     Preview     Nút Share
                          │         │
                          └────┬────┘
                               │
                          US-S.6
                          Featured Cards
                               │
                          US-3.1 Landing
```

---

## Bổ sung Design System

### Section 5.10 — Shareable Card (mới)

```
Type: Static image card, 4:5 ratio (1080×1350px)
Border-radius: 16px
Background: full-bleed image + overlay gradient, hoặc atmospheric gradient

Layers (bottom to top):
1. Background (image hoặc category gradient, 160deg)
2. Bokeh (5 radial circles, accent-gold, opacity 20-40%)
3. Hoa đăng animation (3 🏮, fly up, reduced-motion: hidden)
4. Gradient overlay (transparent → night-warm 85%, chiếm 60-65% dưới)
5. Decorative border (1px accent-gold/15, inset 12px)
6. Content (branding top + text bottom)
7. Wave accent (4px gradient bar, bottom edge)

Typography:
- Title: Playfair Display 700, 28px, cream-light, text-shadow
- Subtitle: Playfair Display 500 italic, 14px, bronze
- Category: Be Vietnam Pro 600, 10px, uppercase, accent-gold
- Info: Be Vietnam Pro 500, 12px, cream
- Brand: Be Vietnam Pro 500, 10px, #C4B5A4

Không có: QR code, badge miễn phí, logo đơn vị tổ chức
```

### Section 6 — Animation: Đăng ký mới

```
| Name | Duration | Easing | Effect | Usage |
|---|---|---|---|---|
| bokeh-float | 8s | ease-in-out | translateY ±10px, scale 1↔1.05 | Share card bokeh |
| lantern-up | 10s | linear | bottom -5%→105%, translateX 20px, opacity fade | Share card 🏮 |
```

Reduced motion: cả hai → `display: none`.

---

## Data cần bổ sung vào schedule.json

```json
{
  "id": "le-via-bo-tat",
  "category_id": "buddhist",
  "featured": true,
  "description_short": "Nghi lễ trang trọng nhất — truyền hình trực tiếp trên DanangTV",
  "image": null
}
```

Mỗi event cần: `category_id` (string, map sang gradient), `description_short` (string, 1 câu gợi cảm xúc), `image` (string URL hoặc null).

---

## Câu hỏi mở cho BTC

1. **Ảnh thật:** BTC có ảnh chất lượng cao (≥1080px ngang) cho 3 sự kiện featured không? Nếu có → dùng ảnh thật, card sẽ đẹp hơn gradient đáng kể.
2. **Domain chính thức:** `lehoiquantheam-nhs-danang.vn` hay `lehoiquantheam.vn`? Cần xác nhận để in trên card.
3. **Ngôn ngữ card:** Card share chỉ tiếng Việt, hay cần variant EN/KR/JP cho du khách nước ngoài? Nếu cần → thêm 1 story cho i18n card (~S effort).

---

*Cập nhật: 02/04/2026*
*Alignment: DESIGN_SYSTEM.md v1.0*
