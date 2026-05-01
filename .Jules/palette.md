## 2026-05-01 - Add aria-label to icon-only close buttons
**Learning:** Icon-only close buttons (like the ones in modals and toats) often lack `aria-label` attributes, which makes them inaccessible to screen readers as their purpose is only indicated visually via an SVG icon.
**Action:** Add `aria-label="Close"` to all icon-only close buttons across components (e.g., AuthModal, Dashboard, etc.) to improve accessibility.
