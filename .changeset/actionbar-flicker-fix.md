---
'@primer/react': patch
---

ActionBar: Fixed flickering on initial render by applying visibility:hidden during initial width calculations. This prevents items from briefly appearing and then disappearing on slower devices.
