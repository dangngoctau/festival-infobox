import festivalConfig from '../data/festivalConfig'

const START = festivalConfig.startDate
const END = festivalConfig.endDate

function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isBeforeFestival(now = new Date()) {
  return toDateStr(now) < START
}

export function isAfterFestival(now = new Date()) {
  return toDateStr(now) > END
}

export function isFestivalDay(now = new Date()) {
  const d = toDateStr(now)
  return d >= START && d <= END
}

export function getCurrentDayIndex(now = new Date()) {
  const d = toDateStr(now)
  const idx = festivalConfig.dates.indexOf(d)
  if (idx !== -1) return idx
  if (d < START) return 0
  return 3
}

export function estimateEndTime(startTime) {
  const [h, m] = startTime.split(':').map(Number)
  const endH = h + 2
  return `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function getEffectiveEndTime(event) {
  return event.endTime || estimateEndTime(event.startTime)
}

export function getDaysUntilFestival(now = new Date()) {
  const start = new Date(START + 'T00:00:00+07:00')
  const diff = start - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
