import { useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import PinCard from './PinCard'
import { LocationPin } from '../icons'

// Zone display order: SVH (includes Cổng chào ①) → Chùa → Sông → CV
const ZONE_ORDER = ['svh', 'chua', 'song', 'cv']

export default function PinListPanel({ zones, highlightedPinId, onPinClick }) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const cardRefs = useRef({})

  // Build ordered zones with Cổng chào merged into SVH
  const orderedGroups = useMemo(() => {
    const zoneMap = {}
    zones.forEach((z) => { zoneMap[z.id] = z })

    return ZONE_ORDER.map((zoneId) => {
      const zone = zoneMap[zoneId]
      if (!zone) return null

      let pins = [...zone.pins]

      // Merge Cổng chào (①) into SVH group since it's the entrance
      if (zoneId === 'svh' && zoneMap['cong']) {
        pins = [...zoneMap['cong'].pins, ...pins]
      }

      // Sort by routeNumber
      pins.sort((a, b) => a.routeNumber - b.routeNumber)

      return { ...zone, pins }
    }).filter(Boolean)
  }, [zones])

  // Auto-scroll to highlighted card
  useEffect(() => {
    if (highlightedPinId && cardRefs.current[highlightedPinId]) {
      cardRefs.current[highlightedPinId].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [highlightedPinId])

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-warm-card" role="list">
      {orderedGroups.map((group) => {
        const zoneName = isEn ? group.nameEn : group.name
        return (
          <div key={group.id}>
            {/* Zone header */}
            <div
              className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 bg-warm-card/95 backdrop-blur-sm border-b border-bronze/15"
              role="heading"
              aria-level="3"
            >
              <LocationPin locationId={group.primaryLocationId} variant="dot" size={22} />
              <span className="text-sm font-bold text-warm-text">{zoneName}</span>
              <span className="text-[11px] text-warm-muted">
                {group.pins.length} {isEn ? (group.pins.length === 1 ? 'location' : 'locations') : 'điểm'}
              </span>
            </div>

            {/* Pin cards */}
            {group.pins.map((pin) => (
              <div key={pin.id} ref={(el) => { cardRefs.current[pin.id] = el }} style={{ scrollMarginTop: '40px' }} className="px-3 mb-px">
                <PinCard
                  pin={pin}
                  isHighlighted={highlightedPinId === pin.id}
                  onClick={onPinClick}
                />
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
