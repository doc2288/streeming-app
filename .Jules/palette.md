## 2024-05-24 - Add native form validation and a11y labels to AuthModal
**Learning:** Found that custom form validation (`if (email.trim().length === 0)`) was used without underlying HTML5 `required` attributes, making the form less accessible for screen reader users expecting native form validation cues.
**Action:** Always pair custom component-level form validation with native HTML5 validation attributes (`required`, `type="email"`, etc.) and explicit `htmlFor`/`id` linking.
