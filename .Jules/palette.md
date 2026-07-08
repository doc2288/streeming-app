## 2026-07-08 - Adding Accessible Labels for Icon Buttons
**Learning:** Icon-only buttons lacking localized `aria-label` and `title` tags are inaccessible and difficult for screen reader users or users hovering with a mouse to understand.
**Action:** Always provide localized `title` (for visual tooltips) and `aria-label` (for screen readers) attributes for all icon-only buttons using keys from `i18n.tsx`.
