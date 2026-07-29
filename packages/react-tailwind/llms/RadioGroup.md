# RadioGroup

`RadioGroup` is a Base UI radio group with roving focus and single-value selection.

Import: `import {RadioGroup} from '@primer/react-tailwind/RadioGroup'`

## Props

- `className`: `string | ((state: RadioGroupState) => string | undefined)`

## Label props

- `visuallyHidden`: `boolean` — Hides the label visually while keeping it available to assistive technology.

## Validation props

- `variant`: `"error" | "success"` — Whether the message reports a problem or confirms success.

## Differences from `@primer/react`

- Use `value`, `defaultValue`, and `onValueChange` for group selection; do not duplicate the primitive's state.
