---
'@primer/react': patch
---

SelectPanel: Reset the single-select modal's intermediate selection during render instead of in an effect, avoiding an extra re-render when the panel opens or the selection changes.
