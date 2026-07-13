## 2024-07-13 - [Accessibility] Localize tooltips and add ARIA labels to WatchPage buttons
**Learning:** Found hardcoded titles and missing ARIA labels on icon-only buttons in `WatchPage.tsx`. When implementing icon-only buttons, it is essential to include localized ARIA labels alongside localized tooltips to maintain cross-language accessibility for screen reader users.
**Action:** Added `aria-label={t('...')}` and replaced hardcoded strings with translation keys to icon-only buttons. Ensure both `title` and `aria-label` attributes use localized strings for future icon buttons.
