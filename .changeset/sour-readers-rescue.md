---
"@primer/react": patch
---

TreeView: Preserve expanded state of nested items when parent item is collapsed.

**Breaking change**

`TreeView.Item` and `TreeView.LinkItem` now require an `id` prop:

```diff
- <TreeView.Item>...</TreeView.Item>
+ <TreeView.Item id="unqiue-id">...</TreeView.Item>
```

This is not in a major release because TreeView is still a `draft` component.
