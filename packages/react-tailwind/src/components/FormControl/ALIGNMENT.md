# Alignment

## From: `@primer/react`

Legacy FormControl supplies label, caption, validation, required and leading-visual composition, including integrations with older complex Primer inputs.

## To: `@primer/react-tailwind`

The stable compound API provides `Label`, `Caption`, `Validation`, `LeadingVisual`, and `Control` around local form elements. Base UI provides field semantics, while a shared context forwards `id`, `name`, `disabled`, `required`, and description references to package controls without extracting or moving children. The deprecated `TextInputWithTokens` integration is represented in examples through `Token` composition rather than restored as a public API.

## Migration notes

- `label`, `caption`, `validation`, and `leadingVisual` accept an element for the corresponding region and take precedence over a matching child. Regions render in place rather than being relocated, because horizontal layout positions parts by selector. A custom control does not need a region prop: `FormControl` distributes `id`, `name`, `required`, `disabled`, `aria-describedby`, and `aria-invalid` through context, so any control calling `useFormControlForwardedProps` is wired without being identified.
- Package controls consume FormControl metadata automatically; use `FormControl.Control` for a native input or `useFormControlForwardedProps` when authoring a custom control.
- Set `layout="horizontal"` explicitly for choice controls. The modern API does not infer layout from child component identity.
- Use `visuallyHidden` only with another accessible name.
- `sx` and styled-system props are unsupported; use `className`.
