---
'@primer/react': minor
---

ActionList: Add `ActionList.GroupHeading.TrailingAction` for header-level actions on grouped lists. Closes #2043.

When the `primer_react_action_list_group_heading_trailing_action` feature flag is enabled, you can place an `ActionList.GroupHeading.TrailingAction` (a small invisible `IconButton`) inside `ActionList.GroupHeading` to render a uniform square action target next to the group's heading. Only supported inside an `ActionList` with the default `list` role — using it inside `ActionMenu` or with `role="listbox"` will throw.

```tsx
<ActionList>
  <ActionList.Group>
    <ActionList.GroupHeading as="h3">
      Custom fields
      <ActionList.GroupHeading.TrailingAction label="New field" icon={PlusIcon} />
    </ActionList.GroupHeading>
    <ActionList.Item>...</ActionList.Item>
  </ActionList.Group>
</ActionList>
```
