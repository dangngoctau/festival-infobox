/**
 * Pre-generate share card images for the Quan The Am Festival app.
 *
 * Reads schedule.json + locations.json, produces:
 *   - 41 event cards x 2 languages = 82 JPEGs  -> public/images/share/event-{id}-{lang}.jpg
 *   - 4 daily cards  x 2 languages = 8  JPEGs  -> public/images/share/day-{0-3}-{lang}.jpg
 *
 * Usage: node scripts/generate-share-cards.mjs
 */

import { createCanvas, registerFont, loadImage } from 'canvas'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'

// ── Paths ────────────────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dirname, '..')
const FONTS_DIR = join(ROOT, 'scripts', 'fonts')
const DATA_DIR = join(ROOT, 'src', 'data')
const IMAGES_DIR = join(ROOT, 'public', 'images', 'landing')
const OUT_DIR = join(ROOT, 'public', 'images', 'share')

// ── Register fonts ───────────────────────────────────────────────────────────

registerFont(join(FONTS_DIR, 'BeVietnamPro-Regular.ttf'), { family: 'Be Vietnam Pro', weight: '400', style: 'normal' })
registerFont(join(FONTS_DIR, 'BeVietnamPro-Medium.ttf'), { family: 'Be Vietnam Pro', weight: '500', style: 'normal' })
registerFont(join(FONTS_DIR, 'BeVietnamPro-SemiBold.ttf'), { family: 'Be Vietnam Pro', weight: '600', style: 'normal' })
registerFont(join(FONTS_DIR, 'BeVietnamPro-Bold.ttf'), { family: 'Be Vietnam Pro', weight: '700', style: 'normal' })
registerFont(join(FONTS_DIR, 'BeVietnamPro-Italic.ttf'), { family: 'Be Vietnam Pro', weight: '400', style: 'italic' })
registerFont(join(FONTS_DIR, 'BeVietnamPro-MediumItalic.ttf'), { family: 'Be Vietnam Pro', weight: '500', style: 'italic' })

// ── Load data ────────────────────────────────────────────────────────────────

const schedule = JSON.parse(readFileSync(join(DATA_DIR, 'schedule.json'), 'utf-8'))
const locations = JSON.parse(readFileSync(join(DATA_DIR, 'locations.json'), 'utf-8'))
const locationMap = Object.fromEntries(locations.map(l => [l.id, l]))

// ── Constants ────────────────────────────────────────────────────────────────

const W = 1080
const H = 1350
const FONT = "'Be Vietnam Pro'"

const FESTIVAL = {
  year: 2026,
  name: 'Lễ hội Quán Thế Âm',
  nameEn: 'Quan The Am Festival',
  dates: ['2026-04-04', '2026-04-05', '2026-04-06', '2026-04-07'],
  lunarDates: ['17/02', '18/02', '19/02', '20/02'],
  domain: 'lehoiquantheam-nhs-danang.vn',
}

const CREAM_LIGHT = '#FFFDF8'
const BRONZE = '#D4B896'
const ACCENT_GOLD = '#C8A35A'
const NIGHT_WARM = '#2C1810'
const BORDER_GOLD = 'rgba(200,163,90,0.15)'
const INFO_MUTED = '#C4B5A4'
const WARM_TEXT = '#3E2723'
const WARM_MUTED = '#795548'

const CATEGORY_LABELS = {
  ceremony: { vi: 'Lễ nghi', en: 'Ceremony' },
  dharma: { vi: 'Phật pháp', en: 'Dharma' },
  folk: { vi: 'Dân gian', en: 'Folk' },
  exhibition: { vi: 'Triển lãm', en: 'Exhibition' },
  culinary: { vi: 'Ẩm thực chay', en: 'Vegetarian Cuisine' },
  art: { vi: 'Nghệ thuật', en: 'Art & Performance' },
}

const CATEGORY_TO_GROUP = {
  ceremony: 'buddhist-ceremony',
  dharma: 'buddhist-ceremony',
  art: 'performing-arts',
  exhibition: 'exhibition',
  folk: 'folk-culture',
  culinary: 'cuisine',
}

const CAT_IMAGE_MAP = {
  'buddhist-ceremony': 'cat-buddhist',
  'performing-arts': 'cat-arts',
  'folk-culture': 'cat-folk',
  'exhibition': 'cat-exhibition',
  'cuisine': 'cat-cuisine',
}

const DAY_CONFIG = [
  { label: 'Khai mạc', labelEn: 'Opening', subtitle: 'Sáng khai kinh, chiều khai hội, tối hoa đăng', subtitleEn: 'Morning sutras, afternoon opening, evening lanterns' },
  { label: 'Rộn ràng', labelEn: 'Vibrant', subtitle: 'Cà kheo rộn ràng, kinh kệ an nhiên', subtitleEn: 'Stilts and chants, peace and joy' },
  { label: 'Hoan hỷ', labelEn: 'Joyful', subtitle: 'Ngày vía Bồ tát — tâm điểm lễ hội', subtitleEn: 'Bodhisattva Day — heart of the festival' },
  { label: 'Bế mạc', labelEn: 'Closing', subtitle: 'Đi bộ vì hòa bình, khép lại mùa lễ', subtitleEn: 'Walk for peace, closing ceremony' },
]

const HIGHLIGHTS = new Set([
  'd1-02', 'd1-14', 'd1-15', 'd1-18',
  'd2-06', 'd2-08', 'd2-11',
  'd3-01', 'd3-02', 'd3-03', 'd3-07', 'd3-09',
  'd4-01', 'd4-02',
])

const SHORT_NAMES = {
  'd1-01': { vi: 'Lễ khai kinh', en: 'Sutra Opening' },
  'd1-02': { vi: 'Lân Sư Rồng & Khai mạc hội', en: 'Lion-Dragon Dance' },
  'd1-03': { vi: 'Điêu khắc đá & Đá mỹ nghệ', en: 'Stone Sculpture' },
  'd1-04': { vi: 'Nhiếp ảnh nghệ thuật', en: 'Art Photography' },
  'd1-05': { vi: 'Ký họa & Thư pháp', en: 'Sketching & Calligraphy' },
  'd1-06': { vi: 'Gian hàng OCOP', en: 'OCOP Fair' },
  'd1-07': { vi: 'Diều nghệ thuật', en: 'Kite Flying' },
  'd1-08': { vi: 'Triển lãm Quan Âm', en: 'Quan Am Exhibition' },
  'd1-09': { vi: 'Nhảy sạp & Trò chơi', en: 'Bamboo Dance & Games' },
  'd1-10': { vi: 'Trưng bày & Review sách', en: 'Book Display' },
  'd1-11': { vi: 'Ẩm thực chay', en: 'Vegetarian Cuisine' },
  'd1-12': { vi: 'Lễ tưởng niệm Huyền Trân', en: 'Huyền Trân Memorial' },
  'd1-13': { vi: 'Lễ tế Xuân', en: 'Spring Prayer' },
  'd1-14': { vi: 'Khai mạc Lễ hội', en: 'Festival Opening' },
  'd1-15': { vi: 'Diễu hành xe hoa', en: 'Floral Parade' },
  'd1-16': { vi: 'Múa rối cạn & nước', en: 'Puppet Show' },
  'd1-17': { vi: 'Văn nghệ chào mừng', en: 'Welcome Show' },
  'd1-18': { vi: 'Hoa đăng Thiền hành', en: 'Lantern Ceremony' },
  'd2-01': { vi: 'Cờ làng & Cà kheo', en: 'Chess & Stilt Walking' },
  'd2-02': { vi: 'Tranh thiếu nhi', en: "Children's Art" },
  'd2-03': { vi: 'Diều nghệ thuật', en: 'Kite Flying' },
  'd2-04': { vi: 'Pháp đàn · Thuyết pháp', en: 'Dharma Assembly' },
  'd2-05': { vi: 'Bài chòi & Dân ca', en: 'Bài Chòi & Folk Songs' },
  'd2-06': { vi: 'Diễu hành xe hoa', en: 'Floral Parade' },
  'd2-07': { vi: 'Thuyết giảng Phật pháp', en: 'Dharma Lecture' },
  'd2-08': { vi: 'Lễ Quán đảnh Quán Âm', en: 'Abhisheka Ceremony' },
  'd2-09': { vi: 'Khánh thành Trụ Kinh', en: 'Sutra Pillar' },
  'd2-10': { vi: 'Văn nghệ chào mừng', en: 'Celebration Show' },
  'd2-11': { vi: 'Hoa đăng & Lửa trại', en: 'Lanterns & Bonfire' },
  'd3-01': { vi: 'Lễ vía Đức Bồ tát', en: 'Bodhisattva Ceremony' },
  'd3-02': { vi: 'Lễ Quán đảnh (quốc tế)', en: 'Abhisheka (international)' },
  'd3-03': { vi: 'Đua thuyền truyền thống', en: 'Traditional Boat Race' },
  'd3-04': { vi: 'Diều nghệ thuật', en: 'Kite Flying' },
  'd3-05': { vi: 'Pháp đàn · Thiền tọa', en: 'Dharma · Meditation' },
  'd3-06': { vi: 'Bài chòi & Dân ca', en: 'Bài Chòi & Folk Songs' },
  'd3-07': { vi: 'Diễu hành xe hoa', en: 'Floral Parade' },
  'd3-08': { vi: 'Chương trình nghệ thuật', en: 'Arts Performance' },
  'd3-09': { vi: 'Hoa đăng Thiền hành', en: 'Lantern Ceremony' },
  'd3-10': { vi: 'Lửa trại truyền thống', en: 'Traditional Bonfire' },
  'd4-01': { vi: 'Đi bộ vì Hòa bình', en: 'Walk for Peace' },
  'd4-02': { vi: 'Lễ Bế mạc', en: 'Closing Ceremony' },
}

const MERGE_KEYS = {
  'd1-04': 'd1-0930-art',
  'd1-05': 'd1-0930-art',
  'd1-06': 'd1-1000-open',
  'd1-07': 'd1-1000-open',
  'd1-09': 'd1-1500-folk',
  'd1-10': 'd1-1500-folk',
  'd1-12': 'd1-1600-ceremony',
  'd1-13': 'd1-1600-ceremony',
  'd2-08': 'd2-1900-ceremony',
  'd2-09': 'd2-1900-ceremony',
}

// ── Canvas helper functions ──────────────────────────────────────────────────

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(' ')
  let line = ''
  let lineCount = 0

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i]
    const metrics = ctx.measureText(testLine)

    if (metrics.width > maxWidth && line) {
      lineCount++
      if (maxLines && lineCount >= maxLines) {
        ctx.fillText(line.slice(0, -1) + '\u2026', x, y)
        return y + lineHeight
      }
      ctx.fillText(line, x, y)
      line = words[i]
      y += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) {
    ctx.fillText(line, x, y)
    y += lineHeight
  }
  return y
}

function drawCalendarIcon(ctx, x, y, color) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 1.5
  ctx.lineJoin = 'round'
  roundRect(ctx, x, y + 2, 14, 12, 2)
  ctx.stroke()
  ctx.fillRect(x, y + 5, 14, 1.5)
  ctx.lineWidth = 1.8
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x + 4, y)
  ctx.lineTo(x + 4, y + 3)
  ctx.moveTo(x + 10, y)
  ctx.lineTo(x + 10, y + 3)
  ctx.stroke()
  ctx.restore()
}

function drawPinIcon(ctx, x, y, color) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x + 5, y + 14)
  ctx.bezierCurveTo(x + 5, y + 10, x, y + 7, x, y + 5)
  ctx.arc(x + 5, y + 5, 5, Math.PI, 0, false)
  ctx.bezierCurveTo(x + 10, y + 7, x + 5, y + 10, x + 5, y + 14)
  ctx.fill()
  ctx.fillStyle = '#FFFDF7'
  ctx.beginPath()
  ctx.arc(x + 5, y + 5, 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawIconCircle(ctx, x, y, size) {
  ctx.beginPath()
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(200,163,90,0.15)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(200,163,90,0.25)'
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawDiamondDivider(ctx, x, y, width) {
  const midX = x + width / 2

  // Gradient line left
  const gradL = ctx.createLinearGradient(x, 0, midX - 16, 0)
  gradL.addColorStop(0, 'rgba(200,163,90,0)')
  gradL.addColorStop(1, 'rgba(200,163,90,0.3)')
  ctx.strokeStyle = gradL
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x + 40, y)
  ctx.lineTo(midX - 16, y)
  ctx.stroke()

  // Diamond character
  ctx.font = `400 18px ${FONT}`
  ctx.fillStyle = 'rgba(200,163,90,0.35)'
  const dw = ctx.measureText('\u2666').width
  ctx.fillText('\u2666', midX - dw / 2, y + 6)

  // Gradient line right
  const gradR = ctx.createLinearGradient(midX + 16, 0, x + width, 0)
  gradR.addColorStop(0, 'rgba(200,163,90,0.3)')
  gradR.addColorStop(1, 'rgba(200,163,90,0)')
  ctx.strokeStyle = gradR
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(midX + 16, y)
  ctx.lineTo(x + width - 40, y)
  ctx.stroke()
}

// ── Text helpers ─────────────────────────────────────────────────────────────

function getEventText(event, field, lang) {
  if (lang === 'en') {
    const enField = `${field}En`
    return event[enField] || event[field]
  }
  return event[field]
}

function getLocationText(location, field, lang) {
  if (lang === 'en') {
    const enField = `${field}En`
    return location[enField] || location[field]
  }
  return location[field]
}

function getCategoryLabel(category, isEn) {
  const labels = isEn ? CATEGORY_LABELS : CATEGORY_LABELS
  const entry = labels[category]
  if (!entry) return category
  return isEn ? entry.en : entry.vi
}

function getSubtitle(event, lang) {
  const short = getEventText(event, 'descriptionShort', lang)
  if (short) return short
  const desc = getEventText(event, 'description', lang)
  if (!desc) return null
  if (desc.length <= 80) return desc
  return desc.slice(0, 77) + '\u2026'
}

function formatEventDate(dateStr, lunarDate, lang) {
  const date = new Date(dateStr + 'T00:00:00+07:00')
  const weekdaysVi = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const weekdaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  // The date constructor with +07:00 offset means getUTC methods give us the local date
  // But we should be careful — the date was created with T00:00:00+07:00 so
  // getUTCHours would be 17 (previous day) if we don't handle offset.
  // Let's parse directly from the string instead.
  const dd = dateStr.slice(8, 10)
  const mm = dateStr.slice(5, 7)
  // Get day of week properly
  const dow = date.getDay()
  // Adjust for timezone: the Date(2026-04-04T00:00:00+07:00) is actually April 3 in UTC
  // So getDay() gives the UTC day, which may be off. Let's just parse directly.
  const dayOfWeek = new Date(dateStr + 'T12:00:00+07:00').getDay()

  if (lang === 'en') {
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    // lunarDate is like "17/02 Âm lịch" — extract just the date part
    const lunarShort = lunarDate.replace(' Âm lịch', '')
    return `${weekdaysEn[dayOfWeek]}, ${monthsEn[parseInt(mm, 10) - 1]} ${dd} \u00b7 ${lunarShort} Lunar`
  }
  const lunarShort = lunarDate.replace(' Âm lịch', '')
  return `${weekdaysVi[dayOfWeek]} ${dd}/${mm} \u00b7 ${lunarShort} \u00c2m l\u1ecbch`
}

// ── Image helpers ────────────────────────────────────────────────────────────

function getCategoryImagePath(catGroup) {
  const imgName = CAT_IMAGE_MAP[catGroup] || 'cat-buddhist'
  return join(IMAGES_DIR, `${imgName}-800w.jpg`)
}

async function drawImageCover(ctx, imgPath, x, y, w, h) {
  try {
    const img = await loadImage(imgPath)
    const imgRatio = img.width / img.height
    const boxRatio = w / h
    let drawW, drawH, offsetX, offsetY
    if (imgRatio > boxRatio) {
      drawH = h
      drawW = h * imgRatio
      offsetX = x - (drawW - w) / 2
      offsetY = y
    } else {
      drawW = w
      drawH = w / imgRatio
      offsetX = x
      offsetY = y - (drawH - h) / 2
    }
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
  } catch (err) {
    // Fallback: dark warm fill
    ctx.fillStyle = '#2C1810'
    ctx.fillRect(x, y, w, h)
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// EVENT CARD RENDERER
// ══════════════════════════════════════════════════════════════════════════════

async function renderEventCard(event, location, lang) {
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const isEn = lang === 'en'

  // Clip to rounded rect for entire card
  ctx.save()
  roundRect(ctx, 0, 0, W, H, 24)
  ctx.clip()

  // === LAYER 1: Background image ===
  const catGroup = CATEGORY_TO_GROUP[event.category] || event.cat
  const imgPath = getCategoryImagePath(catGroup)
  await drawImageCover(ctx, imgPath, 0, 0, W, H)

  // Warm tint
  ctx.fillStyle = 'rgba(44,24,16,0.2)'
  ctx.fillRect(0, 0, W, H)

  // === LAYER 2: Vignette ===
  const vg = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.8)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(0,0,0,0.4)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, W, H)

  // === LAYER 3: Strong bottom gradient ===
  const grad = ctx.createLinearGradient(0, H * 0.3, 0, H)
  grad.addColorStop(0, 'rgba(44,24,16,0)')
  grad.addColorStop(0.3, 'rgba(44,24,16,0.5)')
  grad.addColorStop(0.6, 'rgba(44,24,16,0.85)')
  grad.addColorStop(1, 'rgba(44,24,16,0.92)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // === LAYER 4: Decorative border ===
  const inset = 18
  const r = 12
  ctx.strokeStyle = BORDER_GOLD
  ctx.lineWidth = 1.5
  roundRect(ctx, inset, inset, W - inset * 2, H - inset * 2, r)
  ctx.stroke()

  // Corner accents
  const accentLen = 48
  const accentW = 2.5
  ctx.strokeStyle = 'rgba(200,163,90,0.3)'
  ctx.lineWidth = accentW

  // Top-left
  ctx.beginPath()
  ctx.moveTo(inset, inset + accentLen)
  ctx.lineTo(inset, inset)
  ctx.lineTo(inset + accentLen, inset)
  ctx.stroke()

  // Bottom-right
  ctx.beginPath()
  ctx.moveTo(W - inset, H - inset - accentLen)
  ctx.lineTo(W - inset, H - inset)
  ctx.lineTo(W - inset - accentLen, H - inset)
  ctx.stroke()

  // === LAYER 5: Top badges ===
  const badgeY = 44
  const badgeH = 44
  const badgeR = badgeH / 2

  // Left badge: festival name
  const festText = isEn
    ? `${FESTIVAL.nameEn} ${FESTIVAL.year}`
    : `${FESTIVAL.name} ${FESTIVAL.year}`
  ctx.font = `600 20px ${FONT}`
  const festW = ctx.measureText(festText).width
  const leftBadgeW = festW + 36
  const leftX = 44

  roundRect(ctx, leftX, badgeY, leftBadgeW, badgeH, badgeR)
  ctx.fillStyle = 'rgba(44,24,16,0.5)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(200,163,90,0.2)'
  ctx.lineWidth = 1
  roundRect(ctx, leftX, badgeY, leftBadgeW, badgeH, badgeR)
  ctx.stroke()

  ctx.fillStyle = CREAM_LIGHT
  ctx.fillText(festText, leftX + 18, badgeY + badgeH / 2 + 7)

  // Right badge: day number + date
  const dayNum = event.dayIndex + 1
  const dd = event.date.slice(8, 10)
  const mm = event.date.slice(5, 7)
  const dayText = isEn
    ? `DAY ${dayNum} \u00b7 ${dd}/${mm}`
    : `NG\u00c0Y ${dayNum} \u00b7 ${dd}/${mm}`
  ctx.font = `700 18px ${FONT}`
  const dayW = ctx.measureText(dayText).width
  const rightBadgeW = dayW + 36
  const rightX = W - 44 - rightBadgeW

  roundRect(ctx, rightX, badgeY, rightBadgeW, badgeH, badgeR)
  ctx.fillStyle = 'rgba(200,163,90,0.9)'
  ctx.fill()

  ctx.fillStyle = NIGHT_WARM
  ctx.fillText(dayText, rightX + 18, badgeY + badgeH / 2 + 6)

  // === LAYER 6: Content ===
  const pad = 60
  const contentW = W - pad * 2
  let y = H * 0.52

  // Category label with line prefix
  const catLabel = getCategoryLabel(event.category, isEn)
  ctx.font = `600 20px ${FONT}`
  ctx.fillStyle = ACCENT_GOLD

  // Horizontal line prefix
  const lineY = y + 8
  ctx.strokeStyle = ACCENT_GOLD
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(pad, lineY)
  ctx.lineTo(pad + 36, lineY)
  ctx.stroke()

  ctx.fillText(catLabel.toUpperCase(), pad + 50, y + 14)
  y += 42

  // Title
  ctx.font = `700 56px ${FONT}`
  ctx.fillStyle = CREAM_LIGHT
  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = 24
  ctx.shadowOffsetY = 3
  const title = getEventText(event, 'title', lang)
  y = wrapText(ctx, title, pad, y + 52, contentW, 66, 3)
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // Subtitle
  const subtitle = getSubtitle(event, lang)
  if (subtitle) {
    ctx.font = `italic 500 28px ${FONT}`
    ctx.fillStyle = BRONZE
    y = wrapText(ctx, subtitle, pad, y + 8, contentW, 38, 2)
  }

  y += 28

  // Info row 1: calendar icon + date + time
  const iconCircleSize = 44
  const iconSize = 14
  drawIconCircle(ctx, pad, y, iconCircleSize)
  drawCalendarIcon(ctx, pad + (iconCircleSize - iconSize) / 2, y + (iconCircleSize - iconSize) / 2, ACCENT_GOLD)
  const textX = pad + iconCircleSize + 16
  const dateText = formatEventDate(event.date, event.lunarDate, lang)
  const timeRange = event.endTime ? `${event.startTime} \u2013 ${event.endTime}` : event.startTime
  ctx.font = `500 24px ${FONT}`
  ctx.fillStyle = CREAM_LIGHT
  ctx.fillText(`${dateText}  \u00b7  ${timeRange}`, textX, y + iconCircleSize / 2 + 8)
  y += iconCircleSize + 16

  // Info row 2: pin icon + location
  if (location) {
    const pinW = 10
    drawIconCircle(ctx, pad, y, iconCircleSize)
    drawPinIcon(ctx, pad + (iconCircleSize - pinW) / 2, y + (iconCircleSize - iconSize) / 2, ACCENT_GOLD)
    ctx.font = `500 24px ${FONT}`
    ctx.fillStyle = CREAM_LIGHT
    ctx.fillText(getLocationText(location, 'name', lang), textX, y + iconCircleSize / 2 + 8)
    y += iconCircleSize + 16
  }

  y += 16

  // Diamond divider
  drawDiamondDivider(ctx, pad, y, contentW)
  y += 32

  // Domain URL
  ctx.font = `500 18px ${FONT}`
  ctx.fillStyle = INFO_MUTED
  const domainW = ctx.measureText(FESTIVAL.domain).width
  ctx.fillText(FESTIVAL.domain, (W - domainW) / 2, y)

  // === LAYER 7: Bottom gold bar ===
  const barH = 6
  const barY = H - barH
  const barGrad = ctx.createLinearGradient(0, 0, W, 0)
  barGrad.addColorStop(0, 'rgba(200,163,90,0)')
  barGrad.addColorStop(0.5, 'rgba(200,163,90,0.5)')
  barGrad.addColorStop(1, 'rgba(200,163,90,0)')
  ctx.fillStyle = barGrad
  ctx.fillRect(0, barY, W, barH)

  ctx.restore()

  return canvas
}

// ══════════════════════════════════════════════════════════════════════════════
// DAILY CARD RENDERER
// ══════════════════════════════════════════════════════════════════════════════

async function renderDailyCard(dayIndex, dayEvents, lang) {
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const isEn = lang === 'en'
  const config = DAY_CONFIG[dayIndex]
  const dateStr = FESTIVAL.dates[dayIndex]
  const lunarDate = FESTIVAL.lunarDates[dayIndex]
  const dd = dateStr.slice(8, 10)
  const mm = dateStr.slice(5, 7)

  // Weekday
  const dateObj = new Date(dateStr + 'T12:00:00+07:00')
  const dayOfWeek = dateObj.getDay()
  const weekdaysVi = ['Ch\u1ee7 Nh\u1eadt', 'Th\u1ee9 Hai', 'Th\u1ee9 Ba', 'Th\u1ee9 T\u01b0', 'Th\u1ee9 N\u0103m', 'Th\u1ee9 S\u00e1u', 'Th\u1ee9 B\u1ea3y']
  const weekdaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // ══ ZONE 1: Photo header (top 513px) ══

  const photoH = 513
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, W, photoH)
  ctx.clip()

  // Background image
  const heroPath = join(IMAGES_DIR, 'hero-bg-800w.jpg')
  await drawImageCover(ctx, heroPath, 0, 0, W, photoH)

  // Warm tint
  ctx.fillStyle = 'rgba(44,24,16,0.15)'
  ctx.fillRect(0, 0, W, photoH)

  // Vignette
  const vg = ctx.createRadialGradient(W / 2, photoH / 2, W * 0.3, W / 2, photoH / 2, W * 0.7)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(0,0,0,0.35)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, W, photoH)

  // Gradient fade at bottom: photo -> cream (taller for more breathing room)
  const fadeGrad = ctx.createLinearGradient(0, photoH - 220, 0, photoH)
  fadeGrad.addColorStop(0, 'rgba(255,253,248,0)')
  fadeGrad.addColorStop(0.4, 'rgba(255,253,248,0.6)')
  fadeGrad.addColorStop(1, CREAM_LIGHT)
  ctx.fillStyle = fadeGrad
  ctx.fillRect(0, photoH - 220, W, 220)

  ctx.restore()

  // Brand badge top-left
  const brandY = 36
  const brandH = 40
  const brandR = brandH / 2
  const brandText = isEn ? `Quan The Am Festival ${FESTIVAL.year}` : `L\u1ec5 h\u1ed9i Qu\u00e1n Th\u1ebf \u00c2m ${FESTIVAL.year}`
  ctx.font = `600 18px ${FONT}`
  const brandW = ctx.measureText(brandText).width + 32
  const brandX = 36

  roundRect(ctx, brandX, brandY, brandW, brandH, brandR)
  ctx.fillStyle = 'rgba(44,24,16,0.5)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(200,163,90,0.2)'
  ctx.lineWidth = 1
  roundRect(ctx, brandX, brandY, brandW, brandH, brandR)
  ctx.stroke()

  ctx.fillStyle = CREAM_LIGHT
  ctx.fillText(brandText, brandX + 16, brandY + brandH / 2 + 6)

  // Overlay text at bottom of photo zone — positioned higher for breathing room
  const pad = 60
  let y = photoH - 170

  // Day label in a dark pill badge (same approach as brand badge — readable over any photo)
  const dayLabel = isEn
    ? `DAY ${dayIndex + 1} \u2014 ${config.labelEn.toUpperCase()}`
    : `NG\u00c0Y ${dayIndex + 1} \u2014 ${config.label.toUpperCase()}`
  ctx.font = `600 20px ${FONT}`
  const dayLabelW = ctx.measureText(dayLabel).width
  const dlBadgeW = dayLabelW + 40
  const dlBadgeH = 38
  const dlBadgeR = dlBadgeH / 2

  roundRect(ctx, pad, y, dlBadgeW, dlBadgeH, dlBadgeR)
  ctx.fillStyle = 'rgba(44,24,16,0.55)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(200,163,90,0.25)'
  ctx.lineWidth = 1
  roundRect(ctx, pad, y, dlBadgeW, dlBadgeH, dlBadgeR)
  ctx.stroke()

  ctx.fillStyle = ACCENT_GOLD
  ctx.fillText(dayLabel, pad + 20, y + dlBadgeH / 2 + 7)
  y += dlBadgeH + 12

  // Subtitle
  const subtitleText = isEn ? config.subtitleEn : config.subtitle
  ctx.font = `700 36px ${FONT}`
  ctx.fillStyle = WARM_TEXT
  y = wrapText(ctx, subtitleText, pad, y + 36, W - pad * 2, 44, 2)
  y += 4

  // Meta line: weekday + DD/MM + lunar
  const metaText = isEn
    ? `${weekdaysEn[dayOfWeek]}, ${dd}/${mm} \u00b7 ${lunarDate} Lunar`
    : `${weekdaysVi[dayOfWeek]}, ${dd}/${mm} \u00b7 ${lunarDate} \u00c2m l\u1ecbch`
  ctx.font = `500 18px ${FONT}`
  ctx.fillStyle = '#5D4037'
  ctx.fillText(metaText, pad, y + 4)

  // ══ ZONE 2: Schedule list (513 to 1256) ══

  const listTop = 513
  const listBottom = 1256
  const creamBg = CREAM_LIGHT

  // Cream background
  ctx.fillStyle = creamBg
  ctx.fillRect(0, listTop, W, listBottom - listTop)

  // Group events by time period
  const morning = []   // < 12:00
  const afternoon = []  // 12:00-17:59
  const evening = []    // >= 18:00

  // Build merged rows
  const mergedRows = buildMergedRows(dayEvents, lang)

  for (const row of mergedRows) {
    const hour = parseInt(row.time.split(':')[0], 10)
    if (hour < 12) morning.push(row)
    else if (hour < 18) afternoon.push(row)
    else evening.push(row)
  }

  const groups = [
    { label: isEn ? 'MORNING' : 'S\u00c1NG', rows: morning },
    { label: isEn ? 'AFTERNOON' : 'CHI\u1ec0U', rows: afternoon },
    { label: isEn ? 'EVENING' : 'T\u1ed0I', rows: evening },
  ].filter(g => g.rows.length > 0)

  const rowHeight = 38
  const groupGap = 16
  const groupLabelH = 30

  // Calculate total content height
  let totalContentH = 0
  for (const g of groups) {
    totalContentH += groupLabelH + groupGap / 2
    totalContentH += g.rows.length * rowHeight
    totalContentH += groupGap
  }

  // Available height in zone 2
  const availableH = listBottom - listTop - 40  // 40px padding top+bottom
  const startY = listTop + 20

  // Scale row height if needed
  let effectiveRowH = rowHeight
  let effectiveGroupGap = groupGap
  if (totalContentH > availableH) {
    const scale = availableH / totalContentH
    effectiveRowH = Math.floor(rowHeight * scale)
    effectiveGroupGap = Math.floor(groupGap * scale)
  }

  let cy = startY

  for (const group of groups) {
    // Group label with gradient line
    ctx.font = `600 16px ${FONT}`
    ctx.fillStyle = INFO_MUTED
    const labelW = ctx.measureText(group.label).width
    ctx.fillText(group.label, pad, cy + 14)

    // Gradient line after label
    const lineX = pad + labelW + 12
    const lineEndX = W - pad
    const lineGrad = ctx.createLinearGradient(lineX, 0, lineEndX, 0)
    lineGrad.addColorStop(0, 'rgba(196,168,130,0.4)')
    lineGrad.addColorStop(1, 'rgba(196,168,130,0)')
    ctx.strokeStyle = lineGrad
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(lineX, cy + 10)
    ctx.lineTo(lineEndX, cy + 10)
    ctx.stroke()

    cy += groupLabelH + effectiveGroupGap / 2

    // Event rows
    const timeColW = 60
    const timeX = pad
    const nameX = pad + timeColW + 16

    for (const row of group.rows) {
      const rowY = cy

      // Highlight row
      if (row.highlight) {
        // Tinted background
        ctx.fillStyle = 'rgba(200,163,90,0.08)'
        ctx.fillRect(pad - 8, rowY - 4, W - pad * 2 + 16, effectiveRowH)

        // Gold left border
        ctx.fillStyle = ACCENT_GOLD
        ctx.fillRect(pad - 8, rowY - 4, 3, effectiveRowH)
      }

      // Time (right-aligned in 60px column)
      ctx.font = `600 18px ${FONT}`
      ctx.fillStyle = '#6B4226'
      const timeW = ctx.measureText(row.time).width
      ctx.fillText(row.time, timeX + timeColW - timeW, rowY + 18)

      // Name
      const maxNameW = W - nameX - pad - (row.highlight ? 24 : 0)
      ctx.font = row.highlight ? `700 20px ${FONT}` : `400 20px ${FONT}`
      ctx.fillStyle = WARM_TEXT

      // Truncate if needed
      let nameText = row.name
      while (ctx.measureText(nameText).width > maxNameW && nameText.length > 5) {
        nameText = nameText.slice(0, -2) + '\u2026'
      }
      ctx.fillText(nameText, nameX, rowY + 18)

      // Star suffix for highlights
      if (row.highlight) {
        const nameW2 = ctx.measureText(nameText).width
        ctx.font = `400 16px ${FONT}`
        ctx.fillStyle = ACCENT_GOLD
        ctx.fillText(' \u2605', nameX + nameW2, rowY + 18)
      }

      cy += effectiveRowH
    }

    cy += effectiveGroupGap
  }

  // ══ ZONE 3: Bottom bar ══
  // Fill only below the schedule content (cy is cursor after last event row)

  ctx.fillStyle = CREAM_LIGHT
  ctx.fillRect(0, cy, W, H - cy)

  // Decorative border inset 12px
  ctx.strokeStyle = 'rgba(200,163,90,0.1)'
  ctx.lineWidth = 1
  roundRect(ctx, 12, 12, W - 24, H - 24, 8)
  ctx.stroke()

  // Domain URL left — anchored from bottom
  const bottomY = H - 50
  ctx.font = `400 16px ${FONT}`
  ctx.fillStyle = INFO_MUTED
  ctx.fillText(FESTIVAL.domain, pad, bottomY)

  // 4 dot indicators right
  const dotSize = 10
  const dotGap = 12
  const dotsW = 4 * dotSize + 3 * dotGap
  const dotsX = W - pad - dotsW
  const dotsY = bottomY - 6

  for (let i = 0; i < 4; i++) {
    const cx2 = dotsX + i * (dotSize + dotGap) + dotSize / 2
    const cy2 = dotsY
    ctx.beginPath()
    ctx.arc(cx2, cy2, dotSize / 2, 0, Math.PI * 2)
    ctx.fillStyle = i === dayIndex ? ACCENT_GOLD : '#E8DFD2'
    ctx.fill()
  }

  // Bottom gold bar
  const goldBarH = 4
  const goldBarY = H - goldBarH
  const goldGrad = ctx.createLinearGradient(0, 0, W, 0)
  goldGrad.addColorStop(0, 'rgba(200,163,90,0)')
  goldGrad.addColorStop(0.5, 'rgba(200,163,90,0.5)')
  goldGrad.addColorStop(1, 'rgba(200,163,90,0)')
  ctx.fillStyle = goldGrad
  ctx.fillRect(0, goldBarY, W, goldBarH)

  return canvas
}

/**
 * Build merged event rows for the daily card.
 * Events sharing a MERGE_KEY are combined into one row with names joined by " · ".
 */
function buildMergedRows(dayEvents, lang) {
  const rows = []
  const seen = new Set()

  for (const event of dayEvents) {
    if (seen.has(event.id)) continue

    const mergeKey = MERGE_KEYS[event.id]
    if (mergeKey) {
      // Find all events with same merge key
      const group = dayEvents.filter(e => MERGE_KEYS[e.id] === mergeKey)
      if (seen.has(group[0].id)) continue
      group.forEach(e => seen.add(e.id))

      const names = group.map(e => {
        const sn = SHORT_NAMES[e.id]
        return sn ? (lang === 'en' ? sn.en : sn.vi) : getEventText(e, 'title', lang)
      })
      const anyHighlight = group.some(e => HIGHLIGHTS.has(e.id))

      rows.push({
        time: group[0].startTime,
        name: names.join(' \u00b7 '),
        highlight: anyHighlight,
      })
    } else {
      seen.add(event.id)
      const sn = SHORT_NAMES[event.id]
      const name = sn ? (lang === 'en' ? sn.en : sn.vi) : getEventText(event, 'title', lang)

      rows.push({
        time: event.startTime,
        name,
        highlight: HIGHLIGHTS.has(event.id),
      })
    }
  }

  return rows
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  // Create output directory
  mkdirSync(OUT_DIR, { recursive: true })

  const langs = ['vi', 'en']
  let totalGenerated = 0
  let totalErrors = 0

  console.log('=== Generating share cards ===\n')

  // --- Event cards ---
  console.log(`--- Event cards (${schedule.length} events x ${langs.length} languages) ---\n`)

  for (const event of schedule) {
    const location = locationMap[event.locationId] || null

    for (const lang of langs) {
      const filename = `event-${event.id}-${lang}.jpg`
      const outPath = join(OUT_DIR, filename)

      try {
        const canvas = await renderEventCard(event, location, lang)
        const buffer = canvas.toBuffer('image/jpeg', { quality: 0.85 })
        writeFileSync(outPath, buffer)
        const sizeKB = Math.round(buffer.length / 1024)
        console.log(`  Generated ${filename} (${sizeKB}KB)`)
        totalGenerated++
      } catch (err) {
        console.error(`  ERROR ${filename}: ${err.message}`)
        totalErrors++
      }
    }
  }

  // --- Daily cards ---
  console.log(`\n--- Daily cards (4 days x ${langs.length} languages) ---\n`)

  for (let dayIndex = 0; dayIndex < 4; dayIndex++) {
    const dayEvents = schedule.filter(e => e.dayIndex === dayIndex)

    for (const lang of langs) {
      const filename = `day-${dayIndex}-${lang}.jpg`
      const outPath = join(OUT_DIR, filename)

      try {
        const canvas = await renderDailyCard(dayIndex, dayEvents, lang)
        const buffer = canvas.toBuffer('image/jpeg', { quality: 0.85 })
        writeFileSync(outPath, buffer)
        const sizeKB = Math.round(buffer.length / 1024)
        console.log(`  Generated ${filename} (${sizeKB}KB)`)
        totalGenerated++
      } catch (err) {
        console.error(`  ERROR ${filename}: ${err.message}`)
        totalErrors++
      }
    }
  }

  console.log(`\n=== Done: ${totalGenerated} cards generated, ${totalErrors} errors ===`)
  if (totalErrors > 0) process.exit(1)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
