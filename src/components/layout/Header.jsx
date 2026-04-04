import { useTranslation } from 'react-i18next'
import ShareButton from './ShareButton'

export default function Header({ onBack, activeTab, onToggleDebug, onToggleLanguage, selectedDay, dayEvents }) {
  const { t } = useTranslation()

  const title = activeTab === 'map' ? t('tabs.map') : t('tabs.schedule')

  return (
    <header className={`h-14 bg-warm-bg flex items-center gap-3 px-4 border-b border-warm-muted/10 ${activeTab === 'map' ? 'mb-0' : 'mb-3'}`}>
      {onBack && (
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-warm-card transition-colors -ml-1"
          aria-label={t('landing.back')}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-warm-text">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <h1 className="text-lg font-semibold text-warm-text">{title}</h1>

      <div className="flex-1" />

      {activeTab !== 'map' && (
        <ShareButton source="schedule_header" selectedDay={selectedDay} dayEvents={dayEvents} />
      )}

      <button
        onClick={onToggleLanguage}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-warm-card transition-colors text-warm-muted"
        aria-label={t('aria.toggleLanguage')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </button>

      {onToggleDebug && (
        <button
          onClick={onToggleDebug}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-warm-card transition-colors text-warm-muted"
          aria-label={t('aria.toggleSettings')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      )}
    </header>
  )
}
