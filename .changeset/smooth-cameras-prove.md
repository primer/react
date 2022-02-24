---
'@primer/react': major
---

## ⚠️ Deprecations

### SelectMenu

`SelectMenu` has been deprecated. Please use `ActionMenu` instead.

<table>
<tr>
<th> Before </th> <th> After </th>
</tr>
<tr>
<td valign="top">

```jsx
// import {SelectMenu} from '@primer/react';

<SelectMenu>
  <Button as="summary">Projects</Button>
  <SelectMenu.Modal>
    <SelectMenu.Header>Projects</SelectMenu.Header>
    <SelectMenu.List>
      <SelectMenu.Item href="#">Primer React bugs</SelectMenu.Item>
      <SelectMenu.Item href="#">Primer React roadmap</SelectMenu.Item>
      <SelectMenu.Item href="#">Project 3</SelectMenu.Item>
      <SelectMenu.Item href="#">Project 4</SelectMenu.Item>
    </SelectMenu.List>
  </SelectMenu.Modal>
</SelectMenu>
```

 </td>
<td valign="top">

```jsx
// import {ActionMenu, ActionList} from '@primer/react';

<ActionMenu>
  <ActionMenu.Button>Projects</ActionMenu.Button>
  <ActionMenu.Overlay>
    <ActionList showDividers>
      <ActionList.Group title="Projects">
        <ActionList.Item>Primer React bugs</ActionList.Item>
        <ActionList.Item>Primer React roadmap</ActionList.Item>
        <ActionList.Item>Project three</ActionList.Item>
        <ActionList.Item>Project four</ActionList.Item>
      </ActionList.Group>
    </ActionList>
  </ActionMenu.Overlay>
</ActionMenu>
```

</td>
</tr>
</table>

See [https://primer.style/react/ActionMenu](https://primer.style/react/ActionMenu) for more migration examples.

### Dropdown

TODO

### Flex

TODO

### Grid

TODO

### BorderBox

TODO

### BorderBox

TODO

### Position

TODO
