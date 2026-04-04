import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trackFeatureEngaged, trackErrorEncountered } from '../../utils/analytics'

const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=15.9975&longitude=108.2635&current=temperature_2m,weather_code&timezone=Asia/Ho_Chi_Minh&forecast_days=1&models=ecmwf_ifs025'

const weatherDescriptions = {
  0: { vi: 'Trời quang', en: 'Clear sky' },
  1: { vi: 'Ít mây', en: 'Mainly clear' },
  2: { vi: 'Mây rải rác', en: 'Partly cloudy' },
  3: { vi: 'U ám', en: 'Overcast' },
  45: { vi: 'Sương mù', en: 'Fog' },
  48: { vi: 'Sương mù', en: 'Depositing fog' },
  51: { vi: 'Mưa phùn nhẹ', en: 'Light drizzle' },
  53: { vi: 'Mưa phùn', en: 'Moderate drizzle' },
  55: { vi: 'Mưa phùn dày', en: 'Dense drizzle' },
  61: { vi: 'Mưa nhẹ', en: 'Slight rain' },
  63: { vi: 'Mưa vừa', en: 'Moderate rain' },
  65: { vi: 'Mưa to', en: 'Heavy rain' },
  80: { vi: 'Mưa rào nhẹ', en: 'Slight showers' },
  81: { vi: 'Mưa rào', en: 'Moderate showers' },
  82: { vi: 'Mưa rào lớn', en: 'Violent showers' },
  95: { vi: 'Giông', en: 'Thunderstorm' },
}

function getWeatherDesc(code, lang) {
  const key = lang?.startsWith('vi') ? 'vi' : 'en'
  return weatherDescriptions[code]?.[key] || weatherDescriptions[0][key]
}

export default function WeatherWidget() {
  const { t, i18n } = useTranslation()
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    fetch(WEATHER_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
          })
          trackFeatureEngaged({ feature: 'weather_widget', action: 'opened' })
        }
      })
      .catch(() => {
        trackErrorEncountered({ errorType: 'api_failure', context: 'open-meteo' })
      })
  }, [])

  if (!weather) return null

  return (
    <div className="inline-flex items-center gap-1.5 text-sm text-warm-muted">
      <span>{weather.temp}°C</span>
      <span>·</span>
      <span>{getWeatherDesc(weather.code, i18n.language)}</span>
    </div>
  )
}
