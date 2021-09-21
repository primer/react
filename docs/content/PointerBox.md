---
title: PointerBox
---

PointerBox is a [BorderBox](./BorderBox) component with a caret added to it.

## Default example

```jsx live
<PointerBox m={4} p={2} minHeight={100} bg="success.subtle" borderColor="success.emphasis">
  PointerBox
</PointerBox>
```

```javascript live noinline
function PointerBoxDemo(props) {
  const [pos, setPos] = React.useState('top')

  return (
    <Box>
      <Heading as="h3" sx={{fontSize: 3}}>
        Caret Position
      </Heading>
      <CaretSelector current={pos} onChange={setPos} />
      <Box position="relative" pt={4}>
        <PointerBox m={4} p={2} minHeight={100} bg="success.subtle" borderColor="success.emphasis" caret={pos}>
          {' '}
          Content{' '}
        </PointerBox>
      </Box>
    </Box>
  )
}

function CaretSelector(props) {
  const choices = [
    'top',
    'bottom',
    'left',
    'right',
    'left-bottom',
    'left-top',
    'right-bottom',
    'right-top',
    'top-left',
    'bottom-left',
    'top-right',
    'bottom-right'
  ].map(dir => (
    <label>
      <input
        key={dir}
        type="radio"
        name="caret"
        value={dir}
        checked={dir === props.current}
        onChange={() => props.onChange(dir)}
      />{' '}
      {dir}
    </label>
  ))

  return (
    <Box display="grid" gridTemplateColumns="repeat(4, auto)" gridGap={3} my={2}>
      {choices}
    </Box>
  )
}

render(<PointerBoxDemo />)
```

## System props

PointerBox components get `COMMON`, `LAYOUT`, `BORDER`, and `FLEX` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name  | Type   | Default | Description                                                                                                                                                                                                                                                  |
| :---- | :----- | :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| caret | String | bottom  | Sets the location of the caret. The format is `[edge]-[position on edge]`. For example, `right-top` will position the caret on the top of the right edge of the box. Use `top`, `right`, `bottom`, or `left` to position a caret in the center of that edge. |
