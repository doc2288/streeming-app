## 2024-08-20 - [Aria labels & i18n for icon buttons]
**Learning:** Icon-only buttons lacking `aria-label` attributes cause accessibility issues for screen readers. In addition, hardcoded titles in tooltips fail to adapt to user language settings, reducing usability for international users.
**Action:** Always provide localized `aria-label` and `title` attributes on icon-only buttons using `i18n.tsx` keys (e.g., `t('copyToClipboard')`), avoiding hardcoded strings.
