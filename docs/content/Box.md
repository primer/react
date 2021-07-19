---
title: Box
---

import {Props} from '../src/props'
import {Box} from '@primer/components'

Box is a low-level utility component that accepts [styled system props](https://styled-system.com/table/) to enable custom theme-aware styling.

```jsx live
<Box color="text.secondary" bg="bg.tertiary" p={3}>
  Hello
</Box>
```

## Props

<Props of={Box} />

Box also accepts all [styled system props](https://styled-system.com/table/).

## Examples

### Border on all sides

```jsx live
<Box borderColor="border.primary" borderWidth={1} borderStyle="solid" p={3}>
  Hello
</Box>
```

### Border on one side

```jsx live
<Box borderColor="border.primary" borderBottomWidth={1} borderBottomStyle="solid" pb={3}>
  Hello
</Box>
```

### Flexbox

Use Box to create [flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox) layouts.

```jsx live
<Box display="flex">
  <Box p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    1
  </Box>
  <Box flexGrow={1} p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    2
  </Box>
  <Box p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    3
  </Box>
</Box>
```

### Grid

Use Box to create [grid](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids) layouts.

```jsx live
<Box display="grid" gridTemplateColumns="1fr 1fr" gridGap={3}>
  <Box p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    1
  </Box>
  <Box p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    2
  </Box>
  <Box p={3} borderColor="border.primary" borderWidth={1} borderStyle="solid">
    3
  </Box>
</Box>
```
