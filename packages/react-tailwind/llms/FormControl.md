# FormControl

`FormControl` is a composable field wrapper that provides label, caption, validation, and control association.

Import: `import {FormControl} from '@primer/react-tailwind/FormControl'`

## Props

- `caption`: `React.ReactNode` — Supplies the caption region. Takes precedence over a matching `FormControl.Caption` child.
- `className`: `Field.Root.Props['className']`
- `label`: `React.ReactNode` — Supplies the label region. Takes precedence over a matching `FormControl.Label` child.
- `layout`: `'horizontal' | 'vertical'` — Default `'vertical'`.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `FormControl.LeadingVisual` child.
- `required`: `boolean` — Default `false`.
- `validation`: `React.ReactNode` — Supplies the validation region. Takes precedence over a matching `FormControl.Validation` child.

## FormControlLabel props

- `className`: `Field.Label.Props['className']`
- `requiredIndicator`: `boolean` — Default `true`.
- `requiredText`: `string`
- `visuallyHidden`: `boolean`

## FormControlCaption props

- `className`: `Field.Description.Props['className']`

## FormControlValidation props

- `className`: `string`
- `variant`: `'error' | 'success'`

## Differences from `@primer/react`

- `label`, `caption`, `validation`, and `leadingVisual` accept an element for the corresponding region and take precedence over a matching child. Regions render in place rather than being relocated, because horizontal layout positions parts by selector. A custom control does not need a region prop: `FormControl` distributes `id`, `name`, `required`, `disabled`, `aria-describedby`, and `aria-invalid` through context, so any control calling `useFormControlForwardedProps` is wired without being identified.

