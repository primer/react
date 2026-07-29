# CheckboxGroup

`CheckboxGroup` groups checkbox primitives and supplies their shared controlled or uncontrolled state.

Import: `import {CheckboxGroup} from '@primer/react-tailwind/CheckboxGroup'`

## Props

- `className`: `string | ((state: CheckboxGroupState) => string | undefined)`

## Label props

- `visuallyHidden`: `boolean`

## Validation props

- `variant`: `"error" | "success"`

## Differences from `@primer/react`

- Use `Label`, `Caption`, and `Validation` parts for group metadata; set `visuallyHidden` only when another visible label exists.
