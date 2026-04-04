import { useMemo, useRef, useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import categories from '../../data/categories.json'
import schedule from '../../data/schedule.json'
import useScrollReveal from '../../hooks/useScrollReveal'
import { CategoryIcon } from '../icons'
import OptImage from './OptImage'

const CATEGORY_IMAGES = {
  'buddhist-ceremony': { name: 'cat-buddhist', position: 'center center' },
  'performing-arts': { name: 'cat-arts', position: 'center 60%' },
  'folk-culture': { name: 'cat-folk', position: 'center 45%' },
  'exhibition': { name: 'cat-exhibition', position: 'center 40%' },
  'cuisine': { name: 'cat-cuisine', position: 'center 45%' },
}

function CategoryCard({ cat, t, lang, className = '' }) {
  const catImage = CATEGORY_IMAGES[cat.id]
  const isPrimary = cat.isPrimary

  return (
    <div
      className={`bg-cream-light rounded-xl shadow-bronze overflow-hidden ${
        isPrimary ? 'border-2 border-accent-gold' : ''
      } ${className}`}
    >
      {/* Photo header */}
      {catImage && (
        <div className={`relative h-[120px] overflow-hidden ${isPrimary ? 'desktop:h-[180px]' : ''}`}>
          <OptImage
            name={catImage.name}
            alt=""
            aria-hidden="true"
            sizes={isPrimary ? '(min-width: 1024px) 580px, 75vw' : '(min-width: 1024px) 280px, 75vw'}
            className="w-full h-full object-cover"
            style={{ objectPosition: catImage.position }}
          />
          {/* Gradient fade to card background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(transparent 60%, #FFFDF7 100%)' }}
          />
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ backgroundColor: cat.accentColor }}
          />
          {/* Primary badge */}
          {isPrimary && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-amber-300 text-[10px] font-semibold">
              {t('landing.primaryBadge', 'Trọng tâm')}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-[10px] overflow-hidden"
            style={{ backgroundColor: cat.accentColor + '1A' }}
          >
            <CategoryIcon category={cat.id} size={28} className="text-accent-brown" />
          </div>
          <h3 className="font-bold text-accent-brown text-base leading-snug">
            {t(`catGroup.${cat.id}`)}
          </h3>
        </div>
        <p className="text-sm text-bronze-dark leading-relaxed mb-1">
          {lang?.startsWith('en') && cat.descriptionEn ? cat.descriptionEn : cat.description}
        </p>
        {cat.teaser && (
          <p className="text-sm text-warm-muted italic mt-1">
            {t(`landing.${cat.teaser}`)}
          </p>
        )}
        <p className="text-sm text-warm-muted mt-2">
          {t('landing.eventCount', { count: cat.eventCount })}
        </p>
      </div>
    </div>
  )
}

export default function CategoryHighlights({ onEnterSchedule }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { ref: sectionRef, visible } = useScrollReveal()
  const scrollRef = useRef(null)
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 })
  const [activeIndex, setActiveIndex] = useState(0)

  const highlights = useMemo(() =>
    categories.map((cat) => ({
      ...cat,
      eventCount: schedule.filter((e) => e.cat === cat.id).length,
    })),
  [])

  // Drag-to-scroll (reused from FilterBar pattern)
  const onMouseDown = useCallback((e) => {
    const el = scrollRef.current
    dragState.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
    el.style.cursor = 'grabbing'
  }, [])

  const onMouseUp = useCallback(() => {
    dragState.current.isDown = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!dragState.current.isDown) return
    e.preventDefault()
    const el = scrollRef.current
    const x = e.pageX - el.offsetLeft
    el.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX)
  }, [])

  // Track active card via scroll position
  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.firstElementChild?.offsetWidth || 1
    const gap = 12 // gap-3 = 12px
    const index = Math.round(el.scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(index, highlights.length - 1))
  }, [highlights.length])

  // Cleanup mouse listeners on unmount
  useEffect(() => {
    const handleUp = () => {
      dragState.current.isDown = false
      if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
    }
    window.addEventListener('mouseup', handleUp)
    return () => window.removeEventListener('mouseup', handleUp)
  }, [])

  const revealStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(15px)',
    transition: 'opacity 400ms ease-out, transform 400ms ease-out',
  }

  return (
    <section className="bg-cream-dark py-10 tablet:py-14 px-5 relative z-10" ref={sectionRef}>
      <div className="max-w-lg desktop:max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-accent-brown mb-6 text-center">
          {t('landing.highlightsTitle')}
        </h2>
      </div>

      {/* Mobile carousel — hidden on desktop */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-none cursor-grab pl-5 pr-5 snap-x snap-mandatory desktop:hidden"
        style={{
          scrollPaddingLeft: '20px',
          ...revealStyle,
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onScroll={onScroll}
      >
        {highlights.map((cat) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            t={t}
            lang={lang}
            className="flex-shrink-0 w-[75vw] max-w-[280px] snap-center"
          />
        ))}
      </div>

      {/* Mobile dot indicators — hidden on desktop */}
      <div className="flex justify-center gap-2 mt-4 desktop:hidden">
        {highlights.map((cat, i) => (
          <span
            key={cat.id}
            className={`rounded-full transition-all duration-200 ${
              i === activeIndex
                ? 'w-2 h-2 bg-accent-gold'
                : 'w-1.5 h-1.5 bg-bronze/30'
            }`}
          />
        ))}
      </div>

      {/* Desktop grid — hidden on mobile */}
      <div
        className="hidden desktop:grid desktop:grid-cols-3 desktop:gap-5 desktop:max-w-4xl desktop:mx-auto"
        style={revealStyle}
      >
        {(() => { const np = highlights.filter(c => !c.isPrimary), p = highlights.find(c => c.isPrimary); return [...np.slice(0, 3), p, ...np.slice(3)] })().map((cat) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            t={t}
            lang={lang}
            className={cat.isPrimary ? 'col-span-2' : ''}
          />
        ))}
      </div>

      {/* Section CTA */}
      <div className="mt-8 text-center">
        <button
          onClick={() => onEnterSchedule(null)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-xl text-base transition-colors shadow-lg shadow-amber-500/20"
        >
          {t('landing.viewFullSchedule')}
        </button>
      </div>
    </section>
  )
}
