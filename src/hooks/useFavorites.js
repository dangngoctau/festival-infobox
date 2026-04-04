import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'festival-qta-2026-favorites'

export default function useFavorites() {
  const [favorites, setFavorites] = useState(new Set())
  const [loaded, setLoaded] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setFavorites(new Set(parsed))
        }
      }
    } catch {
      // corrupt data → empty set, no crash
    }
    setLoaded(true)
  }, [])

  const toggleFavorite = useCallback((eventId) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(eventId)) {
        next.delete(eventId)
      } else {
        next.add(eventId)
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {
        // storage full or unavailable → silent fail
      }
      return next
    })
  }, [])

  const isFavorite = useCallback((eventId) => favorites.has(eventId), [favorites])

  return { favorites, loaded, toggleFavorite, isFavorite }
}
