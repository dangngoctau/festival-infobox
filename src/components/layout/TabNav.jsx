import { useTranslation } from 'react-i18next'

export default function TabNav({ activeTab, onTabChange }) {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-warm-card border-t border-warm-muted/20 flex">
      <button
        onClick={() => onTabChange('schedule')}
        className={`flex-1 py-3 text-sm font-medium transition-colors ${
          activeTab === 'schedule'
            ? 'text-accent-gold border-t-2 border-accent-gold'
            : 'text-warm-muted'
        }`}
      >
        {t('tabs.schedule')}
      </button>
      <button
        onClick={() => onTabChange('map')}
        className={`flex-1 py-3 text-sm font-medium transition-colors ${
          activeTab === 'map'
            ? 'text-accent-gold border-t-2 border-accent-gold'
            : 'text-warm-muted'
        }`}
      >
        {t('tabs.map')}
      </button>
    </nav>
  )
}
