## 2024-08-03 - Localized ARIA labels for icon-only buttons
**Learning:** Icon-only buttons across the app (like "Copy", "Delete") had hardcoded titles in different languages and were missing `aria-label`s, creating a broken experience for both international users and screen readers.
**Action:** Always ensure icon-only buttons have consistently localized `title` and `aria-label` attributes using the shared `i18n` dictionary.
