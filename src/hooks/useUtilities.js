import { useState, useMemo, useCallback } from 'react'
import utilities from '../data/utilities.json'

export default function useUtilities() {
  const [showWC, setShowWC] = useState(false)
  const [showParking, setShowParking] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const wcPins = useMemo(() => utilities.filter((u) => u.type === 'wc'), [])
  const parkingPins = useMemo(() => utilities.filter((u) => u.type === 'parking'), [])

  const toggleWC = useCallback(() => setShowWC((v) => !v), [])
  const toggleParking = useCallback(() => setShowParking((v) => !v), [])
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return {
    showWC,
    showParking,
    menuOpen,
    wcPins,
    parkingPins,
    toggleWC,
    toggleParking,
    toggleMenu,
    closeMenu,
  }
}
