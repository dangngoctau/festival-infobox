import { useState, useMemo } from 'react'
import schedule from '../data/schedule.json'
import { getCurrentDayIndex, isFestivalDay } from '../utils/timeUtils'

export default function useFilters(now = new Date()) {
  const defaultDay = isFestivalDay(now) ? getCurrentDayIndex(now) : 0
  const [selectedDay, setSelectedDay] = useState(defaultDay)
  const [selectedLocationId, setSelectedLocationId] = useState('all')

  const filteredEvents = useMemo(() => {
    return schedule.filter((event) => {
      if (event.dayIndex !== selectedDay) return false
      if (selectedLocationId !== 'all' && event.locationId !== selectedLocationId)
        return false
      return true
    })
  }, [selectedDay, selectedLocationId])

  return {
    selectedDay,
    selectedLocationId,
    setDay: setSelectedDay,
    setLocation: setSelectedLocationId,
    filteredEvents,
  }
}
