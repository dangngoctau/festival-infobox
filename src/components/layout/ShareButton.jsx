import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageUp } from 'lucide-react'
import { trackAppShared, trackDayCardShared } from '../../utils/analytics'
import festivalConfig from '../../data/festivalConfig'

const APP_URL = 'https://lehoiquantheam-nhs-danang.vn'

const ShareIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
)

export default function ShareButton({ source, variant = 'default', selectedDay, dayEvents }) {
  const { t, i18n } = useTranslation()
  const [toast, setToast] = useState(false)
  const [loading, setLoading] = useState(false)
  const lang = i18n.language
  const isEn = lang === 'en'

  // Day card mode: when dayEvents is provided
  const isDayCard = dayEvents && dayEvents.length > 0 && selectedDay != null

  const handleShare = useCallback(async () => {
    if (loading) return

    if (isDayCard) {
      // Generate day schedule image card
      setLoading(true)
      try {
        const dayNum = selectedDay + 1
        const dayLabel = t(`dayLabels.${selectedDay}`)
        const res = await fetch(`${import.meta.env.BASE_URL}images/share/day-${selectedDay}-${lang}.jpg`)
        const blob = await res.blob()
        const file = new File([blob], `day-${dayNum}.jpg`, { type: 'image/jpeg' })
        const dayDate = festivalConfig.dates[selectedDay]
        const countText = isEn ? `${dayEvents.length} events` : `${dayEvents.length} sự kiện`
        const dayTitle = isEn ? `Day ${dayNum} \u2014 ${dayLabel}` : `Ng\u00E0y ${dayNum} \u2014 ${dayLabel}`
        const text = `L\u1EC5 h\u1ED9i Qu\u00E1n Th\u1EBF \u00C2m 2026\n${APP_URL}\n\n${dayTitle}\n\u{1F4C5} ${dayDate} \u00B7 ${countText}`

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: dayTitle, text })
          trackDayCardShared({ method: 'native_share', dayIndex: selectedDay })
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = file.name
          a.click()
          URL.revokeObjectURL(url)
          trackDayCardShared({ method: 'download', dayIndex: selectedDay })
        }
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error('[ShareButton] day card', e)
          trackDayCardShared({ method: 'failed', dayIndex: selectedDay })
        }
      } finally {
        setLoading(false)
      }
      return
    }

    // Default: share app link
    const title = isEn ? 'Quan The Am Festival 2026' : 'Lễ hội Quán Thế Âm 2026'

    if (navigator.share) {
      try {
        await navigator.share({ title, url: APP_URL })
        trackAppShared({ method: 'native_share', source })
      } catch (e) {
        if (e.name !== 'AbortError') {
          trackAppShared({ method: 'native_share_failed', source })
        }
      }
      return
    }

    try {
      await navigator.clipboard.writeText(APP_URL)
      trackAppShared({ method: 'copy_link', source })
      setToast(true)
      setTimeout(() => setToast(false), 2000)
    } catch {
      trackAppShared({ method: 'copy_failed', source })
    }
  }, [source, lang, isEn, loading, isDayCard, selectedDay, dayEvents])

  const isHero = variant === 'hero'

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        disabled={loading}
        className={
          isHero
            ? 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-medium transition-colors backdrop-blur-sm'
            : 'w-9 h-9 flex items-center justify-center rounded-full hover:bg-warm-card transition-colors text-warm-muted'
        }
        aria-label={t('aria.share')}
      >
        {loading ? (
          <svg className="w-[18px] h-[18px] animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
            <path d="M12 2a10 10 0 019.5 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : isDayCard ? (
          <ImageUp size={18} />
        ) : (
          <ShareIcon className={isHero ? 'w-3.5 h-3.5' : undefined} />
        )}
      </button>

      {toast && (
        <div className="absolute top-full mt-2 right-0 px-3 py-1.5 rounded-lg bg-warm-text text-white text-xs font-medium whitespace-nowrap shadow-lg animate-[fadeIn_0.2s_ease-out]">
          {t('share.copied')}
        </div>
      )}
    </div>
  )
}
