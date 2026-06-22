import re

def fix_file(filepath, replacements):
    with open(filepath, "r") as f:
        content = f.read()
    for search, replace in replacements:
        content = content.replace(search, replace)
    with open(filepath, "w") as f:
        f.write(content)

fix_file("clients/web/src/App.tsx", [
    ("import { useState, useRef, useEffect, useCallback } from 'react'", "import { useState, useRef, useEffect, useCallback } from 'react'\nimport { setAuthToken, setRefreshToken } from './api'"),
    ("interface UserInfo { id: string; email: string; role: string }", "interface UserInfo { id: string, email: string, role: string }"),
    ("setLang(storedLang as 'ua' | 'en' | 'no')", "setLang((storedLang as 'ua' | 'en' | 'no') ?? 'ua'")
])

fix_file("clients/web/src/api.ts", [
    ("if (err.response?.data?.error === 'Refresh token expired' || err.response?.data?.error === 'Invalid refresh token') {", "if (err.response?.data?.error === 'Refresh token expired' || err.response?.data?.error === 'Invalid refresh token') {")
])

fix_file("clients/web/src/components/WatchPage.tsx", [
    ("&& stream.settings?.mature_content === true", "&& stream.settings?.mature_content === true")
])

fix_file("clients/web/src/main.tsx", [
    ("const rootEl = document.getElementById('root')\nif (rootEl != null) {\n  createRoot(rootEl).render(\n    <StrictMode>\n      <I18nProvider>\n        <App />\n      </I18nProvider>\n    </StrictMode>,\n  )\n}", "const rootEl = document.getElementById('root');\nif (rootEl != null) {\n  createRoot(rootEl).render(\n    <StrictMode>\n      <I18nProvider>\n        <App />\n      </I18nProvider>\n    </StrictMode>\n  )\n}")
])

print("Replacements done")
