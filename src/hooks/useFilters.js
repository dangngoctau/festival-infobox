import { useState, useMemo, useCallback, useEffect } from 'react'
import schedule from '../data/schedule.json'
import { getCurrentDayIndex, isFestivalDay } from '../utils/timeUtils'

export default function useFilters(now = new Date(), initialFilter = null) {
  const defaultDay = isFestivalDay(now) ? getCurrentDayIndex(now) : 0
  const [selectedDay, setSelectedDay] = useState(defaultDay)

  const nowDateStr = now.toISOString().slice(0, 10)
  useEffect(() => {
    setSelectedDay(isFestivalDay(now) ? getCurrentDayIndex(now) : 0)
  }, [nowDateStr])
  const [selectedLocationId, setSelectedLocationId] = useState('all')
  const [filterMode, setFilterMode] = useState(() =>
    initialFilter?.mode === 'category' ? 'category' : 'location'
  )
  const [selectedCategoryId, setSelectedCategoryId] = useState(() =>
    initialFilter?.mode === 'category' ? initialFilter.value : 'all'
  )

  const toggleFilterMode = useCallback(() => {
    setFilterMode((m) => (m === 'location' ? 'category' : 'location'))
    setSelectedLocationId('all')
    setSelectedCategoryId('all')
  }, [])

  const activeLocationCounts = useMemo(() => {
    const counts = {}
    for (const event of schedule) {
      if (event.dayIndex === selectedDay) {
        counts[event.locationId] = (counts[event.locationId] || 0) + 1
      }
    }
    return counts
  }, [selectedDay])

  const activeCategoryCounts = useMemo(() => {
    const counts = {}
    for (const event of schedule) {
      if (event.dayIndex === selectedDay) {
        counts[event.cat] = (counts[event.cat] || 0) + 1
      }
    }
    return counts
  }, [selectedDay])

  const setDay = useCallback((day) => {
    setSelectedDay(day)
    setSelectedLocationId('all')
    setSelectedCategoryId('all')
  }, [])
  const filteredEvents = useMemo(() => {
    return schedule.filter((event) => {
      if (event.dayIndex !== selectedDay) return false
      if (filterMode === 'location') {
        if (selectedLocationId !== 'all' && event.locationId !== selectedLocationId)
          return false
      } else {
        if (selectedCategoryId !== 'all' && event.cat !== selectedCategoryId)
          return false
      }
      return true
    })
  }, [selectedDay, filterMode, selectedLocationId, selectedCategoryId])

  return {
    selectedDay,
    selectedLocationId,
    filterMode,
    selectedCategoryId,
    setDay,
    setLocation: setSelectedLocationId,
    toggleFilterMode,
    setCategory: setSelectedCategoryId,
    filteredEvents,
    activeLocationCounts,
    activeCategoryCounts,
  }
}
