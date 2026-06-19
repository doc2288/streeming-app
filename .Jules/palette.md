## 2023-10-27 - Icon-only Button Accessibility
**Learning:** Icon-only buttons across complex interactive components like Chat and WatchPage often rely on hardcoded `title` attributes or lack accessible names entirely, leading to poor screen reader experiences.
**Action:** Always provide explicit `aria-label`s on icon-only buttons. Use dedicated translation keys (e.g., `t('send')`, `t('copy')`) rather than hardcoding strings or reusing placeholder text to ensure internationalized screen reader support.
