import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Circle, ZoomControl, useMap } from 'react-leaflet'
import festivalConfig from '../../data/festivalConfig'
import useZones from '../../hooks/useZones'
import useUtilities from '../../hooks/useUtilities'
import useGPS from '../../hooks/useGPS'
import { ResizeHandler, ZoomWatcher, MapErrorBoundary } from './MapControls'
import ZoneMarker from './ZoneMarker'
import ZoneDrillDown from './ZoneDrillDown'
import NumberedPin from './NumberedPin'
import UtilityPin from './UtilityPin'
import ControlBar from './ControlBar'
import { useTranslation } from 'react-i18next'

// Fly map to fit all zones (overview) or drill-down bounds
// Guards against zero-size container (map hidden via display:none on inactive tab)
function MapFlyController({ zones, activeZone, activeZonePins }) {
  const map = useMap()
  const prevZoneRef = useRef(undefined) // undefined = first render
  const hasFittedRef = useRef(false)

  // On first visible render, fit bounds to show all 5 zones
  useEffect(() => {
    if (hasFittedRef.current) return
    const size = map.getSize()
    if (!size || size.x === 0 || size.y === 0) return
    hasFittedRef.current = true

    const allBounds = zones.map((z) => [z.centerLat, z.centerLng])
    if (allBounds.length > 1) {
      map.fitBounds(allBounds, { padding: [30, 30], maxZoom: 16 })
    }
  }, [zones, map])

  // Handle zone transitions (drill-down / back)
  useEffect(() => {
    if (prevZoneRef.current === undefined) {
      prevZoneRef.current = activeZone
      return
    }
    if (prevZoneRef.current === activeZone) return
    prevZoneRef.current = activeZone

    const size = map.getSize()
    if (!size || size.x === 0 || size.y === 0) return

    if (!activeZone) {
      // Back to zone overview — fit all zones
      const allBounds = zones.map((z) => [z.centerLat, z.centerLng])
      if (allBounds.length > 1) {
        map.flyToBounds(allBounds, {
          padding: [30, 30],
          maxZoom: 16,
          duration: 0.5,
          easeLinearity: 0.3,
        })
      }
    } else if (activeZonePins.length > 0) {
      const bounds = activeZonePins.map((p) => [p.lat, p.lng])
      setTimeout(() => {
        map.invalidateSize()
        const s = map.getSize()
        if (!s || s.x === 0 || s.y === 0) return
        if (bounds.length === 1) {
          map.flyTo(bounds[0], 17, { duration: 0.5, easeLinearity: 0.3 })
        } else {
          map.flyToBounds(bounds, {
            padding: [40, 40],
            maxZoom: 18,
            duration: 0.5,
            easeLinearity: 0.3,
          })
        }
      }, 80)
    }
  }, [activeZone, activeZonePins, zones, map])

  return null
}

// Compact attribution — ℹ️ icon, tap to expand (ODbL compliance)
function CompactAttribution() {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="absolute bottom-1 right-1 z-[999]">
      {expanded ? (
        <div
          className="bg-warm-card/90 backdrop-blur-sm rounded-md px-2 py-1 text-[9px] text-warm-muted shadow-warm cursor-pointer"
          onClick={() => setExpanded(false)}
        >
          © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a> contributors
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="w-4 h-4 rounded-full bg-warm-card/60 text-warm-muted flex items-center justify-center text-[9px] opacity-40 hover:opacity-80 transition-opacity"
          aria-label="Map attribution"
        >
          ℹ
        </button>
      )}
    </div>
  )
}

// Toast notification for GPS errors
function GpsToast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1001] px-4 py-2 rounded-lg bg-warm-text/90 text-cream-light text-xs font-medium shadow-warm-md backdrop-blur-sm">
      {message}
    </div>
  )
}

export default function ZoneMap({ selectedLocationId, className = '' }) {
  const { t } = useTranslation()
  const [gpsToast, setGpsToast] = useState(null)
  const [listExpanded, setListExpanded] = useState(false)

  const {
    zones,
    activeZone,
    activeZoneId,
    activeZonePins,
    highlightedPinId,
    drillDown,
    back,
    highlightPin,
    clearHighlight,
  } = useZones(selectedLocationId)

  const {
    showWC,
    showParking,
    menuOpen,
    wcPins,
    parkingPins,
    toggleWC,
    toggleParking,
    toggleMenu,
    closeMenu,
  } = useUtilities()

  const {
    position: gpsPosition,
    accuracy: gpsAccuracy,
    loading: gpsLoading,
    error: gpsError,
    requestLocation,
  } = useGPS()

  // Show toast on GPS error
  useEffect(() => {
    if (gpsError) {
      setGpsToast(t('map.gpsError', 'Không tìm được vị trí'))
    }
  }, [gpsError, t])

  // Reset list to peek mode when zone changes
  useEffect(() => {
    setListExpanded(false)
  }, [activeZoneId])

  // Escape key → back to zone overview
  useEffect(() => {
    if (!activeZone) return
    const handler = (e) => {
      if (e.key === 'Escape') back()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeZone, back])

  const mapContainerStyle = useMemo(() => {
    if (!activeZone) return { height: '100%' }
    // Peek: map gets 75%, Expanded: map shrinks to 42%
    return {
      height: listExpanded ? '42%' : '75%',
      minHeight: '200px',
      transition: 'height 300ms ease-out',
    }
  }, [activeZone, listExpanded])

  return (
    <MapErrorBoundary>
      <div className={`relative w-full h-full flex flex-col ${className}`}>
        {/* Map section */}
        <div
          className="relative w-full"
          style={mapContainerStyle}
        >
          <div className="w-full h-full map-warm rounded-[14px] border-[1.5px] border-bronze/30 shadow-bronze overflow-hidden">
            <MapContainer
              center={[festivalConfig.mapCenter.lat, festivalConfig.mapCenter.lng]}
              zoom={festivalConfig.mapZoom}
              className="w-full h-full"
              style={{ minHeight: '200px' }}
              scrollWheelZoom={true}
              zoomControl={false}
              attributionControl={false}
            >
              <ZoomControl position="topright" />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ResizeHandler />
              <ZoomWatcher onZoomChange={() => {}} />
              <MapFlyController zones={zones} activeZone={activeZone} activeZonePins={activeZonePins} />

              {/* Zone overview markers */}
              {!activeZone && zones.map((zone) => (
                <ZoneMarker key={zone.id} zone={zone} onClick={drillDown} />
              ))}

              {/* Drill-down: numbered pin markers */}
              {activeZone && activeZonePins.map((pin, index) => (
                <NumberedPin
                  key={pin.id}
                  pin={pin}
                  index={index}
                  isHighlighted={highlightedPinId === pin.id}
                  onClick={() => highlightPin(pin.id)}
                />
              ))}

              {/* Utility layers — visible in both views */}
              {showWC && wcPins.map((u) => (
                <UtilityPin key={u.id} utility={u} />
              ))}
              {showParking && parkingPins.map((u) => (
                <UtilityPin key={u.id} utility={u} />
              ))}

              {/* GPS marker */}
              {gpsPosition && (
                <>
                  <Circle
                    center={[gpsPosition.lat, gpsPosition.lng]}
                    radius={gpsAccuracy || 30}
                    pathOptions={{
                      fillColor: '#4285F4',
                      fillOpacity: 0.08,
                      color: '#4285F4',
                      weight: 1,
                      opacity: 0.3,
                    }}
                  />
                  <CircleMarker
                    center={[gpsPosition.lat, gpsPosition.lng]}
                    radius={8}
                    pathOptions={{
                      fillColor: '#4285F4',
                      fillOpacity: 1,
                      color: '#FFFFFF',
                      weight: 3,
                    }}
                  />
                </>
              )}
            </MapContainer>
            <CompactAttribution />
          </div>

          {/* Back button overlay */}
          {activeZone && (
            <button
              onClick={back}
              className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warm-card/95 backdrop-blur-sm text-warm-text text-xs font-medium shadow-warm hover:bg-warm-bg transition-colors"
              aria-label={t('map.backToZones', 'Quay lại tất cả khu vực')}
            >
              ← {t('map.allZones', 'Tất cả khu vực')}
            </button>
          )}

          {/* Control bar — only in zone overview */}
          {!activeZone && (
            <ControlBar
              gpsLoading={gpsLoading}
              onRequestGPS={requestLocation}
              showWC={showWC}
              showParking={showParking}
              wcCount={wcPins.length}
              parkingCount={parkingPins.length}
              menuOpen={menuOpen}
              onToggleWC={toggleWC}
              onToggleParking={toggleParking}
              onToggleMenu={toggleMenu}
              onCloseMenu={closeMenu}
            />
          )}

          {/* GPS error toast */}
          {gpsToast && (
            <GpsToast message={gpsToast} onDismiss={() => setGpsToast(null)} />
          )}
        </div>

        {/* Drill-down list panel */}
        {activeZone && (
          <ZoneDrillDown
            zone={activeZone}
            pins={activeZonePins}
            highlightedPinId={highlightedPinId}
            onPinHighlight={highlightPin}
            onBack={back}
            expanded={listExpanded}
            onToggleExpand={() => setListExpanded((v) => !v)}
          />
        )}
      </div>
    </MapErrorBoundary>
  )
}
