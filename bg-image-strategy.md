# Chiến lược Hình ảnh & Background
# Landing Page — Lễ hội Quán Thế Âm 2026

**Ngày chốt:** 25/03/2026  
**Lễ hội:** 04–07/04/2026

---

## 1. NGUYÊN TẮC

1. **Hero giữ nguyên gradient + CSS animation** — không thêm ảnh, không AI. Hero đã hoàn chỉnh (trăng, sao, đèn lồng, countdown, CTA), load nhanh, không rủi ro.
2. **Ảnh thật xuất hiện từ giữa page trở xuống** — tạo nhịp "trừu tượng → cụ thể". Ảnh đầu tiên là "reveal moment", impact mạnh hơn vì bất ngờ.
3. **100% ảnh thật từ BTC** — không AI, không rủi ro bản quyền, không cần disclosure.
4. **Ảnh toàn cảnh chỉ dùng full-bleed hoặc background mờ** — không thu nhỏ vào card (mất chi tiết trên mobile).
5. **Không placeholder** — ảnh lỗi thì ẩn, layout tự co lại.

---

## 2. ĐÁNH GIÁ BỘ ẢNH BTC CUNG CẤP

### 2.1 Phân tích từng ảnh

| Ảnh | Nội dung | Đánh giá | Tier |
|---|---|---|---|
| **Ảnh 1** | Rồng vàng & lọng, góc bird-eye | Pattern màu đẹp nhất bộ (vàng, đỏ, xanh). Truyền tải quy mô đám đông. Có watermark cần xử lý | **A** |
| **Ảnh 2** | Toàn cảnh chùa + Ngũ Hành Sơn | Establishing shot duy nhất — núi, chùa, sông, thành phố. Không thể thay thế. Ánh sáng hơi phẳng nhưng giá trị thông tin rất cao | **A** |
| **Ảnh 3** | Lễ đài + đám đông từ trên | Gần giống ảnh 5. Tone hỗn hợp sáng/tối khó xử lý. Chấp nhận được, không nổi bật | **C** |
| **Ảnh 4** | Lễ đài cận, tượng Quán Âm, đoàn rước bậc thang đỏ | "Editorial" nhất. Focal point rõ (tượng Quán Âm), bố cục đối xứng, màu sắc phong phú. Kể chuyện tốt nhất — hiểu ngay đây là lễ hội Phật giáo trang trọng | **A** |
| **Ảnh 5** | Trùng ảnh 3 | Loại bỏ | **C** |
| **Ảnh 6** | Xe hoa rồng 7 đầu cận cảnh | Close-up duy nhất. Chi tiết rồng ấn tượng, bokeh tiền cảnh tạo depth. **Hoạt động tốt ở mọi kích thước** — khác biệt hoàn toàn với ảnh toàn cảnh | **B** |
| **Ảnh 7** | Lễ đài góc rộng hơn ảnh 4 | Thấy nhiều đèn lồng đỏ, quy mô lễ đài rõ hơn ảnh 4. Có watermark. Bổ sung tốt | **B** |
| **Ảnh 8** | Flycam khu vực chùa mái đỏ | Kiến trúc mái ngói đẹp, rồng vàng phía dưới, đám đông dọc đường. Góc khác biệt với các ảnh còn lại | **B** |

### 2.2 Vấn đề chung

- **100% ảnh ban ngày** — không có ảnh đêm (hoa đăng, lửa trại, xe hoa ban đêm)
- **Thiếu đa dạng thể loại** — tập trung nghi lễ Phật giáo & diễu hành, không có dân gian, ẩm thực, đua thuyền
- **2 ảnh trùng** (3 & 5) — loại bỏ 1
- **2 ảnh có watermark** (1 & 7) — cần xin bản gốc hoặc xử lý

### 2.3 Ảnh cần xin bổ sung (ưu tiên)

| Ưu tiên | Nội dung | Lý do |
|---|---|---|
| 1 | Hoa đăng thiền hành ban đêm | Thiếu hoàn toàn, biểu tượng lễ hội, cần cho concept "Đêm Trăng" nếu nâng cấp hero sau này |
| 2 | Đua thuyền sông Cổ Cò | Highlight event nhưng không có ảnh |
| 3 | Diễu hành xe hoa ban đêm | Ấn tượng hơn bản ban ngày |
| 4 | Trò chơi dân gian (bài chòi, cà kheo) | Cần cho category Dân gian |
| 5 | Ẩm thực chay | Cần cho category Ẩm thực |

**Nguồn xin ảnh:** Nhiếp ảnh gia Nguyễn Trình (tác giả ảnh 1 & 7), Báo Đà Nẵng / DanangTV, Ban Quản lý Di tích Ngũ Hành Sơn (nguhanhson.org), Sở VHTTDL TP Đà Nẵng.

**Phương án B:** Cử photographer đến đêm khai mạc 04/04, cập nhật ảnh vào app ngày hôm sau (kiến trúc data-driven JSON cho phép).

---

## 3. VẤN ĐỀ THIẾT KẾ CẦN GIẢI QUYẾT

### 3.1 Nhịp thị giác phẳng

Từ section "Không thể bỏ lỏ" đến hết page, 3 section liên tiếp cùng format: **card text trên nền sáng**. Không có điểm nào mắt được reset. Page không dài về pixel nhưng **cảm thấy dài** vì thiếu thay đổi nhịp.

```
Card text (nền sáng) → Card text (nền sáng) → Card text (nền sáng)
                              ↑
                    Vấn đề: nhịp phẳng ở đây
```

### 3.2 Tại sao không dùng gallery section riêng

Page đã có 7 section. Thêm gallery tạo section thứ 8, effort S–M (10-18h), responsive 3 breakpoint phức tạp (mobile horizontal scroll + tablet 2-col grid + desktop staggered 3-col). Page thực sự dài hơn đáng kể.

### 3.3 Tại sao không chỉ dùng ảnh làm background mờ toàn bộ

Background opacity 10-15% gần như vô hình, không tạo nhịp thở thị giác. Lễ hội Quán Thế Âm là Di sản văn hóa phi vật thể quốc gia — page cần ít nhất 1 ảnh rõ ràng ngoài hero để xứng tầm.

### 3.4 Tại sao không dùng AI illustration cho hero

- Hero gradient + animation hiện tại đã hoàn chỉnh
- AI rủi ro sai kiến trúc Việt Nam (mái chùa kiểu Trung Quốc), sai chi tiết tâm linh
- Cần quy trình duyệt BTC — tốn thời gian, có thể bị từ chối
- Sự kiện do cơ quan nhà nước chủ trì — rủi ro phản ứng cộng đồng nếu dùng AI cho nội dung Phật giáo
- Tiết kiệm S (4-8h) effort + loại bỏ toàn bộ rủi ro

---

## 4. GIẢI PHÁP: 3 ĐIỂM NHÚNG ẢNH

### 4.1 Visual Break — Ảnh full-bleed (ưu tiên cao nhất)

| Thuộc tính | Giá trị |
|---|---|
| **Vị trí** | Giữa section "Không thể bỏ lỏ" và "5 Trải nghiệm" |
| **Ảnh** | Ảnh 4 (lễ đài + tượng Quán Âm, đoàn rước bậc thang đỏ) |
| **Lý do chọn** | Bố cục đối xứng, focal point rõ, màu sắc phong phú, kể chuyện tốt nhất |
| **Hiển thị** | Full-bleed 100% viewport width, không padding, không border-radius |
| **Chiều cao** | `max-height: 50vh` mobile / `55vh` tablet / `60vh` desktop, `min-height: 250px` |
| **Fit** | `object-fit: cover`, `object-position: center 40%` |
| **Overlay/text** | Không — ảnh tự nói |
| **Caption** | 1 dòng dưới ảnh, `text-sm`, `warm-muted`, nền `cream-dark`, i18n 4 ngôn ngữ |
| **Vignette** | `box-shadow: inset 0 2px 8px rgba(44,24,16,0.06)` ở 2 cạnh ngang |
| **Lazy load** | Có — below the fold |
| **Ảnh lỗi** | Ẩn toàn bộ `<figure>`, 2 section nối trực tiếp |
| **Animation** | Không — hiện ngay, không fade-in, không parallax |
| **Page dài thêm** | ~300-400px mobile (1 lần cuộn ngón tay) |
| **Vai trò** | Visual punctuation — tạo nhịp thở giữa 2 khối text. "Reveal moment" vì là ảnh thật đầu tiên trên page |
| **Effort** | **XS (2-4h)** |
| **User Story** | US-2.2 |

**Responsive image spec:**

```html
<figure role="figure" aria-labelledby="vb-caption">
  <picture>
    <source srcset="/images/landing/le-dai-800.webp" 
            media="(max-width: 767px)" type="image/webp">
    <source srcset="/images/landing/le-dai-1200.webp" 
            media="(max-width: 1024px)" type="image/webp">
    <source srcset="/images/landing/le-dai-1800.webp" 
            type="image/webp">
    <img src="/images/landing/le-dai-1200.jpg"
         alt="Hàng vạn phật tử tham dự Lễ vía Đức Bồ tát..."
         loading="lazy"
         style="object-fit:cover; object-position:center 40%">
  </picture>
  <figcaption id="vb-caption">
    Lễ vía Đức Bồ tát Quán Thế Âm — nghi lễ chính của lễ hội
  </figcaption>
</figure>
```

---

### 4.2 Card lớn "Lễ Phật giáo" — Background mờ

| Thuộc tính | Giá trị |
|---|---|
| **Vị trí** | Card full-width đầu tiên trong section "5 Trải nghiệm" |
| **Ảnh** | Ảnh 7 (lễ đài góc rộng, nhiều đèn lồng đỏ) |
| **Lý do chọn** | Góc khác ảnh 4 (tránh trùng lặp), quy mô lễ đài rõ, tone phù hợp |
| **Hiển thị** | Background image bên trong card, `object-fit: cover` |
| **Opacity** | **12-18%** — đủ nhận ra có ảnh nhưng không tranh text |
| **Overlay** | Gradient nhẹ tone vàng đồng phủ lên, đảm bảo contrast WCAG AA |
| **Ảnh lỗi** | Card hiển thị bình thường, chỉ mất background ảnh |
| **4 card nhỏ** | Không dùng ảnh background — giữ text thuần |
| **Page dài thêm** | Không — card đã tồn tại |
| **Effort** | **XS (1-2h)** — chỉ thêm CSS background vào card có sẵn |
| **User Story** | US-4.1 (bổ sung acceptance criteria) |

**CSS approach:**

```css
.card-buddhist {
  position: relative;
  overflow: hidden;
}
.card-buddhist::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/images/landing/le-dai-wide-1200.webp') center/cover;
  opacity: 0.15;
  z-index: 0;
}
.card-buddhist::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(212,184,150,0.3), rgba(139,111,71,0.2));
  z-index: 1;
}
.card-buddhist > * {
  position: relative;
  z-index: 2;
}
```

---

### 4.3 Footer CTA — Background mờ (nice to have)

| Thuộc tính | Giá trị |
|---|---|
| **Vị trí** | Dải cuối page, gradient `cream` → `night-warm` |
| **Ảnh** | Ảnh 1 (rồng + lọng bird-eye) |
| **Lý do chọn** | Pattern màu vàng-đỏ-xanh tạo cảm giác lễ hội ngay cả khi mờ |
| **Opacity** | **8-12%** — texture nhẹ, không cần nhận ra nội dung cụ thể |
| **Overlay** | Gradient `cream` → `night-warm` phủ lên — ảnh chỉ là texture phía sau |
| **Ảnh lỗi** | Footer hiển thị bình thường, chỉ mất texture |
| **Page dài thêm** | Không — footer đã tồn tại |
| **Effort** | **XS (1h)** — CSS pseudo-element |
| **User Story** | US-6.1 (bổ sung acceptance criteria) |

---

## 5. PHÂN BỔ TỔNG THỂ

### 5.1 Landing page

| Vị trí | Ảnh | Loại | Effort |
|---|---|---|---|
| Hero | Không ảnh | Gradient + CSS animation | — |
| Transition zone | Không ảnh | Gradient + SVG divider | — |
| "Không thể bỏ lỏ" | Không ảnh | Icon/illustration line art | — |
| **Visual break** | **Ảnh 4** | **Full-bleed 40-50vh** | **XS (2-4h)** |
| **Card "Lễ Phật giáo"** | **Ảnh 7** | **Background mờ 12-18%** | **XS (1-2h)** |
| "Chuẩn bị trước khi đến" | Không ảnh | Text thuần | — |
| **Footer CTA** | **Ảnh 1** | **Background mờ 8-12%** | **XS (1h)** |
| **Tổng effort ảnh** | | | **XS–S (4-7h)** |

### 5.2 Ngoài landing page

| Vị trí | Ảnh | Ghi chú |
|---|---|---|
| OG / Social share | Ảnh 2 (toàn cảnh) | Meta tag, hiển thị khi share Zalo/Facebook |
| Event Detail modal | Ảnh 6 (xe hoa cận) | Trong schedule app, cho featured event |
| Dự phòng | Ảnh 8 (mái chùa đỏ) | Thay thế nếu ảnh nào có vấn đề |
| Loại bỏ | Ảnh 3 & 5 | Trùng nhau |

### 5.3 Tổng kết

Từ 8 ảnh BTC cung cấp: **6 ảnh sử dụng**, **2 ảnh loại bỏ** (trùng). Trên landing page: **3 ảnh** (1 full-bleed + 2 background mờ). Không AI, không rủi ro, effort tổng XS–S.

---

## 6. FLOW THỊ GIÁC SAU KHI ÁP DỤNG

```
┌─────────────────────────────────────────┐
│  HERO — gradient tím đêm                │
│  Trăng, sao, đèn lồng (CSS animation)  │
│  Countdown + CTA                        │  ← Trừu tượng, cảm xúc
│  "4 ngày · 40+ sự kiện"                 │
├─────────────────────────────────────────┤
│  TRANSITION — gradient tím → nâu đồng   │  ← Chuyển tiếp
│  Tagline + SVG divider                  │
├─────────────────────────────────────────┤
│  "KHÔNG THỂ BỎ LỌ" — nền cream         │
│  3 card text + icon                      │  ← Text thuần
│  Khai mạc · Xe hoa · Lễ vía            │
├─────────────────────────────────────────┤
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░ VISUAL BREAK — Ảnh 4 full-bleed ░░░░│  ← ẢNH THẬT (reveal moment)
│░░░ Lễ đài + tượng Quán Âm + đoàn rước ░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│  Caption: "Lễ vía Đức Bồ tát..."        │
├─────────────────────────────────────────┤
│  "5 TRẢI NGHIỆM" — nền cream-dark      │
│  ┌─────────────────────────────────┐    │
│  │ Lễ Phật giáo (ảnh 7 mờ 15%)   │    │  ← Background mờ
│  │ 15 chương trình                 │    │
│  └─────────────────────────────────┘    │
│  ┌──────────┐  ┌──────────┐            │
│  │ Nghệ thuật│  │ Triển lãm │            │  ← Text thuần
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │ Dân gian │  │ Ẩm thực  │            │
│  └──────────┘  └──────────┘            │
├─────────────────────────────────────────┤
│  "CHUẨN BỊ TRƯỚC KHI ĐẾN" — nền cream │  ← Text thuần
│  Địa chỉ · Cách đến · Lưu ý           │
├─────────────────────────────────────────┤
│  FOOTER CTA — gradient → đêm           │
│  (ảnh 1 mờ 10% texture)                │  ← Background mờ
│  "Xem chương trình" + "Chia sẻ"        │
└─────────────────────────────────────────┘
```

**Nhịp thị giác:** Tối → sáng → TEXT → **ẢNH** → text (có bg mờ) → text → tối. Visual break ở đúng vị trí phá vỡ chuỗi text phẳng, tạo đỉnh cảm xúc giữa page.

---

## 7. ASSET CHECKLIST

### Cần xin từ BTC / nhiếp ảnh gia

| # | Asset | Spec | Trạng thái |
|---|---|---|---|
| 1 | Ảnh 4 gốc không watermark | ≥ 2000px wide | ☐ Chưa có |
| 2 | Ảnh 7 gốc không watermark | ≥ 2000px wide | ☐ Chưa có |
| 3 | Ảnh 1 gốc không watermark | ≥ 2000px wide | ☐ Chưa có |
| 4 | Ảnh 2 gốc (cho OG image) | ≥ 1200px wide | ☐ Chưa có |
| 5 | Ảnh 6 gốc (cho schedule app) | ≥ 800px wide | ☐ Chưa có |

### Dev export từ ảnh gốc

| # | Asset | Từ ảnh | Kích thước | Format |
|---|---|---|---|---|
| 1 | Visual break mobile | Ảnh 4 | 800px wide | WebP 80% |
| 2 | Visual break tablet | Ảnh 4 | 1200px wide | WebP 82% |
| 3 | Visual break desktop | Ảnh 4 | 1800px wide | WebP 85% |
| 4 | Visual break fallback | Ảnh 4 | 1200px wide | JPEG 85% |
| 5 | Card Phật giáo bg | Ảnh 7 | 1200px wide | WebP 80% |
| 6 | Footer CTA texture | Ảnh 1 | 1200px wide | WebP 75% |
| 7 | OG image | Ảnh 2 | 1200×630px | JPEG 85% |

### Content (BA + Dịch thuật)

| # | Asset | Ngôn ngữ |
|---|---|---|
| 1 | Visual break caption | vi / en / kr / jp |
| 2 | Visual break alt text | vi / en |
| 3 | OG title + description | vi / en |

---

## 8. NÂNG CẤP SAU LỄ HỘI (Backlog)

Nếu có ảnh đêm từ lễ hội 2026 (chụp 04-07/04):

| Nâng cấp | Ảnh cần | Tác động |
|---|---|---|
| Visual break đổi sang ảnh đêm | Hoa đăng ban đêm | Tương phản sáng/tối mạnh hơn giữa 2 section cream bao quanh |
| Hero background | Hoa đăng hoặc xe hoa đêm + overlay | Phù hợp concept "Đêm Trăng" hơn gradient thuần |
| Card "Dân gian" thêm bg mờ | Bài chòi / cà kheo | Đa dạng hóa category |
| Gallery section (cho bản 2027) | Bộ 5-6 ảnh đa dạng | Khi đã có đủ ảnh chất lượng, thêm section gallery responsive |
| AI illustration hero (cho bản 2027) | Không cần ảnh thật | Khi có thời gian, duyệt kỹ với BTC, prompt đã chuẩn bị sẵn |
