## 2024-05-18 - Copy buttons missing accessible labels
**Learning:** Copy buttons in Dashboard and WatchPage only have generic "Copy" or hardcoded localized titles ("Копіювати"), which are not properly localized via the i18n system or consistently available for screen readers (aria-label).
**Action:** Always localize tooltips via `title={t('copy')}` and add `aria-label={t('copy')}` to icon-only buttons for full accessibility.
