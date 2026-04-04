import { useTranslation } from 'react-i18next'
import { getEventText } from '../../utils/i18nEvent'

export default function CategoryCard({ categoryId, icon, featuredEvents, eventCount, onTap }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return (
    <button
      onClick={() => onTap({ mode: 'category', value: categoryId })}
      className="w-full text-left bg-warm-card rounded-xl p-4 border border-accent-gold/15 hover:border-accent-gold/40 transition-colors shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5" aria-hidden="true">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-accent-brown text-lg leading-snug">
            {t(`catGroup.${categoryId}`)}
          </h3>
          <p className="text-warm-muted text-sm mt-0.5">
            {t('landing.eventCount', { count: eventCount })}
          </p>

          {featuredEvents.length > 0 && (
            <ul className="mt-2 space-y-1">
              {featuredEvents.map((evt) => (
                <li key={evt.id} className="text-sm text-warm-text truncate">
                  <span className="text-accent-gold font-medium">
                    {t(`dayLabels.${evt.dayIndex}`)}
                  </span>
                  {' · '}
                  {getEventText(evt, 'title', lang)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="text-warm-muted/50 text-lg mt-1" aria-hidden="true">›</span>
      </div>
    </button>
  )
}
