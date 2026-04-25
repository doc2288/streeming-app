## 2024-04-25 - Improve AuthModal accessibility and validation
**Learning:** For frontend forms, always pair custom component-level validation with native HTML5 validation attributes (e.g., `required`, `type="email"`, `minLength`) and explicit `htmlFor`/`id` linking between labels and inputs to ensure proper accessibility and screen reader support. Native validation correctly prevents form submission.
**Action:** When creating new form inputs, always include corresponding `id`s, `htmlFor`s on labels, and native validation.
