---
'@primer/react': major
---
<br />

### ActionList

ActionList has been rewritten with a composable API, design updates and accessibility fixes.

See full list of props and examples: https://primer.style/react/ActionList

<table>
<tr>
<th> Before (v34)</th> <th> After (v35)</th>
</tr>
<tr>
<td valign="top">

```jsx
<ActionList
  items={[
    {text: 'New file'},
    {text: 'Copy link'},
    {text: 'Edit file'},
    ActionList.Divider,
    {text: 'Delete file', variant: 'danger'}
  ]}
/>
```

 </td>
<td valign="top">

```jsx
<ActionList>
  <ActionList.Item>New file</ActionList.Item>
  <ActionList.Item>Copy link</ActionList.Item>
  <ActionList.Item>Edit file</ActionList.Item>
  <ActionList.Divider />
  <ActionList.Item variant="danger">Delete file</ActionList.Item>
</ActionList>
```

</td>
</tr>
<tr>
<td valign="top">

```jsx
<ActionList
  showItemDividers
  items={[
    {
      key: '0',
      leadingVisual: LinkIcon,
      text: 'github/primer'
    },
    {
      key: '1',
      leadingVisual: () => <Avatar src="https://github.com/mona.png" />,
      text: 'mona',
      description: 'Monalisa Octocat',
      descriptionVariant: 'block'
    },
    {
      key: '2',
      leadingVisual: GearIcon,
      text: 'View Settings',
      trailingVisual: ArrowRightIcon
    }
  ]}
/>
```

 </td>
<td valign="top">

```jsx
<ActionList showDividers>
  <ActionList.Item>
    <ActionList.LeadingVisual>
      <LinkIcon />
    </ActionList.LeadingVisual>
    github/primer
  </ActionList.Item>
  <ActionList.Item>
    <ActionList.LeadingVisual>
      <Avatar src="https://github.com/mona.png" />
    </ActionList.LeadingVisual>
    mona
    <ActionList.Description variant="block">Monalisa Octocat</ActionList.Description>
  </ActionList.Item>
  <ActionList.Item>
    <ActionList.LeadingVisual>
      <GearIcon />
    </ActionList.LeadingVisual>
    View settings
    <ActionList.TrailingVisual>
      <ArrowRightIcon />
    </ActionList.TrailingVisual>
  </ActionList.Item>
</ActionList>
```

</td>
</tr>
<tr>
<td valign="top">

```jsx
<ActionList
  groupMetadata={[
    {groupId: '0', header: {title: 'Live query'}},
    {groupId: '1', header: {title: 'Layout'}}
  ]}
  items={[
    {key: '0', text: 'repo:github/github', groupId: '0'},
    {key: '1', text: 'Table', groupId: '1'},
    {key: '2', text: 'Board', groupId: '1'},
    {key: '3', text: 'View settings'}
  ]}
/>
```

 </td>
<td valign="top">

```jsx
<ActionList>
  <ActionList.Group title="Live query">
    <ActionList.Item>repo:github/github</ActionList.Item>
  </ActionList.Group>
  <ActionList.Divider />

  <ActionList.Group title="Layout">
    <ActionList.Item>Table</ActionList.Item>
    <ActionList.Item>Board Description</ActionList.Item>
  </ActionList.Group>
  <ActionList.Divider />

  <ActionList.Item>View settings</ActionList.Item>
</ActionList>
```

</td>
</tr>
</table>

To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

```js
import {ActionList} from '@primer/react/deprecated'
```

You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.
