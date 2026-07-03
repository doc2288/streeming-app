## 2024-07-03 - [Consistent i18n accessibility for icon buttons]
**Learning:** In the web client, icon-only buttons frequently lack `aria-label`s and use hardcoded English tooltips (e.g., `title="Copy"` or `title="Reply"`). This breaks both accessibility and internationalization.
**Action:** When adding or updating icon-only buttons, always use `t('key')` from `i18n.tsx` for both `title` and `aria-label` to provide localized tooltips and screen reader announcements simultaneously.
