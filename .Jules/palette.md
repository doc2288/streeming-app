## 2024-05-24 - Localization and Accessibility of Icon Buttons
**Learning:** Icon-only buttons in the web client often lack proper `aria-label` attributes and use hardcoded strings (like "Копіювати" or "Copy") for `title` instead of translation keys, causing both accessibility issues for screen readers and breaking localization for non-Ukrainian users.
**Action:** When creating or updating icon-only buttons, always ensure they use translation keys for BOTH `title` (for visual tooltips) and `aria-label` (for screen readers) to maintain full accessibility and internationalization.
