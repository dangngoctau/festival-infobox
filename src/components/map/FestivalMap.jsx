import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import locations from '../../data/locations.json'
import festivalConfig from '../../data/festivalConfig'
import LocationPopup from './LocationPopup'

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

export default function FestivalMap({ className = '' }) {
  return (
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
      {locations.map((loc) => (
        <CircleMarker
          key={loc.id}
          center={[loc.lat, loc.lng]}
          radius={12}
          pathOptions={{
            fillColor: loc.color,
            fillOpacity: 0.9,
            color: '#fff',
            weight: 2,
          }}
        >
          <Popup>
            <LocationPopup location={loc} />
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
