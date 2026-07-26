# Alignment

## From: `@primer/react`

Legacy RadioGroup supplies `Label`, `Caption`, and `Validation` slots around radio choices and depends on Primer styling for group layout and focus presentation.

## To: `@primer/react-tailwind`

RadioGroup preserves `Label`, `Caption`, and `Validation` compound slots around a Base UI radio-group primitive. Base UI owns roving focus, selection, keyboard interaction, and controlled/uncontrolled group value state; local Radio controls retain native form behavior. The stable group uses normal children and local Tailwind classes.

## Migration notes

- Use `value`, `defaultValue`, and `onValueChange` for group selection; do not duplicate the primitive's state.
- Use `visuallyHidden` only if another accessible group name is supplied.
- Keep captions and validation associated with the group.
- `sx` and styled-system props are unsupported; use `className`.
