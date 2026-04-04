import { useMemo } from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'
import { zoneSymbols } from '../../data/pinSymbols'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export default function ZoneMarker({ zone, onClick }) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const pinCount = zone.pins.length
  const rgb = hexToRgb(zone.zoneColor)
  const name = isEn ? zone.shortNameEn : zone.shortName

  const markerIcon = useMemo(() => {
    const html = `
      <div class="zone-marker-wrapper" role="button" aria-label="${isEn ? zone.nameEn : zone.name}, ${pinCount} ${isEn ? 'points' : 'điểm'}" tabindex="0"
        style="width:56px;height:56px;position:relative;cursor:pointer;">
        <div class="zone-marker-pulse"
          style="position:absolute;inset:0;border-radius:50%;background:rgba(${rgb},0.20);border:2.5px solid ${zone.zoneColor};">
        </div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 24 20" width="28" height="28">${(zoneSymbols[zone.id] || '').replace(/#FFFDF8/g, zone.zoneColor)}</svg>
        </div>
        <div style="position:absolute;top:-2px;right:-2px;width:20px;height:20px;border-radius:50%;background:${zone.zoneColor};color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #FFFDF8;line-height:1;">
          ${pinCount}
        </div>
      </div>
      <div style="text-align:center;margin-top:2px;font-size:10px;font-weight:600;color:${zone.zoneColor};text-shadow:0 0 3px #FFFDF8, 0 0 6px #FFFDF8;white-space:nowrap;pointer-events:none;">
        ${name}
      </div>
    `
    return L.divIcon({
      html,
      className: '',
      iconSize: [72, 80],
      iconAnchor: [36, 36],
    })
  }, [zone, pinCount, rgb, name, isEn])

  return (
    <Marker
      position={[zone.centerLat, zone.centerLng]}
      icon={markerIcon}
      eventHandlers={{
        click: () => onClick(zone.id),
        keypress: (e) => {
          if (e.originalEvent.key === 'Enter' || e.originalEvent.key === ' ') {
            e.originalEvent.preventDefault()
            onClick(zone.id)
          }
        },
      }}
    />
  )
}
