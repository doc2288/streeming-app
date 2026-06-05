
## 2026-06-05 - Add ARIA labels and localization to icon buttons
**Learning:** Hardcoded text and missing `aria-label` attributes on icon-only buttons cause accessibility failures. Using strongly typed translation keys in `i18n.tsx` enforces completeness.
**Action:** Always add `aria-label` matched to localized `t()` strings for icon-only buttons, and verify new translation keys exist in `i18n.tsx` before referencing them in UI components.
