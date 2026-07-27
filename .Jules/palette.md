## 2024-07-27 - Accessible icon-only buttons
**Learning:** Icon-only buttons (like send, close, clear) often lack `aria-label` and `title` attributes, making them inaccessible to screen readers and confusing for users who rely on tooltips. It's crucial to map these to localized strings (e.g. `t('send')`) to maintain accessibility across languages.
**Action:** Always add `aria-label` and `title` to icon-only buttons using localized strings to ensure a baseline level of accessibility.
