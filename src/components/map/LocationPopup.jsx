import { useTranslation } from 'react-i18next'
import { getDirectionsUrl } from '../../utils/deepLink'
import { getLocationText } from '../../utils/i18nEvent'
import { trackDirectionsRequested } from '../../utils/analytics'

export default function LocationPopup({ location }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const locName = getLocationText(location, 'name', lang)

  return (
    <div className="min-w-[180px]">
      <p className="font-semibold text-sm mb-0.5">
        {locName}
      </p>
      {location.address && (
        <p className="text-xs text-gray-500 mb-1">{getLocationText(location, 'address', lang)}</p>
      )}
      <p className="text-xs text-gray-500 mb-2">{getLocationText(location, 'description', lang)}</p>
      <a
        href={getDirectionsUrl(location.lat, location.lng, locName)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackDirectionsRequested({
            source: 'map_pin',
            locationId: location.id,
            locationName: locName,
          })
        }}
        className="flex items-center justify-center gap-2 w-full bg-accent-gold text-white text-sm h-[42px] rounded-[10px] font-semibold hover:bg-accent-gold/90 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l19-9-9 19-2-8-8-2z" />
        </svg>
        {t('eventDetail.directions')}
      </a>
    </div>
  )
}
