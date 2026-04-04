import { useTranslation } from 'react-i18next'

function LotusWaveDivider() {
  return (
    <svg
      viewBox="0 0 400 40"
      className="w-48 h-auto mx-auto opacity-40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Decorative wave with lotus accent */}
      <path
        d="M0 20 Q50 8 100 20 T200 20 T300 20 T400 20"
        stroke="#D4B896"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M0 24 Q50 12 100 24 T200 24 T300 24 T400 24"
        stroke="#D4B896"
        strokeWidth="0.8"
        opacity="0.5"
        fill="none"
      />
      {/* Center lotus petals */}
      <g transform="translate(200, 16)">
        <ellipse cx="-8" cy="0" rx="4" ry="9" fill="#D4B896" opacity="0.3" transform="rotate(-25)" />
        <ellipse cx="0" cy="-2" rx="4" ry="10" fill="#D4B896" opacity="0.4" />
        <ellipse cx="8" cy="0" rx="4" ry="9" fill="#D4B896" opacity="0.3" transform="rotate(25)" />
      </g>
    </svg>
  )
}

export default function TransitionZone() {
  const { t } = useTranslation()

  return (
    <section
      className="relative py-6 tablet:py-10 px-6 flex flex-col items-center justify-center text-center"
      style={{
        background: 'linear-gradient(to bottom, #1a0f2e 0%, #8B6F47 50%, #D4B896 100%)',
      }}
    >
      <p className="text-cream-light/80 italic text-base tablet:text-lg max-w-md desktop:max-w-xl leading-relaxed mb-6">
        {t('landing.transitionTagline')}
      </p>
      <LotusWaveDivider />
    </section>
  )
}
