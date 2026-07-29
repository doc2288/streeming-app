## 2024-05-15 - Icon-only Button Accessibility
**Learning:** Hardcoded translation strings in title and aria-label attributes break accessibility in non-default languages.
**Action:** Replace hardcoded titles/aria-labels with translation keys using the useI18n() hook, ensuring that missing keys are properly added to the translations object.
