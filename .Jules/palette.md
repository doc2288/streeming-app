## 2024-06-02 - Translate ARIA labels and titles
**Learning:** Hardcoded translation strings like "Copy" or "Копіювати" break a11y tools for users who do not speak those languages or use a different default.
**Action:** Always use the `t()` translation function for any `title`, `aria-label`, or user-facing string, and verify the key exists in the `i18n.tsx` file.
