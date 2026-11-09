# ButtonBase

`ButtonBase` is the styled lower-level button primitive behind `Button`, `IconButton`, and `LinkButton`. Reach for it only when building a new button-like control that should retain Primer's base styling; prefer `Button` for ordinary actions.

Import: `import {ButtonBase} from '@primer/react-tailwind/ButtonBase'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {ButtonBase} from '@primer/react-tailwind/ButtonBase'
;<ButtonBase type="button">Do something</ButtonBase>
```

## API notes

`className` accepts a string or a Base UI state callback; base button classes are retained.

## Composition

Use as the foundation for locally composed button controls. `Button` builds on this primitive.

## Accessibility

Supply a clear accessible name and use native `type` and `disabled` semantics.

## Data attributes

The root defaults to `data-component="ButtonBase"`.

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

## Props

- `data-component`: `string` — Default `'ButtonBase'`. Overrides the marker used to identify this element in tests and styling.

## Differences from `@primer/react`

- The component is a stable replacement for the experimental legacy export.
- Preserve behavioral props, but remove `sx` and styled-system props.
- Recheck custom selectors tied to legacy CSS-module class names.
