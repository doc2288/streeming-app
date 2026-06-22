import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { I18nProvider } from './i18n'
import { ErrorBoundary } from './components/ErrorBoundary'
import './style.css'

ReactDOM.const rootEl = document.getElementById('root');
if (rootEl != null) {
  createRoot(rootEl).render(
    <StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </StrictMode>
  )
}
  <React.StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
