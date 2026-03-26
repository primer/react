---
'@primer/react': patch
---

Fix item dividers not visible in SelectPanel and FilteredActionList when `showItemDividers` is enabled, caused by `content-visibility: auto` clipping the absolutely-positioned divider pseudo-elements.
