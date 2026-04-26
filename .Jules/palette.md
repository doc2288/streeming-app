## 2026-04-26 - Improve Form Accessibility and Native Validation
**Learning:** Explicit `htmlFor` to `id` matching and native HTML5 attributes like `required` and `minLength` are essential for proper screen reader behavior in forms. They provide instant, native validation feedback before JavaScript executes.
**Action:** Always link `<label>` elements to `<input>` elements using `htmlFor` and `id`, and pair custom validation logic with native constraints in the DOM.
