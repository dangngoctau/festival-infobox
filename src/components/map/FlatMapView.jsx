import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import festivalConfig from '../../data/festivalConfig'
import zones from '../../data/zones.json'
import useMapHighlight from '../../hooks/useMapHighlight'
import useUtilities from '../../hooks/useUtilities'
import { ResizeHandler, MapErrorBoundary } from './MapControls'
import NumberedPin from './NumberedPin'
import UtilityPin from './UtilityPin'
import ControlBar from './ControlBar'
import PinListPanel from './PinListPanel'

// Flatten all pins from all zones, sorted by routeNumber
function getAllPins() {
  const all = []
  zones.forEach((zone) => {
    zone.pins.forEach((pin) => all.push(pin))
  })
  return all.sort((a, b) => a.routeNumber - b.routeNumber)
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

// Fit all pins on mount + detect zoom/pan changes + flyTo/reset actions
function MapController({ allPins, onBoundsReady, onViewChanged, flyTarget, resetRequest }) {
  const map = useMap()
  const initialZoomRef = useRef(null)
  const initialCenterRef = useRef(null)
  const boundsRef = useRef(null)
  const hasFittedRef = useRef(false)
  const prevFlyRef = useRef(null)
  const prevResetRef = useRef(0)

  // Compute pin bounds once
  const pinBounds = useMemo(
    () => L.latLngBounds(allPins.map((p) => [p.lat, p.lng])),
    [allPins]
  )

  // Fit all pins — runs on mount AND when map resizes (tab switch on mobile)
  useEffect(() => {
    boundsRef.current = pinBounds

    function doFit() {
      const size = map.getSize()
      if (!size || size.x === 0 || size.y === 0) return
      if (hasFittedRef.current) return
      hasFittedRef.current = true

      // Enforce zoom limits on the Leaflet instance
      map.setMinZoom(14)
      map.setMaxZoom(18)

      map.fitBounds(pinBounds, { padding: [20, 20], maxZoom: 18 })
      // Clamp to minZoom if fitBounds went below it
      if (map.getZoom() < 14) map.setZoom(14)
      onBoundsReady(pinBounds)

      // Capture initial zoom/center once animation settles
      map.once('moveend', () => {
        initialZoomRef.current = map.getZoom()
        initialCenterRef.current = map.getCenter()
      })
    }

    // Try immediately
    doFit()

    // Also listen for resize (covers tab switch where container goes from 0 → visible)
    if (!hasFittedRef.current) {
      const onResize = () => doFit()
      map.on('resize', onResize)
      return () => map.off('resize', onResize)
    }
  }, [pinBounds, map, onBoundsReady])

  // Detect zoom/pan away from initial view
  useMapEvents({
    moveend: () => {
      if (initialZoomRef.current == null) return
      const zoom = map.getZoom()
      const center = map.getCenter()
      const izoom = initialZoomRef.current
      const icenter = initialCenterRef.current
      const isAtOverview =
        Math.abs(zoom - izoom) < 0.5 &&
        Math.abs(center.lat - icenter.lat) < 0.0015 &&
        Math.abs(center.lng - icenter.lng) < 0.0015
      onViewChanged(!isAtOverview)
    },
  })

  // FlyTo pin on card tap
  useEffect(() => {
    if (!flyTarget) return
    if (prevFlyRef.current === flyTarget._ts) return
    prevFlyRef.current = flyTarget._ts

    const size = map.getSize()
    if (!size || size.x === 0 || size.y === 0) return

    map.flyTo([flyTarget.lat, flyTarget.lng], 18, {
      duration: 0.5,
      easeLinearity: 0.3,
    })
  }, [flyTarget, map])

  // Reset to initial bounds
  useEffect(() => {
    if (!resetRequest || prevResetRef.current === resetRequest) return
    prevResetRef.current = resetRequest
    if (!boundsRef.current) return

    map.flyToBounds(boundsRef.current, {
      padding: [20, 20],
      maxZoom: 18,
      duration: 0.5,
      easeLinearity: 0.3,
    })
  }, [resetRequest, map])

  return null
}

export default function FlatMapView({ className = '' }) {
  const [showOverview, setShowOverview] = useState(false)
  const [flyTarget, setFlyTarget] = useState(null)
  const [resetRequest, setResetRequest] = useState(0)

  const allPins = useMemo(() => getAllPins(), [])

  const {
    highlightedPinId,
    highlightFromMap,
    highlightFromList,
    clearHighlight,
  } = useMapHighlight()

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

  const handleBoundsReady = useCallback(() => {}, [])

  const handleViewChanged = useCallback((hasChanged) => {
    setShowOverview(hasChanged)
  }, [])

  const handleResetView = useCallback(() => {
    setResetRequest((c) => c + 1)
    clearHighlight()
  }, [clearHighlight])

  // Pin tapped on map → highlight card, scroll to it (no zoom)
  const handlePinClick = useCallback((pinId) => {
    highlightFromMap(pinId)
  }, [highlightFromMap])

  // Card tapped in list → highlight pin, flyTo + bounce
  const handleCardClick = useCallback((pinId) => {
    highlightFromList(pinId)
    const pin = allPins.find((p) => p.id === pinId)
    if (pin) setFlyTarget({ ...pin, _ts: Date.now() })
  }, [highlightFromList, allPins])

  return (
    <MapErrorBoundary>
      <div className={`relative w-full h-full flex flex-col ${className}`}>
        {/* Map section — 45% */}
        <div className="relative w-full" style={{ height: '60%', minHeight: '200px' }}>
          <div className="w-full h-full map-warm overflow-hidden">
            <MapContainer
              center={[festivalConfig.mapCenter.lat, festivalConfig.mapCenter.lng]}
              zoom={festivalConfig.mapZoom}
              minZoom={14}
              maxZoom={18}
              className="w-full h-full"
              style={{ minHeight: '180px' }}
              scrollWheelZoom={true}
              zoomControl={false}
              attributionControl={false}
            >
              <ZoomControl position="topright" />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={18} />
              <ResizeHandler />
              <MapController
                allPins={allPins}
                onBoundsReady={handleBoundsReady}
                onViewChanged={handleViewChanged}
                flyTarget={flyTarget}
                resetRequest={resetRequest}
              />

              {/* All 14 numbered pins */}
              {allPins.map((pin) => (
                <NumberedPin
                  key={pin.id}
                  pin={pin}
                  isHighlighted={highlightedPinId === pin.id}
                  onClick={handlePinClick}
                />
              ))}

              {/* Utility layers */}
              {showWC && wcPins.map((u) => (
                <UtilityPin key={u.id} utility={u} />
              ))}
              {showParking && parkingPins.map((u) => (
                <UtilityPin key={u.id} utility={u} />
              ))}
            </MapContainer>
            <CompactAttribution />
          </div>

          {/* Bottom-center control bar */}
          <ControlBar
            showOverview={showOverview}
            onResetView={handleResetView}
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
        </div>

        {/* List section — 55% */}
        <PinListPanel
          zones={zones}
          highlightedPinId={highlightedPinId}
          onPinClick={handleCardClick}
        />
      </div>
    </MapErrorBoundary>
  )
}
