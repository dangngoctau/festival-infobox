import { useTranslation } from 'react-i18next'
import festivalConfig from '../../data/festivalConfig'
import { isFestivalDay, getCurrentDayIndex, formatShortDate } from '../../utils/timeUtils'

export default function DayFilter({ selectedDay, onDayChange, now }) {
  const { t, i18n } = useTranslation()
  const todayIndex = isFestivalDay(now) ? getCurrentDayIndex(now) : -1

  return (
    <div className="flex gap-2 mb-3">
      {festivalConfig.dates.map((date, i) => (
        <button
          key={i}
          onClick={() => onDayChange(i)}
          className={`flex-1 px-2 py-2 rounded-lg text-sm font-medium transition-colors relative ${
            selectedDay === i
              ? 'bg-accent-gold text-white shadow-warm'
              : 'bg-warm-card text-warm-text border border-warm-muted/20 hover:border-accent-gold/40'
          }`}
        >
          <span className="block">{formatShortDate(date, i18n.language)}</span>
          <span className="block text-xs opacity-80">
            {t(`dayLabels.${i}`)}
          </span>
          {todayIndex === i && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent-green" />
          )}
        </button>
      ))}
    </div>
  )
}
