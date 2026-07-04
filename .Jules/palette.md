## 2024-07-04 - Adding ARIA labels to icon-only buttons
**Learning:** Icon-only actions (like copy or delete buttons) in this app often lack ARIA labels, which degrades screen reader accessibility. It's crucial to ensure that translation keys used for visual tooltips (`title`) are also mirrored in `aria-label` properties on these buttons.
**Action:** When working on UI components, specifically those containing icon buttons, explicitly add `aria-label={t('actionName')}` using the shared translation file to maintain full accessibility and internationalization support.
