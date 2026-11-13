# Alignment

## From: `@primer/react`

Legacy CheckboxGroup supplies `Label`, `Caption`, and `Validation` slots around related Checkbox controls, along with legacy layout styling.

## To: `@primer/react-tailwind`

CheckboxGroup keeps `Label`, `Caption`, and `Validation` compound parts around its Base UI-backed group primitive, wrapped in a Base UI `Fieldset` so `disabled` reaches every nested FormControl. Upstream puts the label, caption, and a hidden copy of the validation inside a `<legend>`, which folds them all into the group's name. Here the label alone names the group (`aria-labelledby`), and the validation and caption describe it (`aria-describedby`), so assistive technology announces a short name followed by the details. Individual Checkbox controls retain their native form association; the group owns participating checked values. The stable public surface uses normal children and local classes rather than legacy slot extraction or styled-system props.

## Migration notes

- Use `Label`, `Caption`, and `Validation` parts for group metadata; set `visuallyHidden` only when another visible label exists. `Label` is a Base UI `Fieldset.Legend`, so it must stay inside the group.
- `aria-labelledby` on the group takes precedence over `Label`. Without either, an enclosing `FormControl.Label` names the group.
- `required` shows a visual `*` on the label and adds a hidden "Required" description, because `role="group"` has no `aria-required`. Upstream announces ", required" inside the legend and also exposes the `*`. Neither validates the selection.
- `disabled` disables every nested checkbox and mutes the label and nested leading visuals.
- `Caption` renders a `div` rather than a `p`.
- Replace legacy `onChange(selectedValues, event)` with `onValueChange(selectedValues, details)`. A root `onChange` receives a bubbling React change event instead of the selected array.
- A checkbox with a non-empty `value` (or a `name` when no value is supplied) takes its checked state from the group. Move child `defaultChecked` values into the group's `defaultValue`, or derive a controlled group `value` from existing per-checkbox state and map `onValueChange` back to that state. Without a group default, the selection starts empty.
- `sx` and styled-system props are unsupported; use `className`.
