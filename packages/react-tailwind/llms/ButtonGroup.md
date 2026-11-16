# ButtonGroup

`ButtonGroup` joins related buttons into a single segmented control. Use `SegmentedControl` instead when the buttons select between mutually exclusive views.

Import: `import {ButtonGroup} from '@primer/react-tailwind/ButtonGroup'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {ButtonGroup} from '@primer/react-tailwind/ButtonGroup'
;<ButtonGroup>
  <button type="button">One</button>
</ButtonGroup>
```

## Composition

Compose adjacent controls as children; the group does not clone or modify them.

## Accessibility

Label groups of controls with `aria-label`, and use `role="toolbar"` when appropriate. A toolbar keeps one button in the tab order. The arrow keys in its orientation, Home, and End move focus between buttons, wrapping at either end.

## Data attributes

The root exposes `data-component="ButtonGroup"` and `data-orientation`.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'div'`. Element to render as the group root.
- `orientation`: `"horizontal" | "vertical"` — Default `'horizontal'`. Direction the buttons are joined in.
- `role`: `AriaRole` — Default `'group'`. Role of the group. A `toolbar` keeps one button in the tab order and moves focus between buttons with the arrow keys in its orientation, Home, and End.

## Differences from `@primer/react`

- Compose a local Tooltip or ActionMenu around grouped controls rather than passing overlay behavior to ButtonGroup.
- Build a split dropdown from sibling Button and ActionMenu trigger controls. Render the menu trigger as an `IconButton` with `ActionMenu.Trigger render={...}`. The legacy story passes the undocumented `icon` prop to `ActionMenu.Button`, which renders a wider trigger in the default foreground color; the IconButton trigger is square and uses IconButton's muted icon color.
- Retain proper toolbar labels when the group is a command toolbar.
- With `role="toolbar"`, one button stays in the tab order and the arrow keys move focus between buttons, wrapping at either end, as upstream does. Home and End also jump to the first and last button, and a vertical toolbar uses the up and down arrows and sets `aria-orientation`, matching ActionBar's toolbar. Upstream binds only the left and right arrows.
- The root defaults to `role="group"`, where upstream renders no role. Children render directly inside the root; upstream wraps each child in a `div`. Joined borders and corner radii target the root's direct children structurally, so Base UI triggers rendered as buttons still join even though their `data-component` names the trigger part.
- Use `className` for layout adjustments; `sx` and styled-system props are unsupported.
