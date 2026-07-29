# Select

`Select` is a styled native `<select>` with Primer control tokens. Native browser behavior owns option menus, keyboard operation, focus, form association, and controlled or uncontrolled values.

Import: `import {Select} from '@primer/react-tailwind/Select'`

Renders a `<select>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `block`: `boolean` — Default `false`. Makes the visible control fill its container.
- `className`: `string` — Classes applied to the visible control wrapper.
- `contrast`: `boolean` — Default `false`. Uses the inset control background token.
- `placeholder`: `string` — Text rendered as an initially selected empty-value option.
- `size`: `ControlSize` — Primer control height and typography.
- `validationStatus`: `ValidationStatus` — Applies error or success control styling.

## Differences from `@primer/react`

- Replace `Select.Trigger`, `Value`, `Portal`, `Positioner`, `Popup`, `List`, `Item`, `Group`, and `GroupLabel` with `Select`, native options, and optgroups.
