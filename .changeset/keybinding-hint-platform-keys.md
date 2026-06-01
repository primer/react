---
'@primer/react': patch
---

`KeybindingHint`: display the `Meta` key correctly on platforms other than macOS and Windows. The `Meta`, `Alt`, and `Mod` keys are now resolved based on the detected platform: Apple platforms (macOS and iOS) show `⌘`/`⌥`, Windows shows `Win`, and all other platforms show `Meta`/`Alt`.
