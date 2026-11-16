# TextInput

`TextInput` is a styled native single-line input with small, medium, and large visual sizes.

Import: `import {TextInput} from '@primer/react-tailwind/TextInput'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`TextInputProps` extends native input attributes and adds `size`, `block`, `monospace`, `leadingVisual`, `trailingVisual`, `trailingAction`, `loading`, `loaderPosition`, `loaderText`, `validationStatus`, and `characterLimit`. Use native `value`, `defaultValue`, `onChange`, `type`, `name`, `required`, `disabled`, and autocomplete attributes. While `loading`, the input adds `loaderText` (default “Loading”) to its accessible description; it does not set `aria-busy`.

For a required field, prefer `required` on `FormControl` so the label receives its required marker and the input participates in native constraint validation. An explicit `aria-required` on `TextInput` is preserved, but by itself does not enable native validation or add a label marker.

## Import

```tsx
import {TextInput} from '@primer/react-tailwind/TextInput'
import {FormControl} from '@primer/react-tailwind/FormControl'
;<FormControl required>
  <FormControl.Label>Email</FormControl.Label>
  <TextInput name="email" type="email" />
</FormControl>
```

## Accessibility, forms, and validation

Use `FormControl.Label` or `aria-label`; retain native form submission and constraint validation. Set `aria-invalid` and compose `FormControl.Validation` for errors or success feedback. Disabled inputs cannot receive focus or edits.

## Keyboard, events, and state

Native input keyboard behavior and `onChange` are unchanged. The visual wrapper exposes `data-component="TextInput"`, `data-focused`, `data-disabled`, and `data-validation`. The native input receives `disabled` and `aria-invalid`.

## Styling and prop destinations

`className` applies to the visual wrapper, not the native input. The forwarded ref, native input attributes, event handlers, and `style` apply to the underlying `<input>`. There is currently no separate input-class prop. Preserve these destinations when wrapping `TextInput`, and do not assume all props target the same element.

Renders an [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `block`: `boolean` — Default `false`. Stretches the input to fill the width of its container.
- `characterLimit`: `number` — Shows a remaining-character count and announces when the limit is near.
- `leadingVisual`: `TextInputVisual` — Icon or text shown inside the input, before the value.
- `loaderPosition`: `"auto" | "leading" | "trailing"` — Default `'auto'`. Which end the spinner appears at, or `auto` to take the place of an existing visual.
- `loaderText`: `string` — Default `'Loading'`. Text included in the input's accessible description while loading.
- `loading`: `boolean` — Default `false`. Shows a spinner inside the input while a value is being resolved.
- `monospace`: `boolean` — Default `false`. Renders the value in a monospace face, for code or identifiers.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the input.
- `trailingAction`: `React.ReactElement` — Interactive control shown at the end of the input, such as a clear button.
- `trailingVisual`: `TextInputVisual` — Icon or text shown inside the input, after the value.
- `validationStatus`: `"error" | "success"` — Marks the value invalid or confirmed, which sets the border colour and `aria-invalid`.

## TextInput.Action

Renders a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `aria-label` (required): `string` — Accessible name for the action, since the icon alone conveys nothing.
- `icon` (required): `React.ElementType` — Icon component to render.
- `tooltipDirection`: `TooltipDirection` — Default `'s'`. Side the tooltip appears on.

## Differences from `@primer/react`

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
