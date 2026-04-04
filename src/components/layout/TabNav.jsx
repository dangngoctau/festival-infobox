import { useTranslation } from 'react-i18next'

export default function TabNav({ activeTab, onTabChange }) {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-warm-card border-t border-warm-muted/10 flex">
      <button
        onClick={() => onTabChange('schedule')}
        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
          activeTab === 'schedule'
            ? 'text-accent-gold border-t-2 border-accent-gold'
            : 'text-warm-muted'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
        </svg>
        {t('tabs.schedule')}
      </button>
      <button
        onClick={() => onTabChange('map')}
        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
          activeTab === 'map'
            ? 'text-accent-gold border-t-2 border-accent-gold'
            : 'text-warm-muted'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        {t('tabs.map')}
      </button>
    </nav>
  )
}
