import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import festivalConfig from '../../data/festivalConfig'
import { isBeforeFestival, isAfterFestival, getDaysUntilFestival } from '../../utils/timeUtils'

function generateICS(t) {
  const escapeICS = (s) => s.replace(/,/g, '\\,')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Festival Infobox//VI',
    'BEGIN:VEVENT',
    'DTSTART:20260404T000000',
    'DTEND:20260407T235959',
    `SUMMARY:${t('ics.summary')}`,
    `DESCRIPTION:${escapeICS(t('ics.description'))}`,
    `LOCATION:${escapeICS(t('ics.location'))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

function downloadICS(t) {
  const blob = new Blob([generateICS(t)], { type: 'text/calendar;charset=utf-8' })
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
      {/* Lotus illustration */}
      <svg width="64" height="64" viewBox="0 0 80 80" fill="none" className="mx-auto mb-4 text-warm-muted/30">
        <path d="M40 65c0 0-12-8-12-20s12-20 12-20 12 8 12 20-12 20-12 20z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M40 65c0 0-20-5-22-18S30 25 30 25" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M40 65c0 0 20-5 22-18S50 25 50 25" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M40 65v10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M32 75c4-3 8-3 8-3s4 0 8 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
      {before ? (
        <>
          <p className="text-5xl font-bold text-accent-gold mb-2">{daysLeft}</p>
          <p className="text-lg text-accent-brown font-medium mb-1">
            {t('emptyState.daysUntil', { count: daysLeft })}
          </p>
          <p className="text-warm-muted text-sm mb-4">
            {t('emptyState.summary')}
          </p>
          <button
            onClick={() => downloadICS(t)}
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
