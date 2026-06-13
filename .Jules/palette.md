## 2024-06-13 - Accessibility & i18n for Icon-Only Buttons
**Learning:** Icon-only copy buttons were found with hardcoded `title` strings and missing `aria-label`s.
**Action:** Always ensure both `title` and `aria-label` use translated strings from `i18n.tsx` for these elements to improve accessibility and consistent internationalization.
