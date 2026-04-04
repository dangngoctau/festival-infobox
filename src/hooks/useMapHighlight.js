import { useState, useCallback } from 'react'

export default function useMapHighlight() {
  const [highlightedPinId, setHighlightedPinId] = useState(null)

  const highlightFromMap = useCallback((pinId) => {
    setHighlightedPinId(pinId)
  }, [])

  const highlightFromList = useCallback((pinId) => {
    setHighlightedPinId(pinId)
  }, [])

  const clearHighlight = useCallback(() => {
    setHighlightedPinId(null)
  }, [])

  return { highlightedPinId, highlightFromMap, highlightFromList, clearHighlight }
}
