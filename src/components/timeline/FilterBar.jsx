import { useRef, useCallback, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import allLocations from '../../data/locations.json'
import categories from '../../data/categories.json'
import { categoryColors } from '../../data/colorMap'
import { getLocationText } from '../../utils/i18nEvent'
import { CategoryIcon, LocationPin } from '../icons'

const venueLocations = allLocations.filter((l) => l.type === 'venue' || !l.type)

export default function FilterBar({
  filterMode,
  onToggleMode,
  selectedLocationId,
  onLocationChange,
  selectedCategoryId,
  onCategoryChange,
  showFavorites,
  onToggleFavorites,
  favoritesCount,
  activeLocationCounts,
  activeCategoryCounts,
}) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const scrollRef = useRef(null)
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 })

  // Scroll indicator state
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollIndicators = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  const onMouseDown = useCallback((e) => {
    const el = scrollRef.current
    dragState.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
    el.style.cursor = 'grabbing'
  }, [])

  const onMouseUp = useCallback(() => {
    dragState.current.isDown = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!dragState.current.isDown) return
    e.preventDefault()
    const el = scrollRef.current
    const x = e.pageX - el.offsetLeft
    el.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX)
  }, [])

  // Day-aware location chips: filter to active locations, sort by primary then count
  const dayLocations = useMemo(() => {
    if (!activeLocationCounts) return venueLocations
    return venueLocations
      .filter((loc) => activeLocationCounts[loc.id])
      .sort((a, b) => {
        if (a.primary !== b.primary) return b.primary ? 1 : -1
        return (activeLocationCounts[b.id] || 0) - (activeLocationCounts[a.id] || 0)
      })
  }, [activeLocationCounts])

  // Day-aware category chips: filter to active categories, sort by primary then count
  const dayCategories = useMemo(() => {
    if (!activeCategoryCounts) return categories
    return categories
      .filter((cat) => activeCategoryCounts[cat.id])
      .sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) return b.isPrimary ? 1 : -1
        return (activeCategoryCounts[b.id] || 0) - (activeCategoryCounts[a.id] || 0)
      })
  }, [activeCategoryCounts])

  // Update scroll indicators when chip count changes
  useEffect(() => {
    updateScrollIndicators()
  }, [dayLocations, dayCategories, filterMode, updateScrollIndicators])

  const isLocationMode = filterMode === 'location'
  const activeFilterValue = isLocationMode ? selectedLocationId : selectedCategoryId
  const onFilterChange = isLocationMode ? onLocationChange : onCategoryChange

  // Scroll chip bar back to start when filter resets to "all"
  useEffect(() => {
    if (activeFilterValue === 'all' && scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }, [activeFilterValue])

  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Favorites heart — separated, always visible */}
      <button
        onClick={onToggleFavorites}
        className={`shrink-0 w-9 h-9 ml-1 flex items-center justify-center rounded-full text-lg transition-colors relative ${
          showFavorites
            ? 'bg-accent-gold/15 text-accent-gold'
            : 'text-warm-muted hover:bg-warm-card'
        }`}
        aria-label={showFavorites ? t('favorites.remove') : t('favorites.add')}
      >
        {showFavorites ? '♥' : '♡'}
        {favoritesCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-accent-gold text-white text-[10px] font-bold leading-none px-1">
            {favoritesCount}
          </span>
        )}
      </button>

      {/* Divider */}
      <div className="shrink-0 w-px h-6 bg-warm-muted/20" />

      {/* Scrollable chip area with fade edges */}
      <div className="relative flex-1 min-w-0">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none transition-opacity duration-200 fade-edge-left"
          style={{ opacity: canScrollLeft ? 1 : 0 }}
          aria-hidden="true"
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none transition-opacity duration-200 fade-edge-right"
          style={{ opacity: canScrollRight ? 1 : 0 }}
          aria-hidden="true"
        />

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-none cursor-grab"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
          onScroll={updateScrollIndicators}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {/* Toggle chip */}
          <button
            onClick={onToggleMode}
            className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border-2 border-dashed border-accent-gold/50 bg-warm-card text-accent-brown hover:border-accent-gold transition-colors"
            aria-label={isLocationMode ? t('filters.byCategory') : t('filters.byLocation')}
          >
            {isLocationMode ? t('filters.byLocation') : t('filters.byCategory')}{' '}↔
          </button>

          {/* All chip */}
          <button
            onClick={() => {
              if (showFavorites) onToggleFavorites()
              onFilterChange('all')
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              showFavorites
                ? 'opacity-50 bg-warm-card text-warm-text border border-warm-muted/20 hover:opacity-100'
                : activeFilterValue === 'all'
                  ? 'bg-accent-brown text-white'
                  : 'bg-warm-card text-warm-text border border-warm-muted/20 hover:border-accent-brown/40'
            }`}
          >
            {t('filters.all')}
          </button>

          {/* Mode-dependent chips */}
          {isLocationMode
            ? dayLocations.map((loc) => {
                const isActive = !showFavorites && selectedLocationId === loc.id
                const count = activeLocationCounts?.[loc.id] || 0
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      if (showFavorites) onToggleFavorites()
                      onLocationChange(loc.id)
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      showFavorites ? 'opacity-50 hover:opacity-100' : ''
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: loc.color, color: '#fff' }
                        : { backgroundColor: loc.color + '26', color: loc.color }
                    }
                  >
                    <LocationPin locationId={loc.id} variant="dot" size={18} />
                    {getLocationText(loc, 'shortName', lang)}
                    {count > 1 && (
                      <span className="opacity-70">({count})</span>
                    )}
                  </button>
                )
              })
            : dayCategories.map((cat) => {
                const catColor = cat.accentColor || categoryColors[cat.id] || '#795548'
                const isActive = !showFavorites && selectedCategoryId === cat.id
                const count = activeCategoryCounts?.[cat.id] || 0
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (showFavorites) onToggleFavorites()
                      onCategoryChange(cat.id)
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      showFavorites ? 'opacity-50 hover:opacity-100' : ''
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: catColor, color: '#fff' }
                        : { backgroundColor: catColor + '26', color: catColor }
                    }
                  >
                    <CategoryIcon category={cat.id} size={18} />
                    {t(`catGroup.${cat.id}`)}
                    {count > 1 && (
                      <span className="opacity-70">({count})</span>
                    )}
                  </button>
                )
              })}
        </div>
      </div>
    </div>
  )
}
