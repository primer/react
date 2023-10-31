---
"@primer/react": major
---

- Changes `leadingIcon` and `trailingIcon` to `leadingVisual` and `trailingVisual`
- Removes `Button.Counter` as a child component, replacing it with a `count` prop. This change allows us to use the `trailingVisual` slot for counters.
- Removes the `outline` button variant as we wish to only support `invisible` buttons.
