# ButtonGroup

`ButtonGroup` joins related buttons into a single segmented control. Use `SegmentedControl` instead when the buttons select between mutually exclusive views.

Import: `import {ButtonGroup} from '@primer/react-tailwind/ButtonGroup'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `orientation`: `"horizontal" | "vertical" | null`

## Differences from `@primer/react`

- Compose a local Tooltip or ActionMenu around grouped controls rather than passing overlay behavior to ButtonGroup.
