# Alignment

## From: `@primer/react`

Legacy KeybindingHint chooses platform-specific modifier labels and supports Primer key-formatting variants.

## To: `@primer/react-tailwind`

KeybindingHint remains a presentational shortcut hint with required `keys` and supported `format`, `variant`, and `size` options. It detects the runtime platform for consumers and renders its own semantic shortcut presentation without Base UI. The deterministic platform override seen in stories is test fixture infrastructure, not a production prop.

## Migration notes

- Pass the documented key tokens through `keys`; do not depend on a story platform override.
- Use `format`, `variant`, and `size` rather than legacy styling props.
- Keep the shortcut hint supplemental to the control's accessible name.
- `sx` and styled-system props are unsupported; use `className`.
