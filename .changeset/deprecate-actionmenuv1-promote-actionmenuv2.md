---
'@primer/react': major
---

### ActionMenu

ActionMenu now ships a composable API that utilises ActionList

See full list of props and examples: https://primer.style/react/ActionMenu

Main changes:

1. Instead of using `items` prop, use `ActionList` inside `ActionMenu`
2. Instead of using `anchorContent` on `ActionMenu`, use `ActionMenu.Button` with `children`
3. Instead of using `onAction` prop on `ActionMenu`, use `onSelect` prop on `ActionList.Item`
4. Instead of using `groupMetadata` on `ActionMenu`, use `ActionList.Group`
5. Instead of `overlayProps` on `ActionMenu`, use `ActionMenu.Overlay`

<table>
<tr>
<th> Before </th> <th> After </th>
</tr>
<tr>
<td valign="top">

```jsx
<ActionMenu
  anchorContent="Menu"
  onAction={fn}
  items={[
    {text: 'New file'},
    {text: 'Copy link'},
    {text: 'Edit file'},
    ActionMenu.Divider,
    {text: 'Delete file', variant: 'danger'}
  ]}
  overlayProps={{width: 'small'}}
/>
```

 </td>
<td valign="top">

```jsx
<ActionMenu>
  <ActionMenu.Button>Menu</ActionMenu.Button>
  <ActionMenu.Overlay width="small">
    <ActionList>
      <ActionList.Item onSelect={fn}>New file</ActionList.Item>
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Edit file</ActionList.Item>
      <ActionList.Divider />
      <ActionList.Item variant="danger">Delete file</ActionList.Item>
    </ActionList>
  </ActionMenu.Overlay>
</ActionMenu>
```

</td>
</tr>
</table>

To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

```js
import {ActionMenu} from '@primer/react/deprecated'
```
