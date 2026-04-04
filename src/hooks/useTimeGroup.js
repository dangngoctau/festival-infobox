import { useState, useEffect, useMemo } from 'react'
import { getEffectiveEndTime } from '../utils/timeUtils'

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function getNowMinutes(now) {
  return now.getHours() * 60 + now.getMinutes()
}

export default function useTimeGroup(filteredEvents, timeOffset = 0) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000)

    const refresh = () => setTick((t) => t + 1)

    const handleVisibility = () => {
      if (!document.hidden) refresh()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', refresh)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  return useMemo(() => {
    const now = new Date(Date.now() + timeOffset)
    const nowDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const nowMinutes = getNowMinutes(now)

    const ongoing = []
    const upcoming = []
    const ended = []

    for (const event of filteredEvents) {
      const eventDate = event.date
      const startMin = timeToMinutes(event.startTime)
      const endMin = timeToMinutes(getEffectiveEndTime(event))

      if (nowDate < eventDate) {
        upcoming.push(event)
      } else if (nowDate > eventDate) {
        ended.push(event)
      } else {
        if (nowMinutes < startMin) {
          upcoming.push(event)
        } else if (nowMinutes >= startMin && nowMinutes < endMin) {
          ongoing.push(event)
        } else {
          ended.push(event)
        }
      }
    }

    return { ongoing, upcoming, ended }
  }, [filteredEvents, tick, timeOffset])
}
