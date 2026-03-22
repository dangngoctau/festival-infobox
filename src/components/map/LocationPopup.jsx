import { getDirectionsUrl } from '../../utils/deepLink'

export default function LocationPopup({ location }) {
  return (
    <div className="min-w-[180px]">
      <p className="font-semibold text-warm-text text-sm mb-0.5">
        {location.name}
      </p>
      <p className="text-xs text-warm-muted mb-2">{location.description}</p>
      <a
        href={getDirectionsUrl(location.lat, location.lng, location.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-accent-gold text-white text-xs font-medium px-3 py-1.5 rounded hover:bg-accent-gold/90 transition-colors"
      >
        Chỉ đường
      </a>
    </div>
  )
}
