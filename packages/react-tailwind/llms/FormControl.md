# FormControl

`FormControl` is a composable field wrapper that provides label, caption, validation, and control association.

Import: `import {FormControl} from '@primer/react-tailwind/FormControl'`

## Props

- `caption`: `React.ReactNode` — Supplies the caption region. Takes precedence over a matching `FormControl.Caption` child.
- `className`: `string | ((state: FieldRootState) => string | undefined)`
- `label`: `React.ReactNode` — Supplies the label region. Takes precedence over a matching `FormControl.Label` child.
- `layout`: `"horizontal" | "vertical"` — Default `'vertical'`. Whether the label sits above the control or beside it, as it does for a checkbox or radio.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `FormControl.LeadingVisual` child.
- `required`: `boolean` — Default `false`. Marks the field required, which is reflected on the control and shown on the label.
- `validation`: `React.ReactNode` — Supplies the validation region. Takes precedence over a matching `FormControl.Validation` child.

## Label props

- `className`: `string | ((state: FieldLabelState) => string | undefined)`
- `requiredIndicator`: `boolean` — Default `true`. Shows the required marker. Set `false` to keep the field required without marking it.
- `requiredText`: `string` — Text used for the required marker in place of the default.
- `visuallyHidden`: `boolean` — Hides the label visually while keeping it available to assistive technology.

## Caption props

- `className`: `string | ((state: FieldDescriptionState) => string | undefined)`

## Validation props

- `className`: `string`
- `variant`: `"error" | "success"` — Whether the message reports a problem or confirms success.

## Differences from `@primer/react`

- `label`, `caption`, `validation`, and `leadingVisual` accept an element for the corresponding region and take precedence over a matching child. Regions render in place rather than being relocated, because horizontal layout positions parts by selector. A custom control does not need a region prop: `FormControl` distributes `id`, `name`, `required`, `disabled`, `aria-describedby`, and `aria-invalid` through context, so any control calling `useFormControlForwardedProps` is wired without being identified.
