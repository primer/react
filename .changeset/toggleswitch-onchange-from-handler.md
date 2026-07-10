---
'@primer/react': patch
---

ToggleSwitch: Fire `onChange` from the user interaction instead of an effect, so it no longer fires on mount or when a controlled `checked` value changes externally.
