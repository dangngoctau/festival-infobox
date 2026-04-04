import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getFestivalPhase } from '../../utils/timeUtils'
import locations from '../../data/locations.json'
import amenities from '../../data/amenities.json'
import schedule from '../../data/schedule.json'
import FestivalMap from './FestivalMap'
import VenueCard from './VenueCard'
import AmenityCard from './AmenityCard'

const venues = locations.filter((l) => l.type === 'venue' || !l.type)
const sortedVenues = [...venues].sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0))

const phaseContextKey = {
  before: 'places.contextBefore',
  during: 'places.contextDuring',
  after: 'places.contextAfter',
}

export default function PlacesTab({ now, selectedDay }) {
  const { t } = useTranslation()
  const [mode, setMode] = useState('venues')
  const phase = getFestivalPhase(now)

  const eventCountByLocation = useMemo(() => {
    const counts = {}
    schedule
      .filter((e) => e.dayIndex === selectedDay)
      .forEach((e) => {
        counts[e.locationId] = (counts[e.locationId] || 0) + 1
      })
    return counts
  }, [selectedDay])

  const isDuringFestival = phase === 'during'
  const showAmenities = mode === 'amenities'

  return (
    <div className="space-y-2">
      {/* Context intro line (US-9B.1) */}
      <p className="text-sm italic text-warm-muted px-1">
        {t(phaseContextKey[phase])}
      </p>

      {/* Mode toggle (US-9B.2) */}
      <div className="flex bg-warm-bg rounded-lg p-1 gap-1">
        <button
          onClick={() => setMode('venues')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
            mode === 'venues'
              ? 'bg-accent-gold text-white'
              : 'bg-warm-card text-warm-muted'
          }`}
        >
          {t('places.toggleVenues')}
        </button>
        <button
          onClick={() => setMode('amenities')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
            mode === 'amenities'
              ? 'bg-accent-gold text-white'
              : 'bg-warm-card text-warm-muted'
          }`}
        >
          {t('places.toggleAmenities')}
        </button>
      </div>

      {/* Map (US-9B.5 warm styling applied inside FestivalMap) */}
      <div className="rounded-[14px] overflow-hidden" style={{ height: '50dvh', minHeight: '280px' }}>
        <FestivalMap
          className="h-full"
          showAmenitiesProp={showAmenities}
          hideVenues={showAmenities}
          hideInternalToggle
        />
      </div>

      {/* Section label (US-9B.6) */}
      <p className="text-sm font-medium text-warm-muted py-2 px-1">
        {mode === 'venues'
          ? t('places.venueCount', { count: sortedVenues.length })
          : t('places.amenityAllLabel', { count: amenities.length })}
      </p>

      {/* List */}
      <div className="space-y-2">
        {mode === 'venues'
          ? sortedVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                eventCount={isDuringFestival ? (eventCountByLocation[venue.id] || 0) : 0}
                isPrimary={!!venue.primary}
              />
            ))
          : amenities.map((amenity) => (
              <AmenityCard key={amenity.id} amenity={amenity} />
            ))}
      </div>
    </div>
  )
}
