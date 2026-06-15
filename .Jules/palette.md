## 2024-06-15 - [Add missing translations and ARIA labels for icon buttons]
**Learning:** Icon-only buttons (`btn-icon`, `chat-react-btn`, `btn-copy`) across Streeming App's core components (Chat, Dashboard, WatchPage) relied heavily on English tooltips (`title`) or had missing screen-reader accessible names, breaking multi-language support (ua, no, en).
**Action:** Always add ARIA labels combined with native `title` tooltips localized through `i18n.tsx` keys for icon buttons.
