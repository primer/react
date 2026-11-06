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
- `variant` (required): `"error" | "success"` — Whether the message reports a problem or confirms success.

## FormControl.LeadingVisual

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## FormControl.Control

Forwards unrecognized props to Base UI's [`Field.Control`](https://base-ui.com/react/components/field#control), so it also accepts that part's props.

## Differences from `@primer/react`

- `label`, `caption`, `validation`, and `leadingVisual` accept an element for the corresponding region and replace matching children, including parts inside fragments or native DOM wrappers. Other children retain their order and state. A custom control does not need a region prop: `FormControl` distributes `id`, `name`, `required`, `disabled`, and accessibility attributes through context to controls using `useFormControlForwardedProps`.
- Region props also recognize parts inside fragments and native wrappers. Custom wrappers must expose and forward any explicit part ID or validation variant so the field can establish the corresponding relationships.
- Plain text and single native caption or validation props are associated as descriptions, including inside fragments. Wrap multiple nodes in the corresponding FormControl part or an element with an ID. Use `Validation` with a variant to set the error state or announce success.
- Package controls consume FormControl metadata automatically; use `FormControl.Control` for a native input or `useFormControlForwardedProps` when authoring a custom control.
- A package control's explicit `id` takes precedence over the field ID when composed directly or inside a native DOM wrapper. For an unrecognized custom wrapper with its own control ID, supply the same ID to `FormControl` or connect `Label` with `htmlFor`.
- `FormControl.Control` preserves its field ID in server-rendered HTML as well as after hydration. Base UI radio and switch inputs use Base UI's generated ID until hydration, so their labels follow that ID and then the explicit field or control ID.
- `layout` defaults to `horizontal` when a direct child is a `Checkbox` or `Radio`, as upstream infers it. Set `layout` explicitly for a wrapped choice control, which identity matching cannot recognize, or to keep a choice control vertical. Horizontal layout renders a non-choice control exactly once, which a unit test covers; upstream needed a fix for duplicated input there.
- A raw custom input or a `SelectPanel` anchor works inside FormControl by wiring its own `id`, `htmlFor`, and `aria-*` references, as the `WithCustomInput` and `WithSelectPanel` stories show.
- A disabled control's label and leading visual use the disabled control foreground colour, as upstream does. An enabled leading visual uses the default foreground colour.
- A leading visual's content is at least 16px square, or 24px when the FormControl has a caption, as upstream does, so a default-size icon grows beside a two-line label and caption.
- Vertical layout spaces parts with a top margin, as upstream does, so a part's own inline margin can override it. A `visuallyHidden` label leaves the flow and does not space the control below it.
- In horizontal layout, `Checkbox` and `Radio` sit 2px below the label's top edge, matching upstream's choice-input offset.
- Package text controls receive a success or error validation status from `FormControl.Validation`. An invalid field or exceeded character limit still takes precedence over a control's own status.
- `visuallyHidden` keeps the label available to assistive technology while hiding it visually.
- `sx` and styled-system props are unsupported; use `className`.
