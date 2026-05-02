## 2024-05-02 - Add ARIA labels to close and clear buttons
**Learning:** Many small UI dismissals like '×' buttons or close icons lacked ARIA labels, creating screen reader dead ends and confusing navigation for visually impaired users.
**Action:** Ensure all icon-only buttons, especially those for dismissing modals, clearing search, or closing notifications, always include descriptive `aria-label` attributes.
