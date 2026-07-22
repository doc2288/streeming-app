## 2024-05-18 - Localized Accessible Icon Buttons
**Learning:** Hardcoded titles and strings in icon-only buttons cause accessibility and internationalization bugs, making screen readers fail for non-English/Ukrainian users.
**Action:** Always provide localized `aria-label` and `title` attributes using translation keys for icon-only buttons.
