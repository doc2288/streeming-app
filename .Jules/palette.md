## 2026-04-21 - Improve Form Accessibility in AuthModal
**Learning:** The project's `<div className="form-group">` pattern historically omitted explicit `<label htmlFor>` and `id` attributes on its child inputs, representing a widespread accessibility gap for screen readers.
**Action:** Always pair custom state-based validation with native HTML5 attributes (`required`, `minLength`) and explicitly link labels to their input `id`s when building or refactoring components.
