---
"@primer/components": patch
---

Removed "suspended" state from active-descendant focus zones.  Active descendant will now be active as soon as the `activeDescendantControl` element is focused, and cannot be deactivated by pressing `esc`.  This is a breaking change to `useFocusZone`, but this behavior is still considred to be in `alpha`.
