---
title: PointerBox
description: A customisable, bordered Box with a caret pointer
componentId: pointer_box
status: Alpha
source: https://github.com/primer/react/blob/main/src/PointerBox.tsx
---

## Examples

```jsx live
<PointerBox minHeight={100} sx={{m: 4, p: 2, bg: 'success.subtle', borderColor: 'success.emphasis'}}>
  PointerBox
</PointerBox>
```

### Caret position

```javascript live noinline
function PointerBoxDemo(props) {
  const [pos, setPos] = React.useState('top')

  return (
    <Box>
      <Heading as="h3" sx={{fontSize: 3}}>
        Caret Position
      </Heading>
      <CaretSelector current={pos} onChange={setPos} />
      <Box position="relative">
        <PointerBox
          minHeight={100}
          caret={pos}
          sx={{m: 4, p: 2, bg: 'success.subtle', borderColor: 'success.emphasis'}}
        >
          Content
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
    <label key={dir}>
      <input
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

## Props

<PropsTable>
  <PropsTableRow
    name="caret"
    type={`| 'top'
| 'top-left'
| 'top-right'
| 'right'
| 'right-top'
| 'right-bottom'
| 'bottom'
| 'bottom-left'
| 'bottom-right'
| 'left'
| 'left-top'
| 'left-bottom'`}
    defaultValue="'bottom'"
    description="Sets the location of the caret. The format is [edge]-[position on edge]. For example, right-top will position the caret on the top of the right edge of the box. Use top"
  />
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

## Related components

- [Popover](/Popover)
