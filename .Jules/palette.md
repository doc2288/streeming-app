## 2026-03-16 - Added accessibility attributes to generic icon buttons

**Learning:** When using purely icon-based buttons for critical user interactions like "Copy", "Delete", or dropdown toggles (e.g. "Quality picker"), screen readers require explicit `aria-label` attributes to interpret their purpose. Similarly, interactive dropdowns must indicate their state using `aria-expanded` and `aria-haspopup`. Relying on visual metaphors like SVGs or contextual positioning leaves visually impaired users without context.

**Action:** Always verify icon-only buttons have localized `aria-label` attributes and use appropriate ARIA state attributes (like `aria-expanded`) for interactive UI elements that reveal or hide content.
