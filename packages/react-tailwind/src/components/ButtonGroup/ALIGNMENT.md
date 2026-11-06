# Alignment

## From: `@primer/react`

Legacy ButtonGroup is a layout wrapper commonly used with tooltips, menus, loading buttons, links, inactive controls, and split-dropdown examples.

## To: `@primer/react-tailwind`

ButtonGroup is a presentational grouping container that preserves grouped controls and toolbar semantics. It does not own overlay, loading, link, or split-dropdown behavior and does not use Base UI. Tooltip and menu behavior stay with their dedicated local primitives, while Button and LinkButton own their own semantics.

## Migration notes

- Compose a local Tooltip or ActionMenu around grouped controls rather than passing overlay behavior to ButtonGroup.
- Build a split dropdown from sibling Button and ActionMenu trigger controls. Render the menu trigger as an `IconButton` with `ActionMenu.Trigger render={...}`. The legacy story passes the undocumented `icon` prop to `ActionMenu.Button`, which renders a wider trigger in the default foreground color; the IconButton trigger is square and uses IconButton's muted icon color.
- Retain proper toolbar labels when the group is a command toolbar.
- With `role="toolbar"`, one button stays in the tab order and the arrow keys move focus between buttons, wrapping at either end, as upstream does. Home and End also jump to the first and last button, and a vertical toolbar uses the up and down arrows and sets `aria-orientation`, matching ActionBar's toolbar. Upstream binds only the left and right arrows.
- The root defaults to `role="group"`, where upstream renders no role. Children render directly inside the root; upstream wraps each child in a `div`. Joined borders and corner radii target the root's direct children structurally, so Base UI triggers rendered as buttons still join even though their `data-component` names the trigger part.
- Use `className` for layout adjustments; `sx` and styled-system props are unsupported.
