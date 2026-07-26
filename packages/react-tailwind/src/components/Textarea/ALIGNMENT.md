# Alignment

## From: `@primer/react`

Legacy Textarea supports character-limit UI, `block`, pixel-height configuration, styled-system props, and native textarea rows, columns, resizing, validation, and form semantics.

## To: `@primer/react-tailwind`

Textarea is a native textarea primitive with normal DOM value handling, `rows`, `cols`, `resize`, required, disabled, and form behavior. It composes with FormControl for captions, validation, and labels and does not use Base UI. Width and height presentation are local Tailwind or native textarea attributes, not a pixel-height compatibility API.

## Migration notes

- Replace `block` and pixel-height props with `className` sizing utilities or native rows/cols.
- Implement character limits and counters in consumer state and markup.
- Keep controlled values on the native `value`/`defaultValue`/`onChange` contract.
- `sx` and styled-system props are unsupported.
