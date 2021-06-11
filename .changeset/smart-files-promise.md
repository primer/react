---
"@primer/components": patch
---

Focus zones with an `activeDescendantControl` will now activate the first descendant as soon as the control element is focused, rather than waiting for an up/down arrow press.  Descendants stay active until the control element is blured.  This is a breaking change to `useFocusZone`, but this behavior is still considred to be in `alpha`.
