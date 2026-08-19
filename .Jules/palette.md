## 2024-03-20 - Add missing aria-labels to icon-only buttons
**Learning:** Many icon-only buttons across the app (like delete actions and modal close buttons) lacked `aria-label`s, making them inaccessible to screen readers, and some tooltips were hardcoded instead of using `t()`.
**Action:** Always ensure icon-only buttons have both an `aria-label` (for screen readers) and a `title` (for visual tooltips), and consistently use the `i18n.tsx` localization keys for both attributes.
