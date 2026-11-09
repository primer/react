# Alignment

## From: `@primer/react`

Legacy TextInput includes built-in leading and trailing visuals, icon actions, loaders, character counters, styled-system props, and native input behavior.

## To: `@primer/react-tailwind`

TextInput preserves the native input contract while owning the visual wrapper needed for `leadingVisual`, `trailingVisual`, `loading`, `TextInput.Action`, validation, and character-count presentation. It composes the package Spinner, IconButton, Tooltip, live-region, and visually-hidden primitives rather than recreating their behavior. FormControl supplies labels, captions, required indication, and validation messages.

## Migration notes

- Continue using `leadingVisual`, `trailingVisual`, `trailingAction`, `loading`, and `characterLimit`.
- `loading` no longer sets `aria-busy` on the wrapper, which GitHub accessibility policy prohibits; the input instead gets `loaderText` as part of its accessible description. Update selectors or tests that relied on `aria-busy`.
- `TextInput.Action` is intentionally icon-only and requires both `icon` and `aria-label`; deprecated text-action and variant APIs are omitted.
- Keep value state on the native input (`value`, `defaultValue`, and `onChange`).
- Use FormControl for labels, captions, required indication, and validation.
- Use `FormControl required` for the label marker and native required state; an explicit `aria-required` is preserved but does not enable native constraint validation.
- `className` styles the visual root, while native input attributes and the forwarded ref apply to the underlying input.
- A `block` input includes its border and padding in its container width, even without a global box-sizing reset.
- Deprecated `contrast`, `icon`, styled width props, and `variant` are omitted. Drop `contrast` only when the default background is intended. To preserve intentional contrast styling, apply a scoped consumer class to `TextInput.className`, which styles the wrapper, not the transparent native input. Read-only controls can use the same class without changing their native `readOnly` behavior.
  ```tsx
  import {FilteredActionList, TextInput} from '@primer/react-tailwind'
  import styles from './Search.module.css'
  <TextInput readOnly value={networkAddress} className={styles.contrastInput} />
  <FilteredActionList
    items={items}
    aria-label="Filter labels"
    textInputProps={{className: styles.contrastInput}}
  />
  ```
  ```css
  .contrastInput {
    background-color: var(--control-bgColor-contrast, var(--bgColor-inset));
  }
  ```
  `FilteredActionList.textInputProps.className` reaches that same TextInput wrapper. The legacy contrast token is a compatibility choice, not a new package default; github-ui may require a narrowly scoped stylelint exception for that declaration. Keep the fallback and host-owned exception local to the compatibility class rather than disabling a rule globally. Verify the class in the consumer's stylesheet/layer order and themes; this does not resolve unrelated global utility collisions.
- Replace `sx` and styled-system props with `className`.
