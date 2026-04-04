import { useState, useEffect, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { getDirectionsUrl } from '../../utils/deepLink'
import { PracticalIcon } from '../icons'
import festivalConfig from '../../data/festivalConfig'
import useBreakpoint from '../../hooks/useBreakpoint'
import QRCode from '../layout/QRCode'

const BASE = import.meta.env.BASE_URL

const RAIN_CODES = new Set([51, 53, 55, 61, 63, 65, 67, 80, 81, 82, 95])

function classifyWeather(weatherCode, temp) {
  if (RAIN_CODES.has(weatherCode)) return 'rain'
  if (temp >= 30) return 'hot'
  return 'mild'
}

function useWeatherTip(now) {
  const { t } = useTranslation()
  const [result, setResult] = useState({ text: null, condition: 'static' })

  useEffect(() => {
    const { startDate, endDate, dates, mapCenter } = festivalConfig
    const start = new Date(startDate + 'T00:00:00+07:00')
    const end = new Date(endDate + 'T23:59:59+07:00')
    const isDuring = now >= start && now <= end
    const daysBefore = Math.ceil((start - now) / (1000 * 60 * 60 * 24))
    const isForecastAvailable = !isDuring && daysBefore > 0 && daysBefore <= 16

    if (!isDuring && !isForecastAvailable) {
      setResult({ text: t('landing.tipWeatherStatic'), condition: 'static' })
      return
    }

    const context = t(isDuring ? 'landing.weatherContextCurrent' : 'landing.weatherContextForecast')
    let url

    if (isDuring) {
      url = `https://api.open-meteo.com/v1/forecast?latitude=${mapCenter.lat}&longitude=${mapCenter.lng}&current=temperature_2m,weather_code&timezone=Asia/Ho_Chi_Minh&forecast_days=1&models=ecmwf_ifs025`
    } else {
      const forecastEnd = dates[2] // Day 3 — main day
      url = `https://api.open-meteo.com/v1/forecast?latitude=${mapCenter.lat}&longitude=${mapCenter.lng}&daily=temperature_2m_max,weather_code&timezone=Asia/Ho_Chi_Minh&start_date=${startDate}&end_date=${forecastEnd}&models=ecmwf_ifs025`
    }

    let cancelled = false
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return

        let condition, maxTemp

        if (isDuring && data.current) {
          maxTemp = Math.round(data.current.temperature_2m)
          condition = classifyWeather(data.current.weather_code, maxTemp)
        } else if (data.daily) {
          const temps = data.daily.temperature_2m_max
          const codes = data.daily.weather_code
          maxTemp = Math.round(Math.max(...temps))
          const hasRain = codes.some((c) => RAIN_CODES.has(c))
          condition = hasRain ? 'rain' : maxTemp >= 30 ? 'hot' : 'mild'
        } else {
          setResult({ text: t('landing.tipWeatherStatic'), condition: 'static' })
          return
        }

        const key =
          condition === 'rain'
            ? 'landing.tipWeatherRain'
            : condition === 'hot'
              ? 'landing.tipWeatherHot'
              : 'landing.tipWeatherMild'

        setResult({ text: t(key, { context, temp: maxTemp }), condition })
      })
      .catch(() => {
        if (!cancelled) setResult({ text: t('landing.tipWeatherStatic'), condition: 'static' })
      })

    return () => { cancelled = true }
  }, [now, t])

  return result
}

const WEATHER_BG = {
  rain: 'bg-[#E8F0FE] text-[#2E5A88]',
  hot: 'bg-[#FFF8E8] text-[#8B6914]',
  mild: 'bg-[#F0F7F0] text-[#4A6741]',
  static: 'bg-[#FFF8E8] text-[#8B6914]',
}

function VenueThumb() {
  const [failed, setFailed] = useState(false)
  if (failed) return null

  return (
    <img
      src={`${BASE}images/landing/venue-thumb-112.webp`}
      alt=""
      loading="lazy"
      width={56}
      height={56}
      className="flex-shrink-0 rounded-[10px] object-cover"
      style={{
        objectPosition: 'center 25%',
        border: '1.5px solid rgba(212,184,150,0.3)',
      }}
      onError={() => setFailed(true)}
    />
  )
}

function AccordionItem({ icon, title, isOpen, onToggle, children }) {
  const id = useId()
  const headerId = `${id}-header`
  const panelId = `${id}-panel`

  return (
    <div className="bg-cream-light rounded-xl shadow-bronze overflow-hidden">
      <button
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex items-center gap-3 w-full p-4 text-left cursor-pointer"
      >
        <div className="flex-shrink-0">{icon}</div>
        <h3 className="font-bold text-accent-brown text-base flex-1">{title}</h3>
        <svg
          className={`w-5 h-5 text-warm-muted transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="grid transition-[grid-template-rows] duration-200"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, title, children }) {
  return (
    <div className="bg-cream-light rounded-xl shadow-bronze overflow-hidden">
      <div className="flex items-center gap-3 p-4 pb-2">
        <div className="flex-shrink-0">{icon}</div>
        <h3 className="font-bold text-accent-brown text-base">{title}</h3>
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  )
}

function TransportMode({ title, info }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-sm font-semibold text-warm-text mb-0.5">{title}</p>
      <p className="text-sm text-warm-muted leading-relaxed">{info}</p>
    </div>
  )
}

function VenuePhotoCard({ directionsUrl, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null

  return (
    <a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden shadow-bronze group flex-1"
    >
      <div className="relative h-full">
        <img
          src={`${BASE}images/landing/chua-bg-1200.jpg`}
          alt={alt}
          loading="lazy"
          className="w-full h-full min-h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
          style={{ objectPosition: 'center 30%' }}
          onError={() => setFailed(true)}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
          <p className="text-white text-sm font-medium">{alt}</p>
        </div>
      </div>
    </a>
  )
}


function QRSidebarCard({ title }) {
  return (
    <div className="bg-cream-light rounded-xl shadow-bronze p-4 flex flex-col items-center">
      <p className="text-sm font-semibold text-accent-brown mb-3">{title}</p>
      <QRCode />
    </div>
  )
}

export default function PracticalInfo({ now }) {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useBreakpoint()
  const { gateCoords } = festivalConfig
  const directionsUrl = getDirectionsUrl(gateCoords.lat, gateCoords.lng)
  const { text: weatherText, condition: weatherCondition } = useWeatherTip(now)
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  const whenWhereContent = (
    <>
      <p className="text-sm font-semibold text-warm-text">{t('landing.dates')}</p>
      <p className="text-sm text-warm-muted mb-3">
        {t('landing.lunarDates')} · {t('landing.duration')}
      </p>
      <div className="flex gap-3 items-start">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-warm-text">{t('landing.venueName')}</p>
          <p className="text-sm text-warm-muted">{t('landing.venueDistrict')}</p>
          <p className="text-sm text-warm-muted">{t('landing.entryPoint')}</p>
        </div>
        {/* Hide thumb on desktop — sidebar has large venue photo */}
        <div className="desktop:hidden">
          <VenueThumb />
        </div>
      </div>
      {/* Hide directions link on desktop — sidebar map has it */}
      <div className="desktop:hidden">
        <div className="mb-2" />
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent-gold font-medium hover:underline"
        >
          {t('landing.gateDirectionsLink')}
        </a>
      </div>
    </>
  )

  const gettingThereContent = (
    <>
      <TransportMode title={t('landing.transportMotorbike')} info={t('landing.transportMotorbikeInfo')} />
      <TransportMode title={t('landing.transportBus')} info={t('landing.transportBusInfo')} />
      <TransportMode title={t('landing.transportGrab')} info={t('landing.transportGrabInfo')} />
    </>
  )

  const tipsContent = (
    <>
      <ul className="space-y-1.5 mb-3">
        <li className="text-sm text-warm-muted leading-relaxed">· {t('landing.tipClothing')}</li>
        <li className="text-sm text-warm-muted leading-relaxed">· {t('landing.tipFood')}</li>
      </ul>
      <div className={`text-sm rounded-lg px-3 py-2 leading-relaxed ${WEATHER_BG[weatherCondition]}`}>
        {weatherText || t('landing.tipWeatherStatic')}
      </div>
    </>
  )

  const sections = [
    { key: 'when', icon: 'calendar', title: t('landing.whenWhereTitle'), content: whenWhereContent },
    { key: 'how', icon: 'transport', title: t('landing.gettingThereTitle'), content: gettingThereContent },
    { key: 'tips', icon: 'info', title: t('landing.tipsTitle'), content: tipsContent },
  ]

  return (
    <section className="bg-cream px-5 py-10 tablet:py-14">
      <div className="max-w-lg tablet:max-w-2xl desktop:max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-accent-brown mb-6 text-center">
          {t('landing.beforeYouGoTitle')}
        </h2>

        <div className={isDesktop ? 'grid grid-cols-[1fr_280px] gap-6' : ''}>
          {/* Content cards */}
          <div className="flex flex-col gap-3">
            {isMobile
              ? sections.map((s, i) => (
                  <AccordionItem
                    key={s.key}
                    icon={<PracticalIcon icon={s.icon} size={24} className="text-bronze" />}
                    title={s.title}
                    isOpen={openIndex === i}
                    onToggle={() => toggle(i)}
                  >
                    {s.content}
                  </AccordionItem>
                ))
              : sections.map((s) => (
                  <InfoCard
                    key={s.key}
                    icon={<PracticalIcon icon={s.icon} size={24} className="text-bronze" />}
                    title={s.title}
                  >
                    {s.content}
                  </InfoCard>
                ))}
          </div>

          {/* Sidebar — desktop only */}
          {isDesktop && (
            <aside className="flex flex-col gap-4">
              <VenuePhotoCard
                directionsUrl={directionsUrl}
                alt={t('landing.sidebarVenueAlt')}
              />
              <QRSidebarCard title={t('landing.sidebarShareTitle')} />
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
