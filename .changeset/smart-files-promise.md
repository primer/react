---
"@primer/components": patch
---

Focus zones with an `activeDescendantControl` will now activate the first descendant as soon as the control element is focused, rather than waiting for an up/down arrow press.  Descendants stay active until the control element is blurred.  This is a breaking change to `useFocusZone`, but this behavior is still considered to be in `alpha`.
