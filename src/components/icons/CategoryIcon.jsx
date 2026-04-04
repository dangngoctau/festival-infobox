import { catGroupToIconId } from '../../data/colorMap'

const icons = {
  buddhist: ({ color }) => (
    <>
      {/* Center petal — largest */}
      <path d="M12 2.5 C9.5 6, 9 9, 12 12 C15 9, 14.5 6, 12 2.5Z"
        strokeWidth="2" fill={color} fillOpacity="0.15"/>
      {/* Left petal */}
      <path d="M5.5 6 C5.5 9.5, 7.5 11.5, 10.5 12 C8.5 9.5, 7 7.5, 5.5 6Z"
        strokeWidth="1.8" fill={color} fillOpacity="0.1"/>
      {/* Right petal */}
      <path d="M18.5 6 C18.5 9.5, 16.5 11.5, 13.5 12 C15.5 9.5, 17 7.5, 18.5 6Z"
        strokeWidth="1.8" fill={color} fillOpacity="0.1"/>
      {/* Lotus base */}
      <path d="M7 13 C9 16, 15 16, 17 13"
        strokeWidth="2" fill={color} fillOpacity="0.08"/>
      {/* Pistil */}
      <circle cx="12" cy="10" r="1.2" fill={color} fillOpacity="0.35" stroke="none"/>
      {/* Stem */}
      <path d="M12 16 L12 21.5" strokeWidth="1.8"/>
    </>
  ),

  performance: ({ color }) => (
    <>
      {/* Face — rounded */}
      <path d="M7.5 6.5 C7.5 3.5, 9.5 2, 12 2 C14.5 2, 16.5 3.5, 16.5 6.5
               L16.5 10.5 C16.5 14.5, 14.5 16.5, 12 16.5 C9.5 16.5, 7.5 14.5, 7.5 10.5Z"
        strokeWidth="2.2" fill={color} fillOpacity="0.07"/>
      {/* Left eyebrow */}
      <path d="M8.5 7 C9 5.2, 10.8 5.2, 11.2 6.5" strokeWidth="2.5"/>
      {/* Right eyebrow */}
      <path d="M15.5 7 C15 5.2, 13.2 5.2, 12.8 6.5" strokeWidth="2.5"/>
      {/* Left eye */}
      <circle cx="10" cy="9" r="0.9" fill={color} stroke="none"/>
      {/* Right eye */}
      <circle cx="14" cy="9" r="0.9" fill={color} stroke="none"/>
      {/* Smile */}
      <path d="M10 13 C10.8 14.2, 13.2 14.2, 14 13" strokeWidth="2"/>
      {/* Left ribbon */}
      <path d="M7.5 15 C6 17, 5.5 19.5, 6 22" strokeWidth="1.8"/>
      {/* Right ribbon */}
      <path d="M16.5 15 C18 17, 18.5 19.5, 18 22" strokeWidth="1.8"/>
    </>
  ),

  craft: ({ color }) => (
    <>
      {/* Chisel — diagonal */}
      <path d="M15 2 L8.5 12.5" strokeWidth="2.5"/>
      {/* Chisel blade */}
      <path d="M8.5 12.5 L6.5 14 L10.5 14 Z"
        strokeWidth="2" fill={color} fillOpacity="0.25"/>
      {/* Hammer head */}
      <path d="M17.5 4 L20 6" strokeWidth="2.8"/>
      {/* Hammer handle */}
      <path d="M15 2 L18.5 5" strokeWidth="2"/>
      {/* Stone block */}
      <path d="M2.5 14.5 L7 14.5 L8 21.5 L1.5 21.5 Z"
        strokeWidth="2" fill={color} fillOpacity="0.12"/>
      {/* Stone grain */}
      <path d="M3.5 17.5 C4.5 17, 6 18, 6.5 17" strokeWidth="1.5"/>
      {/* Stone chips */}
      <circle cx="8" cy="11" r="1" fill={color} fillOpacity="0.4" stroke="none"/>
      <circle cx="10" cy="10" r="0.7" fill={color} fillOpacity="0.25" stroke="none"/>
    </>
  ),

  folk: ({ color }) => (
    <>
      {/* Head */}
      <circle cx="11.5" cy="3" r="2" strokeWidth="2" fill={color} fillOpacity="0.1"/>
      {/* Body */}
      <path d="M11.5 5 L10.5 11" strokeWidth="2.2"/>
      {/* Left arm raised */}
      <path d="M11 7 L7.5 4.5" strokeWidth="2"/>
      {/* Right arm */}
      <path d="M11 7.5 L15 5.5" strokeWidth="2"/>
      {/* Left leg → stilt */}
      <path d="M10.5 11 L8.5 13.5" strokeWidth="1.8"/>
      <path d="M8.5 13.5 L6.5 22" strokeWidth="2.5"/>
      {/* Left footrest */}
      <path d="M7.5 13.5 L9.5 13.5" strokeWidth="2.2"/>
      {/* Right leg → stilt */}
      <path d="M10.5 11 L13 13" strokeWidth="1.8"/>
      <path d="M13 13 L15 22" strokeWidth="2.5"/>
      {/* Right footrest */}
      <path d="M12 13 L14 13" strokeWidth="2.2"/>
    </>
  ),

  cuisine: ({ color }) => (
    <>
      {/* Bodhi leaf */}
      <path d="M12 4 C9 7, 8.5 10, 12 12.5 C15.5 10, 15 7, 12 4Z"
        strokeWidth="1.8" fill={color} fillOpacity="0.15"/>
      {/* Leaf tip */}
      <path d="M12 4 L12 2" strokeWidth="1.8"/>
      {/* Main vein */}
      <path d="M12 5 L12 12" strokeWidth="1.5"/>
      {/* Side veins */}
      <path d="M12 7.5 L10 8.8" strokeWidth="1.3"/>
      <path d="M12 7.5 L14 8.8" strokeWidth="1.3"/>
      <path d="M12 9.5 L10.5 10.8" strokeWidth="1.3"/>
      <path d="M12 9.5 L13.5 10.8" strokeWidth="1.3"/>
      {/* Bowl */}
      <path d="M4 13 C4.5 18, 8 19.5, 12 19.5 C16 19.5, 19.5 18, 20 13"
        strokeWidth="2.5" fill={color} fillOpacity="0.08"/>
      {/* Bowl rim */}
      <path d="M4 13 L20 13" strokeWidth="2"/>
      {/* Bowl base */}
      <path d="M9.5 19.5 L9 21.5 L15 21.5 L14.5 19.5" strokeWidth="1.8"/>
      {/* Steam */}
      <path d="M8.5 3.5 C8 2, 9.5 1.5, 9 0.5" strokeWidth="1.5" strokeOpacity="0.4"/>
      <path d="M15.5 3 C16 1.8, 14.5 1, 15 0.5" strokeWidth="1.5" strokeOpacity="0.35"/>
    </>
  ),
}

export default function CategoryIcon({ category, size = 24, className = '' }) {
  // Normalize: accept both cat group ID (e.g. 'buddhist-ceremony') and icon ID (e.g. 'buddhist')
  const iconId = catGroupToIconId[category] || category
  const IconPaths = icons[iconId]
  if (!IconPaths) return null

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      overflow="hidden"
      aria-hidden="true"
    >
      <IconPaths color="currentColor" />
    </svg>
  )
}
