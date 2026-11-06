# Alignment

## From: `@primer/react`

Legacy Token, IssueLabelToken, and TokenBase support removable and interactive token patterns, including the accessibility requirement that an interactive token not contain a nested interactive remove control.

## To: `@primer/react-tailwind`

The stable API keeps `Token`, `IssueLabelToken`, `TokenBase`, and `TokenRemoveButton`. TokenBase supports text, size, remove behavior, selected state, href, disabled state, and simple element choice. Token and IssueLabelToken share internal text and size-aware removal layers.

Interactive removable tokens compose their primary action and pointer removal affordance as siblings inside the token shell. Non-interactive tokens retain a labelled remove button. IssueLabelToken parses arbitrary CSS colors once and exposes light, dark, hover, border, and selected color models through package CSS. No Base UI primitive is used.

## Migration notes

- Do not nest a remove button inside a link/button token.
- Use `onRemove` and the documented composition for keyboard removal.
- `as="button"` defaults to `type="button"`; pass `type="submit"` or `type="reset"` explicitly for form actions.
- Keep non-interactive token remove controls visibly and programmatically named; interactive tokens include keyboard-removal instructions in the primary action's accessible name.
- `sx` and styled-system props are unsupported; use `className`.
