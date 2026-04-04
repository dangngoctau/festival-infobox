const icons = {
  location: ({ color }) => (
    <>
      {/* Pin body — organic teardrop */}
      <path d="M12 2.5 C8 2.5, 4.5 5.5, 4.5 9.5 C4.5 14, 12 22, 12 22 C12 22, 19.5 14, 19.5 9.5 C19.5 5.5, 16 2.5, 12 2.5Z"
        strokeWidth="2" fill={color} fillOpacity="0.1"/>
      {/* Inner circle */}
      <circle cx="12" cy="9.5" r="3.5" strokeWidth="1.8" fill={color} fillOpacity="0.12"/>
      {/* Center dot */}
      <circle cx="12" cy="9.5" r="1.2" fill={color} fillOpacity="0.35" stroke="none"/>
    </>
  ),

  calendar: ({ color }) => (
    <>
      {/* Calendar body — slightly organic rectangle */}
      <path d="M4.5 6.5 C4.5 5.8, 5 5.2, 5.8 5.2 L18.2 5.2 C19 5.2, 19.5 5.8, 19.5 6.5 L19.5 19.5 C19.5 20.2, 19 20.8, 18.2 20.8 L5.8 20.8 C5 20.8, 4.5 20.2, 4.5 19.5 Z"
        strokeWidth="2" fill={color} fillOpacity="0.08"/>
      {/* Top bar */}
      <path d="M4.5 9.2 L19.5 9.2" strokeWidth="1.8"/>
      {/* Left pin */}
      <path d="M8.5 3 L8.5 6.5" strokeWidth="2.2"/>
      {/* Right pin */}
      <path d="M15.5 3 L15.5 6.5" strokeWidth="2.2"/>
      {/* Date rows — organic lines */}
      <path d="M7.5 12.5 L10.5 12.5" strokeWidth="1.5"/>
      <path d="M13 12.5 L16.5 12.5" strokeWidth="1.5"/>
      <path d="M7.5 16 L10.5 16" strokeWidth="1.5"/>
      {/* Circled date — emphasis dot */}
      <circle cx="14.8" cy="16" r="1.8" strokeWidth="1.5" fill={color} fillOpacity="0.15"/>
    </>
  ),

  sparkle: ({ color }) => (
    <>
      {/* Main four-pointed star */}
      <path d="M12 2 C12 8, 8 12, 2 12 C8 12, 12 16, 12 22 C12 16, 16 12, 22 12 C16 12, 12 8, 12 2Z"
        strokeWidth="1.8" fill={color} fillOpacity="0.12"/>
      {/* Small sparkle — top right */}
      <path d="M18.5 2.5 C18.5 4, 17 5.5, 15.5 5.5 C17 5.5, 18.5 7, 18.5 8.5 C18.5 7, 20 5.5, 21.5 5.5 C20 5.5, 18.5 4, 18.5 2.5Z"
        strokeWidth="1.3" fill={color} fillOpacity="0.2"/>
      {/* Tiny sparkle — bottom left */}
      <circle cx="5" cy="19" r="0.8" fill={color} fillOpacity="0.3" stroke="none"/>
    </>
  ),

  info: ({ color }) => (
    <>
      {/* Circle body — organic ring */}
      <circle cx="12" cy="12" r="9.5" strokeWidth="2" fill={color} fillOpacity="0.08"/>
      {/* Dot — info anchor */}
      <circle cx="12" cy="7.5" r="1.3" fill={color} fillOpacity="0.4" stroke="none"/>
      {/* Stem — slightly thicker for brush feel */}
      <path d="M12 11 L12 17.5" strokeWidth="2.2"/>
      {/* Serif base — subtle brush detail */}
      <path d="M10 17.5 L14 17.5" strokeWidth="1.5"/>
    </>
  ),

  transport: ({ color }) => (
    <>
      {/* Bus body — organic rounded shape */}
      <path d="M3.5 8 C3.5 6.5, 4.5 5.5, 6 5.5 L16 5.5 C18.5 5.5, 20 7, 20.5 9 L20.5 15 C20.5 15.8, 20 16.5, 19.2 16.5 L4.8 16.5 C4 16.5, 3.5 15.8, 3.5 15 Z"
        strokeWidth="2" fill={color} fillOpacity="0.08"/>
      {/* Windows */}
      <path d="M6 8.5 L6 11.5 L10 11.5 L10 8.5 Z"
        strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      <path d="M12.5 8.5 L12.5 11.5 L17 11.5 L17 8.5 Z"
        strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
      {/* Bumper line */}
      <path d="M5 14 L19 14" strokeWidth="1.3" strokeOpacity="0.5"/>
      {/* Left wheel */}
      <circle cx="8" cy="17.5" r="2.2" strokeWidth="1.8" fill={color} fillOpacity="0.1"/>
      <circle cx="8" cy="17.5" r="0.7" fill={color} fillOpacity="0.35" stroke="none"/>
      {/* Right wheel */}
      <circle cx="16.5" cy="17.5" r="2.2" strokeWidth="1.8" fill={color} fillOpacity="0.1"/>
      <circle cx="16.5" cy="17.5" r="0.7" fill={color} fillOpacity="0.35" stroke="none"/>
      {/* Headlight */}
      <circle cx="19" cy="9" r="0.9" fill={color} fillOpacity="0.3" stroke="none"/>
    </>
  ),
}

export default function PracticalIcon({ icon, size = 24, className = '' }) {
  const IconPaths = icons[icon]
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
