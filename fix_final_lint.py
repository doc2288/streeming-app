def fix():
    # BrowsePage.tsx
    with open('clients/web/src/components/BrowsePage.tsx', 'r') as f:
        content = f.read()
    content = content.replace("import { useI18n, CATEGORIES, getCategoryKey, type Category } from '../i18n'",
                              "import { useI18n, CATEGORIES, getCategoryKey } from '../i18n'")
    with open('clients/web/src/components/BrowsePage.tsx', 'w') as f:
        f.write(content)

    # Chat.tsx
    with open('clients/web/src/components/Chat.tsx', 'r') as f:
        content = f.read()
    content = content.replace("userId: string | null; userName: string | null; message: string; ts: number",
                              "userId: string | null\n  userName: string | null\n  message: string\n  ts: number")
    with open('clients/web/src/components/Chat.tsx', 'w') as f:
        f.write(content)

    # env.ts
    with open('clients/web/src/config/env.ts', 'r') as f:
        content = f.read()
    content = content.replace("normalizeBaseUrl(configured ?? defaultMediaServerUrl)",
                              "normalizeBaseUrl(configured != null ? String(configured) : defaultMediaServerUrl)")
    with open('clients/web/src/config/env.ts', 'w') as f:
        f.write(content)

    # main.tsx
    with open('clients/web/src/main.tsx', 'w') as f:
        f.write('''import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { I18nProvider } from './i18n'
import { ErrorBoundary } from './components/ErrorBoundary'
import './style.css'

const root = document.getElementById('root')
if (root != null) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <I18nProvider>
          <App />
        </I18nProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
''')

fix()
