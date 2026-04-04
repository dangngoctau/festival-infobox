# US-7.1: OG Share Image — Chọn ảnh & crop safe zone

**Là** người dùng chia sẻ link lễ hội qua Zalo/iMessage/Telegram,
**tôi muốn** thumbnail hiển thị rõ ràng, đọc được ở kích thước nhỏ,
**để** người nhận nhận diện ngay đây là Lễ hội Quán Thế Âm và muốn tap vào.

---

## Bối cảnh

- Hiện tại OG image dùng hero screenshot, nền tối, chữ nhỏ — gần như không đọc được ở thumbnail 100×100px
- Zalo, iMessage, Telegram crop OG image thành hình vuông (~1:1)
- Facebook, Twitter giữ 1.91:1 (1200×630)
- Cần 1 ảnh phục vụ cả hai tỷ lệ → thiết kế 1200×630, nội dung nằm trong safe zone vuông 630×630 ở trung tâm

### Sơ đồ safe zone

```
┌──────────────────────────────┐
│  bleed   ┌──────────┐ bleed  │  1200×630
│  zone    │ SAFE ZONE│  zone  │
│ (285px)  │ 630×630  │(285px) │
│          │          │        │
│          └──────────┘        │
└──────────────────────────────┘
```

---

## Acceptance Criteria

### Chọn ảnh gốc
- [ ] Chọn 1 ảnh đại diện lễ hội từ nguồn có sẵn (ảnh Chùa Quán Thế Âm, hoa đăng, hoặc cảnh lễ hội năm trước)
- [ ] Ảnh gốc tối thiểu 1200×1200px, chất lượng cao, không watermark
- [ ] Ưu tiên ảnh có focal point rõ (hoa đăng trên nước, cổng Chùa, tượng Quán Âm) — tránh ảnh đám đông chung chung

### Crop & Overlay
- [ ] Canvas: 1200×630px
- [ ] Ảnh gốc crop/scale lấp đầy canvas, áp dark overlay gradient 40-60% để chữ đọc được
- [ ] Toàn bộ text + logo nằm trong **safe zone 630×630px trung tâm**
- [ ] Vùng bleed 2 bên (mỗi bên 285px): ảnh nền tiếp tục, mất khi crop vuông cũng không ảnh hưởng

### Nội dung trong safe zone
- [ ] Dòng 1: Icon hoa sen hoặc logo lễ hội — kích thước đủ nhận diện ở 100px render
- [ ] Dòng 2: **"Lễ hội Quán Thế Âm"** — bold, font ≥ 48px
- [ ] Dòng 3: **"Ngũ Hành Sơn · Đà Nẵng"** — medium, font ≥ 32px
- [ ] Dòng 4: **"04 – 07 Tháng 4, 2026"** — medium, font ≥ 28px
- [ ] Màu chữ: cream-light (#FFFDF8), text-shadow nhẹ để tách khỏi nền ảnh
- [ ] Căn giữa cả ngang và dọc trong safe zone

### Tích hợp
- [ ] File output: `og-share.png`, nén ≤ 300KB
- [ ] Đặt trong `/public/`
- [ ] Cập nhật `index.html`:

```html
<meta property="og:image" content="https://lehoiquantheam-nhs-danang.vn/og-share.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:title" content="Lễ hội Quán Thế Âm – Ngũ Hành Sơn 2026" />
<meta property="og:description" content="4 ngày · 40+ sự kiện · Hoa đăng, đua thuyền, nghệ thuật dân gian" />
<meta property="og:type" content="website" />
```

### Kiểm tra
- [ ] Test preview trên Zalo (crop vuông) — chữ đọc được, ảnh không bị cắt quan trọng
- [ ] Test preview trên Facebook (1.91:1) — layout cân đối
- [ ] Test trên iMessage / Telegram
- [ ] Dùng [opengraph.xyz](https://opengraph.xyz) hoặc Facebook Sharing Debugger để validate

---

## Thông tin triển khai

**Effort:** XS (2-4h)
**Phụ thuộc:** Cần 1 ảnh gốc từ BTC hoặc ảnh lễ hội năm trước
**Ưu tiên:** Cao — ảnh hưởng trực tiếp đến tỷ lệ click khi share, là kênh viral chính của lễ hội
