## 2024-05-15 - Icon-only Button Accessibility
**Learning:** Hardcoded translation strings in title and aria-label attributes break accessibility in non-default languages. Furthermore, all components using `t()` keys must have their keys matched exactly to the keys of the translations object in `i18n.tsx`.
**Action:** Replace hardcoded titles/aria-labels with translation keys using the useI18n() hook, ensuring that missing keys are properly added to the translations object.
