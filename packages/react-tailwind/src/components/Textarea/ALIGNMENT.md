# Alignment

## From: `@primer/react`

Legacy Textarea supports character-limit UI, `block`, `autoSize`, pixel-height configuration, validation status, a deprecated `contrast` background, styled-system props, and native textarea rows, columns, resizing, and form semantics.

## To: `@primer/react-tailwind`

Textarea is a native textarea primitive with normal DOM value handling plus the Primer `block`, `autoSize`, `characterLimit`, `minHeight`, `maxHeight`, `resize`, and `validationStatus` props. Its character counter shares the internal counter and live-region implementation with TextInput. It composes with FormControl for captions, validation, and labels and does not use Base UI.

## Migration notes

- `block`, `autoSize`, `characterLimit`, `minHeight`, `maxHeight`, `resize`, and `validationStatus` keep their Primer meaning; `autoSize` uses CSS `field-sizing: content`.
- Going over `characterLimit` always applies the error state.
- The deprecated `contrast` prop is omitted; drop it to use the default background.
- Keep controlled values on the native `value`/`defaultValue`/`onChange` contract.
- `sx` and styled-system props are unsupported.
