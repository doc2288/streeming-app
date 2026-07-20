## 2024-07-20 - Icon-Only Button ARIA Labels
**Learning:** Icon-only buttons in this app must have both visual tooltips (`title`) and screen-reader accessible names (`aria-label`) that use matching translation keys from `i18n.tsx` rather than hardcoded strings, ensuring full accessibility and internationalization compliance.
**Action:** When adding or updating icon-only interactive elements, verify the presence of an appropriate localization key in `i18n.tsx`, add it if missing, and bind it to both `title` and `aria-label` properties to satisfy accessibility requirements.
