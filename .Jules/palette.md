## 2024-08-05 - Add localized tooltips and ARIA labels to icon-only buttons
**Learning:** Found several icon-only buttons (like copy, delete, and settings) using either hardcoded strings or lacking ARIA labels, creating accessibility issues for screen readers.
**Action:** When implementing icon-only buttons, consistently use localized keys from `i18n.tsx` for both `title` (visual tooltip) and `aria-label` (screen reader context) to ensure inclusive and internationalized accessibility.
