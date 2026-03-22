import { useTranslation } from 'react-i18next'
import festivalConfig from '../../data/festivalConfig'

export default function DayFilter({ selectedDay, onDayChange }) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-2 mb-3">
      {festivalConfig.dates.map((date, i) => (
        <button
          key={i}
          onClick={() => onDayChange(i)}
          className={`flex-1 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedDay === i
              ? 'bg-accent-gold text-white shadow-sm'
              : 'bg-warm-card text-warm-text border border-warm-muted/20 hover:border-accent-gold/40'
          }`}
        >
          <span className="block">{date.slice(8)}/04</span>
          <span className="block text-xs opacity-80">
            {t(`dayLabels.${i}`)}
          </span>
        </button>
      ))}
    </div>
  )
}
