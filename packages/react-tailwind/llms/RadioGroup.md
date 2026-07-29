# RadioGroup

`RadioGroup` is a Base UI radio group with roving focus and single-value selection.

Import: `import {RadioGroup} from '@primer/react-tailwind/RadioGroup'`

## Props

- `className`: `BaseRadioGroup.Props<Value>['className']`

## RadioGroupLabel props

- `visuallyHidden`: `boolean`

## RadioGroupValidation props

- `variant`: `'error' | 'success'`

## Differences from `@primer/react`

- Use `value`, `defaultValue`, and `onValueChange` for group selection; do not duplicate the primitive's state.

