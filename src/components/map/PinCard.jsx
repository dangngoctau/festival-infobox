import { useTranslation } from 'react-i18next'
import { getDirectionsUrl } from '../../utils/deepLink'

const NavIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z" />
  </svg>
)

export default function PinCard({ pin, index, isHighlighted, onClick }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const label = pin.routeNumber ?? (index + 1)
  const name = isEn ? pin.nameEn : pin.name
  const time = isEn ? pin.timeEn : pin.time
  const note = isEn ? pin.noteEn : pin.note

  return (
    <div
      role="listitem"
      onClick={() => onClick(pin.id)}
      className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-colors rounded-lg ${
        isHighlighted ? 'bg-accent-gold/10' : 'hover:bg-warm-bg/60'
      }`}
      style={{ borderLeft: `3px solid ${pin.locationColor}`, borderRight: `1px solid ${pin.locationColor}40` }}
    >
      {/* Numbered circle */}
      <div
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-content text-white text-xs font-bold"
        style={{
          backgroundColor: pin.locationColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {label}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-warm-text leading-tight truncate">{name}</p>
        {time && (
          <p className="text-[11px] text-bronze-dark mt-0.5">{time}</p>
        )}
        {note && (
          <p className="text-[10px] text-warm-muted mt-0.5 leading-snug">{note}</p>
        )}
      </div>

      {/* Directions — icon-only to reduce repetition in list */}
      <a
        href={getDirectionsUrl(pin.lat, pin.lng)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 self-center w-8 h-8 rounded-full bg-accent-gold text-white flex items-center justify-center hover:bg-accent-gold/90 transition-colors"
        aria-label={`${isEn ? 'Directions to' : 'Chỉ đường đến'} ${name}`}
        title={t('map.directions', 'Chỉ đường')}
      >
        <NavIcon />
      </a>
    </div>
  )
}
