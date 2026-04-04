import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EventCard from './EventCard'
import festivalConfig from '../../data/festivalConfig'
import { formatShortDate } from '../../utils/timeUtils'

function TimelineItem({ event, timeStatus, isLast, onEventClick, isFavorite, onToggleFavorite, favLoaded, filterMode }) {
  const isOngoing = timeStatus === 'ongoing'
  const isUpcoming = timeStatus === 'upcoming'
  const isFeatured = event.isFeatured

  // Node size: ongoing 14px, upcoming 10px, ended 6px (featured slightly larger)
  const nodeSize = isOngoing
    ? (isFeatured ? 'w-3.5 h-3.5' : 'w-3 h-3')
    : isUpcoming
      ? (isFeatured ? 'w-2.5 h-2.5' : 'w-2 h-2')
      : (isFeatured ? 'w-2 h-2' : 'w-1.5 h-1.5')

  const nodeStyle = isOngoing
    ? 'bg-rail-ongoing rail-node-pulse'
    : isUpcoming
      ? 'border-2 border-rail-muted bg-warm-bg'
      : 'bg-rail-muted'

  const featuredRing = isFeatured
    ? 'ring-2 ring-accent-gold ring-offset-1 ring-offset-warm-bg'
    : ''

  const segmentColor = isOngoing
    ? 'bg-rail-ongoing'
    : isUpcoming
      ? 'border-l-2 border-dashed border-rail-muted bg-transparent'
      : 'bg-rail-muted'

  const segmentWidth = isOngoing ? 'w-[3px]' : 'w-[2px]'

  return (
    <div className="relative pl-8 max-[359px]:pl-6">
      {!isLast && (
        isOngoing ? (
          <div
            className={`absolute left-[15px] max-[359px]:left-[11px] top-4 bottom-[-8px] ${segmentWidth} ${segmentColor} -translate-x-1/2`}
            aria-hidden="true"
          />
        ) : (
          <div
            className="absolute left-[15px] max-[359px]:left-[11px] top-4 bottom-[-8px] -translate-x-1/2"
            style={{
              width: '2px',
              backgroundImage: isUpcoming
                ? 'repeating-linear-gradient(to bottom, var(--color-rail-muted) 0, var(--color-rail-muted) 4px, transparent 4px, transparent 8px)'
                : undefined,
              backgroundColor: isUpcoming ? undefined : 'var(--color-rail-muted)',
            }}
            aria-hidden="true"
          />
        )
      )}
      <div
        className={`absolute left-[15px] max-[359px]:left-[11px] top-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${nodeSize} ${nodeStyle} ${featuredRing} z-10`}
        aria-hidden="true"
      />
      <EventCard
        event={event}
        onClick={onEventClick}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        favLoaded={favLoaded}
        timeStatus={timeStatus}
        filterMode={filterMode}
      />
    </div>
  )
}

function SectionHeading({ title, count, timeStatus, isCollapsible, collapsed, onClick, showRail }) {
  const isOngoing = timeStatus === 'ongoing'
  const isEnded = timeStatus === 'ended'

  const headingStyle = isOngoing
    ? 'text-accent-green'
    : isEnded
      ? 'text-warm-muted opacity-60'
      : 'text-warm-text'

  return (
    <h3
      className={`text-sm font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${headingStyle} ${showRail ? 'pl-8 max-[359px]:pl-6' : ''} ${isCollapsible ? 'cursor-pointer select-none' : ''}`}
      onClick={onClick}
    >
      {isOngoing && (
        <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
      )}
      {title} ({count})
      {isCollapsible && (
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform ${collapsed ? '' : 'rotate-90'}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </h3>
  )
}

function Section({ title, events, onEventClick, dimmed = false, timeStatus, showRail, isCollapsible = false, defaultCollapsed = false, isFavorite, onToggleFavorite, favLoaded, filterMode }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  if (events.length === 0) return null

  return (
    <div className={`${dimmed && collapsed ? 'opacity-50' : dimmed ? 'opacity-60' : ''} ${timeStatus === 'ended' ? 'mt-6' : timeStatus === 'upcoming' ? 'mt-6' : ''}`}>
      <SectionHeading
        title={title}
        count={events.length}
        timeStatus={timeStatus}
        isCollapsible={isCollapsible}
        collapsed={collapsed}
        onClick={isCollapsible ? () => setCollapsed((c) => !c) : undefined}
        showRail={showRail}
      />
      {!collapsed && (
        <div className="flex flex-col gap-2 mb-4">
          {events.map((event, idx) => (
            showRail ? (
              <TimelineItem
                key={event.id}
                event={event}
                timeStatus={timeStatus}
                isLast={idx === events.length - 1}
                onEventClick={onEventClick}
                isFavorite={isFavorite?.(event.id)}
                onToggleFavorite={onToggleFavorite}
                favLoaded={favLoaded}
                filterMode={filterMode}
              />
            ) : (
              <EventCard
                key={event.id}
                event={event}
                onClick={onEventClick}
                isFavorite={isFavorite?.(event.id)}
                onToggleFavorite={onToggleFavorite}
                favLoaded={favLoaded}
                timeStatus={timeStatus}
                filterMode={filterMode}
              />
            )
          ))}
        </div>
      )}
    </div>
  )
}

/* Lotus line art SVG for empty state */
function LotusIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-warm-muted/30">
      <path d="M40 65c0 0-12-8-12-20s12-20 12-20 12 8 12 20-12 20-12 20z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M40 65c0 0-20-5-22-18S30 25 30 25" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M40 65c0 0 20-5 22-18S50 25 50 25" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M40 65v10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 75c4-3 8-3 8-3s4 0 8 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export default function EventList({ ongoing, upcoming, ended, onEventClick, isFavorite, onToggleFavorite, favLoaded, showFavorites, selectedDay, filterMode, festivalPhase }) {
  const { t, i18n } = useTranslation()
  const showRail = !showFavorites
  const totalCount = ongoing.length + upcoming.length + ended.length
  const allEvents = [...ongoing, ...upcoming, ...ended]

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <LotusIllustration />
        <p className="text-warm-muted text-center text-sm whitespace-pre-line">
          {t('noEventsWarm')}
        </p>
      </div>
    )
  }

  // Day context zone (shown in all phases)
  const dayContext = (
    <div className="py-3 mb-2">
      <p className="text-accent-brown font-semibold text-sm">
        {festivalPhase === 'before'
          ? t('timeState.beforeHeading', { date: formatShortDate(festivalConfig.dates[selectedDay] || '', i18n.language) })
          : t('dayContext.label', {
              num: selectedDay + 1,
              label: t(`dayLabels.${selectedDay}`),
              count: totalCount,
            })}
      </p>
      <p className="italic text-warm-muted text-xs mt-0.5">
        {t('lunarLabel', { lunar: festivalConfig.lunarDates[selectedDay] || '' })} · {t(`dayContext.tagline.${selectedDay}`)}
      </p>
    </div>
  )

  // BEFORE festival: flat list, no time grouping
  if (festivalPhase === 'before') {
    return (
      <div>
        {dayContext}
        <div className="flex flex-col gap-2">
          {allEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={onEventClick}
              isFavorite={isFavorite?.(event.id)}
              onToggleFavorite={onToggleFavorite}
              favLoaded={favLoaded}
              timeStatus="upcoming"
              filterMode={filterMode}
            />
          ))}
        </div>
      </div>
    )
  }

  // AFTER festival: ended message + flat archive
  if (festivalPhase === 'after') {
    return (
      <div>
        <div className="text-center py-4 mb-2">
          <p className="text-warm-muted text-sm italic">
            {t('timeState.afterMessage')}
          </p>
        </div>
        {dayContext}
        <div className="flex flex-col gap-2">
          {allEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={onEventClick}
              isFavorite={isFavorite?.(event.id)}
              onToggleFavorite={onToggleFavorite}
              favLoaded={favLoaded}
              timeStatus="ended"
              filterMode={filterMode}
            />
          ))}
        </div>
      </div>
    )
  }

  // DURING festival: full 3-group view
  return (
    <div>
      {dayContext}
      <Section
        title={t('timeGroup.ongoing')}
        events={ongoing}
        onEventClick={onEventClick}
        timeStatus="ongoing"
        showRail={showRail}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        favLoaded={favLoaded}
        filterMode={filterMode}
      />
      <Section
        title={t('timeGroup.upcoming')}
        events={upcoming}
        onEventClick={onEventClick}
        timeStatus="upcoming"
        showRail={showRail}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        favLoaded={favLoaded}
        filterMode={filterMode}
      />
      <Section
        title={t('timeGroup.ended')}
        events={ended}
        onEventClick={onEventClick}
        dimmed
        timeStatus="ended"
        showRail={showRail}
        isCollapsible
        defaultCollapsed
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        favLoaded={favLoaded}
        filterMode={filterMode}
      />
    </div>
  )
}
