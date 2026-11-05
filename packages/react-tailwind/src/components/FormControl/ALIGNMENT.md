# Alignment

## From: `@primer/react`

Legacy FormControl supplies label, caption, validation, required and leading-visual composition, including integrations with older complex Primer inputs.

## To: `@primer/react-tailwind`

The stable compound API provides `Label`, `Caption`, `Validation`, `LeadingVisual`, and `Control` around local form elements. Base UI provides field semantics, while a shared context forwards `id`, `name`, `disabled`, `required`, and description references to package controls without extracting or moving children. The deprecated `TextInputWithTokens` integration is represented in examples through `Token` composition rather than restored as a public API.

## Migration notes

- `label`, `caption`, `validation`, and `leadingVisual` accept an element for the corresponding region and take precedence over a matching child. Regions render in place rather than being relocated, because horizontal layout positions parts by selector. A custom control does not need a region prop: `FormControl` distributes `id`, `name`, `required`, `disabled`, `aria-describedby`, and `aria-invalid` through context, so any control calling `useFormControlForwardedProps` is wired without being identified.
- Package controls consume FormControl metadata automatically; use `FormControl.Control` for a native input or `useFormControlForwardedProps` when authoring a custom control.
- Set `layout="horizontal"` explicitly for choice controls. The modern API does not infer layout from child component identity. Horizontal layout renders a non-choice control exactly once, which a unit test covers; upstream needed a fix for duplicated input there.
- A raw custom input or a `SelectPanel` anchor works inside FormControl by wiring its own `id`, `htmlFor`, and `aria-*` references, as the `WithCustomInput` and `WithSelectPanel` stories show.
- A disabled control's label and leading visual use the disabled control foreground colour, as upstream does. An enabled leading visual uses the default foreground colour.
- A leading visual's content is at least 16px square, or 24px when the FormControl has a caption, as upstream does, so a default-size icon grows beside a two-line label and caption.
- Vertical layout spaces parts with a top margin, as upstream does, so a part's own inline margin can override it. A `visuallyHidden` label leaves the flow and does not space the control below it.
- In horizontal layout, `Checkbox` and `Radio` sit 2px below the label's top edge, matching upstream's choice-input offset.
- A success `FormControl.Validation` does not tint the control's border; set `validationStatus="success"` on the control. Upstream forwards the status automatically.
- Use `visuallyHidden` only with another accessible name.
- `sx` and styled-system props are unsupported; use `className`.
