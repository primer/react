# Alignment

## From: `@primer/react`

Legacy FormControl supplies label, caption, validation, required and leading-visual composition, including integrations with older complex Primer inputs.

## To: `@primer/react-tailwind`

The stable compound API provides `Label`, `Caption`, `Validation`, `LeadingVisual`, and `Control` around local form elements. Base UI provides field semantics, while a shared context forwards `id`, `name`, `disabled`, `required`, and accessibility references to package controls without reordering the remaining children. The deprecated `TextInputWithTokens` integration is represented in examples through `Token` composition rather than restored as a public API.

## Migration notes

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
