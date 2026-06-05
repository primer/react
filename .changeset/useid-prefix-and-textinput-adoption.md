---
'@primer/react': patch
---

Switch `TextInput` and `Textarea` to import `useId` from `../hooks/useId` (Primer's thin wrapper around React's `useId`) instead of importing `useId` directly from `react`. Matches the convention used by every other Primer component (`FormControl`, `ActionMenu`, `Dialog`, etc.).

No runtime behaviour changes — Primer's `useId(id?)` falls back to `useReactId()` when no `id` argument is provided, which is how both call sites use it today.