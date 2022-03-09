---
'@primer/react': major
---

<br />

### SelectMenu

⚠️ `SelectMenu` has been deprecated. Please use `ActionMenu` instead.

<table>
<tr>
<th> Before </th> <th> After </th>
</tr>
<tr>
<td valign="top">

```jsx
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

⚠️ `Dropdown` has been deprecated. Please use `ActionMenu` instead.

<table>
<tr>
<th> Before </th> <th> After </th>
</tr>
<tr>
<td valign="top">

```jsx
const fieldTypes = [
  {leadingVisual: TypographyIcon, text: 'Text'},
  {leadingVisual: NumberIcon, text: 'Number'}
]

const Example = () => {
  const [selectedItem, setSelectedItem] = React.useState()

  return (
    <DropdownMenu
      renderAnchor={({children, ...anchorProps}) => <ButtonInvisible {...anchorProps}>{children}</ButtonInvisible>}
      placeholder="Select a field type"
      items={fieldTypes}
      selectedItem={selectedItem}
      onChange={() => setSelectedIndex(index)}
    />
  )
}
```

 </td>
<td valign="top">

```jsx
const fieldTypes = [
  {icon: <TypographyIcon />, name: 'Text'},
  {icon: <NumberIcon />, name: 'Number'}
]

const Example = () => {
  const [selectedItem, setSelectedItem] = React.useState()

  return (
    <ActionMenu>
      <ActionMenu.Button>{selectedItem ? selectedItem.name : 'Select a field type'}</ActionMenu.Button>
      <ActionMenu.Overlay>
        <ActionList selectionVariant="single">
          {fieldTypes.map(field => (
            <ActionList.Item onSelect={() => setSelectedItem(field)} key={field.name}>
              <ActionList.LeadingVisual>{field.icon}</ActionList.LeadingVisual>
              {field.name}
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

See [https://primer.style/react/ActionMenu](https://primer.style/react/ActionMenu) for more migration examples.

### Flex

⚠️ `Flex` has been deprecated. Please use [`Box`](https://primer.style/react/Box) instead.

<table>
<tr>
<th> Before </th> <th> After </th>
</tr>
<tr>
<td valign="top">

```jsx
<Flex flexWrap="nowrap">
  <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
    Item 1
  </Box>
</Flex>
```

 </td>
<td valign="top">

```jsx
<Box display="flex" flexWrap="nowrap">
  <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
    Item 1
  </Box>
</Box>
```

</td>
</tr>
</table>

### Grid

⚠️ `Grid` has been deprecated. Please use [`Box`](https://primer.style/react/Box) instead.

<table>
<tr>
<th> Before </th> <th> After </th>
</tr>
<tr>
<td valign="top">

```jsx
<Grid gridTemplateColumns="repeat(2, auto)" gridGap={3}>
  <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
    1
  </Box>
  <Box p={3} color="fg.onEmphasis" bg="attention.emphasis">
    2
  </Box>
</Grid>
```

 </td>
<td valign="top">

```jsx
<Box display="grid" gridTemplateColumns="repeat(2, auto)" gridGap={3}>
  <Box p={3} color="fg.onEmphasis" bg="accent.emphasis">
    1
  </Box>
  <Box p={3} color="fg.onEmphasis" bg="attention.emphasis">
    2
  </Box>
</Box>
```

</td>
</tr>
</table>

### BorderBox

⚠️ `BorderBox` has been deprecated. Please use [`Box`](https://primer.style/react/Box) instead.

<table>
<tr>
<th> Before </th> <th> After </th>
</tr>
<tr>
<td valign="top">

```jsx
<BorderBox>Item 1</BorderBox>
```

 </td>
<td valign="top">

```jsx
<Box borderWidth="1px" borderStyle="solid" borderColor="border.default" borderRadius={2}>
  Item 1
</Box>
```

</td>
</tr>
</table>

### Position

⚠️ `Position` has been deprecated. Please use [`Box`](https://primer.style/react/Box) instead.

<table>
<tr>
<th> Before </th> <th> After </th>
</tr>
<tr>
<td valign="top">

```jsx
<>
  <Position position="absolute">...</Position>
  <Absolute>...</Absolute>
  <Relative>...</Relative>
  <Fixed>...</Fixed>
  <Sticky>...</Sticky>
</>
```

 </td>
<td valign="top">

```jsx
<>
  <Box position="absolute">...</Box>
  <Box position="absolute">...</Box>
  <Box position="relative">...</Box>
  <Box position="fixed">...</Box>
  <Box position="sticky">...</Box>
</>
```

</td>
</tr>
</table>
