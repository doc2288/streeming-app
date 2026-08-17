## 2024-08-17 - Icon-only Button Accessibility & Localization
**Learning:** Icon-only buttons often rely on visual tooltips (`title`) which are inaccessible to screen readers and are sometimes hardcoded, breaking internationalization and assistive tech.
**Action:** Always provide both `title` (for visual users) and `aria-label` (for screen readers) using strongly-typed translation keys from `i18n.tsx` to ensure a fully accessible, multi-lingual experience.
