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

export function getFestivalPhase(now = new Date()) {
  if (isBeforeFestival(now)) return 'before'
  if (isAfterFestival(now)) return 'after'
  return 'during'
}

export function getDaysUntilFestival(now = new Date()) {
  const start = new Date(START + 'T00:00:00+07:00')
  const diff = start - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function formatShortDate(dateStr, language) {
  const day = dateStr.slice(8, 10)
  const month = dateStr.slice(5, 7)

  if (language === 'en') {
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthsEn[parseInt(month, 10) - 1]} ${day}`
  }

  return `${day}/${month}`
}

export function formatLunarDate(lunarDateStr, language) {
  if (language === 'en') {
    const datePart = lunarDateStr.split(' ')[0]
    return `${datePart} Lunar`
  }
  return lunarDateStr
}

export function formatEventDate(dateStr, lunarDate, language) {
  const date = new Date(dateStr + 'T00:00:00+07:00')
  const weekdaysVi = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const weekdaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const lunar = formatLunarDate(lunarDate, language)

  if (language === 'en') {
    const weekday = weekdaysEn[date.getDay()]
    return `${weekday}, ${monthsEn[date.getMonth()]} ${day} · ${lunar}`
  }

  const weekday = weekdaysVi[date.getDay()]
  return `${weekday} ${day}/${month} · ${lunar}`
}
