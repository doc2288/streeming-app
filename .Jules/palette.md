## 2024-05-24 - Accessible Labels for Icon-Only Buttons
**Learning:** `title` attributes on icon-only buttons aren't always reliably announced by screen readers, particularly in multi-language contexts if not paired clearly. Many icon-only action buttons (like copy, delete, back) relied solely on `title` or hardcoded un-localized strings.
**Action:** Always pair `aria-label` with `title` using shared translation keys (e.g., `t('copy')`) on icon-only interactive elements to ensure consistent screen reader support and full i18n coverage.
