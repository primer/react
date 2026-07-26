# Alignment

## From: `@primer/react`

Legacy TextInput includes built-in leading and trailing visuals, icon actions, loaders, character counters, styled-system props, and native input behavior.

## To: `@primer/react-tailwind`

TextInput preserves the native input contract while owning the visual wrapper needed for `leadingVisual`, `trailingVisual`, `loading`, `TextInput.Action`, validation, and character-count presentation. It composes the package Spinner, IconButton, Tooltip, live-region, and visually-hidden primitives rather than recreating their behavior. FormControl supplies labels, captions, required indication, and validation messages.

## Migration notes

- Continue using `leadingVisual`, `trailingVisual`, `trailingAction`, `loading`, and `characterLimit`.
- `TextInput.Action` is intentionally icon-only and requires both `icon` and `aria-label`; deprecated text-action and variant APIs are omitted.
- Keep value state on the native input (`value`, `defaultValue`, and `onChange`).
- Use FormControl for labels, captions, required indication, and validation.
- `className` styles the visual root, while native input attributes and the forwarded ref apply to the underlying input.
- Deprecated `icon`, styled width props, and `variant` are omitted.
- Replace `sx` and styled-system props with `className`.
