
## 2024-07-07 - Missing ARIA Labels on Icon-Only Chat Actions
**Learning:** Found a recurring accessibility pattern in this app's `Chat` component where icon-only action buttons (e.g., Emoji picker, Reply, and Send) lacked `aria-label`s, rendering them functionally invisible or confusing to screen reader users. Because these buttons used dynamically bound SVG/icons or raw text symbols without distinct text descriptions, assistive technologies could not deduce their purpose.
**Action:** Always verify icon-only interactive elements contain localized `aria-label` attributes using the `t()` function, explicitly mapping the action intent (e.g., `t('send')`) for screen readers. Ensure translation dictionaries are updated with these explicit intent keys.
