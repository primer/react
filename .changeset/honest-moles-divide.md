---
"@primer/react": patch
---

Delete `TreeView.LinkItem`. Use `TreeView.Item` and call a navigation function inside the `onSelect` callback instead:

```diff
- <TreeView.LinkItem href="#">...
+ <TreeView.Item onSelect={() => navigate('#')}>...
```
