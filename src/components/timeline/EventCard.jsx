import { useTranslation } from 'react-i18next'
import locations from '../../data/locations.json'
import { categoryColors } from '../../data/colorMap'

const locationMap = Object.fromEntries(locations.map((l) => [l.id, l]))

export default function EventCard({ event, onClick }) {
  const { t } = useTranslation()
  const loc = locationMap[event.locationId]
  const timeRange = event.endTime
    ? `${event.startTime} – ${event.endTime}`
    : event.startTime

  return (
    <button
      onClick={() => onClick(event)}
      className="w-full text-left bg-warm-card rounded-lg p-3 border border-warm-muted/10 hover:border-accent-gold/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-accent-brown">{timeRange}</p>
          <p className="text-base font-semibold text-warm-text mt-0.5 leading-snug">
            {event.title}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {loc && (
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: loc.color }}
              >
                {loc.shortName}
              </span>
            )}
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white/90"
              style={{ backgroundColor: categoryColors[event.category] }}
            >
              {t(`category.${event.category}`)}
            </span>
          </div>
        </div>
        {event.isFeatured && (
          <span className="shrink-0 text-accent-gold text-lg" title={t('featured')}>
            ★
          </span>
        )}
      </div>
    </button>
  )
}
