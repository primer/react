---
'@primer/react': minor
---

Add support for the `as` prop on `TreeView.Item`. This enables rendering the
treeitem as a different element (e.g. `as="a"` for native anchors, or a custom
router-link component) while preserving all existing keyboard, focus, and ARIA
behavior.

When `as` is omitted, the existing markup is unchanged: an `<li>` is rendered
as the `role="treeitem"` element. When `as` is provided, the polymorphic
element is rendered as the treeitem and is wrapped in an `<li role="none">`
so the markup remains valid (a `<ul role="tree">` may only directly contain
`<li>` elements).
