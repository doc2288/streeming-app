## 2024-08-04 - Localized ARIA labels and tooltips for icon-only buttons
**Learning:** When adding ARIA labels or titles to icon-only buttons, it is crucial to use localized strings from `i18n.tsx` instead of hardcoded strings to ensure full internationalization and accessibility support.
**Action:** Always verify that both `title` and `aria-label` are present and use the `t()` function for translation keys on icon-only buttons.
