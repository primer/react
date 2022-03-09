---
'@primer/react': major
---

<br />

### DropdownMenu

DropdownMenu has been deprecated in favor of ActionMenu with ActionList

See example with selection: https://primer.style/react/ActionMenu#with-selection

Migration guide:

1. Instead of using `items` prop, use `ActionList` inside `ActionMenu`
2. Use `selectionVariant="single"` on `ActionList` to set the right semantics for selection
3. Instead of using `selectedItem` prop, use `selected` prop on `ActionList.Item`
4. Instead of using `renderAnchor` and `placeholder` props on `DropdownMenu`, use `ActionMenu.Button` or `ActionMenu.Anchor`
5. Instead of using `onChange` prop on `DropdownMenu`, use `onSelect` prop on `ActionList.Item`
6. Instead of using `groupMetadata` on `DropdownMenu`, use `ActionList.Group`
7. Instead of `overlayProps` on `DropdownMenu`, use `ActionMenu.Overlay`

<table>
<tr>
<th> Before (v34)</th> <th> After (v35)</th>
</tr>
<tr>
<td valign="top">

```js
const fieldTypes = [
  {key: 0, text: 'Text'},
  {key: 1, text: 'Number'},
  {key: 3, text: 'Date'},
  {key: 4, text: 'Single select'},
  {key: 5, text: 'Iteration'}
]

const Example = () => {
  const [selectedType, setSelectedType] = React.useState()

  return (
    <DropdownMenu
      renderAnchor={({children, ...anchorProps}) => (
        <ButtonInvisible {...anchorProps}>
          {children} <GearIcon />
        </ButtonInvisible>
      )}
      placeholder="Field type"
      items={fieldTypes}
      selectedItem={selectedType}
      onChange={setSelectedType}
      overlayProps={{width: 'medium'}}
    />
  )
}
```

 </td>
<td valign="top">

```jsx
const fieldTypes = [
  {id: 0, text: 'Text'},
  {id: 1, text: 'Number'},
  {id: 3, text: 'Date'},
  {id: 4, text: 'Single select'},
  {id: 5, text: 'Iteration'}
]

const Example = () => {
  const [selectedType, setSelectedType] = React.useState()

  render(
    <ActionMenu>
      <ActionMenu.Button aria-label="Select field type">{selectedType.name || 'Field type'}</ActionMenu.Button>
      <ActionMenu.Overlay width="medium">
        <ActionList selectionVariant="single">
          {fieldTypes.map(type => (
            <ActionList.Item
              key={type.id}
              selected={type.id === selectedType.id}
              onSelect={() => setSelectedType(type)}
            >
              {type.name}
            </ActionList.Item>
          ))}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}
```

</td>
</tr>
</table>

To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

```js
import {DropdownMenu} from '@primer/react/deprecated'
```

You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.

### drafts/DropdownMenu2

DropdownMenu2 has been removed in favor of ActionMenu with ActionList
