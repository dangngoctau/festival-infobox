import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { categoryColors, catGroupToIconId } from '../../data/colorMap'
import { getEventText } from '../../utils/i18nEvent'
import { formatEventDate } from '../../utils/timeUtils'
import { CategoryIcon } from '../icons'
import { X } from 'lucide-react'
import ShareEventButton from './ShareEventButton'

export default function EventDetailHeader({
  event, timeStatus, isFavorite, onToggleFavorite, favLoaded, onClose, location,
}) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [popping, setPopping] = useState(false)

  const timeRange = event.endTime
    ? `${event.startTime} – ${event.endTime}`
    : event.startTime

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

  return (
    <div className="px-5 pt-5 pb-4">
      {/* Share + Favorite + Close buttons */}
      <ShareEventButton event={event} location={location} />
      {favLoaded && (
        <button
          onClick={handleHeart}
          className={`absolute top-3 right-14 w-10 h-10 flex items-center justify-center rounded-full bg-warm-bg/80 backdrop-blur-sm z-10 text-lg ${popping ? 'heart-pop' : ''}`}
          aria-label={isFavorite ? t('eventDetail.unfavorite') : t('eventDetail.favorite')}
        >
          {isFavorite ? (
            <span className="text-accent-gold">♥</span>
          ) : (
            <span className="text-warm-muted/40">♡</span>
          )}
        </button>
      )}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-warm-bg/80 backdrop-blur-sm text-warm-text hover:bg-warm-bg z-10"
        aria-label={t('eventDetail.close')}
      >
        <X size={18} />
      </button>

      {/* Category badge */}
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium mb-3"
        style={{
          backgroundColor: categoryColors[event.category] + '26',
          color: categoryColors[event.category],
        }}
      >
        {catGroupToIconId[event.cat] && (
          <CategoryIcon category={event.cat} size={20} />
        )}
        {t(`category.${event.category}`)}
      </span>

      {/* Title */}
      <h2
        id="event-detail-title"
        className="text-xl font-bold text-warm-text mb-2"
      >
        {getEventText(event, 'title', lang)}
      </h2>

      {/* Time status + time range */}
      <div className="flex items-center gap-2 mb-1">
        {timeStatus === 'ongoing' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm font-semibold" style={{ boxShadow: '0 0 8px rgba(74,103,65,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            {t('timeState.ongoing')}
          </span>
        )}
        {timeStatus === 'ended' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warm-muted/10 border border-warm-muted/20 text-warm-muted text-sm font-medium">
            {t('eventDetail.ended')}
          </span>
        )}
        <span className="text-accent-brown font-medium">{timeRange}</span>
      </div>

      {/* Formatted date */}
      <p className="text-warm-muted text-sm">
        {formatEventDate(event.date, event.lunarDate, lang)}
      </p>
    </div>
  )
}
