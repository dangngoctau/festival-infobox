Generate 3 JavaScript constants (`SHORT_NAMES`, `HIGHLIGHTS`, `MERGE_KEYS`) for a Node script that renders daily schedule share cards (1080x1350 JPEG) for the Quan The Am Festival 2026 app. Each card shows events grouped by Morning/Afternoon/Evening with short names, merged rows for concurrent events, and gold-highlighted key events.

## Events (41 total)

Format: `ID | startTime | title VI | title EN | category`

**Day 0 — 04/04 — Opening (18 events)**
d1-01 | 07:00 | Lễ khai kinh · Thượng phan | Sutra Opening · Banner Raising | ceremony
d1-02 | 08:00 | Lân Sư Rồng & Hội thao dân gian | Lion–Dragon Dance & Folk Sports | art
d1-03 | 09:00 | Điêu khắc đá & Đá mỹ nghệ | Stone Sculpture & Stonecraft | exhibition
d1-04 | 09:30 | Triển lãm nhiếp ảnh nghệ thuật | Art Photography Exhibition | exhibition
d1-05 | 09:30 | Ký họa màu nước & Thư pháp | Watercolor Sketching & Calligraphy | exhibition
d1-06 | 10:00 | Gian hàng OCOP | OCOP Product Fair | culinary
d1-07 | 10:00 | Trình diễn diều nghệ thuật | Artistic Kite Flying | folk
d1-08 | 14:30 | Triển lãm "Quan Âm mùa lễ hội" | "Quan Am in Festival Season" | exhibition
d1-09 | 15:00 | Nhảy sạp & Trò chơi dân gian | Bamboo Dance & Folk Games | folk
d1-10 | 15:00 | Trưng bày sách & Thi Review sách | Book Display & Review Contest | exhibition
d1-11 | 15:30 | Ẩm thực chay Đà Nẵng | Da Nang Vegetarian Cuisine | culinary
d1-12 | 16:00 | Lễ tưởng niệm Huyền Trân Công Chúa | Princess Huyền Trân Memorial | ceremony
d1-13 | 16:00 | Lễ tế Xuân cầu Quốc thái Dân an | Spring Prayer for National Peace | ceremony
d1-14 | 17:30 | Khai mạc Lễ hội | Festival Opening Ceremony | ceremony
d1-15 | 18:00 | Diễu hành xe hoa | Floral Float Parade | art
d1-16 | 18:30 | Múa rối cạn & Múa rối nước | Rod & Water Puppet Show | art
d1-17 | 19:30 | Văn nghệ chào mừng Lễ hội | Festival Welcome Show | art
d1-18 | 20:00 | Hoa đăng Thiền hành | Lantern Ceremony & Walking Meditation | ceremony

**Day 1 — 05/04 — Vibrant (11 events)**
d2-01 | 07:30 | Hội Cờ làng & Thi đi cà kheo | Village Chess & Stilt Walking | folk
d2-02 | 08:30 | Tranh thiếu nhi "Nét đẹp NHS" | Children's Art "Beauty of NHS" | exhibition
d2-03 | 10:00 | Trình diễn diều nghệ thuật | Artistic Kite Flying | folk
d2-04 | 14:00 | Pháp đàn Đại bi · Thuyết pháp | Great Compassion Assembly · Dharma Talk | dharma
d2-05 | 16:00 | Bài chòi & Dân ca miền Trung | Bài Chòi & Central Folk Songs | folk
d2-06 | 18:00 | Diễu hành xe hoa | Floral Float Parade | art
d2-07 | 18:30 | Thuyết giảng Phật pháp | Dharma Lecture | dharma
d2-08 | 19:00 | Lễ Quán đảnh Quán Âm | Abhisheka Ceremony | ceremony
d2-09 | 19:30 | Khánh thành Trụ Kinh Pháp Luân | Dharma Wheel Sutra Pillar | ceremony
d2-10 | 20:00 | Văn nghệ chào mừng Lễ hội | Festival Celebration Show | art
d2-11 | 20:30 | Hoa đăng & Lửa trại | Floating Lanterns & Bonfire | ceremony

**Day 2 — 06/04 — Main Ceremony (10 events)**
d3-01 | 07:00 | Lễ vía Đức Bồ tát Quán Thế Âm | Avalokiteshvara Commemoration | ceremony
d3-02 | 09:00 | Lễ Quán đảnh Quán Âm | Abhisheka Ceremony | ceremony
d3-03 | 09:30 | Đua thuyền truyền thống | Traditional Boat Race | folk
d3-04 | 10:00 | Trình diễn diều nghệ thuật | Artistic Kite Flying | folk
d3-05 | 14:00 | Pháp đàn · Thiền tọa · Thuyết pháp | Dharma Assembly · Meditation · Talk | dharma
d3-06 | 16:00 | Bài chòi & Dân ca miền Trung | Bài Chòi & Central Folk Songs | folk
d3-07 | 18:00 | Diễu hành xe hoa | Floral Float Parade | art
d3-08 | 19:00 | Chương trình nghệ thuật | Arts Performance | art
d3-09 | 20:00 | Hoa đăng Thiền hành | Lantern Ceremony & Walking Meditation | ceremony
d3-10 | 21:00 | Lửa trại truyền thống | Traditional Bonfire | folk

**Day 3 — 07/04 — Closing (2 events)**
d4-01 | 07:00 | Đi bộ vì Hòa bình 2026 | Walk for Peace 2026 | folk
d4-02 | 09:30 | Lễ Bế mạc | Closing Ceremony | ceremony

## Rules

**SHORT_NAMES** — compact display name for each event on the card:
- Every event must have an entry: `'d1-01': { vi: '...', en: '...' }`
- Max ~35 chars VI, ~30 chars EN. Shorter is better.
- Drop filler prefixes ("Chương trình", "Khai mạc", "Biểu diễn") when meaning is clear
- English: concise, no articles, abbreviate naturally
- Recurring events must use identical names across days (kite: d1-07/d2-03/d3-04, parade: d1-15/d2-06/d3-07, bài chòi: d2-05/d3-06)

**HIGHLIGHTS** — key events with gold emphasis (bold, tinted bg, star):
- 4–5 per day (Day 3: both events)
- Pick: flagship ceremonies, unique/one-time events, crowd favorites
- Day 0: opening ceremony (d1-14), float parade (d1-15), lantern (d1-18) + 1–2 more
- Day 1: abhisheka (d2-08), float parade (d2-06), lanterns (d2-11) + 1–2 more
- Day 2: bodhisattva ceremony (d3-01), boat race (d3-03), float parade (d3-07), lantern (d3-09)
- Day 3: d4-01 + d4-02

**MERGE_KEYS** — combine same-time events into one row joined by " · ":
- Only merge events with exact same startTime
- Key format: `d{day}-{HHMM}-{theme}` (e.g., `d1-0930-art`)
- Good merges: d1-04+d1-05 (09:30, both exhibitions), d1-06+d1-07 (10:00), d1-09+d1-10 (15:00), d1-12+d1-13 (16:00), d2-08+d2-09 (19:00-19:30 adjacent ceremonies)
- Don't merge highlighted + non-highlighted if it dilutes the highlight
- Target rows after merging: Day 0 ≤ 15, Day 1 ≤ 11, Day 2 ≤ 10, Day 3 = 2

## Output

Produce valid JS, paste-ready:

```javascript
const SHORT_NAMES = {
  'd1-01': { vi: '...', en: '...' },
  // all 41 events...
}

const HIGHLIGHTS = new Set([
  // Day 0
  'd1-02', 'd1-14', 'd1-15', 'd1-18',
  // Day 1
  'd2-06', 'd2-08', 'd2-11',
  // Day 2
  'd3-01', 'd3-02', 'd3-03', 'd3-07', 'd3-09',
  // Day 3
  'd4-01', 'd4-02',
])

const MERGE_KEYS = {
  'd1-04': 'd1-0930-art',
  'd1-05': 'd1-0930-art',
  // etc...
}
```

## Checklist
1. All 41 IDs in SHORT_NAMES
2. VI ≤ 35 chars, EN ≤ 30 chars each
3. HIGHLIGHTS: 4–5 per day (2 for Day 3)
4. MERGE_KEYS pairs share exact same startTime
5. Rows after merge ≤ 15 per day
6. Recurring events use identical names across days
7. Vietnamese diacritics intact
8. English culturally respectful (national heritage Buddhist festival)
