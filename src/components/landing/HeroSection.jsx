import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import festivalConfig from '../../data/festivalConfig'
import SplashImage from './SplashImage'
import OptImage from './OptImage'
import ShareButton from '../layout/ShareButton'
import {
  isBeforeFestival,
  isAfterFestival,
  isFestivalDay,
  getDaysUntilFestival,
  getCurrentDayIndex,
} from '../../utils/timeUtils'

// Floating light particles — subtle ambient lanterns/fireflies
const PARTICLES = [
  { x: '12%', startY: '-5%', size: 4, opacity: 0.4, duration: 14, delay: 0 },
  { x: '28%', startY: '-8%', size: 5, opacity: 0.3, duration: 18, delay: 3 },
  { x: '45%', startY: '-3%', size: 3, opacity: 0.5, duration: 12, delay: 6 },
  { x: '62%', startY: '-10%', size: 6, opacity: 0.35, duration: 16, delay: 1 },
  { x: '78%', startY: '-6%', size: 4, opacity: 0.45, duration: 15, delay: 8 },
  { x: '88%', startY: '-4%', size: 3, opacity: 0.3, duration: 17, delay: 5 },
  { x: '35%', startY: '-12%', size: 5, opacity: 0.4, duration: 13, delay: 10 },
]

function ScrollIndicator() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setVisible(false)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-500 ${
        visible ? 'opacity-70' : 'opacity-0 pointer-events-none'
      }`}
    >
      <svg
        className="w-8 h-8 text-amber-200 animate-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

function HeroLanguageToggle() {
  const { i18n } = useTranslation()
  const isVi = i18n.language?.startsWith('vi')

  return (
    <button
      onClick={() => i18n.changeLanguage(isVi ? 'en' : 'vi')}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-medium transition-colors backdrop-blur-sm"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
      {isVi ? 'EN' : 'VI'}
    </button>
  )
}


export default function HeroSection({ now, onEnterSchedule }) {
  const { t } = useTranslation()
  const [heroPhotoLoaded, setHeroPhotoLoaded] = useState(false)

  const before = isBeforeFestival(now)
  const during = isFestivalDay(now)
  const after = isAfterFestival(now)

  let ctaText = t('landing.ctaDefault')
  if (during) ctaText = t('landing.ctaDuring')
  if (after) ctaText = t('landing.ctaAfter')

  const dayIndex = getCurrentDayIndex(now)
  const dayNum = dayIndex + 1

  return (
    <section className="relative h-[88vh] max-h-[88vh] flex flex-col justify-center items-center text-center overflow-hidden bg-[#0d0a1a]">
      {/* Photo background with ken-burns animation */}
      <div
        className="absolute inset-0 transition-opacity duration-500 motion-reduce:duration-0"
        style={{ opacity: heroPhotoLoaded ? 1 : 0 }}
      >
        <OptImage
          name="hero-bg"
          alt=""
          aria-hidden="true"
          loading="eager"
          sizes="100vw"
          className="w-full h-full object-cover hero-ken-burns"
          style={{
            objectPosition: 'center 30%',
            filter: 'saturate(0.4) brightness(0.7)',
          }}
          onLoad={() => setHeroPhotoLoaded(true)}
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(170deg, #0d0a1aaa 0%, #1a0f2e88 40%, #2a154566 70%, #2C181088 100%)' }}
        />
        {/* Floating light particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="hero-particle"
              style={{
                left: p.x,
                bottom: p.startY,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
      {/* SVG splash — fallback when photo hasn't loaded */}
      {!heroPhotoLoaded && (
        <div className="absolute inset-0">
          <SplashImage className="w-full h-full" />
        </div>
      )}
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      {/* Bottom fade to night-purple (blends into TransitionZone) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-night-purple" />

      {/* Language toggle + Share - top right */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <ShareButton source="landing_hero" variant="hero" />
        <HeroLanguageToggle />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pt-16 pb-12 tablet:py-12 max-w-lg desktop:max-w-2xl">
        {/* Heritage badge — extra top spacing on mobile to clear SVG moon */}
        <div className="inline-block px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-900/30 mb-6 mt-4 tablet:mt-0">
          <span className="text-amber-300 text-sm font-medium">
            {t('landing.heritageBadge')}
          </span>
        </div>

        {/* Festival name */}
        <h1 className="text-3xl tablet:text-5xl desktop:text-6xl font-bold text-white mb-2 leading-tight">
          {t('landing.festivalName')}
        </h1>
        <p className="text-xl text-amber-200/90 font-medium mb-1">
          {t('landing.festivalLocation')}
        </p>
        <p className="text-amber-100/70 text-sm mb-6">
          {t('landing.dates')} · {t('landing.lunarDates')}
        </p>

        {/* Phase-aware countdown */}
        <div className="mb-8 transition-all duration-500">
          {before && (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <p className="text-amber-200/80 text-lg">
                {(() => { const daysLeft = getDaysUntilFestival(now); return <>{t('landing.countdownPrefix')}<span className="text-3xl font-bold text-amber-400 mx-1.5">{daysLeft}</span>{t('landing.countdownSuffix', { count: daysLeft })}</>; })()}
              </p>
            </div>
          )}
          {during && (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-800/50 border border-green-500/40 animate-[fadeIn_0.5s_ease-out]">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 font-semibold">
                {t('landing.duringFestival', { dayNum })}
              </span>
            </div>
          )}
          {after && (
            <p className="text-amber-200/70 text-lg italic animate-[fadeIn_0.5s_ease-out]">
              {t('landing.festivalEnded')}
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => onEnterSchedule(null)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl text-lg transition-colors shadow-lg shadow-amber-500/20"
        >
          {ctaText}
        </button>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}
