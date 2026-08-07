## 2024-05-24 - Missing Aria Labels on Icon Buttons
**Learning:** Across the web client, many icon-only buttons lack `aria-label` or `title` attributes (or rely on hardcoded strings instead of i18n), harming screen reader accessibility and discoverability.
**Action:** When adding or reviewing icon buttons, ensure both an `aria-label` (for screen readers) and a `title` (for visual tooltips) are consistently provided using localization keys from `i18n.tsx`.
