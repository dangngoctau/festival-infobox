import React, { useState, useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import locations from '../../data/locations.json'
import amenities from '../../data/amenities.json'
import festivalConfig from '../../data/festivalConfig'
import { amenityMap } from '../../data/amenityMap'
import { trackErrorEncountered } from '../../utils/analytics'
import { getLocationText } from '../../utils/i18nEvent'
import { pinSymbols } from '../../data/pinSymbols'
import LocationPopup from './LocationPopup'
import AmenityPopup from './AmenityPopup'
import { useTranslation } from 'react-i18next'

function ResizeHandler() {
  const map = useMap()
  const containerRef = useRef(map.getContainer())

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize()
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [map])

  return null
}

function ZoomWatcher({ onZoomChange }) {
  useMapEvents({
    zoomend: (e) => {
      onZoomChange(e.target.getZoom())
    },
  })
  return null
}

// pinSymbols imported from shared module

// Simplified SVG paths for Lucide icons at 14px inside 24px viewBox
const amenitySvgPaths = {
  wc: `<path d="M4 4h4v4H4z M4 12h4v8 M16 4h4v4h-4z M16 12h4v8" stroke="#FFFDF8" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  parking_car: `<rect x="3" y="5" width="18" height="14" rx="2" stroke="#FFFDF8" stroke-width="1.8" fill="none"/><circle cx="7.5" cy="15" r="1.5" stroke="#FFFDF8" stroke-width="1.5" fill="none"/><circle cx="16.5" cy="15" r="1.5" stroke="#FFFDF8" stroke-width="1.5" fill="none"/><path d="M5 10h14" stroke="#FFFDF8" stroke-width="1.5"/>`,
  parking_bike: `<circle cx="18" cy="17" r="3" stroke="#FFFDF8" stroke-width="1.8" fill="none"/><circle cx="6" cy="17" r="3" stroke="#FFFDF8" stroke-width="1.8" fill="none"/><path d="M6 17 L9 5h3l3 6h3" stroke="#FFFDF8" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  medical: `<path d="M12 5v14M5 12h14" stroke="#FFFDF8" stroke-width="2.5" stroke-linecap="round"/>`,
  water: `<path d="M12 2v6M6 12a6 6 0 0012 0c0-4-6-10-6-10s-6 6-6 10z" stroke="#FFFDF8" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
  atm: `<rect x="3" y="6" width="18" height="12" rx="2" stroke="#FFFDF8" stroke-width="1.8" fill="none"/><path d="M7 15v-4l2 2 2-2v4M15 11h2v4M15 13h2" stroke="#FFFDF8" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  info: `<circle cx="12" cy="12" r="9" stroke="#FFFDF8" stroke-width="1.8" fill="none"/><path d="M12 16v-4M12 8h0" stroke="#FFFDF8" stroke-width="2" stroke-linecap="round"/>`,
  accessible: `<circle cx="12" cy="5" r="1.5" fill="#FFFDF8"/><path d="M12 8v6l4 4M8 14l4-4" stroke="#FFFDF8" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  bus_stop: `<rect x="4" y="4" width="16" height="14" rx="2" stroke="#FFFDF8" stroke-width="1.8" fill="none"/><circle cx="8" cy="15" r="1.5" stroke="#FFFDF8" stroke-width="1.5" fill="none"/><circle cx="16" cy="15" r="1.5" stroke="#FFFDF8" stroke-width="1.5" fill="none"/><path d="M4 10h16" stroke="#FFFDF8" stroke-width="1.5"/>`,
  wifi: `<path d="M2 8.5c3.5-3.5 13-3.5 16.5 0M5.5 12c2.5-2.5 9-2.5 11.5 0M9 15.5c1.5-1.5 4.5-1.5 6 0" stroke="#FFFDF8" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="12" cy="19" r="1" fill="#FFFDF8"/>`,
  photo_spot: `<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#FFFDF8" stroke-width="1.8" fill="none"/><circle cx="12" cy="13" r="4" stroke="#FFFDF8" stroke-width="1.8" fill="none"/>`,
  restricted: `<path d="M12 2L2 20h20L12 2z" stroke="#FFFDF8" stroke-width="1.8" fill="none" stroke-linejoin="round"/><path d="M12 9v4M12 16h0" stroke="#FFFDF8" stroke-width="2" stroke-linecap="round"/>`,
}

function createVenueIcon(loc) {
  const symbol = pinSymbols[loc.id] || ''
  const svg = `<svg viewBox="0 0 24 32" width="32" height="42" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.25))">
    <path d="M12 30 C12 30, 2 17, 2 11 C2 5.5, 6.5 1, 12 1 C17.5 1, 22 5.5, 22 11 C22 17, 12 30, 12 30Z"
      fill="${loc.color}" fill-opacity="0.92" stroke="#FFFDF8" stroke-width="1.5"/>
    ${symbol}
  </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  })
}

function createAmenityDivIcon(amenity) {
  const svgContent = amenitySvgPaths[amenity.type] || amenitySvgPaths.info
  const svg = `<div style="width:26px;height:26px;border-radius:50%;background:#6B4226;border:2px solid #FFFDF8;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 1px 4px rgba(0,0,0,0.35))">
    <svg viewBox="0 0 24 24" width="14" height="14">${svgContent}</svg>
  </div>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  })
}

const venues = locations.filter((l) => l.type === 'venue' || l.type === 'landmark' || !l.type)
const locationAmenities = locations.filter((l) => ['parking', 'restroom', 'gate'].includes(l.type))

// Map location amenity types to amenitySvgPaths keys
const locTypeToAmenityKey = { parking: 'parking_car', restroom: 'wc', gate: 'info' }

// Get unique amenity types present in data
const activeAmenityTypes = [...new Set(amenities.map((a) => a.type))]

function MapErrorFallback() {
  const { t } = useTranslation()
  return (
    <div className="w-full h-full flex items-center justify-center bg-warm-bg rounded-xl">
      <p className="text-warm-muted text-sm">{t('map.loadError')}</p>
    </div>
  )
}

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error) {
    trackErrorEncountered({ errorType: 'map_load_fail', context: 'react-leaflet' })
  }
  render() {
    if (this.state.hasError) return <MapErrorFallback />
    return this.props.children
  }
}

export default function FestivalMap({ className = '', showAmenitiesProp, hideInternalToggle = false, hideVenues = false }) {
  const { t, i18n } = useTranslation()
  const [zoom, setZoom] = useState(festivalConfig.mapZoom)
  const [showAmenitiesInternal, setShowAmenitiesInternal] = useState(false)
  const [amenityFilter, setAmenityFilter] = useState('all')
  const showAmenities = showAmenitiesProp !== undefined ? showAmenitiesProp : showAmenitiesInternal
  const showLabels = zoom >= 16
  const showAmenityMarkers = showAmenitiesProp !== undefined ? showAmenities : (showAmenities && zoom >= 16)
  const isEn = i18n.language === 'en'

  const filteredAmenities = useMemo(() => {
    if (amenityFilter === 'all') return amenities
    return amenities.filter((a) => a.type === amenityFilter)
  }, [amenityFilter])

  return (
    <MapErrorBoundary>
    <div className="relative w-full h-full map-warm rounded-[14px] border-[1.5px] border-bronze/30 shadow-bronze overflow-hidden">
      <MapContainer
        center={[festivalConfig.mapCenter.lat, festivalConfig.mapCenter.lng]}
        zoom={festivalConfig.mapZoom}
        className={`w-full h-full rounded-xl ${className}`}
        style={{ minHeight: '300px' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ResizeHandler />
        <ZoomWatcher onZoomChange={setZoom} />

        {/* Venue markers */}
        {!hideVenues && venues.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createVenueIcon(loc)}
          >
            <Popup>
              <LocationPopup location={loc} />
            </Popup>
            {showLabels && (
              <Tooltip permanent direction="right" offset={[18, 0]} className="venue-label">
                {getLocationText(loc, 'shortName', i18n.language)}
              </Tooltip>
            )}
          </Marker>
        ))}

        {/* Location-based amenity markers (parking, WC, gate from locations.json) */}
        {showAmenityMarkers && locationAmenities.map((loc) => (
          <Marker
            key={`loc-${loc.id}`}
            position={[loc.lat, loc.lng]}
            icon={createAmenityDivIcon({ type: locTypeToAmenityKey[loc.type] || 'info' })}
            zIndexOffset={-100}
          >
            <Popup>
              <LocationPopup location={loc} />
            </Popup>
          </Marker>
        ))}

        {/* Amenity markers — visible at zoom >= 16 */}
        {showAmenityMarkers && filteredAmenities.map((amenity) => (
          <Marker
            key={amenity.id}
            position={[amenity.lat, amenity.lng]}
            icon={createAmenityDivIcon(amenity)}
            zIndexOffset={-100}
          >
            <Popup>
              <AmenityPopup amenity={amenity} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Amenity layer toggle button */}
      {!hideInternalToggle && (
        <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end gap-2">
          <button
            onClick={() => {
              setShowAmenitiesInternal((v) => !v)
              if (showAmenitiesInternal) setAmenityFilter('all')
            }}
            className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-warm transition-colors ${
              showAmenities
                ? 'bg-accent-gold text-white'
                : 'bg-warm-card text-warm-muted hover:bg-warm-bg'
            }`}
            aria-label={t('map.toggleAmenities')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </button>

          {/* Amenity type filter chips */}
          {showAmenities && (
            <div className="flex gap-1.5 max-w-[240px] overflow-x-auto scrollbar-none rounded-lg bg-warm-card/90 backdrop-blur-sm p-1.5 shadow-warm">
              <AmenityChip
                label={t('filters.all')}
                active={amenityFilter === 'all'}
                onClick={() => setAmenityFilter('all')}
              />
              {activeAmenityTypes.map((type) => {
                const entry = amenityMap[type]
                if (!entry) return null
                return (
                  <AmenityChip
                    key={type}
                    label={isEn ? entry.label_en : entry.label}
                    type={type}
                    active={amenityFilter === type}
                    onClick={() => setAmenityFilter(type)}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
    </MapErrorBoundary>
  )
}

function AmenityChip({ label, type, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-bronze text-cream-light'
          : 'bg-transparent text-warm-muted hover:bg-warm-bg'
      }`}
    >
      {type && (
        <span
          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: active ? 'rgba(255,253,248,0.25)' : 'rgba(212,184,150,0.15)',
          }}
          dangerouslySetInnerHTML={{
            __html: `<svg viewBox="0 0 24 24" width="10" height="10">${(amenitySvgPaths[type] || amenitySvgPaths.info).replace(/#FFFDF8/g, active ? '#FFFDF8' : '#6B4226')}</svg>`,
          }}
        />
      )}
      {label}
    </button>
  )
}
