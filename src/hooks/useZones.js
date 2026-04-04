import { useState, useEffect, useMemo, useCallback } from 'react'
import zones from '../data/zones.json'
import { locationToZone } from '../data/colorMap'

export default function useZones(selectedLocationId) {
  const [activeZoneId, setActiveZoneId] = useState(null)
  const [highlightedPinId, setHighlightedPinId] = useState(null)

  const activeZone = useMemo(
    () => zones.find((z) => z.id === activeZoneId) || null,
    [activeZoneId]
  )

  const activeZonePins = useMemo(
    () => (activeZone ? activeZone.pins : []),
    [activeZone]
  )

  const drillDown = useCallback((zoneId) => {
    setActiveZoneId(zoneId)
    setHighlightedPinId(null)
  }, [])

  const back = useCallback(() => {
    setActiveZoneId(null)
    setHighlightedPinId(null)
  }, [])

  const highlightPin = useCallback((pinId) => {
    setHighlightedPinId(pinId)
  }, [])

  const clearHighlight = useCallback(() => {
    setHighlightedPinId(null)
  }, [])

  // Cross-tab sync: auto-drill when selectedLocationId changes
  useEffect(() => {
    if (!selectedLocationId || selectedLocationId === 'all') {
      // Don't auto-back — let user stay in current drill if they navigated manually
      return
    }
    const zoneId = locationToZone[selectedLocationId]
    if (zoneId && zoneId !== activeZoneId) {
      drillDown(zoneId)
    }
  }, [selectedLocationId]) // intentionally exclude activeZoneId and drillDown to avoid loops

  return {
    zones,
    activeZone,
    activeZoneId,
    activeZonePins,
    highlightedPinId,
    drillDown,
    back,
    highlightPin,
    clearHighlight,
  }
}
