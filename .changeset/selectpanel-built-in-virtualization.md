---
"@primer/react": minor
---

SelectPanel: Add built-in client-side list virtualization via a new `virtualized` prop. When enabled, only the visible items plus a small overscan buffer are rendered in the DOM, dramatically improving performance for large lists.
