import { useTranslation } from 'react-i18next'
import { amenityMap } from '../../data/amenityMap'
import { getDirectionsUrl } from '../../utils/deepLink'
import { AmenityIcon } from '../icons'

export default function AmenityCard({ amenity }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const name = isEn && amenity.name_en ? amenity.name_en : amenity.name
  const entry = amenityMap[amenity.type]

  return (
    <div className="bg-warm-card rounded-xl shadow-warm p-3 flex items-center gap-3">
      <AmenityIcon type={amenity.type} variant="list" size={28} />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-warm-text text-sm leading-snug">
          {name}
        </p>
        {entry && (
          <p className="text-xs text-warm-muted">
            {isEn ? entry.label_en : entry.label}
          </p>
        )}
      </div>

      <a
        href={getDirectionsUrl(amenity.lat, amenity.lng)}
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
