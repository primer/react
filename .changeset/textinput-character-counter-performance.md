---
'@primer/react': patch
---

TextInput: Improve typing performance by deriving the character counter in render instead of in effects, removing extra re-renders on each keystroke.
