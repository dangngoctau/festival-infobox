import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const BASE = import.meta.env.BASE_URL

export default function FooterCTA({ onEnterSchedule }) {
  const { t } = useTranslation()
  const [imgError, setImgError] = useState(false)

  return (
    <section className="relative overflow-hidden py-12 tablet:py-16 px-5">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, var(--color-cream) 0%, var(--color-night-warm) 100%)',
        }}
      />

      {/* Background texture image */}
      {!imgError && (
        <img
          src={`${BASE}images/landing/rong-vang-bg-1200.jpg`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-[0.10]"
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-lg desktop:max-w-4xl mx-auto text-center">
        <p className="text-xl font-bold text-amber-100 mb-6">
          {t('landing.footerCTAText')}
        </p>
        <button
          onClick={() => onEnterSchedule(null)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-amber-500/20"
        >
          {t('landing.footerCTAButton')}
        </button>
      </div>
    </section>
  )
}
