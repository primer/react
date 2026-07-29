# CheckboxGroup

`CheckboxGroup` groups checkbox primitives and supplies their shared controlled or uncontrolled state.

Import: `import {CheckboxGroup} from '@primer/react-tailwind/CheckboxGroup'`

## Props

- `className`: `BaseCheckboxGroup.Props['className']`

## CheckboxGroupLabel props

- `visuallyHidden`: `boolean`

## CheckboxGroupValidation props

- `variant`: `'error' | 'success'`

## Differences from `@primer/react`

- Use `Label`, `Caption`, and `Validation` parts for group metadata; set `visuallyHidden` only when another visible label exists.

