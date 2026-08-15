## 2024-08-15 - Icon-Only Button Accessibility
**Learning:** Hardcoded titles on icon-only buttons break internationalization, and omitting `aria-label` breaks screen reader accessibility, even if a visual `title` tooltip is present.
**Action:** Always ensure both `title` and `aria-label` attributes are consistently provided using localization keys from `i18n.tsx` for all icon-only interactive elements.
