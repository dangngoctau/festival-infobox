/**
 * Generate OG share image (1200×630) with safe zone for social media.
 *
 * Source: public/_images/IMG_5003 2.JPG (festival crowd at Chùa Quán Thế Âm)
 * Output: public/og-share.jpg (≤300KB)
 *
 * Safe zone: 630×630 centered — survives 1:1 crop on Zalo/iMessage/Telegram.
 * Text overlay via SVG composite with embedded Be Vietnam Pro font.
 *
 * Usage: node scripts/generate-og.mjs
 */

import sharp from 'sharp'
import { readFile, stat } from 'node:fs/promises'
import { resolve, join } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const INPUT = join(ROOT, 'public/_images/IMG_5003 2.JPG')
const OUTPUT_PNG = join(ROOT, 'public/og-share.png')
const OUTPUT = join(ROOT, 'public/og-share.jpg')

const WIDTH = 1200
const HEIGHT = 630

// ── Load font as base64 for SVG embedding ─────────────────────────────────

async function loadFontBase64(path) {
  const buf = await readFile(path)
  return buf.toString('base64')
}

// ── Build SVG text overlay ────────────────────────────────────────────────

function buildOverlaySVG(boldFontB64, mediumFontB64) {
  // Safe zone: 630×630 centered at x=285
  // All text centered within safe zone
  const cx = WIDTH / 2 // 600

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <style>
      @font-face {
        font-family: 'BVP';
        font-weight: 700;
        src: url('data:font/truetype;base64,${boldFontB64}') format('truetype');
      }
      @font-face {
        font-family: 'BVP';
        font-weight: 500;
        src: url('data:font/truetype;base64,${mediumFontB64}') format('truetype');
      }
    </style>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.6"/>
    </filter>
    <!-- Dark gradient overlay — heavier at center for text legibility -->
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.25"/>
      <stop offset="35%" stop-color="#000" stop-opacity="0.55"/>
      <stop offset="65%" stop-color="#000" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.3"/>
    </linearGradient>
  </defs>

  <!-- Dark overlay -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad)"/>

  <!-- Lotus icon (SVG shape) -->
  <g transform="translate(${cx - 24}, 150)" filter="url(#shadow)">
    <ellipse cx="24" cy="20" rx="8" ry="18" fill="#F5E6C8" opacity="0.9"/>
    <ellipse cx="24" cy="20" rx="8" ry="18" fill="#F5E6C8" opacity="0.7" transform="rotate(-25,24,20)"/>
    <ellipse cx="24" cy="20" rx="8" ry="18" fill="#F5E6C8" opacity="0.7" transform="rotate(25,24,20)"/>
    <ellipse cx="24" cy="20" rx="8" ry="18" fill="#F5E6C8" opacity="0.5" transform="rotate(-50,24,20)"/>
    <ellipse cx="24" cy="20" rx="8" ry="18" fill="#F5E6C8" opacity="0.5" transform="rotate(50,24,20)"/>
    <circle cx="24" cy="22" r="5" fill="#C8A35A" opacity="0.8"/>
  </g>

  <!-- Festival name -->
  <text x="${cx}" y="260" text-anchor="middle"
        font-family="BVP, 'Be Vietnam Pro', system-ui, sans-serif" font-weight="700"
        font-size="56" fill="#FFFDF8" filter="url(#shadow)">
    Lễ hội Quán Thế Âm
  </text>

  <!-- Location -->
  <text x="${cx}" y="315" text-anchor="middle"
        font-family="BVP, 'Be Vietnam Pro', system-ui, sans-serif" font-weight="500"
        font-size="34" fill="#FFFDF8" filter="url(#shadow)">
    Ngũ Hành Sơn · Đà Nẵng
  </text>

  <!-- Date -->
  <text x="${cx}" y="375" text-anchor="middle"
        font-family="BVP, 'Be Vietnam Pro', system-ui, sans-serif" font-weight="500"
        font-size="28" fill="#F5E6C8" filter="url(#shadow)">
    04 – 07 Tháng 4, 2026
  </text>

  <!-- Subtle tagline -->
  <text x="${cx}" y="420" text-anchor="middle"
        font-family="BVP, 'Be Vietnam Pro', system-ui, sans-serif" font-weight="500"
        font-size="18" fill="#FFFDF8" opacity="0.8" filter="url(#shadow)">
    Di sản văn hóa phi vật thể quốc gia
  </text>
</svg>`
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('Generating OG share image...\n')

  // Load fonts
  const SCRIPT_DIR = import.meta.dirname
  const boldB64 = await loadFontBase64(join(SCRIPT_DIR, 'BeVietnamPro-Bold.ttf'))
  const mediumB64 = await loadFontBase64(join(SCRIPT_DIR, 'BeVietnamPro-Medium.ttf'))
  console.log('  Fonts loaded')

  // Get source image metadata
  const meta = await sharp(INPUT).metadata()
  console.log(`  Source: ${meta.width}×${meta.height}`)

  // Crop source to 1200×630 — focus on upper-center (temple + crowd)
  // Source is 2560×1710 → aspect 1.50:1, target is 1.90:1
  // We want to crop height, keeping upper portion (temple)
  const targetRatio = WIDTH / HEIGHT // 1.905
  const sourceRatio = meta.width / meta.height // 1.497

  let extractOpts
  if (sourceRatio < targetRatio) {
    // Source is taller relative to target — crop top/bottom
    const cropH = Math.round(meta.width / targetRatio)
    // Position: favor upper 35% (temple area, not ground)
    const topOffset = Math.round((meta.height - cropH) * 0.25)
    extractOpts = { left: 0, top: topOffset, width: meta.width, height: cropH }
  } else {
    // Source is wider — crop left/right
    const cropW = Math.round(meta.height * targetRatio)
    const leftOffset = Math.round((meta.width - cropW) / 2)
    extractOpts = { left: leftOffset, top: 0, width: cropW, height: meta.height }
  }

  console.log(`  Crop: ${JSON.stringify(extractOpts)}`)

  // Build SVG overlay
  const svgOverlay = buildOverlaySVG(boldB64, mediumB64)
  const svgBuffer = Buffer.from(svgOverlay)

  // Compose: crop + resize + overlay → JPEG (photographic content compresses well)
  await sharp(INPUT)
    .extract(extractOpts)
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .jpeg({ quality: 85 })
    .toFile(OUTPUT)

  const outputStat = await stat(OUTPUT)
  const sizeKB = (outputStat.size / 1024).toFixed(1)

  console.log(`\n  Output: ${OUTPUT}`)
  console.log(`  Size: ${sizeKB}KB ${outputStat.size <= 300 * 1024 ? '✓ within budget' : '⚠ over 300KB'}`)


  console.log('\nDone.')
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
