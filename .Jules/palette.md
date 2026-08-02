## 2024-05-24 - Accessibility for Icon-Only Buttons
**Learning:** Icon-only buttons (like 'copy' buttons in dashboard and watch page) often lack screen reader support and rely on hardcoded tooltips. In this app, relying on the `i18n` dictionary for both `title` and `aria-label` ensures consistent accessibility and internationalization for these elements.
**Action:** Always provide both `title` (for visual tooltips) and `aria-label` (for screen readers) mapped to localization keys from `i18n.tsx` for icon-only buttons instead of hardcoding strings.
