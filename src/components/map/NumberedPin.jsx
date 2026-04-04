import { useMemo } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'

export default function NumberedPin({ pin, isHighlighted, onClick }) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const label = pin.routeNumber
  const name = isEn ? pin.nameEn : pin.name

  // Staggered glow timing per pin (stable via routeNumber)
  const glowTiming = useMemo(() => {
    const dur = (2.5 + (pin.routeNumber * 0.143) % 2).toFixed(1)
    const del = ((pin.routeNumber * 0.73) % 3).toFixed(1)
    return `--glow-dur:${dur}s;--glow-del:${del}s;`
  }, [pin.routeNumber])

  const icon = useMemo(() => {
    const cssClass = isHighlighted ? 'pin-bounce-anim' : 'pin-glow-anim'
    const html = `
      <div class="${cssClass}"
        style="width:26px;height:26px;border-radius:50%;background:${pin.locationColor};color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #FFFDF8;box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer;${glowTiming}"
        role="button" tabindex="0" aria-label="${label}. ${name}">
        ${label}
      </div>
    `
    return L.divIcon({
      html,
      className: 'pin-icon-wrapper',
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -15],
    })
  }, [pin, label, isHighlighted, name, glowTiming])

  return (
    <Marker
      position={[pin.lat, pin.lng]}
      icon={icon}
      zIndexOffset={isHighlighted ? 1000 : 0}
      eventHandlers={{
        click: () => onClick(pin.id),
        keypress: (e) => {
          if (e.originalEvent.key === 'Enter' || e.originalEvent.key === ' ') {
            e.originalEvent.preventDefault()
            onClick(pin.id)
          }
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -15]}>
        {name}
      </Tooltip>
    </Marker>
  )
}
