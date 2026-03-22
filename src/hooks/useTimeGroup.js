import { useState, useEffect, useMemo } from 'react'
import { getEffectiveEndTime } from '../utils/timeUtils'

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function getNowMinutes(now) {
  return now.getHours() * 60 + now.getMinutes()
}

export default function useTimeGroup(filteredEvents, simulatedTime = null) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (simulatedTime) return
    const id = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(id)
  }, [simulatedTime])

  return useMemo(() => {
    const now = simulatedTime || new Date()
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
  }, [filteredEvents, tick, simulatedTime])
}
