import React from 'react'
import { useMap, useMapEvents } from 'react-leaflet'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { trackErrorEncountered } from '../../utils/analytics'

export function ResizeHandler() {
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

export function ZoomWatcher({ onZoomChange }) {
  useMapEvents({
    zoomend: (e) => {
      onZoomChange(e.target.getZoom())
    },
  })
  return null
}

function MapErrorFallback() {
  const { t } = useTranslation()
  return (
    <div className="w-full h-full flex items-center justify-center bg-warm-bg rounded-xl">
      <p className="text-warm-muted text-sm">{t('map.loadError')}</p>
    </div>
  )
}

export class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch() {
    trackErrorEncountered({ errorType: 'map_load_fail', context: 'react-leaflet' })
  }
  render() {
    if (this.state.hasError) return <MapErrorFallback />
    return this.props.children
  }
}
