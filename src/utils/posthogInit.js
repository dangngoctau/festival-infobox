import posthog from 'posthog-js'

let initialized = false

export function initPostHog() {
  if (initialized) return
  const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
  if (!key) return

  posthog.init(key, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    persistence: 'localStorage',
    autocapture: false,
    capture_pageview: false,
    disable_session_recording: true,
  })
  initialized = true
}

export function getPostHog() {
  return initialized ? posthog : null
}
