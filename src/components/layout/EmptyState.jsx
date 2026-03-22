import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import festivalConfig from '../../data/festivalConfig'
import { isBeforeFestival, isAfterFestival, getDaysUntilFestival } from '../../utils/timeUtils'

function generateICS() {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Festival Infobox//VI',
    'BEGIN:VEVENT',
    'DTSTART:20260404T000000',
    'DTEND:20260407T235959',
    'SUMMARY:Lễ hội Quán Thế Âm 2026',
    'DESCRIPTION:Lễ hội Quán Thế Âm - Di sản văn hóa phi vật thể quốc gia. Ngũ Hành Sơn\\, Đà Nẵng.',
    'LOCATION:Chùa Quán Thế Âm\\, 48 Sư Vạn Hạnh\\, Ngũ Hành Sơn\\, Đà Nẵng',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

function downloadICS() {
  const blob = new Blob([generateICS()], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'le-hoi-quan-the-am-2026.ics'
  a.click()
  URL.revokeObjectURL(url)
}

export default function EmptyState({ now }) {
  const { t } = useTranslation()
  const [daysLeft, setDaysLeft] = useState(() => getDaysUntilFestival(now))

  useEffect(() => {
    setDaysLeft(getDaysUntilFestival(now))
    const id = setInterval(() => setDaysLeft(getDaysUntilFestival(now)), 60000)
    return () => clearInterval(id)
  }, [now])

  const before = isBeforeFestival(now)
  const after = isAfterFestival(now)

  if (!before && !after) return null

  return (
    <div className="bg-warm-card rounded-xl p-6 text-center border border-accent-gold/20">
      {before ? (
        <>
          <p className="text-5xl font-bold text-accent-gold mb-2">{daysLeft}</p>
          <p className="text-lg text-accent-brown font-medium mb-1">
            {t('emptyState.daysUntil')}
          </p>
          <p className="text-warm-muted text-sm mb-4">
            {t('emptyState.summary')}
          </p>
          <button
            onClick={downloadICS}
            className="bg-accent-gold text-white px-5 py-2.5 rounded-lg font-medium hover:bg-accent-gold/90 transition-colors"
          >
            {t('emptyState.addToCalendar')}
          </button>
        </>
      ) : (
        <>
          <p className="text-xl font-semibold text-accent-brown mb-2">
            {t('emptyState.festivalEnded')}
          </p>
          <p className="text-warm-muted">
            {t('emptyState.seeYouNext', { year: festivalConfig.year + 1 })}
          </p>
        </>
      )}
    </div>
  )
}
