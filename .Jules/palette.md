## 2026-04-29 - Missing Form Accessibility Linkages
**Learning:** React form inputs without explicit `htmlFor` on labels and `id` on inputs cause screen reader failures. Combining custom validation with native HTML5 validation (like `required`, `minLength`) and a `role="alert"` for error containers creates a more robust, accessible auth flow.
**Action:** When creating forms, always link labels directly to inputs via ID, utilize native HTML validation as a baseline, and announce errors via ARIA alerts.
