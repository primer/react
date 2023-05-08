---
"@primer/react": minor
---

Update PRC ActionList implementation to have similar semantics to PVC.
* Removes `ActionList.Group`.
* Adds `ActionList.Heading` to be used for labelling children in an `ActionList`.
* Adds `heading` slot to `ActionList` for adding headings that label internal lists correctly.

ActionList.Groups inside an ActionList generated inaccessible markup. Previous usage:
```
<ActionList>
  <ActionList.Group title="Actions">
    <ActionList.Item>Create</ActionList.Item>
    <ActionList.Item>Read</ActionList.Item>
    <ActionList.Item>Update</ActionList.Item>
    <ActionList.Item>Delete</ActionList.Item>
  </ActionList.Group>
  <ActionList.Group>
    ...
  </ActionList.Group>
</ActionList>
```

Instead, use `ActionList`s and stack them as needed.
```
<div>
  <ActionList>
    <ActionList.Heading title="Actions" />
    <ActionList.Item>Create</ActionList.Item>
    <ActionList.Item>Read</ActionList.Item>
    <ActionList.Item>Update</ActionList.Item>
    <ActionList.Item>Delete</ActionList.Item>
  </ActionList>
  <ActionList>
    ...
  </ActionList>
</div>
```
