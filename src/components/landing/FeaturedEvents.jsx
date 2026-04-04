import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageUp } from 'lucide-react'
import schedule from '../../data/schedule.json'
import locations from '../../data/locations.json'
import { getEventText, getLocationText } from '../../utils/i18nEvent'
import { trackEventCardShared } from '../../utils/analytics'
import useScrollReveal from '../../hooks/useScrollReveal'
import {
  isBeforeFestival,
  isAfterFestival,
  isFestivalDay,
  getCurrentDayIndex,
  formatShortDate,
} from '../../utils/timeUtils'
import { CategoryIcon } from '../icons'
import OptImage from './OptImage'

const locationMap = Object.fromEntries(locations.map((l) => [l.id, l]))

const staticFeatured = schedule.filter((e) => e.isFeatured).slice(0, 3)

// Photo config for static featured cards (by index in staticFeatured)
const FEATURED_IMAGES = [
  { name: 'highlight-levia', position: 'center 55%', height: 220 },   // Opening ceremony Lan Su Rong
  { name: 'highlight-xehoa', position: 'center center', height: 160 }, // img-06: night xe hoa
  { name: 'highlight-thuyen', position: 'center 35%', height: 160 },  // img-12: dragon on water
]

// Category fallback images for during-festival dynamic cards
const CATEGORY_IMAGES = {
  'buddhist-ceremony': { name: 'cat-buddhist', position: 'center center', height: 160 },
  'performing-arts':   { name: 'cat-arts',     position: 'center 60%',    height: 160 },
  'folk-culture':      { name: 'cat-folk',     position: 'center 45%',    height: 160 },
  'exhibition':        { name: 'cat-exhibition', position: 'center 40%',  height: 160 },
  'cuisine':           { name: 'cat-cuisine',  position: 'center 45%',    height: 160 },
}

// Pick events maximizing category diversity (different background photos)
function pickDiverseEvents(events, count) {
  const groups = {}
  for (const e of events) {
    if (!groups[e.cat]) groups[e.cat] = []
    groups[e.cat].push(e)
  }
  for (const cat in groups) {
    groups[cat].sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1
      return a.startTime.localeCompare(b.startTime)
    })
  }
  const catOrder = Object.keys(groups).sort((a, b) => {
    const aFeat = groups[a][0].isFeatured ? 0 : 1
    const bFeat = groups[b][0].isFeatured ? 0 : 1
    if (aFeat !== bFeat) return aFeat - bFeat
    return groups[a][0].startTime.localeCompare(groups[b][0].startTime)
  })
  const result = []
  const indices = Object.fromEntries(catOrder.map((c) => [c, 0]))
  while (result.length < count) {
    let added = false
    for (const cat of catOrder) {
      if (result.length >= count) break
      if (indices[cat] < groups[cat].length) {
        result.push(groups[cat][indices[cat]++])
        added = true
      }
    }
    if (!added) break
  }
  return result
}

function EventCard({ event, badge, lang, image, onShare, sharing }) {
  const location = locationMap[event.locationId]
  const [imgFailed, setImgFailed] = useState(false)

  // Photo-background variant
  if (image && !imgFailed) {
    return (
      <div
        className="relative rounded-xl overflow-hidden shadow-bronze h-full"
        style={{ minHeight: image.height }}
      >
        <OptImage
          name={image.name}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: image.position }}
          onError={() => setImgFailed(true)}
        />
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] z-10"
          style={{ backgroundColor: location?.color || '#C8A35A' }}
        />
        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #2C1810ee 0%, #2C181099 40%, transparent 100%)' }}
        />
        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3">
            {badge}
          </div>
        )}
        {/* Share icon */}
        {onShare && (
          <button
            onClick={(e) => { e.stopPropagation(); onShare(event) }}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white z-10 transition-colors"
            disabled={sharing}
          >
            {sharing ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                <path d="M12 2a10 10 0 019.5 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : (
              <ImageUp size={16} />
            )}
          </button>
        )}
        {/* Text content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-cream-light leading-snug mb-1 drop-shadow-md">
            {getEventText(event, 'title', lang)}
          </h3>
          <p className="text-sm text-cream-light/80">
            {formatShortDate(event.date, lang)} · {event.startTime}
            {event.endTime ? `–${event.endTime}` : ''}
            {' · '}
            {location ? getLocationText(location, 'shortName', lang) : ''}
          </p>
        </div>
      </div>
    )
  }

  // Default text-only variant
  return (
    <div
      className="flex gap-4 bg-cream-light rounded-xl p-4 shadow-bronze"
      style={{ borderTop: `3px solid ${location?.color || '#C8A35A'}` }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-[10px] bg-accent-gold/10 overflow-hidden mt-0.5">
        <CategoryIcon category={event.cat} size={28} className="text-accent-brown" />
      </div>

      {/* Content */}
      <div className="min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-bold text-warm-text leading-snug flex-1 min-w-0">
            {getEventText(event, 'title', lang)}
          </h3>
          {badge && <div className="flex-shrink-0">{badge}</div>}
        </div>
        <p className="text-sm text-warm-muted mb-1.5">
          {formatShortDate(event.date, lang)} · {event.startTime}
          {event.endTime ? `–${event.endTime}` : ''}
          {' · '}
          {location ? getLocationText(location, 'shortName', lang) : ''}
        </p>
        {event.descriptionShort && (
          <p className="text-sm text-bronze-dark leading-relaxed">
            {getEventText(event, 'descriptionShort', lang)}
          </p>
        )}
      </div>
    </div>
  )
}

function OngoingBadge({ label }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-green/10 backdrop-blur-md border border-accent-green/30 text-accent-green text-xs font-semibold" style={{ boxShadow: '0 0 8px rgba(74,103,65,0.15)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
      {label}
    </span>
  )
}

function UpcomingBadge({ label }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-accent-gold/10 backdrop-blur-md border border-accent-gold/30 text-accent-gold text-xs font-semibold shadow-sm shadow-accent-gold/10">
      {label}
    </span>
  )
}

function EndedBadge({ label }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-warm-muted/10 backdrop-blur-md border border-warm-muted/20 text-warm-muted text-xs font-semibold">
      {label}
    </span>
  )
}

export default function FeaturedEvents({ now, ongoing = [], upcoming = [] }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { ref: sectionRef, visible } = useScrollReveal()
  const [sharingEventId, setSharingEventId] = useState(null)

  const handleShare = useCallback(async (event) => {
    if (sharingEventId) return
    setSharingEventId(event.id)
    try {
      const loc = locationMap[event.locationId]
      const res = await fetch(`${import.meta.env.BASE_URL}images/share/event-${event.id}-${lang}.jpg`)
      const blob = await res.blob()
      const file = new File([blob], `event-${event.id}.jpg`, { type: 'image/jpeg' })
      const eventTitle = getEventText(event, 'title', lang)
      const timeRange = event.endTime ? `${event.startTime}\u2013${event.endTime}` : event.startTime
      const locName = loc ? getLocationText(loc, 'name', lang) : ''
      const text = `L\u1EC5 h\u1ED9i Qu\u00E1n Th\u1EBF \u00C2m 2026\nhttps://lehoiquantheam-nhs-danang.vn\n\n${eventTitle}\n${event.date} \u00B7 ${timeRange}\n${locName}`

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: eventTitle, text })
        trackEventCardShared({ method: 'native_share', eventId: event.id, source: 'featured' })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
        trackEventCardShared({ method: 'download', eventId: event.id, source: 'featured' })
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('[FeaturedEvents share]', e)
        trackEventCardShared({ method: 'failed', eventId: event.id, source: 'featured' })
      }
    } finally {
      setSharingEventId(null)
    }
  }, [sharingEventId, lang])

  const staggerStyle = (index) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(15px)',
    transition: `opacity 500ms ease-out ${index * 150}ms, transform 500ms ease-out ${index * 150}ms`,
  })

  const before = isBeforeFestival(now)
  const during = isFestivalDay(now)
  const after = isAfterFestival(now)

  const dayIndex = getCurrentDayIndex(now)

  // Pick events to display based on phase
  let title = t('landing.featuredTitle')
  let cards = null

  if (during && (ongoing.length > 0 || upcoming.length > 0)) {
    title = t('landing.featuredDuring')
    const ongoingCards = ongoing.slice(0, 2).map((e) => (
      <EventCard
        key={e.id}
        event={e}
        lang={lang}
        image={CATEGORY_IMAGES[e.cat]}
        badge={<OngoingBadge label={t('landing.featuredOngoing')} />}
      />
    ))
    const upcomingCards = upcoming.slice(0, 3 - ongoingCards.length).map((e) => (
      <EventCard
        key={e.id}
        event={e}
        lang={lang}
        image={CATEGORY_IMAGES[e.cat]}
        badge={<UpcomingBadge label={t('landing.featuredUpcoming')} />}
      />
    ))
    const todayCards = [...ongoingCards, ...upcomingCards]

    // Fill remaining slots with tomorrow's preview (if not last day)
    const remaining = 3 - todayCards.length
    if (remaining > 0 && dayIndex < 3) {
      const tomorrowEvents = schedule.filter((e) => e.dayIndex === dayIndex + 1)
      const picked = pickDiverseEvents(tomorrowEvents, remaining)
      const fillCards = picked.map((e) => (
        <EventCard
          key={e.id}
          event={e}
          lang={lang}
          image={CATEGORY_IMAGES[e.cat]}
          badge={<UpcomingBadge label={t('landing.featuredTomorrowBadge')} />}
        />
      ))
      cards = [...todayCards, ...fillCards]
    } else {
      cards = todayCards
    }
  } else if (during) {
    // During festival but no ongoing/upcoming (late night)
    if (dayIndex < 3) {
      // Show tomorrow's preview
      title = t('landing.featuredTomorrow')
      const tomorrowEvents = schedule.filter((e) => e.dayIndex === dayIndex + 1)
      const picked = pickDiverseEvents(tomorrowEvents, 3)
      cards = picked.map((e) => (
        <EventCard
          key={e.id}
          event={e}
          lang={lang}
          image={CATEGORY_IMAGES[e.cat]}
        />
      ))
    } else {
      // Last day, no more events — show festival highlights recap
      title = t('landing.featuredHighlights')
      cards = staticFeatured.map((e, i) => (
        <EventCard
          key={e.id}
          event={e}
          lang={lang}
          image={FEATURED_IMAGES[i]}
          badge={<EndedBadge label={t('landing.featuredEndedBadge')} />}
        />
      ))
    }
  } else if (after) {
    title = t('landing.featuredHighlights')
    cards = staticFeatured.map((e, i) => (
      <EventCard
        key={e.id}
        event={e}
        lang={lang}
        image={FEATURED_IMAGES[i]}
        badge={<EndedBadge label={t('landing.featuredEndedBadge')} />}
        onShare={handleShare}
        sharing={sharingEventId === e.id}
      />
    ))
  } else {
    // Before festival
    cards = staticFeatured.map((e, i) => (
      <EventCard
        key={e.id}
        event={e}
        lang={lang}
        image={FEATURED_IMAGES[i]}
        onShare={handleShare}
        sharing={sharingEventId === e.id}
      />
    ))
  }

  return (
    <section className="bg-cream py-10 tablet:py-14 px-5 relative z-10" ref={sectionRef}>
      <div className="max-w-lg desktop:max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-accent-brown mb-6 text-center">
          {title}
        </h2>
        <div className="flex flex-col gap-4 desktop:flex-row desktop:gap-6">
          {cards.map((card, i) => (
            <div key={card.key} className="desktop:flex-1" style={staggerStyle(i)}>
              {card}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
