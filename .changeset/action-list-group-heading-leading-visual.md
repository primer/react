---
'@primer/react': minor
---

ActionList: Add `ActionList.GroupHeading.LeadingVisual` for a leading icon (or similar) on grouped list headings.

When the `primer_react_action_list_group_heading_leading_visual` feature flag is enabled, you can place an `ActionList.GroupHeading.LeadingVisual` inside `ActionList.GroupHeading` to render a decorative visual before the group's heading text. It can be combined with `ActionList.GroupHeading.TrailingAction`.

```tsx
<ActionList>
  <ActionList.Group>
    <ActionList.GroupHeading as="h3">
      <ActionList.GroupHeading.LeadingVisual>
        <FileDirectoryIcon />
      </ActionList.GroupHeading.LeadingVisual>
      Custom fields
    </ActionList.GroupHeading>
    <ActionList.Item>...</ActionList.Item>
  </ActionList.Group>
</ActionList>
```
