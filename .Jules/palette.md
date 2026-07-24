## 2024-07-24 - Accessibility labels on icon-only buttons
**Learning:** Icon-only buttons often lack translation integration and screen-reader accessibility labels, relying only on tooltips or hardcoded text.
**Action:** When adding or updating icon-only buttons, consistently provide both `title` and `aria-label` attributes using appropriate localization keys from `i18n.tsx`.
