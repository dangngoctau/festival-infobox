import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function ControlBar({
  showOverview,
  onResetView,
  showWC,
  showParking,
  wcCount,
  parkingCount,
  menuOpen,
  onToggleWC,
  onToggleParking,
  onToggleMenu,
  onCloseMenu,
}) {
  const { t } = useTranslation()
  const menuRef = useRef(null)

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onCloseMenu()
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [menuOpen, onCloseMenu])

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') onCloseMenu()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [menuOpen, onCloseMenu])

  return (
    <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2 whitespace-nowrap">
      {/* Utility toggle — text label */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={onToggleMenu}
          className={`h-8 px-3 rounded-full text-xs font-medium shadow-warm transition-colors backdrop-blur-sm ${
            showWC || showParking
              ? 'bg-accent-gold text-white'
              : 'bg-warm-card/95 text-warm-text hover:bg-warm-bg'
          }`}
          aria-label={t('map.utilityToggle', 'Tiện ích')}
          aria-expanded={menuOpen}
        >
          {t('map.utilities', 'Tiện ích')}
        </button>

        {/* Popover menu */}
        {menuOpen && (
          <div
            className="absolute bottom-full left-0 mb-2 min-w-[160px] bg-warm-card rounded-xl shadow-warm-md border border-bronze/15 py-1.5 backdrop-blur-sm animate-menu-slide-up"
            role="menu"
          >
            <UtilityMenuItem
              label={`${t('map.restroom', 'Nhà vệ sinh')} (${wcCount})`}
              dotColor="#E85D75"
              checked={showWC}
              onToggle={onToggleWC}
            />
            <UtilityMenuItem
              label={`${t('map.parking', 'Bãi đỗ xe')} (${parkingCount})`}
              dotColor="#D4845A"
              checked={showParking}
              onToggle={onToggleParking}
            />
          </div>
        )}
      </div>

      {/* Reset view — icon-only, only visible when zoomed/panned away */}
      {showOverview && (
        <button
          onClick={onResetView}
          className="w-8 h-8 rounded-full bg-warm-card/95 backdrop-blur-sm text-warm-text text-sm font-bold shadow-warm hover:bg-warm-bg transition-colors flex items-center justify-center"
          aria-label={t('map.overview', 'Xem tổng quan bản đồ')}
        >
          ↻
        </button>
      )}
    </div>
  )
}

function UtilityMenuItem({ label, dotColor, checked, onToggle }) {
  return (
    <button
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={onToggle}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-warm-text hover:bg-warm-bg/60 transition-colors"
    >
      <span
        className="w-3 h-3 rounded-full shrink-0 border-2"
        style={{
          borderColor: dotColor,
          backgroundColor: checked ? dotColor : 'transparent',
        }}
      />
      <span className="flex-1 text-left font-medium">{label}</span>
      {checked && <span className="text-accent-green text-[10px]">✓</span>}
    </button>
  )
}
