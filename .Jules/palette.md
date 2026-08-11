## 2024-05-17 - Missing title attributes and aria-labels for icon-only buttons
**Learning:** Found an accessibility issue where the "copy to clipboard" button and "delete stream" button in `WatchPage.tsx` lack `aria-label` or uses hardcoded string for `title` instead of using the translation utility `t()`. Some icon-only buttons like "Delete stream" use `title="Видалити стрім"`, missing translation.
**Action:** Replace hardcoded `title` attributes with localized keys in `WatchPage.tsx`. Add missing localized `aria-label` and `title` to copy buttons.
