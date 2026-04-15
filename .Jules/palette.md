## 2024-05-17 - Added native validation and label associations to AuthModal
**Learning:** React native `htmlFor` combined with HTML5 `required` and `minLength` enhances screen reader capabilities by properly connecting labels with inputs and standardizing browser-level validation.
**Action:** Always link form labels using `htmlFor` and their respective input `id` attributes, while falling back onto native browser validations like `required` when possible before engaging custom JS logic.
