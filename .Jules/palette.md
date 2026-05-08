## 2025-05-18 - Missing Explicit Form Label Associations
**Learning:** Found a pattern across the application where `label` elements implicitly wrap or simply precede input fields without using `htmlFor` and `id` linking. This damages accessibility for screen readers and shrinks click targets.
**Action:** Always link `<label htmlFor="id">` to `<input id="id">` in all existing and future forms (e.g. Create Stream form, settings) to improve keyboard accessibility and semantic structure. Also ensure `role="alert"` is present for dynamic error text.
