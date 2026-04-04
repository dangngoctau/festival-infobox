import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { zoneSymbols } from '../../data/pinSymbols'
import PinCard from './PinCard'

export default function ZoneDrillDown({ zone, pins, highlightedPinId, onPinHighlight, onBack, expanded, onToggleExpand }) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const cardRefs = useRef({})

  // Auto-scroll to highlighted card (only when expanded)
  useEffect(() => {
    if (expanded && highlightedPinId && cardRefs.current[highlightedPinId]) {
      cardRefs.current[highlightedPinId].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [highlightedPinId, expanded])

  // Auto-expand when a pin is tapped on the map
  useEffect(() => {
    if (highlightedPinId && !expanded) {
      onToggleExpand()
    }
  }, [highlightedPinId])

  const zoneName = isEn ? zone.nameEn : zone.name

  return (
    <div
      className="bg-warm-card flex-1 min-h-0 flex flex-col overflow-hidden"
    >
      {/* Drag handle + tappable header */}
      <div
        className="cursor-pointer select-none"
        onClick={onToggleExpand}
        role="button"
        aria-label={expanded ? (isEn ? 'Collapse list' : 'Thu gọn') : (isEn ? 'Expand list' : 'Mở rộng')}
      >
        {/* Drag handle pill */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-bronze/30" />
        </div>

        {/* Zone header */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-bronze/15">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${zone.zoneColor}20`, border: `2px solid ${zone.zoneColor}` }}
            dangerouslySetInnerHTML={{
              __html: `<svg viewBox="0 0 24 20" width="18" height="18">${(zoneSymbols[zone.id] || '').replace(/#FFFDF8/g, zone.zoneColor)}</svg>`,
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-warm-text truncate">{zoneName}</h3>
            <p className="text-[11px] text-warm-muted">
              {pins.length} {isEn ? (pins.length === 1 ? 'location' : 'locations') : 'điểm'}
            </p>
          </div>
          {/* Expand/collapse indicator */}
          <span className={`text-warm-muted text-xs transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
            ▲
          </span>
        </div>
      </div>

      {/* Scrollable pin list */}
      <div
        className={`flex-1 transition-all duration-300 ease-out ${
          expanded ? 'overflow-y-auto' : 'overflow-hidden'
        }`}
        role="list"
      >
        {pins.map((pin, index) => (
          <div key={pin.id} ref={(el) => { cardRefs.current[pin.id] = el }}>
            <PinCard
              pin={pin}
              index={index}
              isHighlighted={highlightedPinId === pin.id}
              onClick={onPinHighlight}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
