# Checkbox

`Checkbox` is a form-associated binary control. Pair it with a native label or `FormControl.Label`.

Import: `import {Checkbox} from '@primer/react-tailwind/Checkbox'`

Forwards unrecognized props to Base UI's [`Checkbox.Root`](https://base-ui.com/react/components/checkbox#root), so it also accepts that part's props.

## Props

- `className`: `string | ((state: CheckboxRootState) => string | undefined)`

## Differences from `@primer/react`

- Keep a native label or FormControl label associated with each checkbox.
