import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import locations from '../../data/locations.json'
import { categoryColors } from '../../data/colorMap'
import { getDirectionsUrl } from '../../utils/deepLink'
import { getEventText, getLocationText } from '../../utils/i18nEvent'
import { trackDirectionsRequested } from '../../utils/analytics'
import { LocationPin } from '../icons'
import { Building2, Users } from 'lucide-react'
import EventDetailHeader from './EventDetailHeader'

const locationMap = Object.fromEntries(locations.map((l) => [l.id, l]))

export default function EventDetail({
  event, onClose, timeStatus, isFavorite, onToggleFavorite, favLoaded,
}) {
  const { t, i18n } = useTranslation()
  const loc = locationMap[event.locationId]
  const lang = i18n.language
  const isEn = lang === 'en'
  const [showAllPartners, setShowAllPartners] = useState(false)

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

  const partners = isEn && event.partnerOrgsEn ? event.partnerOrgsEn : event.partnerOrgs
  const hasPartners = partners?.length > 0
  const visiblePartners = showAllPartners ? partners : partners?.slice(0, 2)
  const hasMorePartners = hasPartners && partners.length > 2

  return (
    <div
      className="fixed inset-0 z-50 flex items-end tablet:items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-detail-title"
    >
      <div className="absolute inset-0 bg-black/50" />

      {/* Three-zone modal */}
      <div
        className="relative bg-warm-card w-full tablet:max-w-lg tablet:rounded-xl rounded-t-xl max-h-[85vh] flex flex-col overflow-hidden"
        style={{ borderTopColor: categoryColors[event.category], borderTopWidth: '4px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Zone 1: Identity Header */}
        <div className="shrink-0">
          <EventDetailHeader
            event={event}
            timeStatus={timeStatus}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            favLoaded={favLoaded}
            onClose={onClose}
            location={loc}
          />
        </div>

        {/* Zone 2: Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5 pb-4">
          {/* Location card */}
          {loc && (
            <div
              className="rounded-lg p-3 mb-4"
              style={{ backgroundColor: loc.color + '0D' }}
            >
              <div className="flex items-center gap-2">
                <LocationPin locationId={event.locationId} variant="dot" size={22} />
                <div>
                  <p className="text-warm-text font-medium">
                    {getLocationText(loc, 'name', lang)}
                  </p>
                  {loc.address && (
                    <p className="text-sm text-warm-muted">{getLocationText(loc, 'address', lang)}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <p className="text-warm-muted leading-relaxed mb-4">
              {getEventText(event, 'description', lang)}
            </p>
          )}

          {/* Organization */}
          {(event.leadOrg || hasPartners) && (
            <div className="rounded-lg bg-warm-bg/50 p-3 mb-4">
              {event.leadOrg && (
                <div className={`flex items-start gap-2${hasPartners ? ' pb-2.5 mb-2.5 border-b border-bronze/10' : ''}`}>
                  <Building2 size={16} className="text-warm-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-warm-muted">{t('eventDetail.organizedBy')}</p>
                    <p className="text-sm text-warm-text font-medium">
                      {getEventText(event, 'leadOrg', lang)}
                    </p>
                  </div>
                </div>
              )}
              {hasPartners && (
                <div className="flex items-start gap-2">
                  <Users size={16} className="text-warm-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-warm-muted">{t('eventDetail.coOrganized')}</p>
                    <p className="text-sm text-warm-text">
                      {visiblePartners.join(', ')}
                    </p>
                    {hasMorePartners && (
                      <button
                        onClick={() => setShowAllPartners((v) => !v)}
                        className="text-sm text-accent-gold font-medium mt-0.5"
                        aria-expanded={showAllPartners}
                      >
                        {showAllPartners
                          ? t('eventDetail.hidePartners')
                          : t('eventDetail.showAllPartners', { count: partners.length })}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image */}
          {event.image && (
            <img
              src={event.image}
              alt={getEventText(event, 'title', lang)}
              className="w-full rounded-xl mb-4 object-cover max-h-48"
            />
          )}

        </div>

        {/* Zone 3: Sticky CTA Footer */}
        {loc && (
          <div className="shrink-0 px-5 py-3 bg-warm-card shadow-up pb-safe">
            <a
              href={getDirectionsUrl(loc.lat, loc.lng, getLocationText(loc, 'name', lang))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackDirectionsRequested({
                  source: 'event_detail',
                  locationId: event.locationId,
                  locationName: getLocationText(loc, 'name', lang),
                  eventId: event.id,
                  day: event.dayIndex + 1,
                })
              }}
              className="flex items-center justify-center gap-2 w-full bg-accent-gold text-white h-[52px] rounded-xl font-semibold hover:bg-accent-gold/90 transition-colors"
            >
              <LocationPin locationId={event.locationId} variant="dot" size={20} />
              {t('eventDetail.directions')}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
