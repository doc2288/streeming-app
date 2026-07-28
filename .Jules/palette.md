## 2024-05-18 - Missing ARIA labels and i18n titles on icon-only buttons
**Learning:** Icon-only buttons frequently omit `aria-label` or rely on hardcoded English strings for `title`, which breaks both screen readers and localization.
**Action:** Always apply both `title` and `aria-label` using `useI18n` translations for icon-only buttons to ensure accessibility and internationalization.
