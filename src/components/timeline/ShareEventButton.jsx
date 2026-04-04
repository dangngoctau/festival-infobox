import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageUp } from 'lucide-react'
import { trackEventCardShared } from '../../utils/analytics'
import { getEventText, getLocationText } from '../../utils/i18nEvent'

export default function ShareEventButton({ event, location }) {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  const lang = i18n.language

  const handleShare = useCallback(async () => {
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}images/share/event-${event.id}-${lang}.jpg`)
      const blob = await res.blob()
      const file = new File([blob], `event-${event.id}.jpg`, { type: 'image/jpeg' })
      const eventTitle = getEventText(event, 'title', lang)
      const timeRange = event.endTime ? `${event.startTime}\u2013${event.endTime}` : event.startTime
      const locName = location ? getLocationText(location, 'name', lang) : ''
      const locFull = location?.address ? `${locName}, ${getLocationText(location, 'address', lang)}` : locName
      const text = `L\u1EC5 h\u1ED9i Qu\u00E1n Th\u1EBF \u00C2m 2026\nhttps://lehoiquantheam-nhs-danang.vn\n\n${eventTitle}\n\u{1F4C5} ${event.date} \u00B7 ${timeRange}\n\u{1F4CD} ${locFull}`

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: eventTitle, text })
        trackEventCardShared({ method: 'native_share', eventId: event.id })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
        trackEventCardShared({ method: 'download', eventId: event.id })
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('[ShareEventButton]', e)
        trackEventCardShared({ method: 'failed', eventId: event.id })
      }
    } finally {
      setLoading(false)
    }
  }, [event, location, lang, loading])

  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleShare() }}
      className="absolute top-3 right-[104px] w-10 h-10 flex items-center justify-center rounded-full bg-warm-bg/80 backdrop-blur-sm text-warm-muted hover:bg-warm-bg z-10 transition-colors"
      aria-label={t('aria.shareEvent')}
      disabled={loading}
    >
      {loading ? (
        <svg className="w-[18px] h-[18px] animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
          <path d="M12 2a10 10 0 019.5 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ) : (
        <ImageUp size={18} />
      )}
    </button>
  )
}
