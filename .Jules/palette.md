## 2024-07-14 - Icon-only buttons Accessibility
**Learning:** Icon-only buttons lacking `title` and `aria-label` attributes represent a recurring accessibility issue within this app's UI components.
**Action:** When creating icon-only action buttons (e.g. back, delete, copy, search), consistently provide localized keys for both `aria-label` (for screen readers) and `title` (for visual tooltips) attributes to maintain a11y and internationalization.
