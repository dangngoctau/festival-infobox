import { useState, useCallback } from 'react'

export default function useGPS() {
  const [position, setPosition] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setAccuracy(pos.coords.accuracy)
        setLoading(false)
        setError(null)

        // Announce to screen reader
        const el = document.getElementById('gps-status')
        if (el) el.textContent = 'Đã tìm thấy vị trí'
      },
      (err) => {
        setLoading(false)
        setError(err.message || 'Không tìm được vị trí')

        const el = document.getElementById('gps-status')
        if (el) el.textContent = 'Không tìm được vị trí'
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000,
      }
    )
  }, [])

  return { position, accuracy, loading, error, requestLocation }
}
