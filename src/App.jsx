import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useBreakpoint from './hooks/useBreakpoint'
import useFilters from './hooks/useFilters'
import useTimeGroup from './hooks/useTimeGroup'
import useFavorites from './hooks/useFavorites'
import { isFestivalDay, getFestivalPhase, getCurrentDayIndex } from './utils/timeUtils'
import { initPostHog } from './utils/posthogInit'
import {
  isAnalyticsAcknowledged,
  trackAppOpened,
  trackFilterApplied,
  trackEventDetailViewed,
  trackDirectionsRequested,
  trackFeatureEngaged,
  trackErrorEncountered,
  setSentryEventContext,
} from './utils/analytics'
import festivalConfig from './data/festivalConfig'
import schedule from './data/schedule.json'
import Header from './components/layout/Header'
import TabNav from './components/layout/TabNav'
import AnalyticsNotice from './components/layout/AnalyticsNotice'
import DayFilter from './components/timeline/DayFilter'
import FilterBar from './components/timeline/FilterBar'
import EventList from './components/timeline/EventList'
import EventDetail from './components/timeline/EventDetail'
import FestivalMap from './components/map/FestivalMap'
import PlacesTab from './components/map/PlacesTab'
import FlatMapView from './components/map/FlatMapView'
import LandingPage from './components/landing/LandingPage'

function getInitialView(now) {
  if (isFestivalDay(now)) {
    try {
      if (sessionStorage.getItem('hasEnteredSchedule') === 'true') {
        return 'schedule'
      }
    } catch {
      // sessionStorage unavailable
    }
  }
  return 'landing'
}

function App() {
  const { t, i18n } = useTranslation()
  const { isMobile } = useBreakpoint()
  const [timeOverride, setTimeOverride] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedEventTimeStatus, setSelectedEventTimeStatus] = useState(null)
  const [activeTab, setActiveTab] = useState('schedule')
  const scrollPositions = useRef({ schedule: 0, map: 0 })
  const [debugEnabled] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('debug') === '1') {
        sessionStorage.setItem('debugEnabled', 'true')
        params.delete('debug')
        const cleanUrl = params.toString()
          ? `${window.location.pathname}?${params}`
          : window.location.pathname
        window.history.replaceState({}, '', cleanUrl)
        return true
      }
      return sessionStorage.getItem('debugEnabled') === 'true'
    } catch { return false }
  })
  const [showDebug, setShowDebug] = useState(false)
  const [debugError, setDebugError] = useState(false)

  if (debugError) throw new Error('[Debug] Test error — triggered from simulator panel')

  const timeOffset = useMemo(() => {
    if (!timeOverride) return 0
    return new Date(timeOverride).getTime() - Date.now()
  }, [timeOverride])
  const now = new Date(Date.now() + timeOffset)

  const [currentView, setCurrentView] = useState(() => getInitialView(now))
  const [initialFilter, setInitialFilter] = useState(null)

  // --- Analytics state ---
  const [analyticsReady, setAnalyticsReady] = useState(() => isAnalyticsAcknowledged())
  const appOpenedRef = useRef(false)
  const filterTrackRef = useRef(true) // skip initial render

  // Init PostHog when analytics acknowledged
  useEffect(() => {
    if (analyticsReady) initPostHog()
  }, [analyticsReady])

  // Track app_opened once after PostHog is ready
  useEffect(() => {
    if (!analyticsReady || appOpenedRef.current) return
    appOpenedRef.current = true
    trackAppOpened({
      dayOfFestival: (() => {
        const today = new Date().toISOString().slice(0, 10)
        const idx = festivalConfig.dates.indexOf(today)
        return idx !== -1 ? idx + 1 : null
      })(),
      language: i18n.language,
      isReturning: isAnalyticsAcknowledged(),
    })
  }, [analyticsReady, i18n.language])

  const handleAnalyticsAcknowledged = useCallback(() => {
    setAnalyticsReady(true)
  }, [])

  const enterSchedule = useCallback((filter = null) => {
    setInitialFilter(filter)
    setCurrentView('schedule')
    setActiveTab('schedule')
    scrollPositions.current = { schedule: 0, map: 0 }
    window.scrollTo(0, 0)
    try { sessionStorage.setItem('hasEnteredSchedule', 'true') } catch {}
  }, [])

  const backToLanding = useCallback(() => {
    setCurrentView('landing')
    setInitialFilter(null)
    scrollPositions.current = { schedule: 0, map: 0 }
    window.scrollTo(0, 0)
  }, [])

  const handleTabChange = useCallback((newTab) => {
    scrollPositions.current[activeTab] = window.scrollY
    setActiveTab(newTab)
    // Track map_tab opened
    if (newTab === 'map') {
      trackFeatureEngaged({ feature: 'map_tab', action: 'opened' })
    }
    requestAnimationFrame(() => {
      const saved = scrollPositions.current[newTab]
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo(0, Math.min(saved, Math.max(0, maxScroll)))
    })
  }, [activeTab])

  const toggleLanguage = useCallback(() => {
    const isVi = i18n.language?.startsWith('vi')
    i18n.changeLanguage(isVi ? 'en' : 'vi')
  }, [i18n])

  const { favorites, loaded: favLoaded, toggleFavorite, isFavorite } = useFavorites()
  const [showFavorites, setShowFavorites] = useState(false)

  // Wrap toggleFavorite with tracking
  const handleToggleFavorite = useCallback((eventId) => {
    const wasOn = favorites.has(eventId)
    toggleFavorite(eventId)
    trackFeatureEngaged({
      feature: 'favorite',
      action: wasOn ? 'dismissed' : 'used',
    })
  }, [favorites, toggleFavorite])

  const {
    selectedDay, selectedLocationId, filterMode, selectedCategoryId,
    setDay, setLocation, toggleFilterMode, setCategory, filteredEvents,
    activeLocationCounts,
    activeCategoryCounts,
  } = useFilters(now, initialFilter)

  // Track filter_applied on filter changes (skip initial render)
  useEffect(() => {
    if (filterTrackRef.current) {
      filterTrackRef.current = false
      return
    }
    trackFilterApplied({
      filterType: filterMode,
      value: filterMode === 'location' ? selectedLocationId : selectedCategoryId,
      resultCount: filteredEvents.length,
    })
  }, [selectedDay, selectedLocationId, selectedCategoryId, filterMode, filteredEvents.length])

  const dayFavoritesCount = schedule.filter(
    (e) => e.dayIndex === selectedDay && favorites.has(e.id)
  ).length

  const displayEvents = showFavorites
    ? schedule.filter((e) => e.dayIndex === selectedDay && favorites.has(e.id))
    : filteredEvents
  const { ongoing, upcoming, ended } = useTimeGroup(displayEvents, timeOffset)

  // Landing page: today's unfiltered events grouped by time
  const landingDayIndex = isFestivalDay(now) ? getCurrentDayIndex(now) : -1
  const landingTodayEvents = landingDayIndex >= 0
    ? schedule.filter((e) => e.dayIndex === landingDayIndex)
    : []
  const { ongoing: landingOngoing, upcoming: landingUpcoming } = useTimeGroup(landingTodayEvents, timeOffset)

  // Track event detail viewed with position + time group
  const handleEventClick = useCallback((event) => {
    const allDisplayed = [...ongoing, ...upcoming, ...ended]
    const position = allDisplayed.findIndex((e) => e.id === event.id)
    const timeGroup = ongoing.some((e) => e.id === event.id)
      ? 'ongoing'
      : upcoming.some((e) => e.id === event.id)
        ? 'upcoming'
        : 'ended'

    trackEventDetailViewed({
      eventId: event.id,
      eventName: event.title,
      locationId: event.locationId,
      day: event.dayIndex + 1,
      timeGroup,
      positionInList: position,
    })
    setSentryEventContext(event)
    setSelectedEvent(event)
    setSelectedEventTimeStatus(timeGroup)
  }, [ongoing, upcoming, ended])

  const timelineContent = (
    <>
      <DayFilter selectedDay={selectedDay} onDayChange={setDay} now={now} />
      <FilterBar
        filterMode={filterMode}
        onToggleMode={toggleFilterMode}
        selectedLocationId={selectedLocationId}
        onLocationChange={setLocation}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={setCategory}
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites((v) => !v)}
        favoritesCount={dayFavoritesCount}
        activeLocationCounts={activeLocationCounts}
        activeCategoryCounts={activeCategoryCounts}
      />
      <AnalyticsNotice onAcknowledged={handleAnalyticsAcknowledged} />
      <EventList
        ongoing={ongoing}
        upcoming={upcoming}
        ended={ended}
        onEventClick={handleEventClick}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        favLoaded={favLoaded}
        showFavorites={showFavorites}
        selectedDay={selectedDay}
        filterMode={filterMode}
        festivalPhase={getFestivalPhase(now)}
      />
    </>
  )

  const mapContent = <FlatMapView className="h-full" />

  if (currentView === 'landing') {
    return (
      <>
        {debugEnabled && (
          <>
            {/* Debug gear toggle */}
            <button
              onClick={() => setShowDebug((v) => !v)}
              className="fixed top-3 left-3 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white/50 hover:text-white/80 transition-colors backdrop-blur-sm text-sm"
              aria-label="Toggle debug panel"
            >
              ⚙️
            </button>

            {/* Collapsible debug panel */}
            {showDebug && (
              <div className="fixed top-13 left-3 z-50 p-2 bg-warm-card/95 rounded-lg border border-accent-gold/30 text-sm flex items-center gap-2 flex-wrap backdrop-blur-sm shadow-lg max-w-[90vw]">
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
                <span className="w-px h-5 bg-warm-muted/30" />
                <button
                  onClick={() => setDebugError(true)}
                  className="px-2 py-1 rounded bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
                >
                  Test Error
                </button>
              </div>
            )}
          </>
        )}

        <LandingPage now={now} landingOngoing={landingOngoing} landingUpcoming={landingUpcoming} onEnterSchedule={enterSchedule} />
      </>
    )
  }

  return (
    <div className={`bg-warm-bg ${isMobile && activeTab === 'map' ? 'h-[calc(100dvh-3rem)] overflow-hidden' : ''}`} style={isMobile && activeTab === 'map' ? undefined : { minHeight: '100dvh' }}>
      <div className={`mx-auto ${isMobile ? (activeTab === 'map' ? '' : 'max-w-2xl') : 'max-w-6xl'} ${isMobile && activeTab === 'map' ? 'h-full flex flex-col' : ''}`} style={isMobile && activeTab !== 'map' ? { paddingBottom: '64px' } : undefined}>
        <Header
          onBack={backToLanding}
          activeTab={activeTab}
          onToggleDebug={debugEnabled ? () => setShowDebug((v) => !v) : undefined}
          onToggleLanguage={toggleLanguage}
          selectedDay={selectedDay}
          dayEvents={schedule.filter((e) => e.dayIndex === selectedDay)}
        />

        {/* Collapsible debug panel (hidden by default, requires ?debug=1) */}
        {debugEnabled && showDebug && (
          <div className="mx-4 mb-3 p-2 bg-warm-card rounded-lg border border-accent-gold/30 text-sm flex items-center gap-2 flex-wrap">
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
            <span className="w-px h-5 bg-warm-muted/30" />
            <button
              onClick={() => {
                trackAppOpened({ dayOfFestival: 1, language: i18n.language, isReturning: false })
                trackFilterApplied({ filterType: 'day', value: '2026-04-04', resultCount: 12 })
                trackEventDetailViewed({ eventId: 'd1-01', eventName: 'Test Event', locationId: 'chua', day: 1, timeGroup: 'ongoing', positionInList: 0 })
                trackDirectionsRequested({ source: 'event_detail', locationId: 'chua', locationName: 'Chùa', eventId: 'd1-01', day: 1, timeGroup: 'ongoing' })
                trackFeatureEngaged({ feature: 'map_tab', action: 'opened' })
                trackErrorEncountered({ errorType: 'api_failure', context: 'test' })
                console.log('%c[Debug] All 6 analytics events fired — check console above', 'color: #4A6741; font-weight: bold')
              }}
              className="px-2 py-1 rounded bg-accent-green/15 text-accent-green font-medium hover:bg-accent-green/25 transition-colors"
            >
              Test Analytics
            </button>
            <button
              onClick={() => setDebugError(true)}
              className="px-2 py-1 rounded bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
            >
              Test Error
            </button>
          </div>
        )}

        <div className={`${isMobile && activeTab === 'map' ? 'flex-1 min-h-0' : 'px-4 py-3'}`}>
          {isMobile ? (
            <>
              <div style={{ display: activeTab === 'schedule' ? 'block' : 'none' }}>
                {timelineContent}
              </div>
              <div style={{ display: activeTab === 'map' ? 'flex' : 'none' }} className="h-full">
                <FlatMapView className="h-full w-full" />
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <div className="w-[50%] desktop:w-[55%]">
                {timelineContent}
              </div>
              <div className="w-[50%] desktop:w-[45%] sticky top-3 h-[calc(100dvh-100px)] rounded-xl overflow-hidden">
                {mapContent}
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => { setSelectedEvent(null); setSelectedEventTimeStatus(null) }}
          timeStatus={selectedEventTimeStatus}
          isFavorite={isFavorite(selectedEvent.id)}
          onToggleFavorite={handleToggleFavorite}
          favLoaded={favLoaded}
        />
      )}
    </div>
  )
}

export default App
