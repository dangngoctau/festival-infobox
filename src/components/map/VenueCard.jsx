import { useTranslation } from 'react-i18next'
import { getDirectionsUrl } from '../../utils/deepLink'
import { getLocationText } from '../../utils/i18nEvent'
import { LocationPin } from '../icons'

export default function VenueCard({ venue, eventCount, isPrimary }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return (
    <div
      className={`bg-warm-card rounded-xl shadow-warm flex items-start gap-3 ${
        isPrimary ? 'p-4' : 'p-3'
      }`}
      style={{
        borderLeft: `3px solid ${venue.color}`,
        backgroundColor: isPrimary ? `${venue.color}0D` : undefined,
      }}
    >
      <LocationPin locationId={venue.id} variant="dot" size={isPrimary ? 32 : 24} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-warm-text text-sm leading-snug">
          {getLocationText(venue, 'name', lang)}
        </p>
        <p className="text-xs text-warm-muted mt-0.5">
          {getLocationText(venue, 'description', lang)}
        </p>
        {isPrimary && eventCount > 0 && (
          <p className="text-xs text-accent-brown font-medium mt-1">
            {t('places.eventsToday', { count: eventCount })}
          </p>
        )}
      </div>

      <a
        href={getDirectionsUrl(venue.lat, venue.lng, getLocationText(venue, 'name', lang))}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-1 bg-accent-gold text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-accent-gold/90 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l19-9-9 19-2-8-8-2z" />
        </svg>
        {t('places.directions')}
      </a>
    </div>
  )
}
