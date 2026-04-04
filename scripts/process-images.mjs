/**
 * Image processing script for landing page photo integration.
 *
 * Reads raw images from public/_images/, outputs optimized WebP + JPEG
 * at 3 widths (400, 800, 1200) to public/images/landing/.
 *
 * Usage: npm run process-images
 */

import sharp from 'sharp'
import { readdir, stat, mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const INPUT_DIR = join(ROOT, 'public/_images')
const OUTPUT_DIR = join(ROOT, 'public/images/landing')

// ── Image mapping: logical ID → source filename + output name ──────────────

const IMAGE_MAP = [
  // US-P.1 Hero + US-P.5 Thumbnail
  {
    src: 'toan_canh.jpeg',
    name: 'hero-bg',
    desc: 'Golden hour aerial panorama, temple + Ngu Hanh Son + lanterns + sunset',
  },
  // US-P.2 FeaturedEvents — large card (Khai mạc)
  {
    src: '1JKKG684D_6JA8DG 2.JPG',
    name: 'highlight-levia',
    desc: 'Opening ceremony: Lan Su Rong on stage, "Chao Mung Le Hoi" signs',
  },
  // US-P.2 FeaturedEvents — small left (Xe hoa)
  {
    src: '1JKOS8QUU_6JA8DG.JPG',
    name: 'highlight-xehoa',
    desc: 'Night xe hoa, glowing lotus Quan Am',
  },
  // US-P.2 FeaturedEvents — small right (Đua thuyền)
  {
    src: 'IMG_4954.JPG',
    name: 'highlight-thuyen',
    desc: 'Golden dragon on water, performers',
  },
  // US-P.4 CategoryHighlights — Buddhist
  {
    src: '1JKKG685F_6JA8DG 2.JPG',
    name: 'cat-buddhist',
    desc: 'Temple + crowd + Buddhist flag, pagoda prominent',
  },
  // US-P.4 CategoryHighlights — Arts
  {
    src: 'lan-su-rong-chua.jpg',
    name: 'cat-arts',
    desc: 'Lan Su Rong procession at Chua Quan The Am gate, red carpet, mountain',
  },
  // US-P.4 CategoryHighlights — Folk
  {
    src: 'IMG_4997 2.JPG',
    name: 'cat-folk',
    desc: 'Hoi Co Lang — traditional chess on stage, costumes, flags',
  },
  // US-P.4 CategoryHighlights — Exhibition
  {
    src: '1JKKG685A_6JA8DG 2.JPG',
    name: 'cat-exhibition',
    desc: 'Quan Am statue display with flowers, crowd photographing',
  },
  // US-P.4 CategoryHighlights — Cuisine
  {
    src: 'Copilot_20260329_180834.png',
    name: 'cat-cuisine',
    desc: 'Vegetarian feast illustration — monks, lotus, Dragon Bridge, pagoda',
  },
]

// US-P.5 Thumbnail — special crop from hero panorama
const THUMBNAIL = {
  src: 'toan_canh.jpeg',
  name: 'venue-thumb',
  desc: 'Golden hour temple close-up for PracticalInfo',
  size: 112, // 2x for retina (displayed at 56×56)
}

const WIDTHS = [400, 800, 1200]
const WEBP_QUALITY = 78
const JPEG_QUALITY = 82

// ── Processing ─────────────────────────────────────────────────────────────

async function processImage(entry) {
  const inputPath = join(INPUT_DIR, entry.src)
  const results = []

  for (const w of WIDTHS) {
    // WebP
    const webpName = `${entry.name}-${w}w.webp`
    const webpPath = join(OUTPUT_DIR, webpName)
    await sharp(inputPath)
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath)
    const webpSize = (await stat(webpPath)).size
    results.push({ file: webpName, size: webpSize })

    // JPEG fallback
    const jpgName = `${entry.name}-${w}w.jpg`
    const jpgPath = join(OUTPUT_DIR, jpgName)
    await sharp(inputPath)
      .resize(w, null, { withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY })
      .toFile(jpgPath)
    const jpgSize = (await stat(jpgPath)).size
    results.push({ file: jpgName, size: jpgSize })
  }

  return results
}

async function processThumbnail() {
  const inputPath = join(INPUT_DIR, THUMBNAIL.src)
  const s = THUMBNAIL.size
  const results = []

  // WebP thumbnail — center crop, position 25% from top (temple area)
  const meta = await sharp(inputPath).metadata()
  const cropTop = Math.round(meta.height * 0.15)
  const cropSize = Math.min(meta.width, meta.height - cropTop)

  const webpName = `${THUMBNAIL.name}-${s}.webp`
  const webpPath = join(OUTPUT_DIR, webpName)
  await sharp(inputPath)
    .extract({
      left: Math.round((meta.width - cropSize) / 2),
      top: cropTop,
      width: cropSize,
      height: cropSize,
    })
    .resize(s, s)
    .webp({ quality: WEBP_QUALITY })
    .toFile(webpPath)
  const webpSize = (await stat(webpPath)).size
  results.push({ file: webpName, size: webpSize })

  // JPEG fallback
  const jpgName = `${THUMBNAIL.name}-${s}.jpg`
  const jpgPath = join(OUTPUT_DIR, jpgName)
  await sharp(inputPath)
    .extract({
      left: Math.round((meta.width - cropSize) / 2),
      top: cropTop,
      width: cropSize,
      height: cropSize,
    })
    .resize(s, s)
    .jpeg({ quality: JPEG_QUALITY })
    .toFile(jpgPath)
  const jpgSize = (await stat(jpgPath)).size
  results.push({ file: jpgName, size: jpgSize })

  return results
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  console.log('Processing landing page images...\n')

  let allResults = []
  let mobileTotal = 0

  for (const entry of IMAGE_MAP) {
    console.log(`  ${entry.name} (${entry.desc})`)
    const results = await processImage(entry)
    allResults.push(...results)

    // Mobile budget: count only 400w WebP files
    const mobile400 = results.find((r) => r.file.endsWith('-400w.webp'))
    if (mobile400) {
      mobileTotal += mobile400.size
      console.log(
        `    400w: ${fmt(mobile400.size)} (WebP)  |  800w: ${fmt(results.find((r) => r.file.endsWith('-800w.webp')).size)}  |  1200w: ${fmt(results.find((r) => r.file.endsWith('-1200w.webp')).size)}`
      )
    }
  }

  // Thumbnail
  console.log(`\n  ${THUMBNAIL.name} (${THUMBNAIL.desc})`)
  const thumbResults = await processThumbnail()
  allResults.push(...thumbResults)
  const thumbWebp = thumbResults.find((r) => r.file.endsWith('.webp'))
  if (thumbWebp) {
    mobileTotal += thumbWebp.size
    console.log(`    ${THUMBNAIL.size}px: ${fmt(thumbWebp.size)} (WebP)`)
  }

  // Summary
  console.log('\n── Summary ──')
  console.log(`  Total files: ${allResults.length}`)
  console.log(
    `  Total size: ${fmt(allResults.reduce((s, r) => s + r.size, 0))}`
  )
  console.log(`  Mobile budget (400w WebP + thumb): ${fmt(mobileTotal)}`)

  if (mobileTotal > 500 * 1024) {
    console.warn(
      `\n  WARNING: Mobile budget exceeds 500KB! (${fmt(mobileTotal)})`
    )
  } else {
    console.log(`  Status: within 500KB budget`)
  }

  console.log('\nDone.')
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
