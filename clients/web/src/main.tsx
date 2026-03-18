import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { I18nProvider } from './i18n'
import { ErrorBoundary } from './components/ErrorBoundary'
import './style.css'

const rootEl = document.getElementById('root')
if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ErrorBoundary>
  </React.StrictMode>
  )
}
