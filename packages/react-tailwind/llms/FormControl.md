# FormControl

`FormControl` is a composable field wrapper that provides label, caption, validation, and control association.

Import: `import {FormControl} from '@primer/react-tailwind/FormControl'`

Forwards unrecognized props to Base UI's [`Field.Root`](https://base-ui.com/react/components/field#root), so it also accepts that part's props.

## Props

- `caption`: `React.ReactNode` — Supplies the caption region. Takes precedence over a matching `FormControl.Caption` child.
- `className`: `string | ((state: FieldRootState) => string | undefined)`
- `label`: `React.ReactNode` — Supplies the label region. Takes precedence over a matching `FormControl.Label` child.
- `layout`: `"horizontal" | "vertical"` — Whether the label sits above the control or beside it. Defaults to `horizontal` when a direct child is a `Checkbox` or `Radio`, and `vertical` otherwise.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `FormControl.LeadingVisual` child.
- `required`: `boolean` — Default `false`. Marks the field required, which is reflected on the control and shown on the label.
- `validation`: `React.ReactNode` — Supplies the validation region. Takes precedence over a matching `FormControl.Validation` child.

## FormControl.Label

Forwards unrecognized props to Base UI's [`Field.Label`](https://base-ui.com/react/components/field#label), so it also accepts that part's props.

- `className`: `string | ((state: FieldLabelState) => string | undefined)`
- `requiredIndicator`: `boolean` — Default `true`. Shows the required marker. Set `false` to keep the field required without marking it.
- `requiredText`: `string` — Text used for the required marker in place of the default.
- `visuallyHidden`: `boolean` — Hides the label visually while keeping it available to assistive technology.

## FormControl.Caption

Forwards unrecognized props to Base UI's [`Field.Description`](https://base-ui.com/react/components/field#description), so it also accepts that part's props.

- `className`: `string | ((state: FieldDescriptionState) => string | undefined)`

## FormControl.Validation

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `className`: `string`
- `variant`: `"error" | "success"` — Whether the message reports a problem or confirms success.

## FormControl.LeadingVisual

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## FormControl.Control

Forwards unrecognized props to Base UI's [`Field.Control`](https://base-ui.com/react/components/field#control), so it also accepts that part's props.

## Differences from `@primer/react`

- `label`, `caption`, `validation`, and `leadingVisual` accept an element for the corresponding region and take precedence over a matching child. Regions render in place rather than being relocated, because horizontal layout positions parts by selector. A custom control does not need a region prop: `FormControl` distributes `id`, `name`, `required`, `disabled`, `aria-describedby`, and `aria-invalid` through context, so any control calling `useFormControlForwardedProps` is wired without being identified.
