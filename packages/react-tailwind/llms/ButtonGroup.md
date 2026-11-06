# ButtonGroup

`ButtonGroup` joins related buttons into a single segmented control. Use `SegmentedControl` instead when the buttons select between mutually exclusive views.

Import: `import {ButtonGroup} from '@primer/react-tailwind/ButtonGroup'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'div'`. Element to render as the group root.
- `orientation`: `"horizontal" | "vertical"` — Default `'horizontal'`. Direction the buttons are joined in.
- `role`: `AriaRole` — Default `'group'`. Role of the group. A `toolbar` keeps one button in the tab order and moves focus between buttons with the arrow keys in its orientation, Home, and End.

## Differences from `@primer/react`

- Compose a local Tooltip or ActionMenu around grouped controls rather than passing overlay behavior to ButtonGroup.
