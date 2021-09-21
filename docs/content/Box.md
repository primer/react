---
title: Box
description: A low-level utility component that accepts styled system props to enable custom theme-aware styling
source: https://github.com/primer/react/blob/main/src/Box.tsx
---

import {Props} from '../src/props'
import {Box} from '@primer/components'

```jsx live
<Box color="fg.muted" bg="canvas.subtle" p={3}>
  Hello
</Box>
```

## Props

<Props of={Box} />

Box also accepts all [styled system props](https://styled-system.com/table/).

## Examples

### Border on all sides

```jsx live
<Box borderColor="border.default" borderWidth={1} borderStyle="solid" p={3}>
  Hello
</Box>
```

### Border on one side

```jsx live
<Box borderColor="border.default" borderBottomWidth={1} borderBottomStyle="solid" pb={3}>
  Hello
</Box>
```

### Flexbox

Use Box to create [flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox) layouts.

```jsx live
<Box display="flex">
  <Box p={3} borderColor="border.default" borderWidth={1} borderStyle="solid">
    1
  </Box>
  <Box flexGrow={1} p={3} borderColor="border.default" borderWidth={1} borderStyle="solid">
    2
  </Box>
  <Box p={3} borderColor="border.default" borderWidth={1} borderStyle="solid">
    3
  </Box>
</Box>
```

### Grid

Use Box to create [grid](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids) layouts.

```jsx live
<Box display="grid" gridTemplateColumns="1fr 1fr" gridGap={3}>
  <Box p={3} borderColor="border.default" borderWidth={1} borderStyle="solid">
    1
  </Box>
  <Box p={3} borderColor="border.default" borderWidth={1} borderStyle="solid">
    2
  </Box>
  <Box p={3} borderColor="border.default" borderWidth={1} borderStyle="solid">
    3
  </Box>
</Box>
```
