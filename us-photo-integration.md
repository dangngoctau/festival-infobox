# User Stories — Tích hợp Hình ảnh vào Landing Page
# Lễ hội Quán Thế Âm 2026 — v3.1

**Bối cảnh:** Landing page v3 đã gọn (7 tầng), nhưng dựa hoàn toàn vào emoji + gradient. Bộ ảnh thực tế lễ hội (11 tấm, chất lượng cao) chưa được sử dụng. Các US dưới đây tích hợp ảnh vào page để tạo emotional impact mà không thay đổi cấu trúc section.

**Quy ước Effort:** XS (2-4h) · S (4-8h) · M (8-16h) · L (16-24h)

**Quy ước ảnh:** `img-01` đến `img-12` tương ứng Image 1–12 trong bộ ảnh đã cung cấp.

---

## Epic P — Photo Integration

### US-P.0: Chuẩn bị asset ảnh (pipeline)
**Là** developer,
**tôi muốn** bộ ảnh được tối ưu sẵn với nhiều kích thước và format,
**để** page load nhanh trên 4G khu vực lễ hội (mật độ cao, mạng chậm).

**Acceptance Criteria:**
- [ ] Mỗi ảnh gốc export 3 kích thước: `400w` (mobile), `800w` (tablet), `1200w` (desktop)
- [ ] Format: WebP primary, JPEG fallback
- [ ] Chất lượng WebP: 75-80% (cân bằng size/quality)
- [ ] Tổng budget ảnh trên mobile ≤ 500KB (tất cả ảnh cộng lại)
- [ ] Ảnh đặt trong `public/images/landing/` với naming convention: `{section}-{size}.webp`
  - Ví dụ: `hero-bg-400w.webp`, `highlight-levia-800w.webp`
- [ ] Utility component `<OptImage>` dùng chung:
  ```jsx
  <OptImage
    src="hero-bg"
    alt="Toàn cảnh Chùa Quán Thế Âm"
    sizes="100vw"
    loading="eager" // hoặc "lazy"
    className="..."
  />
  ```
  - Tự tạo `srcSet` từ naming convention
  - Render `<picture>` với `<source type="image/webp">` + `<img>` fallback JPEG
  - Prop `loading` default `"lazy"`, hero/above-fold dùng `"eager"`

**Effort:** S (4-8h)
**Phụ thuộc:** Bộ ảnh gốc đã có
**Ghi chú:** Task này unblock tất cả US bên dưới. Có thể dùng sharp/squoosh CLI để batch process.

---

### US-P.1: Hero — Background ảnh thật
**Là** người lần đầu nghe về lễ hội,
**tôi muốn** thấy hình ảnh thật của lễ hội ngay từ hero,
**để** tôi cảm nhận được quy mô và không gian thực tế, không chỉ là animation trừu tượng.

**Ảnh sử dụng:** `img-11` — aerial panorama Chùa Quán Thế Âm từ trên cao (ngôi chùa, đám đông, núi Ngũ Hành Sơn, sông, bãi xe).

**Acceptance Criteria:**
- [ ] Ảnh `img-11` làm background layer **phía sau** các element hiện tại (trăng SVG, sao, đèn lồng)
- [ ] Xử lý ảnh qua CSS (không cần edit file gốc):
  - `filter: saturate(0.3) brightness(0.4)` — desaturate mạnh, tối đi
  - Overlay gradient: `linear-gradient(170deg, #0d0a1aee 0%, #1a0f2ecc 40%, #2a1545bb 70%, #2C1810dd 100%)` — giữ palette đêm trăng hiện tại
  - Không blur CSS (ảnh đã đủ mờ qua overlay, blur tốn performance mobile)
- [ ] Ảnh `object-fit: cover`, `object-position: center 30%` (lấy phần chùa, không lấy bãi xe phía dưới)
- [ ] `loading="eager"` — above-fold, cần load ngay
- [ ] Tất cả text content hiện tại (trăng, tên lễ hội, countdown, CTA) giữ nguyên, vẫn đọc rõ trên nền ảnh
- [ ] Fallback khi ảnh chưa load: gradient hiện tại giữ nguyên → ảnh fade in khi ready (`opacity transition 0.5s`)
- [ ] Performance: ảnh mobile ≤ 80KB (400w WebP, crop landscape 16:9)

**Test:**
- [ ] Text contrast ≥ WCAG AA trên nền ảnh + overlay
- [ ] Trên mạng 3G chậm: hero vẫn hiện gradient + content ngay, ảnh load sau không gây layout shift
- [ ] `prefers-reduced-motion`: không ảnh hưởng (ảnh tĩnh)

**Effort:** S (4-8h)
**Phụ thuộc:** US-P.0

---

### US-P.2: Highlight Cards — Ảnh nền thật
**Là** người đang lướt landing page,
**tôi muốn** thấy ảnh thật của 3 sự kiện highlight,
**để** tôi hình dung được trải nghiệm cụ thể thay vì chỉ đọc text trên gradient.

**Ảnh sử dụng:**
- Card lớn (Lễ vía): `img-09` — lễ đài trang trí rực rỡ, đoàn rước trang phục truyền thống, tượng Quán Âm
- Card nhỏ trái (Xe hoa): `img-06` — xe hoa ban đêm, tượng Quán Âm trên hoa sen hồng phát sáng
- Card nhỏ phải (Đua thuyền): `img-12` — rồng vàng 9 đầu, diễn viên hóa trang trên nước

**Acceptance Criteria:**

**Chung cho cả 3 card:**
- [ ] Ảnh chiếm toàn bộ card (background), text overlay phía dưới
- [ ] Gradient overlay bottom → top: `linear-gradient(to top, {nightWarm}ee 0%, {nightWarm}99 40%, transparent 100%)`
- [ ] Tất cả text (date, title, desc) đặt trên vùng gradient tối → đảm bảo contrast
- [ ] Viền trái 4px `locationColor` giữ nguyên (wayfinding cue)
- [ ] Badge vẫn ở góc trên trái, thêm `backdrop-filter: blur(8px)` + nền `rgba(0,0,0,0.3)` để đọc được trên ảnh
- [ ] `loading="lazy"` — below fold

**Card lớn — Lễ vía (img-09):**
- [ ] `object-position: center 40%` — lấy phần đoàn rước + lễ đài, không lấy phần trời
- [ ] Height giữ 220px mobile
- [ ] Crop gợi ý: lấy vùng trung tâm (từ hàng cờ xuống đến bậc thang)

**Card nhỏ trái — Xe hoa (img-06):**
- [ ] `object-position: center center` — lấy xe hoa + tượng Quán Âm
- [ ] Height giữ 160px mobile

**Card nhỏ phải — Đua thuyền (img-12):**
- [ ] `object-position: center 35%` — lấy phần rồng vàng + diễn viên
- [ ] Height giữ 160px mobile

**Fallback:**
- [ ] Khi ảnh chưa load: hiện gradient màu `locationColor` (giống v3 hiện tại) → ảnh fade in
- [ ] Emoji bỏ đi khi có ảnh (không cần cả hai)

**Test:**
- [ ] 3 card phải khác biệt thị giác rõ ràng — không còn "3 gradient giống nhau chỉ khác màu"
- [ ] Text đọc được trên tất cả ảnh nền (contrast AA)
- [ ] Trên iPhone SE (375px): 2 card nhỏ không bị crop mất nội dung chính

**Effort:** M (8-16h)
**Phụ thuộc:** US-P.0

---

### US-P.3: Photo Moment — Ảnh full-bleed
**Là** người đang cuộn từ highlights xuống carousel,
**tôi muốn** thấy một tấm ảnh landscape ấn tượng,
**để** mắt tôi được "nghỉ" khỏi text và cảm nhận không khí thực tế buổi tối lễ hội.

**Ảnh sử dụng:** `img-03` — xe hoa ban đêm trên đường, đèn lồng nhiều màu 2 bên, núi Ngũ Hành Sơn phía sau, đám đông, gian hàng.

**Lý do chọn img-03:**
- Góc landscape rộng → phù hợp dải full-width
- Có depth: foreground (đám đông) → midground (xe hoa, đèn lồng) → background (núi) 
- Ánh đèn lung linh → atmosphere đêm lễ hội
- Chưa dùng ở section nào khác (img-06 dùng cho xe hoa card, img-09 cho lễ vía)

**Acceptance Criteria:**
- [ ] Ảnh full-bleed (edge-to-edge, không padding, không border-radius)
- [ ] Height: 200px mobile, 280px tablet+
- [ ] `object-fit: cover`, `object-position: center 45%` — lấy phần xe hoa + đèn lồng, giữ núi phía trên
- [ ] Gradient overlay bottom: `linear-gradient(transparent 50%, rgba(44,24,16,0.7) 100%)`
- [ ] Caption trên gradient: "Đèn lồng và xe hoa trên đường Sư Vạn Hạnh" — font 13px, semibold, cream, text-shadow
- [ ] Sub-caption: "Diễu hành 18:00–20:00 · Ngày 1–3" — font 11px, opacity 0.6
- [ ] `loading="lazy"`
- [ ] Bỏ emoji 🎆 hiện tại — ảnh thật thay thế hoàn toàn

**Fallback:**
- [ ] Khi ảnh fail: hiện gradient placeholder hiện tại (giữ nguyên code v3 làm fallback)

**Effort:** XS (2-4h)
**Phụ thuộc:** US-P.0

---

### US-P.4: Carousel — Ảnh header cho 3/5 card
**Là** người đang vuốt ngang khám phá 5 trải nghiệm,
**tôi muốn** thấy ảnh đại diện cho từng loại trải nghiệm,
**để** tôi cảm nhận được không khí của mỗi category trước khi đọc text.

**Ảnh sử dụng:**
- Card "Lễ Phật giáo": `img-10` — aerial rồng vàng, lọng vàng hồng, đám đông từ trên xuống
- Card "Nghệ thuật": `img-02` — xe hoa ban ngày trước kiến trúc Chùa, Lân Sư Rồng
- Card "Dân gian": `img-08` — aerial khuôn viên Chùa đông nghẹt, hoạt động lễ hội
- Card "Triển lãm": giữ emoji 🖼️ (chưa có ảnh phù hợp)
- Card "Ẩm thực": giữ emoji 🍜 (chưa có ảnh phù hợp)

**Acceptance Criteria:**

**Layout card mới (khi có ảnh):**
- [ ] Ảnh chiếm phần trên card, height 120px, `border-radius: 12px 12px 0 0`
- [ ] `object-fit: cover`
- [ ] Nhẹ gradient overlay bottom trên ảnh: `linear-gradient(transparent 60%, {cardBg} 100%)` — tạo transition mượt sang content
- [ ] Content (icon + name + count + desc + CTA) giữ nguyên, đẩy xuống dưới ảnh
- [ ] Card tổng height tăng lên ~320px (từ 200px) để chứa cả ảnh + content
- [ ] `loading="lazy"`

**Layout card giữ nguyên (emoji, khi chưa có ảnh):**
- [ ] Card "Triển lãm" và "Ẩm thực" giữ layout hiện tại (emoji + text, height 200px)
- [ ] Component nhận prop `image?: string` — có thì render ảnh, không thì render layout emoji

**Object-position từng ảnh:**
- img-10 (Phật giáo): `center center` — rồng + lọng ở trung tâm
- img-02 (Nghệ thuật): `center 60%` — lấy xe hoa + chùa, bớt trời
- img-08 (Dân gian): `center 40%` — lấy sân chùa + đám đông

**Dot indicator:**
- [ ] Giữ nguyên, không thay đổi

**Test:**
- [ ] 3 card có ảnh vs 2 card không ảnh: transition vuốt vẫn mượt, không giật
- [ ] Ảnh trong card không bị stretch/distort ở bất kỳ viewport width nào
- [ ] Card đầu tiên (Phật giáo) vẫn có border vàng + badge "Trọng tâm" — nổi bật hơn nhờ có cả ảnh lẫn styling

**Effort:** M (8-16h)
**Phụ thuộc:** US-P.0

---

### US-P.5: Accordion Địa điểm — Thumbnail ảnh
**Là** du khách chưa đến lễ hội bao giờ,
**tôi muốn** thấy ảnh nhỏ của Chùa bên cạnh địa chỉ,
**để** tôi nhận diện được nơi mình sẽ đến.

**Ảnh sử dụng:** `img-11` — crop vuông lấy phần chùa chính (tái sử dụng ảnh hero, crop khác).

**Acceptance Criteria:**
- [ ] Thumbnail 56×56px, `border-radius: 10px`, đặt bên phải nội dung địa chỉ
- [ ] `object-fit: cover`, `object-position: center 25%` — lấy phần chùa, bỏ bãi xe
- [ ] Border: `1.5px solid {bronze}30`
- [ ] Chỉ hiện khi accordion "Địa điểm" đang mở
- [ ] `loading="lazy"`
- [ ] Không chiếm thêm vertical space — nằm cùng hàng với text địa chỉ (flexbox)

**Effort:** XS (2-4h)
**Phụ thuộc:** US-P.0

---

## Tổng hợp

| Story | Ảnh gốc | Effort | Ưu tiên |
|---|---|---|---|
| US-P.0 Asset pipeline | Tất cả | S (4-8h) | ★ Unblock all |
| US-P.1 Hero background | img-11 | S (4-8h) | Cao |
| US-P.2 Highlight cards | img-09, img-06, img-12 | M (8-16h) | Cao |
| US-P.3 Photo Moment | img-03 | XS (2-4h) | Trung bình |
| US-P.4 Carousel ảnh | img-10, img-02, img-08 | M (8-16h) | Trung bình |
| US-P.5 Accordion thumb | img-11 (crop) | XS (2-4h) | Thấp |
| **Tổng** | **8 ảnh gốc** | **~28-52h** | |

---

## Thứ tự triển khai

```
Sprint 1 (3-4 ngày): Foundation + High Impact
├── US-P.0 Asset pipeline ★ unblock all
├── US-P.1 Hero background (high impact, 1 ảnh)
└── US-P.2 Highlight cards (high impact, 3 ảnh)

Sprint 2 (2-3 ngày): Polish
├── US-P.3 Photo Moment (1 ảnh, nhanh)
├── US-P.4 Carousel ảnh (3 ảnh)
└── US-P.5 Accordion thumbnail (1 ảnh, nhanh)
```

---

## Sơ đồ phụ thuộc

```
Bộ ảnh gốc (11 tấm)
       │
  US-P.0 Asset Pipeline ★
       │
  ┌────┼────┬────────┬──────────┐
  │    │    │        │          │
P.1  P.2  P.3     P.4        P.5
Hero  Cards Moment Carousel  Thumb
```

---

## Ảnh cần chụp bổ sung (backlog)

Các card/section hiện giữ emoji vì chưa có ảnh phù hợp:

| Chủ đề | Dùng cho | Ghi chú chụp |
|---|---|---|
| Đua thuyền sông Cổ Cò | Highlight card (thay img-12 nếu có ảnh tốt hơn) | Chụp ngày 3, 09:30, từ bờ hoặc drone |
| Ẩm thực chay | Carousel card "Ẩm thực" | Chụp gian hàng + món ăn, ngày 1 15:30+ |
| Triển lãm nhiếp ảnh/đá mỹ nghệ | Carousel card "Triển lãm" | Chụp đường SVH, ngày 1 09:00+ |
| Bài chòi / cà kheo / nhảy sạp | Carousel card "Dân gian" (thay img-08) | Chụp ngày 1-3, đường SVH |
| Hoa đăng thiền hành | Có thể thêm vào hero hoặc photo moment | Chụp tối ngày 1 hoặc 3, 20:00 |

**Ghi chú:** Nếu có photographer đi cùng ngày 1 lễ hội, ưu tiên chụp 5 chủ đề trên. Format RAW + JPEG, landscape orientation, chú ý ánh sáng tối (ISO cao, tripod nếu được).
