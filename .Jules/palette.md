## 2024-06-26 - Add proper ARIA labels with localized tooltips
**Learning:** Icon-only buttons relying purely on `title` and static values create confusing screen reader announcements and break internationalization.
**Action:** Always pair `title` (for visual tooltips) with `aria-label` (for screen readers) on icon-only buttons, and use corresponding translations from the i18n system to maintain accessibility.
