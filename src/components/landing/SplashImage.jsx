import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import festivalConfig from '../../data/festivalConfig'
import SplashSVG from './SplashSVG'

export default function SplashImage({ className = '' }) {
  const { t } = useTranslation()
  const [photoFailed, setPhotoFailed] = useState(false)
  const usePhoto = festivalConfig.splashMode === 'photo' && !photoFailed

  if (!usePhoto) {
    return <SplashSVG className={className} />
  }

  return (
    <img
      src={festivalConfig.splashPhoto}
      srcSet={`${festivalConfig.splashPhoto.replace('.jpg', '-640w.jpg')} 640w, ${festivalConfig.splashPhoto.replace('.jpg', '-1200w.jpg')} 1200w`}
      sizes="100vw"
      alt={t('splash.alt')}
      className={`w-full h-full object-cover ${className}`}
      onError={() => setPhotoFailed(true)}
    />
  )
}
