## 2024-04-24 - Improve AuthModal form accessibility
**Learning:** React native forms often lack connection between labels and inputs which impedes screen reader accessibility. Also native validation on forms isn't utilized causing unnecessary errors.
**Action:** Always add `htmlFor` to `label` components and `id` to `input` components. Utilize native HTML5 validation constraints whenever possible.
