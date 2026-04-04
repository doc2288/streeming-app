## 2025-04-04 - Missing Form Control Associations
**Learning:** React form inputs without explicit `id`/`htmlFor` pairings or native validation properties completely break screen reader context and rely solely on custom JavaScript logic to evaluate invalid states.
**Action:** Always link labels to inputs explicitly and utilize HTML5 validation attributes (`required`, `minLength`) alongside component-level JavaScript validation for full accessibility and graceful fallback.
