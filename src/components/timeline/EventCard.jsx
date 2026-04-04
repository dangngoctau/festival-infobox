import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import locations from '../../data/locations.json'
import { categoryColors, catGroupToIconId } from '../../data/colorMap'
import { getDirectionsUrl } from '../../utils/deepLink'
import { getEventText, getLocationText } from '../../utils/i18nEvent'
import { CategoryIcon } from '../icons'

const locationMap = Object.fromEntries(locations.map((l) => [l.id, l]))

export default function EventCard({ event, onClick, isFavorite, onToggleFavorite, favLoaded, timeStatus, filterMode }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const loc = locationMap[event.locationId]
  const [popping, setPopping] = useState(false)

  const isOngoing = timeStatus === 'ongoing'
  const isFeatured = event.isFeatured

  // 3-tier: ongoing > featured > normal
  const cardClass = isOngoing
    ? 'bg-accent-green/5 border-warm-muted/10 hover:border-accent-green/30'
    : isFeatured
      ? 'bg-accent-gold/5 border-warm-muted/10 hover:border-accent-gold/30'
      : 'bg-warm-card border-warm-muted/10 hover:border-accent-gold/30'

  // Tag swap based on filter mode
  const isLocationMode = filterMode === 'location' || !filterMode
  const locShortName = loc ? getLocationText(loc, 'shortName', lang) : undefined
  const primaryTag = isLocationMode
    ? { label: locShortName, color: loc?.color }
    : { label: t(`category.${event.category}`), color: categoryColors[event.category] }
  const secondaryTag = isLocationMode
    ? { label: t(`category.${event.category}`) }
    : { label: locShortName, dotColor: loc?.color }

  const handleHeart = (e) => {
    e.stopPropagation()
    setPopping(true)
    onToggleFavorite(event.id)
  }

  useEffect(() => {
    if (popping) {
      const timer = setTimeout(() => setPopping(false), 300)
      return () => clearTimeout(timer)
    }
  }, [popping])

  const handleDirections = (e) => {
    e.stopPropagation()
    if (loc) {
      window.open(getDirectionsUrl(loc.lat, loc.lng, getLocationText(loc, 'name', lang)), '_blank')
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(event)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(event) }}
      className={`w-full text-left rounded-lg p-3 border transition-colors cursor-pointer ${cardClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Category icon */}
        {catGroupToIconId[event.cat] && (
          <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-[10px] bg-accent-gold/10 overflow-hidden">
            <CategoryIcon category={event.cat} size={32} className="text-accent-brown" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {/* Time — prominent */}
          <p className="text-base font-semibold text-accent-brown">
            {event.startTime}
            {event.endTime && (
              <span className="text-warm-muted font-normal"> – {event.endTime}</span>
            )}
          </p>

          {/* Title */}
          <p className="text-base font-semibold text-warm-text mt-0.5 leading-snug">
            {getEventText(event, 'title', lang)}
          </p>

          {/* Featured description */}
          {isFeatured && event.descriptionShort && (
            <p className="text-sm text-warm-muted mt-1 leading-snug line-clamp-2">
              {getEventText(event, 'descriptionShort', lang)}
            </p>
          )}

          {/* Tags — primary chip + secondary text */}
          <div className="flex items-center gap-2 mt-1.5">
            {primaryTag.color && (
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: primaryTag.color }}
              >
                {primaryTag.label}
              </span>
            )}
            <span className="text-xs text-warm-muted flex items-center gap-1">
              {secondaryTag.dotColor && (
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: secondaryTag.dotColor }}
                />
              )}
              {secondaryTag.label}
            </span>
          </div>
        </div>

        {/* Right column: direction + heart */}
        <div className="shrink-0 flex flex-col items-center gap-1">
          {loc && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleDirections}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleDirections(e)
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-warm-bg/60 transition-colors cursor-pointer text-warm-muted/50 hover:text-accent-gold"
              aria-label={t('eventDetail.directions')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11l19-9-9 19-2-8-8-2z" />
              </svg>
            </span>
          )}
          {favLoaded && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleHeart}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation()
                  e.preventDefault()
                  handleHeart(e)
                }
              }}
              className={`text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-warm-bg/60 transition-colors cursor-pointer ${popping ? 'heart-pop' : ''}`}
              aria-label={isFavorite ? t('favorites.remove') : t('favorites.add')}
            >
              {isFavorite ? (
                <span className="text-accent-gold">♥</span>
              ) : (
                <span className="text-warm-muted/40">♡</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
