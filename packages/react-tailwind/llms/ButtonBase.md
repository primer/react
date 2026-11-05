# ButtonBase

`ButtonBase` is the unstyled button primitive behind `Button`, `IconButton`, and `LinkButton`. Reach for it only when building a new button-like control; prefer `Button` for ordinary actions.

Import: `import {ButtonBase} from '@primer/react-tailwind/ButtonBase'`

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

## Props

- `data-component`: `string` — Default `'ButtonBase'`. Overrides the marker used to identify this element in tests and styling.

## Differences from `@primer/react`

- The component is a stable replacement for the experimental legacy export.
