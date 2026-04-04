# Redesign: Section "Thông tin thực tế" → "Chuẩn bị trước khi đến"

## Vấn đề hiện tại

| Vấn đề | Chi tiết |
|---|---|
| Tiêu đề mơ hồ | "Thông tin thực tế" không giúp người dùng hiểu section trả lời câu hỏi gì |
| Card chồng lấn | "Địa điểm" và "Di chuyển" cùng trả lời "làm sao đến đó" |
| Thiếu thông tin thiết thực | Không có hướng dẫn trang phục, ẩm thực, lưu ý thời tiết — những thứ du khách lần đầu cần nhất |
| Bãi xe quá chung chung | "Có bãi đỗ xe gần chùa" — không nói ở đâu, bao nhiêu bãi |
| Badge "Miễn phí vào cửa" | Nằm rời rạc, không gắn vào ngữ cảnh nào |

---

## Tiêu đề mới: **"Chuẩn bị trước khi đến"**

Lý do: gắn với hành động cụ thể của người dùng (đang lên kế hoạch đi), tạo kỳ vọng đúng về nội dung bên dưới.

Các phương án thay thế nếu cần ngắn hơn: "Hướng dẫn tham dự", "Trước khi đến".

---

## Card 1 — "Khi nào & Ở đâu"

**Icon:** Calendar + Pin gộp (hoặc giữ icon Calendar hiện tại)

**Nội dung:**

> **04 – 07 Tháng 4, 2026**
> 17–20/02 Âm lịch Bính Ngọ · 4 ngày · 40+ sự kiện
>
> **Chùa Quán Thế Âm & trục đường Sư Vạn Hạnh**
> Hòa Hải, Ngũ Hành Sơn, Đà Nẵng
> Vào từ cổng chào phía đường Lê Văn Hiến
>
> [Chỉ đường đến cổng chào →]

**Lý do gộp:** Khi người ta hỏi "lễ hội khi nào ở đâu", đó là MỘT câu hỏi — không ai hỏi riêng "khi nào" rồi mới hỏi "ở đâu". Gộp lại tiết kiệm không gian cuộn và phản ánh đúng mô hình tư duy.

**Lý do đổi địa chỉ:** Địa chỉ cũ "48 Sư Vạn Hạnh" là địa chỉ Chùa — nằm giữa khu vực lễ hội. Nếu Google Maps dẫn đến số 48, du khách có thể bị đưa vào giữa thay vì lối vào chính. Link chỉ đường nên trỏ đến **cổng chào** (giao Sư Vạn Hạnh – Lê Văn Hiến) — đây là lối vào chính, gần bãi xe và trạm bus, ai cũng đi qua.

**Badge "Miễn phí vào cửa":** Bỏ. Lễ hội diễn ra tại chùa và đường phố công cộng — miễn phí là hiển nhiên, không cần nói. Badge chỉ có giá trị khi bối cảnh gây mơ hồ (festival âm nhạc, triển lãm). Ở đây nó thừa và làm loãng card.

---

## Card 2 — "Cách đến"

**Icon:** Bus hoặc Navigation

**Nội dung:**

> **Xe máy / Ô tô**
> 2 bãi xe công cộng phía đường Lê Văn Hiến, ngay gần cổng chào — đi bộ vào khu lễ hội khoảng 2–3 phút. Lưu ý: đường Sư Vạn Hạnh là tuyến đi bộ trong lễ hội, không đi xe vào được.
>
> **Xe bus**
> Tuyến 02 (Bến xe Trung tâm – TTHC TP Đà Nẵng – Cửa Đại) chạy qua đường Lê Văn Hiến, ngay cổng chào lễ hội. Tần suất 15–30 phút/chuyến, 5h00–19h00, giá 8.000–15.000đ/lượt. Buổi tối (sau 17h30) nên đi Grab/taxi vì bus ngưng chạy.
>
> **Grab / Taxi**
> Bảo tài xế thả ở cổng chào đường Sư Vạn Hạnh (giao Lê Văn Hiến). Lưu ý tối ngày 1–3 (18h–20h) có diễu hành xe hoa trên các tuyến đường chính → khu vực lân cận có thể kẹt đường.

**Nguồn dữ liệu:** Sơ đồ bố trí chính thức BTC — 2 bãi xe công cộng phía Lê Văn Hiến, cổng chào tại ngã giao Sư Vạn Hạnh – Lê Văn Hiến.

**Lý do tách riêng khỏi Card 1:** Card 1 trả lời "đi đâu", Card 2 trả lời "đi bằng gì" — hai quyết định khác nhau. Người địa phương chỉ cần Card 1, du khách cần cả Card 2.

---

## Card 3 — "Lưu ý khi tham dự"

**Icon:** Info hoặc Lightbulb

**Nội dung (landing page — chỉ giữ 3 dòng cốt lõi):**

> Mặc trang phục kín đáo khi vào Chùa · Mang nón và nước uống (nắng 30–35°C, nhiều hoạt động ngoài trời) · Có khu ẩm thực chay và gian hàng OCOP tại lễ hội.

**Tông giọng:** thân thiện, gợi ý nhẹ nhàng — không phải nội quy.

**Nội dung chuyển sang app schedule (không đặt trên landing page):**

| Thông tin | Lý do chuyển | Đặt ở đâu trong app |
|---|---|---|
| 2 điểm WC | Chi tiết khi-đã-ở-lễ-hội, không phải khi-đang-quyết-định-đi | Tab Bản đồ (pin riêng) |
| Khu diều cách 2km | Thông tin gắn với sự kiện cụ thể | EventDetail của "Trình diễn diều nghệ thuật" |
| Gian hàng do Chùa/UBND quản lý | Không ảnh hưởng quyết định đi, quá chi tiết cho landing | Tab Bản đồ hoặc EventDetail |
| Tiêu chí "5 Không" | Đúng nhưng sai chỗ — tông nội quy giết momentum trước CTA | Màn hình welcome khi mở app lần đầu, hoặc phần "Giới thiệu" trong app |

**Lý do tinh gọn:** Landing page bán cảm xúc, app bán tiện ích. Card 3 trên landing chỉ cần đủ để người ta nghĩ "họ chu đáo ghê" — không cần đủ để thay thế bản hướng dẫn tham dự. Chi tiết granular (WC, khoảng cách khu diều, nội quy) đặt đúng chỗ trong app sẽ có giá trị cao hơn nhiều so với nằm trên landing page.

---

## So sánh trước/sau

| Tiêu chí | Hiện tại (3 card) | Đề xuất (3 card) |
|---|---|---|
| Tiêu đề section | "Thông tin thực tế" — mơ hồ | "Chuẩn bị trước khi đến" — rõ hành động |
| Card 1 | Địa điểm (chỉ địa chỉ) | Khi nào & Ở đâu (gộp thời gian + địa chỉ + badge miễn phí) |
| Card 2 | Thời gian (tách riêng, ít giá trị) | Cách đến (chi tiết 3 phương tiện, bãi xe cụ thể, cảnh báo kẹt đường) |
| Card 3 | Di chuyển (1 dòng chung chung) | Lưu ý khi tham dự (3 dòng cốt lõi: trang phục, thời tiết, ẩm thực) |
| Chồng lấn nội dung | Có (Địa điểm ↔ Di chuyển) | Không — mỗi card một câu hỏi riêng |
| Thông tin từ sơ đồ BTC | Không sử dụng | Có (bãi xe, cổng chào, WC) |
| Giá trị cho du khách lần đầu | Thấp | Cao |

---

## Ghi chú triển khai

- **Dữ liệu thời tiết (Card 3):** có thể kết nối Open-Meteo API (đã có trong roadmap — task M5) để hiển thị dự báo thời tiết thực tế thay vì text tĩnh. Fallback: giữ text tĩnh "Đà Nẵng tháng 4 nắng nóng".
- **Bãi xe (Card 2):** cân nhắc gắn link chỉ đường riêng cho bãi xe Lê Văn Hiến (tọa độ GPS lấy từ sơ đồ BTC), khác với link chỉ đường đến Chùa ở Card 1.
- **WC:** thông tin WC từ sơ đồ (2 điểm) có thể đưa vào Card 3 hoặc hiển thị trên tab Bản đồ (pin riêng). Không nên để ở card vì làm loãng nội dung — phù hợp hơn khi hiện trên map.
- **Effort:** Thay đổi chủ yếu là content + layout, không thêm component mới. Ước lượng giữ nguyên S (4–8h) như US-5.1 ban đầu.
