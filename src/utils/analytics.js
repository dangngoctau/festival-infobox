import * as Sentry from '@sentry/react'
import i18n from '../i18n/i18n'
import festivalConfig from '../data/festivalConfig'
import { getPostHog } from './posthogInit'

const ANALYTICS_FLAG = 'analytics_acknowledged'

function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getDayOfFestival() {
  const today = toDateStr(new Date())
  const idx = festivalConfig.dates.indexOf(today)
  return idx !== -1 ? idx + 1 : null
}

function getPlatform() {
  const ua = navigator.userAgent
  if (/Mobi|Android/i.test(ua)) return 'mobile'
  if (/Tablet|iPad/i.test(ua)) return 'tablet'
  return 'desktop'
}

function getCommonContext() {
  return {
    app_version: festivalConfig.version,
    festival_day: getDayOfFestival(),
    language: i18n.language,
    platform: getPlatform(),
  }
}

function send(eventName, properties) {
  const payload = { ...getCommonContext(), ...properties }

  if (import.meta.env.DEV) {
    console.groupCollapsed(`[Analytics] ${eventName}`)
    console.table(payload)
    console.groupEnd()
    return
  }

  getPostHog()?.capture(eventName, payload)
}

/**
 * Q: How is traffic distributed across festival days? What's the return rate?
 * Sampling: 100%
 */
export function trackAppOpened({ dayOfFestival, language, isReturning }) {
  send('app_opened', {
    day_of_festival: dayOfFestival,
    language,
    is_returning: isReturning,
  })
}

/**
 * Q: Which day/location/category filters are most popular? Are there zero-result combinations?
 * Sampling: 50% (100% when result_count === 0)
 */
export function trackFilterApplied({ filterType, value, resultCount }) {
  if (resultCount > 0 && Math.random() > 0.5) return
  send('filter_applied', {
    filter_type: filterType,
    value,
    result_count: resultCount,
  })
}

/**
 * Q: Which events attract the most taps? Are bottom-of-list events invisible?
 * Sampling: 50%
 */
export function trackEventDetailViewed({ eventId, eventName, locationId, day, timeGroup, positionInList }) {
  if (Math.random() > 0.5) return
  send('event_detail_viewed', {
    event_id: eventId,
    event_name: eventName,
    location_id: locationId,
    day,
    time_group: timeGroup,
    position_in_list: positionInList,
  })
}

/**
 * Q: What's the conversion rate from viewing to physically going? EventDetail vs map pin?
 * Sampling: 100% — KPI #1, never sample
 */
export function trackDirectionsRequested({ source, locationId, locationName, eventId, day, timeGroup }) {
  send('directions_requested', {
    source,
    location_id: locationId,
    location_name: locationName,
    event_id: eventId ?? null,
    day: day ?? null,
    time_group: timeGroup ?? null,
  })
}

/**
 * Q: How many times is the app shared? Which placement drives more shares?
 * Sampling: 100%
 */
export function trackAppShared({ method, source, eventId }) {
  send('app_shared', { method, source, event_id: eventId ?? null })
}

/**
 * Q: Which events get shared as image cards? Which method (native/download)?
 * Sampling: 100%
 */
export function trackEventCardShared({ method, eventId }) {
  send('event_card_shared', { method, event_id: eventId })
}

/**
 * Q: Which festival days get shared? Which method?
 * Sampling: 100%
 */
export function trackDayCardShared({ method, dayIndex }) {
  send('day_card_shared', { method, day_index: dayIndex })
}

/**
 * Q: Which secondary features are actually used? Which are opened then immediately abandoned?
 * Sampling: 100%
 */
export function trackFeatureEngaged({ feature, action }) {
  send('feature_engaged', { feature, action })
}

/**
 * Q: What fails during the festival, and in what user context?
 * Sampling: 100%
 */
export function trackErrorEncountered({ errorType, context, dayOfFestival }) {
  send('error_encountered', {
    error_type: errorType,
    context,
    day_of_festival: dayOfFestival ?? getDayOfFestival(),
  })
}

/**
 * Set Sentry context when viewing an event detail — helps debug crashes.
 */
export function setSentryEventContext(event) {
  try {
    Sentry.setContext('current_event', {
      event_id: event.id,
      event_name: event.title,
    })
  } catch {
    // Sentry not available
  }
}

/** Check if user has previously acknowledged analytics */
export function isAnalyticsAcknowledged() {
  try {
    return localStorage.getItem(ANALYTICS_FLAG) === 'true'
  } catch {
    return false
  }
}

/** Mark analytics as acknowledged */
export function setAnalyticsAcknowledged() {
  try {
    localStorage.setItem(ANALYTICS_FLAG, 'true')
  } catch {
    // localStorage unavailable
  }
}
