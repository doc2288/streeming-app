## 2024-06-04 - Hardcoded tooltips in WatchPage and Chat
**Learning:** Several icon-only buttons (`copy`, `emoji`, `reply`, `delete`) have hardcoded `title` attributes (e.g. `title="Копіювати"`, `title="Emoji"`) instead of using the i18n system or lack translation keys entirely, causing inconsistent localization and screen-reader announcements.
**Action:** When adding or fixing accessibility labels for icon-only buttons, ensure the corresponding translation keys exist in `i18n.tsx` and use them for `title` and/or `aria-label` attributes to maintain consistent i18n.
