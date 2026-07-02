---
'@primer/react': patch
---

ActionList: replace the `:has(~ .SubGroup [data-active='true'])` selector that styled collapsed parent items containing an active descendant with a plain attribute + child-combinator selector. The collapsed-parent active indicator now depends on the parent item carrying `data-active='true'`, which the supported `NavList.ItemWithSubNav` consumer already sets via its `containsCurrentItem` walk.
