import { locationColors } from '../../data/colorMap'

const CREAM = '#FFFDF8'

// Map actual location IDs from locations.json to symbol renderers
const symbols = {
  // Lễ đài — ceremonial platform with pillars
  'le-dai': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <path d="M6 7 L18 7" strokeWidth="2.2"/>
      <path d="M8 7 L8 15" strokeWidth="1.8"/>
      <path d="M12 7 L12 15" strokeWidth="1.8"/>
      <path d="M16 7 L16 15" strokeWidth="1.8"/>
      <path d="M5.5 15 L18.5 15" strokeWidth="2"/>
      <path d="M12 4.5 L12 7" strokeWidth="1.5"/>
      <circle cx="12" cy="4" r="1" fill={CREAM} stroke="none"/>
    </g>
  ),

  // Chùa — pagoda roof (kept from original)
  'chua': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <path d="M8 8.5 C9.5 6, 14.5 6, 16 8.5" strokeWidth="2"/>
      <path d="M8 8.5 L6.5 7.5" strokeWidth="1.8"/>
      <path d="M16 8.5 L17.5 7.5" strokeWidth="1.8"/>
      <path d="M6.5 12 C8.5 9.5, 15.5 9.5, 17.5 12" strokeWidth="2"/>
      <path d="M6.5 12 L5 11" strokeWidth="1.8"/>
      <path d="M17.5 12 L19 11" strokeWidth="1.8"/>
      <path d="M8 12 L8 16" strokeWidth="1.5"/>
      <path d="M16 12 L16 16" strokeWidth="1.5"/>
      <path d="M7 16 L17 16" strokeWidth="1.8"/>
      <path d="M10.5 16 L10.5 13.5 C10.5 12.2, 13.5 12.2, 13.5 13.5 L13.5 16" strokeWidth="1.5"/>
    </g>
  ),

  // Triển lãm thiếu nhi — paintbrush + frame
  'trienlam-thieunhi': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <rect x="6" y="5" width="12" height="10" rx="1" strokeWidth="1.8"/>
      <circle cx="12" cy="10" r="2.5" strokeWidth="1.5" fill={CREAM} fillOpacity="0.15"/>
      <path d="M9 7.5 L15 7.5" strokeWidth="1.2"/>
      <path d="M10 13 L14 13" strokeWidth="1.2"/>
    </g>
  ),

  // Miếu thờ Huyền Trân — small shrine with curved roof & archway (kept)
  'mieu-huyen-tran': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <path d="M7 8.5 C9 6, 15 6, 17 8.5" strokeWidth="2.2"/>
      <path d="M7 8.5 L6 7.8" strokeWidth="1.8"/>
      <path d="M17 8.5 L18 7.8" strokeWidth="1.8"/>
      <rect x="8" y="8.5" width="8" height="7" rx="0.5" strokeWidth="1.5" fill={CREAM} fillOpacity="0.15"/>
      <path d="M10.5 15.5 L10.5 12 C10.5 10.5, 13.5 10.5, 13.5 12 L13.5 15.5" strokeWidth="1.5"/>
      <circle cx="12" cy="5.8" r="0.7" fill={CREAM} stroke="none"/>
    </g>
  ),

  // Sân khấu dân gian — stage curtain + spotlight (adapted from san-khau)
  'sk-dan-gian': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <path d="M5.5 5 L18.5 5" strokeWidth="2"/>
      <path d="M5.5 5 C6.5 8, 5.5 11, 7 15" strokeWidth="2"/>
      <path d="M18.5 5 C17.5 8, 18.5 11, 17 15" strokeWidth="2"/>
      <path d="M7 16 L17 16" strokeWidth="1.8"/>
      <circle cx="12" cy="10.5" r="2.5" strokeWidth="1.8" fill={CREAM} fillOpacity="0.2"/>
      <circle cx="12" cy="10.5" r="0.8" fill={CREAM} stroke="none"/>
    </g>
  ),

  // OCOP — shopping basket
  'ocop': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <path d="M7 8 L17 8" strokeWidth="1.8"/>
      <path d="M8 8 L9 15" strokeWidth="1.8"/>
      <path d="M16 8 L15 15" strokeWidth="1.8"/>
      <path d="M9 15 L15 15" strokeWidth="1.8"/>
      <path d="M9.5 5 L9.5 8" strokeWidth="1.5"/>
      <path d="M14.5 5 L14.5 8" strokeWidth="1.5"/>
      <path d="M10.5 10.5 L10.5 13" strokeWidth="1.2"/>
      <path d="M13.5 10.5 L13.5 13" strokeWidth="1.2"/>
    </g>
  ),

  // Triển lãm ảnh — camera
  'trienlam-anh': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <rect x="5" y="8" width="14" height="9" rx="1.5" strokeWidth="1.8"/>
      <circle cx="12" cy="12.5" r="3" strokeWidth="1.8"/>
      <circle cx="12" cy="12.5" r="1" fill={CREAM} stroke="none"/>
      <path d="M9 8 L10 5.5 L14 5.5 L15 8" strokeWidth="1.5"/>
    </g>
  ),

  // Đá mỹ nghệ — stone + chisel
  'da-my-nghe': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <path d="M7 15 C7 9, 10 5, 12 5 C14 5, 17 9, 17 15 Z" strokeWidth="1.8" fill={CREAM} fillOpacity="0.12"/>
      <path d="M7 15 L17 15" strokeWidth="2"/>
      <path d="M10 10 L14 10" strokeWidth="1.3"/>
      <path d="M9.5 12.5 L14.5 12.5" strokeWidth="1.3"/>
    </g>
  ),

  // Đầm Sen — kite (adapted from hoa-quy)
  'dam-sen': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <path d="M12 3.5 L17.5 10 L12 15 L6.5 10 Z"
        strokeWidth="2" fill={CREAM} fillOpacity="0.15"/>
      <path d="M12 3.5 L12 15" strokeWidth="1.2"/>
      <path d="M6.5 10 L17.5 10" strokeWidth="1.2"/>
      <path d="M12 15 C11 16.5, 13 17.5, 12 19" strokeWidth="1.5"/>
      <path d="M11 16.5 L12 16 L13 16.5" strokeWidth="1.3"/>
    </g>
  ),

  // Sông Cổ Cò — dragon boat (kept)
  'song-co-co': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <path d="M5.5 10 C5 8, 6 6, 7.5 5" strokeWidth="2"/>
      <circle cx="6.5" cy="6.5" r="0.8" fill={CREAM} stroke="none"/>
      <path d="M5.5 10 C7 12.5, 15 13, 18.5 10" strokeWidth="2.2" fill={CREAM} fillOpacity="0.1"/>
      <path d="M18.5 10 C19 8.5, 18 7.5, 17 7.5" strokeWidth="1.8"/>
      <path d="M10.5 9.5 C11 7.5, 14 7.5, 14.5 9.5" strokeWidth="1.5"/>
      <path d="M5 14.5 C7 13.5, 9 15, 11 14 C13 15, 15 13.5, 17 14.5 C18 14, 19 14.5, 19.5 14"
        strokeWidth="1.5" strokeOpacity="0.6"/>
      <path d="M6 16.5 C8 15.5, 10 17, 12 16 C14 17, 16 15.5, 18 16.5"
        strokeWidth="1.2" strokeOpacity="0.4"/>
    </g>
  ),

  // Diễu hành xe hoa — float/car with flower (kept)
  'dieu-hanh': () => (
    <g stroke={CREAM} strokeLinecap="round" fill="none">
      <path d="M12 5 C10.5 6.5, 10.5 8.5, 12 9 C13.5 8.5, 13.5 6.5, 12 5Z"
        strokeWidth="1.5" fill={CREAM} fillOpacity="0.2"/>
      <path d="M9.5 7 C10 8, 11 9, 11.5 9" strokeWidth="1.2"/>
      <path d="M14.5 7 C14 8, 13 9, 12.5 9" strokeWidth="1.2"/>
      <rect x="5.5" y="9" width="13" height="5.5" rx="1" strokeWidth="1.8" fill={CREAM} fillOpacity="0.1"/>
      <circle cx="8.5" cy="15" r="2.2" strokeWidth="1.8"/>
      <circle cx="8.5" cy="15" r="0.7" fill={CREAM} stroke="none"/>
      <circle cx="15.5" cy="15" r="2.2" strokeWidth="1.8"/>
      <circle cx="15.5" cy="15" r="0.7" fill={CREAM} stroke="none"/>
    </g>
  ),
}

const FALLBACK_COLOR = '#9E9E9E'

function PinFull({ color, children, size }) {
  const height = size * (32 / 24)
  return (
    <svg viewBox="0 0 24 32" width={size} height={height} overflow="hidden" aria-hidden="true">
      <path
        d="M12 30 C12 30, 2 17, 2 11 C2 5.5, 6.5 1, 12 1 C17.5 1, 22 5.5, 22 11 C22 17, 12 30, 12 30Z"
        fill={color} fillOpacity="0.92" stroke={CREAM} strokeWidth="1.5"
      />
      {children}
    </svg>
  )
}

function PinDot({ color, children, size }) {
  return (
    <svg viewBox="0 0 24 22" width={size} height={size} overflow="hidden" aria-hidden="true">
      <circle cx="12" cy="11" r="10" fill={color} fillOpacity="0.92" stroke={CREAM} strokeWidth="1.5"/>
      {children}
    </svg>
  )
}

export default function LocationPin({ locationId, size = 32, variant = 'full', className = '' }) {
  const color = locationColors[locationId] || FALLBACK_COLOR
  const Symbol = symbols[locationId]
  const Wrapper = variant === 'dot' ? PinDot : PinFull

  return (
    <span className={`inline-flex shrink-0 ${className}`}>
      <Wrapper color={color} size={size}>
        {Symbol && <Symbol />}
      </Wrapper>
    </span>
  )
}
