## 2024-05-25 - Icon-Only Button Accessibility and i18n
**Learning:** Found an accessibility issue pattern where icon-only buttons in `WatchPage` were missing `aria-label` attributes and had hardcoded Ukrainian titles (e.g., `Копіювати`, `Видалити стрім`), bypassing the localization system.
**Action:** Ensure all icon-only buttons have localized `aria-label`s for screen readers and `title`s for tooltips using existing `i18n.tsx` translations. Add new translation keys for actions that are missing them.
