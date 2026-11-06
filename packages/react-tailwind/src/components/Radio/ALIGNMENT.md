# Alignment

## From: `@primer/react`

Legacy Radio is a styled form control with leading visual examples, disabled, caption, checked, keyboard, focus, controlled, and native form behavior.

## To: `@primer/react-tailwind`

Radio keeps native radio form semantics and local leading-visual composition while Base UI supplies checked-state, keyboard, focus, and callback behavior. It follows controlled/uncontrolled checked-state conventions and composes with local FormControl or RadioGroup rather than adding avatar or styled-system dependencies.

## Migration notes

- Use a visible label or associated FormControl label for every radio.
- For a group of choices, prefer RadioGroup so roving focus and a shared value are managed consistently.
- Keep avatar visuals in consumer composition; Radio does not import an Avatar dependency.
- Use `className`, not `sx` or styled-system props.
