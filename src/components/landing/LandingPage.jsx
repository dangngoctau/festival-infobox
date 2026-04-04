import HeroSection from './HeroSection'
import TransitionZone from './TransitionZone'
import FeaturedEvents from './FeaturedEvents'
import CategoryHighlights from './CategoryHighlights'
import PracticalInfo from './PracticalInfo'
import FooterCTA from './FooterCTA'

function SectionDivider() {
  return (
    <div className="py-4 flex justify-center bg-cream">
      <svg
        viewBox="0 0 200 20"
        className="w-24 h-auto opacity-35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="10" x2="70" y2="10" stroke="#D4B896" strokeWidth="1" />
        <g transform="translate(100, 10)">
          <ellipse cx="-6" cy="0" rx="3" ry="7" fill="#D4B896" opacity="0.4" transform="rotate(-20)" />
          <ellipse cx="0" cy="-1" rx="3" ry="8" fill="#D4B896" opacity="0.5" />
          <ellipse cx="6" cy="0" rx="3" ry="7" fill="#D4B896" opacity="0.4" transform="rotate(20)" />
        </g>
        <line x1="130" y1="10" x2="200" y2="10" stroke="#D4B896" strokeWidth="1" />
      </svg>
    </div>
  )
}

export default function LandingPage({ now, landingOngoing = [], landingUpcoming = [], onEnterSchedule }) {
  return (
    <div className="min-h-screen bg-cream-light">
      <HeroSection now={now} onEnterSchedule={onEnterSchedule} />
      <TransitionZone />
      <FeaturedEvents now={now} ongoing={landingOngoing} upcoming={landingUpcoming} />
      <SectionDivider />
      <CategoryHighlights onEnterSchedule={onEnterSchedule} />
      <PracticalInfo now={now} />
      <FooterCTA onEnterSchedule={onEnterSchedule} />
    </div>
  )
}
