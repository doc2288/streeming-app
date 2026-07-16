1. **Identify the UX Opportunity**:
   - In `clients/web/src/components/WatchPage.tsx`, there are multiple copy buttons (e.g., for `obsServer` and `stream.stream_key`).
   - The current UI shows a generic SVG copy icon. When clicked, it copies the text and uses a `title="Копіювати"` attribute (which is hardcoded and not localized).
   - There's a `copied` translation key in `clients/web/src/i18n.tsx` (`copied: { ua: 'Скопійовано!', en: 'Copied!', no: 'Kopiert!' }`).
   - Adding visual feedback (like momentarily changing the tooltip to "Copied!" or changing the icon to a checkmark) and fixing the hardcoded "Копіювати" tooltip to use a localized string will enhance the micro-UX significantly, conforming exactly to the "add micro-interaction feedback" goal of Palette.

2. **Steps to Implement**:
   - **Update Translation:** Add a localized `copy: { ua: 'Копіювати', en: 'Copy', no: 'Kopier' }` string in `clients/web/src/i18n.tsx`.
   - **Update `WatchPage.tsx`**:
     - Introduce state variables to track the recently copied item: `const [copiedKey, setCopiedKey] = useState<'server' | 'key' | null>(null)`.
     - Update `copyToClipboard` function or wrapper to take an identifier and text, call `navigator.clipboard.writeText`, then set `copiedKey(identifier)`, and use a `setTimeout` to reset it after ~2 seconds.
     - Update the two `.btn-copy` buttons in `WatchPage.tsx`:
       - Use the `t('copy')` translation for the default `title` attribute or `aria-label`, falling back to `t('copied')` when actively copied.
       - If `copiedKey === 'server'` (or `'key'`), conditionally swap the icon to a Checkmark icon (`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>`) and change the tooltip.

3. **Verify**:
   - Run `pnpm lint` in `clients/web`.
   - Ensure the keyboard focus states are maintained (the buttons use `.btn-copy`).
   - Ensure changes are under 50 lines.

4. **Add Journal Entry**:
   - Add a brief entry to `.Jules/palette.md` noting the importance of localizing aria-labels/tooltips and providing micro-feedback on clipboard actions to reduce user uncertainty.

5. **Pre-commit**:
   - Complete standard pre-commit validation.

6. **Submit**:
   - Create a PR `🎨 Palette: [UX improvement]` with the required format (`💡 What`, `🎯 Why`, `📸 Before/After`, `♿ Accessibility`).
