export default function SplashSVG({ className = '' }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      className={`w-full h-auto ${className}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0a1a" />
          <stop offset="35%" stopColor="#1a0f2e" />
          <stop offset="65%" stopColor="#2d1810" />
          <stop offset="100%" stopColor="#4a2810" />
        </linearGradient>

        {/* Water gradient */}
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1428" />
          <stop offset="100%" stopColor="#0d0a18" />
        </linearGradient>

        {/* Lantern glow */}
        <radialGradient id="glow">
          <stop offset="0%" stopColor="rgba(251,191,36,0.9)" />
          <stop offset="40%" stopColor="rgba(245,158,11,0.4)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Moon glow */}
        <radialGradient id="moonGlow">
          <stop offset="0%" stopColor="rgba(255,250,220,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="1600" height="900" fill="url(#sky)" />

      {/* Stars — centered x, safe vertical range */}
      <g className="animate-star-twinkle" style={{ animationDuration: '4s' }}>
        <circle cx="520" cy="150" r="1.5" fill="rgba(255,255,255,0.7)" />
        <circle cx="650" cy="170" r="1" fill="rgba(255,255,255,0.5)" />
        <circle cx="750" cy="200" r="1.8" fill="rgba(255,255,255,0.6)" />
        <circle cx="900" cy="160" r="1.2" fill="rgba(255,255,255,0.7)" />
        <circle cx="1050" cy="210" r="1" fill="rgba(255,255,255,0.5)" />
        <circle cx="1100" cy="180" r="1.5" fill="rgba(255,255,255,0.6)" />
      </g>
      <g className="animate-star-twinkle" style={{ animationDuration: '6s', animationDelay: '2s' }}>
        <circle cx="580" cy="230" r="1" fill="rgba(255,255,255,0.4)" />
        <circle cx="700" cy="140" r="2" fill="rgba(255,255,255,0.6)" />
        <circle cx="850" cy="185" r="1.3" fill="rgba(255,255,255,0.5)" />
        <circle cx="1000" cy="220" r="1.8" fill="rgba(255,255,255,0.7)" />
        <circle cx="620" cy="250" r="0.8" fill="rgba(255,255,255,0.4)" />
      </g>

      {/* Moon glow halo */}
      <circle cx="960" cy="210" r="100" fill="url(#moonGlow)" />

      {/* Crescent moon */}
      <circle cx="960" cy="210" r="30" fill="#FFF8DC" opacity="0.9" />
      <circle cx="973" cy="201" r="25" fill="#0d0a1a" />

      {/* Far mountains (lightest) */}
      <path
        d="M0,420 Q80,340 160,370 Q240,310 340,350 Q420,290 520,330 Q580,260 680,310
           Q760,260 860,290 Q940,230 1040,270 Q1120,240 1200,280 Q1300,230 1380,260
           Q1440,250 1520,290 L1600,280 L1600,520 L0,520 Z"
        fill="rgba(30,20,50,0.5)"
      />

      {/* Mid mountains with pagoda */}
      <path
        d="M0,460 Q100,390 200,420 Q300,360 400,400 Q460,340 540,370 Q600,330 680,360
           Q740,320 820,350 Q880,300 960,340 Q1040,310 1120,330 Q1200,290 1280,320
           Q1360,300 1440,330 Q1520,320 1600,350 L1600,520 L0,520 Z"
        fill="rgba(20,15,35,0.7)"
      />
      {/* Pagoda silhouette on mid-mountain */}
      <g transform="translate(780, 290)">
        {/* Base tier */}
        <polygon points="-18,0 18,0 14,-16 -14,-16" fill="rgba(15,10,25,0.85)" />
        {/* Roof 1 */}
        <polygon points="-22,-16 22,-16 16,-22 -16,-22" fill="rgba(15,10,25,0.85)" />
        {/* Middle tier */}
        <polygon points="-12,-22 12,-22 9,-34 -9,-34" fill="rgba(15,10,25,0.85)" />
        {/* Roof 2 */}
        <polygon points="-16,-34 16,-34 10,-39 -10,-39" fill="rgba(15,10,25,0.85)" />
        {/* Top tier */}
        <polygon points="-7,-39 7,-39 4,-48 -4,-48" fill="rgba(15,10,25,0.85)" />
        {/* Spire */}
        <line x1="0" y1="-48" x2="0" y2="-58" stroke="rgba(15,10,25,0.85)" strokeWidth="2" />
      </g>

      {/* Near mountains (darkest) */}
      <path
        d="M0,500 Q120,450 240,470 Q360,430 460,460 Q540,420 640,450
           Q720,430 800,445 Q880,415 980,440 Q1080,420 1160,445
           Q1260,415 1360,440 Q1460,425 1560,450 L1600,445 L1600,520 L0,520 Z"
        fill="rgba(12,8,18,0.9)"
      />

      {/* Water surface */}
      <rect x="0" y="520" width="1600" height="380" fill="url(#water)" />

      {/* Water ripple lines — centered */}
      <line x1="500" y1="550" x2="1100" y2="550" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <line x1="600" y1="580" x2="1000" y2="580" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="550" y1="610" x2="1050" y2="610" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <line x1="650" y1="635" x2="950" y2="635" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {/* Hoa dang — centered, on water */}
      {[
        { x: 550, y: 545, size: 0.85, delay: 0 },
        { x: 680, y: 555, size: 1, delay: 1.5 },
        { x: 800, y: 540, size: 1.1, delay: 0.5 },
        { x: 920, y: 552, size: 0.9, delay: 2 },
        { x: 1050, y: 543, size: 1, delay: 1 },
        { x: 1160, y: 558, size: 0.75, delay: 3 },
      ].map((l, i) => (
        <g key={i} transform={`translate(${l.x}, ${l.y}) scale(${l.size})`}>
          {/* Glow halo */}
          <circle
            r="40"
            fill="url(#glow)"
            className="animate-lantern-flicker"
            style={{ animationDuration: '3s', animationDelay: `${l.delay}s` }}
          />
          {/* Lantern body */}
          <rect x="-8" y="-6" width="16" height="10" rx="2" fill="#D4910A" opacity="0.9" />
          {/* Flame */}
          <ellipse cx="0" cy="-9" rx="3" ry="5" fill="#FBBF24" opacity="0.85" />

          {/* Water reflection */}
          <ellipse
            cx="0" cy="30" rx="20" ry="6"
            fill="rgba(251,191,36,0.12)"
            className="animate-water-ripple"
            style={{ animationDuration: '4s', animationDelay: `${l.delay}s` }}
          />
        </g>
      ))}

      {/* Subtle moon reflection on water */}
      <ellipse cx="960" cy="550" rx="60" ry="8" fill="rgba(255,250,220,0.06)" />
      <ellipse cx="960" cy="575" rx="40" ry="5" fill="rgba(255,250,220,0.04)" />
    </svg>
  )
}
