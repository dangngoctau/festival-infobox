import { useTranslation } from 'react-i18next'
import festivalConfig from '../../data/festivalConfig'
import WeatherWidget from './WeatherWidget'

export default function Header() {
  const { t } = useTranslation()

  return (
    <header className="relative overflow-hidden rounded-xl mb-4">
      <div className="bg-gradient-to-br from-accent-brown via-accent-gold to-accent-brown/80 px-4 py-6 tablet:py-8">
        <div className="relative z-10">
          <h1 className="text-2xl tablet:text-3xl font-bold text-white mb-1">
            {festivalConfig.festivalName}
          </h1>
          <p className="text-white/90 font-medium text-lg">
            {festivalConfig.location}
          </p>
          <p className="text-white/80 text-sm mt-2">
            {t('header.tagline')}
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <p className="text-white/90 font-medium">
              {t('header.dates')}
            </p>
            <div className="text-white/80">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
