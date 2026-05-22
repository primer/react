---
'@primer/react': patch
---

UnderlineNav: Re-architect item measurement to remove a cascading render on
mount. Each `UnderlineNav.Item` no longer dispatches measurement setState calls
back into its parent via context; `UnderlineNav` now walks its rendered items
in a single layout effect and stores widths in refs. Overflow state is
consolidated into one `useState` object (one commit per change), the context
value is memoized, `UnderlineNav.Item` is wrapped in `React.memo`, and the
external-`aria-current` swap was moved out of render-phase setState into a
layout effect. Behavior is unchanged for consumers, but the initial mount and
overflow-state transitions produce far fewer per-item renders.
