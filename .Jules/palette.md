## 2024-08-06 - Accessible Icon Buttons
**Learning:** Hardcoded string `title` attributes on icon-only buttons create accessibility gaps and break localization.
**Action:** Always provide both `title` and `aria-label` attributes using localized `t('key')` strings for icon-only buttons to ensure they are accessible to screen readers and consistently translated.
