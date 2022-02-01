---
title: Popover
description: Use Popovers to bring attention to specific user interface elements and suggest an action or to guide users through a new experience
componentId: popover
status: Alpha
source: https://github.com/primer/react/blob/main/src/Popover.tsx
---

```js
import {Popover} from '@primer/react'
```

## Examples

```jxs live
<Box position="relative">
  <Text textAlign="center" display="block">
    <ButtonPrimary>Hello!</ButtonPrimary>
  </Text>

  <Popover relative open={true} caret="top">
    <Popover.Content sx={{mt: 2}}>
      <Heading sx={{fontSize: 2}}>Popover heading</Heading>
      <Text as="p">Message about this particular piece of UI.</Text>
      <Button>Got it!</Button>
    </Popover.Content>
  </Popover>
</Box>
```

Two components make up a popover; the `Popover` component controls the absolute positioning of the popover, and `Popover.Content` renders the inner content of the popover as well as the caret.

By default, the popover renders with absolute positioning, meaning it should usually be wrapped in an element with a relative position in order to be positioned properly. To render the popover with relative positioning, use the `relative` property.

It can be useful to give the `Popover.Content` element a margin to help align the popover.

### Caret position

`Popover` supports various caret positions, which you can specify via the `caret` property. This demo shows all the valid values for the prop. The default is `top`. Note that the `top-left`, `bottom-left`, `top-right`, and `bottom-right` values modify the horizontal alignment of the popover.

```javascript live noinline
function PopoverDemo(props) {
  const [pos, setPos] = React.useState('top')
  const [open, setOpen] = React.useState(true)

  return (
    <Box>
      <Heading as="h3" sx={{fontSize: 3}}>
        Caret Position
      </Heading>
      <CaretSelector current={pos} onChange={setPos} />
      <Heading as="h3" sx={{fontSize: 3}}>
        Popover Visibility
      </Heading>
      <Box my={2}>
        <label>
          <input type="checkbox" value={open} checked={open} onChange={() => setOpen(open => !open)} /> Open
        </label>
      </Box>

      <Box position="relative" pt={4}>
        <Popover relative open={open} caret={pos}>
          <Popover.Content>
            <Heading sx={{fontSize: 2}}>
              <code>{pos}</code> caret
            </Heading>
            <Text as="p">Message about this particular piece of UI.</Text>
            <Button onClick={() => setOpen(false)}>Got it!</Button>
          </Popover.Content>
        </Popover>
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

render(<PopoverDemo />)
```

## Props

### Popover

<PropsTable>
  <PropsTableRow
    name="as"
    defaultValue="div"
    type="string"
    description="Sets the underlying HTML tag for the component"
  />
  <PropsTableRow
    name="caret"
    defaultValue="'top'"
	    type={`| 'top'
| 'bottom'
| 'left'
| 'right'
| 'bottom-left'
| 'bottom-right'
| 'top-left'
| 'top-right'
| 'left-bottom'
| 'left-top'
| 'right-bottom'
| 'right-top'
  `}
    description="Controls the position of the caret"
  />
  <PropsTableRow
    name="open"
    defaultValue="false"
    type="boolean"
    description="Controls the visibility of the popover."
  />
  <PropsTableRow
    name="relative"
    defaultValue="false"
    type="boolean"
    description="Set to true to render the popover using relative positioning. "
  />
  <PropsTableSxRow />
</PropsTable>

### Popover.Content

<PropsTable>
  <PropsTableRow
    name="as"
    defaultValue="div"
    type="string"
    description="Sets the underlying HTML tag for the component"
  />
  <PropsTableSxRow />
</PropsTable>

## Status

<ComponentChecklist
items={{
    propsDocumented: true,
    noUnnecessaryDeps: true,
    adaptsToThemes: true,
    adaptsToScreenSizes: true,
    fullTestCoverage: true,
    usedInProduction: false,
    usageExamplesDocumented: false,
    designReviewed: false,
    a11yReviewed: false,
    stableApi: false,
    addressedApiFeedback: false,
    hasDesignGuidelines: false,
    hasFigmaComponent: false
  }}
/>
