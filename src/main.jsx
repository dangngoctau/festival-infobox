import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './i18n/i18n'
import './index.css'
import App from './App.jsx'

// Patch DOM methods to prevent React crash when Google Translate
// mutates the DOM by wrapping text nodes in <font> elements.
// See: https://github.com/facebook/react/issues/11538
if (typeof Node !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child)
      }
      return child
    }
    try {
      return originalRemoveChild.call(this, child)
    } catch {
      return child
    }
  }

  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      return originalInsertBefore.call(this, newNode, null)
    }
    try {
      return originalInsertBefore.call(this, newNode, referenceNode)
    } catch {
      return originalInsertBefore.call(this, newNode, null)
    }
  }
}

Sentry.init({
  dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
  enabled: import.meta.env.PROD,
  tracesSampleRate: 0.2,
  environment: import.meta.env.MODE,
  ignoreErrors: [
    /zaloJSV2/,
    /NotFoundError.*The object can not be found here/,
    /Java object is gone/,
    /isReCreate/,
    /querySelector.*addEventListener/,
    /Unexpected identifier/,
    /webkit\.messageHandlers/,
  ],
})

function ErrorFallback() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F0', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        <p style={{ color: '#3E2723', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Ứng dụng gặp lỗi
        </p>
        <p style={{ color: '#795548', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Vui lòng tải lại trang để tiếp tục.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{ background: '#C8A35A', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Tải lại
        </button>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
