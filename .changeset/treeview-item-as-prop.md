---
'@primer/react': minor
---

Add support for the `as` prop on `TreeView.Item`. This enables rendering the
treeitem as a different element (e.g. `as="a"` for native anchors, or a custom
router-link component) while preserving all existing keyboard, focus, and ARIA
behavior. Defaults to `'li'`, so existing usage is unchanged.
