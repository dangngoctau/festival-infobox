import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import locations from '../../data/locations.json'
import { categoryColors } from '../../data/colorMap'
import { getDirectionsUrl } from '../../utils/deepLink'

const locationMap = Object.fromEntries(locations.map((l) => [l.id, l]))

export default function EventDetail({ event, onClose }) {
  const { t } = useTranslation()
  const loc = locationMap[event.locationId]
  const timeRange = event.endTime
    ? `${event.startTime} – ${event.endTime}`
    : event.startTime

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end tablet:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-warm-card w-full tablet:max-w-lg tablet:rounded-xl rounded-t-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-warm-bg/80 text-warm-text hover:bg-warm-bg z-10"
          aria-label={t('eventDetail.close')}
        >
          ✕
        </button>

        <div className="p-5">
          <span
            className="inline-block px-2.5 py-1 rounded text-xs font-medium text-white mb-3"
            style={{ backgroundColor: categoryColors[event.category] }}
          >
            {t(`category.${event.category}`)}
          </span>

          <h2 className="text-xl font-bold text-warm-text mb-2 pr-8">
            {event.title}
          </h2>

          <p className="text-accent-brown font-medium mb-1">{timeRange}</p>
          <p className="text-warm-muted text-sm mb-3">
            {event.date} ({event.lunarDate})
          </p>

          {loc && (
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: loc.color }}
              />
              <span className="text-warm-text font-medium">{loc.name}</span>
            </div>
          )}

          {event.description && (
            <p className="text-warm-muted leading-relaxed mb-4">
              {event.description}
            </p>
          )}

          {event.leadOrg && (
            <p className="text-sm text-warm-muted mb-1">
              <span className="font-medium text-warm-text">{t('eventDetail.organization')}:</span>{' '}
              {event.leadOrg}
            </p>
          )}

          {event.partnerOrgs?.length > 0 && (
            <p className="text-sm text-warm-muted mb-4">
              <span className="font-medium text-warm-text">{t('eventDetail.partners')}:</span>{' '}
              {event.partnerOrgs.join(', ')}
            </p>
          )}

          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full rounded-lg mb-4 object-cover max-h-48"
            />
          )}

          {loc && (
            <a
              href={getDirectionsUrl(loc.lat, loc.lng, loc.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-accent-gold text-white text-center py-3 rounded-lg font-semibold hover:bg-accent-gold/90 transition-colors"
            >
              {t('eventDetail.directions')}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
