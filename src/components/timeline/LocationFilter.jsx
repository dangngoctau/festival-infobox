import { useTranslation } from 'react-i18next'
import locations from '../../data/locations.json'

export default function LocationFilter({ selectedLocationId, onLocationChange }) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onLocationChange('all')}
        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selectedLocationId === 'all'
            ? 'bg-accent-brown text-white'
            : 'bg-warm-card text-warm-text border border-warm-muted/20 hover:border-accent-brown/40'
        }`}
      >
        {t('filters.all')}
      </button>
      {locations.map((loc) => (
        <button
          key={loc.id}
          onClick={() => onLocationChange(loc.id)}
          className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium text-white transition-opacity"
          style={{
            backgroundColor: loc.color,
            opacity: selectedLocationId === 'all' || selectedLocationId === loc.id ? 1 : 0.5,
          }}
        >
          {loc.shortName}
        </button>
      ))}
    </div>
  )
}
