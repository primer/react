# Alignment

## From: `@primer/react`

Legacy RadioGroup supplies `Label`, `Caption`, and `Validation` slots around radio choices and depends on Primer styling for group layout and focus presentation.

## To: `@primer/react-tailwind`

RadioGroup preserves `Label`, `Caption`, and `Validation` compound slots around a Base UI radio-group primitive, wrapped in a Base UI `Fieldset` so `disabled` reaches every nested FormControl. Base UI owns roving focus, selection, keyboard interaction, and controlled/uncontrolled group value state; local Radio controls retain native form behavior. Upstream puts the label, caption, and a hidden copy of the validation inside a `<legend>`, which folds them all into the group's name. Here the label alone names the radiogroup (`aria-labelledby`), and the validation and caption describe it (`aria-describedby`). The stable group uses normal children and local Tailwind classes.

## Migration notes

- Use `value`, `defaultValue`, and `onValueChange` for group selection; do not duplicate the primitive's state.
- Use `visuallyHidden` only if another accessible group name is supplied. `Label` is a Base UI `Fieldset.Legend`, so it must stay inside the group.
- `aria-labelledby` on the group takes precedence over `Label`. Without either, an enclosing `FormControl.Label` names the group.
- `required` sets `aria-required` on the radiogroup and `required` on its inputs, and shows a visual `*` on the label. Upstream announces ", required" inside the legend and also exposes the `*`.
- `Caption` renders a `div` rather than a `p`.
- A disabled group (`disabled` on RadioGroup or an enclosing FormControl) leaves the tab order, like native disabled radios, and mutes its label and nested leading visuals. Base UI's roving focus still treats individually disabled radios differently from native radios: if the checked radio is disabled, it remains the group's tab stop, and if every radio is disabled individually, the group stays reachable but inert. Disable the group instead of each radio when no choice is available.
- `sx` and styled-system props are unsupported; use `className`.
