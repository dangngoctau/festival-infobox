import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trackFeatureEngaged } from '../../utils/analytics'

const BASE = import.meta.env.BASE_URL

export default function QRCode() {
  const { t } = useTranslation()

  useEffect(() => {
    trackFeatureEngaged({ feature: 'qr_code', action: 'opened' })
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={`${BASE}images/qr-code.png`}
        alt={t('qr.alt')}
        width={120}
        height={120}
        className="rounded"
      />
      <p className="text-xs text-warm-muted">{t('qr.scanToAccess')}</p>
    </div>
  )
}
