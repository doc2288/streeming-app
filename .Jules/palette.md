## 2024-07-09 - Accessible Icon-Only Buttons
**Learning:** Icon-only buttons (like Send, Emoji, and Reply in Chat) frequently lack proper ARIA labels and titles, making them inaccessible to screen readers and difficult to understand without tooltips. Hardcoding English strings like `title="Reply"` breaks internationalization.
**Action:** Always provide both `title` (for visual tooltips) and `aria-label` (for screen readers) on icon-only buttons using localized translation keys (e.g., `title={t('reply')} aria-label={t('reply')}`) to ensure accessibility and support for multiple languages.
