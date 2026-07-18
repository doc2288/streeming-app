## 2024-07-18 - Added `aria-label` to icon-only buttons
**Learning:** Icon-only actions without `aria-label`s were found in Dashboard and WatchPage components, making them inaccessible to screen readers. We need to be careful with ternary logic on UI conditional rendering. In this app, many icon-only buttons (copy, hide/show, delete, back) lacked both a tooltip (`title`) and screen reader announcement text (`aria-label`).
**Action:** Always add `aria-label` to buttons without visible text. Also ensure they correspond to localized `t(...)` translations if present.
