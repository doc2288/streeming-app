## 2024-05-12 - Added missing translation keys and aria-labels for copy buttons
**Learning:** Found multiple icon-only buttons (copy server URL, copy stream key, delete stream) lacking `aria-label` and utilizing hardcoded `title` strings instead of i18n values in the `WatchPage.tsx` and `Dashboard.tsx` components.
**Action:** When creating icon-only buttons, always add `aria-label` using translation keys (e.g., `t(copy)`). If translation keys do not exist for standard actions, add them to `i18n.tsx` rather than hardcoding them.
