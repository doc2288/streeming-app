## 2024-05-10 - Accessibility missing on form controls / inputs
**Learning:** Many interactive elements like icon-only buttons (`btn-copy`, `btn-icon`, `search-btn`) and form inputs (`<input ref={inputRef} value={text} ...>`) do not have clear programmatic accessible names (`aria-label`) that screen readers can pick up on. And some are missing translation entries.
**Action:** When adding ARIA labels, add translations explicitly to `clients/web/src/i18n.tsx`. Do not reuse generic placeholders if a specific verb represents the action better.
