---
title: Popover
---

Popovers are used to bring attention to specific user interface elements, typically to suggest an action or to guide users through a new experience.

Two components make up a popover; the `Popover` component controls the absolute positioning of the popover, and `Popover.Content` renders the inner content of the popover as well as the caret.

By default, the popover renders with absolute positioning, meaning it should usually be wrapped in an element with a relative position in order to be positioned properly. To render the popover with relative positioning, use the `relative` property.

It can be useful to give the `Popover.Content` element a margin to help align the popover.

## Default Example

```jxs live
<Relative>
  <Text textAlign="center" display="block">
    <ButtonPrimary>Hello!</ButtonPrimary>
  </Text>

  <Popover relative open={true} caret="top">
    <Popover.Content mt={2}>
      <Heading fontSize={2}>Popover heading</Heading>
      <Text as="p">Message about this particular piece of UI.</Text>
      <Button>Got it!</Button>
    </Popover.Content>
  </Popover>
</Relative>
```

## Caret position

`Popover` supports various caret positions, which you can specify via the `caret` property. This demo shows all the valid values for the prop. The default is `top`. Note that the `top-left`, `bottom-left`, `top-right`, and `bottom-right` values modify the horizontal alignment of the popover.

```javascript live noinline
function PopoverDemo(props) {
  const [pos, setPos] = React.useState('top')
  const [open, setOpen] = React.useState(true)

  return (
    <Box>
      <Heading as="h3" fontSize={3}>Caret Position</Heading>
      <CaretSelector current={pos} onChange={setPos} />
      <Heading as="h3" fontSize={3}>Popover Visibility</Heading>
      <Box my={2}>
        <label>
          <input type="checkbox" value={open} checked={open}
            onChange={() => setOpen(open => !open)}/> Open
        </label>
      </Box>

      <Relative pt={4}>
        <Popover relative open={open} caret={pos}>
          <Popover.Content>
            <Heading fontSize={2}><code>{pos}</code> caret</Heading>
            <Text as="p">Message about this particular piece of UI.</Text>
            <Button onClick={() => setOpen(false)}>Got it!</Button>
          </Popover.Content>
        </Popover>
      </Relative>
    </Box>
  )
}

function CaretSelector(props) {
  const choices = [
    'top',         'bottom',      'left',         'right',
    'left-bottom', 'left-top',    'right-bottom', 'right-top',
    'top-left',    'bottom-left', 'top-right',    'bottom-right'
  ].map((dir) => (
    <label>
      <input key={dir} type='radio' name='caret' value={dir}
        checked={dir === props.current} onChange={() => props.onChange(dir)} /> {dir}
    </label>
))

  return (
    <Grid gridTemplateColumns="repeat(4, auto)" gridGap={3} my={2}>
      {choices}
    </Grid>
  )
}

render(<PopoverDemo />)
```

## System props

`Popover` components get `COMMON`, `LAYOUT`, and `POSITION` system props. `Popover.Content` components get `COMMON`, `LAYOUT`, `BORDER`, and `FLEX` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

### Popover

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| as | String | 'div' | Sets the HTML tag for the component. |
| caret | String | 'top' | Controls the position of the caret. See below for the list of caret positions. |
| open | Boolean | false | Controls the visibility of the popover. |
| relative | Boolean | false | Set to true to render the popover using relative positioning. |

#### Caret Positions

The `caret` prop can be one of the following values: `top`, `bottom`, `left`, `right`, `bottom-left`, `bottom-right`, `top-left`, `top-right`, `left-bottom`, `left-top`, `right-bottom`, or `right-top`.

### Popover.Content

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| as | String | 'div' | Sets the HTML tag for the component. |
