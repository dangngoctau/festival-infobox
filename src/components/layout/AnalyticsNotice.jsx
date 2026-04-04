import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { isAnalyticsAcknowledged, setAnalyticsAcknowledged } from '../../utils/analytics'
import { PracticalIcon } from '../icons'

export default function AnalyticsNotice({ onAcknowledged }) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [collapsing, setCollapsing] = useState(false)
  const containerRef = useRef(null)
  const outOfViewTimer = useRef(null)

  // Don't render at all if already acknowledged
  const [acknowledged] = useState(() => isAnalyticsAcknowledged())
  useEffect(() => {
    if (acknowledged) {
      onAcknowledged?.()
      return
    }
    // Delay appearance by 800ms
    const timer = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(timer)
  }, [acknowledged, onAcknowledged])

  // Auto-dismiss when out of viewport for 5 seconds
  useEffect(() => {
    if (!visible || collapsing || acknowledged) return
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          outOfViewTimer.current = setTimeout(() => {
            setAnalyticsAcknowledged()
            onAcknowledged?.()
          }, 5000)
        } else {
          clearTimeout(outOfViewTimer.current)
        }
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(outOfViewTimer.current)
    }
  }, [visible, collapsing, acknowledged, onAcknowledged])

  const handleDismiss = useCallback(() => {
    setCollapsing(true)
    setTimeout(() => {
      setAnalyticsAcknowledged()
      onAcknowledged?.()
    }, 200)
  }, [onAcknowledged])

  if (acknowledged) return null

  return (
    <div
      ref={containerRef}
      className="overflow-hidden transition-all duration-200 ease-out"
      style={{
        maxHeight: collapsing ? 0 : visible ? '200px' : 0,
        opacity: collapsing ? 0 : visible ? 1 : 0,
      }}
    >
      <div className="bg-cream-dark rounded-lg px-4 py-3 mb-4 flex items-start gap-3">
        <PracticalIcon icon="sparkle" size={18} className="text-accent-brown shrink-0 mt-0.5" />
        <p className="text-sm text-warm-muted flex-1 leading-relaxed">
          {t('analyticsNotice.message')}
        </p>
        <button
          onClick={handleDismiss}
          className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-accent-brown/10 text-accent-brown hover:bg-accent-brown/20 transition-colors"
        >
          {t('analyticsNotice.ok')}
        </button>
      </div>
    </div>
  )
}
