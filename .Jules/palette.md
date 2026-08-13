## 2024-05-15 - Localized Accessible Icon Buttons
**Learning:** In this application, icon-only buttons frequently use localized `title` attributes for tooltips but miss `aria-label` attributes for screen readers, or use hardcoded strings. Both attributes should consistently use translation keys from `i18n.tsx` to ensure full accessibility and internationalization.
**Action:** Always provide both `title` and `aria-label` using `t('key')` for any icon-only button to ensure it is accessible to all users across all supported languages.
