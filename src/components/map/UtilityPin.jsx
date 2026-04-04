import { useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'
import { getDirectionsUrl } from '../../utils/deepLink'
import { utilityLabels } from '../../data/pinSymbols'

export default function UtilityPin({ utility }) {
  const { i18n, t } = useTranslation()
  const isEn = i18n.language === 'en'
  const borderColor = utility.color
  const isWC = utility.type === 'wc'
  const label = utilityLabels[isWC ? 'wc' : 'parking'] || '?'

  // WC: show generic label only (culturally sensitive near temple)
  // Parking: show actual name + note from data
  const popupName = isWC
    ? t('map.restroom', 'Nhà vệ sinh')
    : (isEn ? utility.nameEn : utility.name)
  const popupNote = isWC
    ? null
    : (isEn ? (utility.noteEn || '') : (utility.note || ''))

  const icon = useMemo(() => {
    const html = `
      <div style="width:30px;height:30px;border-radius:50%;background:${borderColor};border:2px solid #FFFDF8;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.25);cursor:pointer;">
        <span style="color:#FFFDF8;font-size:11px;font-weight:800;letter-spacing:-0.5px;line-height:1;">${label}</span>
      </div>
    `
    return L.divIcon({
      html,
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -17],
    })
  }, [borderColor, label])

  return (
    <Marker position={[utility.lat, utility.lng]} icon={icon}>
      <Popup className="utility-popup">
        <div className="min-w-[160px]">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-extrabold text-white"
              style={{ backgroundColor: utility.color }}
            >
              {label}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-warm-text leading-snug">{popupName}</p>
              {popupNote && <p className="text-xs text-warm-muted">{popupNote}</p>}
            </div>
          </div>
          <a
            href={getDirectionsUrl(utility.lat, utility.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-accent-gold text-white text-sm h-[38px] rounded-[10px] font-semibold hover:bg-accent-gold/90 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l19-9-9 19-2-8-8-2z" />
            </svg>
            {t('map.directions', 'Chỉ đường')}
          </a>
        </div>
      </Popup>
    </Marker>
  )
}
