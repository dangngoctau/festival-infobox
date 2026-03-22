import { useTranslation } from 'react-i18next'
import EventCard from './EventCard'

function Section({ title, events, onEventClick, dimmed = false }) {
  if (events.length === 0) return null

  return (
    <div className={dimmed ? 'opacity-50' : ''}>
      <h3 className="text-sm font-semibold text-accent-brown uppercase tracking-wide mb-2">
        {title} ({events.length})
      </h3>
      <div className="flex flex-col gap-2 mb-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onClick={onEventClick} />
        ))}
      </div>
    </div>
  )
}

export default function EventList({ ongoing, upcoming, ended, onEventClick }) {
  const { t } = useTranslation()

  if (ongoing.length === 0 && upcoming.length === 0 && ended.length === 0) {
    return (
      <p className="text-warm-muted text-center py-8">
        {t('noEvents')}
      </p>
    )
  }

  return (
    <div>
      <Section
        title={t('timeGroup.ongoing')}
        events={ongoing}
        onEventClick={onEventClick}
      />
      <Section
        title={t('timeGroup.upcoming')}
        events={upcoming}
        onEventClick={onEventClick}
      />
      <Section
        title={t('timeGroup.ended')}
        events={ended}
        onEventClick={onEventClick}
        dimmed
      />
    </div>
  )
}
