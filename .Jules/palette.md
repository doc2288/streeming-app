## 2024-06-21 - [Aria labels for icon buttons]
**Learning:** Icon-only buttons or close/clear buttons with non-text characters (like `×`) cause accessibility issues for screen readers without `aria-label`. Ensure these are explicitly labelled with translation keys to support a11y and i18n seamlessly.
**Action:** Always verify if `aria-label` exists on buttons lacking descriptive text. Use `t('key')` from `i18n.tsx`.
