import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useBreakpoint from './hooks/useBreakpoint'
import useFilters from './hooks/useFilters'
import useTimeGroup from './hooks/useTimeGroup'
import { isFestivalDay } from './utils/timeUtils'
import Header from './components/layout/Header'
import EmptyState from './components/layout/EmptyState'
import TabNav from './components/layout/TabNav'
import DayFilter from './components/timeline/DayFilter'
import LocationFilter from './components/timeline/LocationFilter'
import EventList from './components/timeline/EventList'
import EventDetail from './components/timeline/EventDetail'
import FestivalMap from './components/map/FestivalMap'

function LanguageToggle() {
  const { i18n } = useTranslation()
  const isVi = i18n.language?.startsWith('vi')

  return (
    <button
      onClick={() => i18n.changeLanguage(isVi ? 'en' : 'vi')}
      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-warm-card border border-warm-muted/20 text-accent-brown hover:border-accent-gold/40 transition-colors"
    >
      {isVi ? 'EN' : 'VI'}
    </button>
  )
}

function App() {
  const { t } = useTranslation()
  const { isMobile } = useBreakpoint()
  const [timeOverride, setTimeOverride] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [activeTab, setActiveTab] = useState('schedule')

  const simulatedTime = timeOverride ? new Date(timeOverride) : null
  const now = simulatedTime || new Date()

  const { selectedDay, selectedLocationId, setDay, setLocation, filteredEvents } =
    useFilters(now)
  const { ongoing, upcoming, ended } = useTimeGroup(filteredEvents, simulatedTime)

  const festivalActive = isFestivalDay(now)

  const timelineContent = festivalActive ? (
    <>
      <DayFilter selectedDay={selectedDay} onDayChange={setDay} />
      <LocationFilter
        selectedLocationId={selectedLocationId}
        onLocationChange={setLocation}
      />
      <EventList
        ongoing={ongoing}
        upcoming={upcoming}
        ended={ended}
        onEventClick={setSelectedEvent}
      />
    </>
  ) : (
    <EmptyState now={now} />
  )

  const mapContent = <FestivalMap className="h-full" />

  return (
    <div className="min-h-screen bg-warm-bg">
      <div className={`mx-auto px-4 py-3 ${isMobile ? 'max-w-2xl pb-16' : 'max-w-6xl'}`}>
        {/* Toolbar: time simulator + language */}
        <div className="mb-3 p-2 bg-warm-card rounded-lg border border-accent-gold/30 text-sm flex items-center gap-2 flex-wrap">
          <label className="font-medium text-accent-brown">
            {t('simulator.label')}
          </label>
          <input
            type="datetime-local"
            value={timeOverride}
            onChange={(e) => setTimeOverride(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          {timeOverride && (
            <button
              onClick={() => setTimeOverride('')}
              className="text-accent-gold underline"
            >
              {t('simulator.reset')}
            </button>
          )}
          <div className="ml-auto">
            <LanguageToggle />
          </div>
        </div>

        <Header />

        {isMobile ? (
          <>
            {activeTab === 'schedule' ? (
              timelineContent
            ) : (
              <div className="h-[calc(100dvh-200px)] rounded-xl overflow-hidden">
                {mapContent}
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-4">
            <div className="w-[60%] desktop:w-[65%]">
              {timelineContent}
            </div>
            <div className="w-[40%] desktop:w-[35%] sticky top-3 h-[calc(100dvh-100px)] rounded-xl overflow-hidden">
              {mapContent}
            </div>
          </div>
        )}
      </div>

      {isMobile && (
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}

export default App
