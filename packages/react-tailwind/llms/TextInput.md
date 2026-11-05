# TextInput

`TextInput` is a styled native single-line input with small, medium, and large visual sizes.

Import: `import {TextInput} from '@primer/react-tailwind/TextInput'`

Renders an [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `block`: `boolean` — Default `false`. Stretches the input to fill the width of its container.
- `characterLimit`: `number` — Shows a remaining-character count and announces when the limit is near.
- `leadingVisual`: `TextInputVisual` — Icon or text shown inside the input, before the value.
- `loaderPosition`: `"auto" | "leading" | "trailing"` — Default `'auto'`. Which end the spinner appears at, or `auto` to take the place of an existing visual.
- `loaderText`: `string` — Default `'Loading'`. Text announced to assistive technology while the input is loading.
- `loading`: `boolean` — Default `false`. Shows a spinner inside the input while a value is being resolved.
- `monospace`: `boolean` — Default `false`. Renders the value in a monospace face, for code or identifiers.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the input.
- `trailingAction`: `React.ReactElement` — Interactive control shown at the end of the input, such as a clear button.
- `trailingVisual`: `TextInputVisual` — Icon or text shown inside the input, after the value.
- `validationStatus`: `"error" | "success"` — Marks the value invalid or confirmed, which sets the border colour and `aria-invalid`.

## TextInput.Action

Renders a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `aria-label`: `string` — Accessible name for the action, since the icon alone conveys nothing.
- `icon`: `React.ElementType` — Icon component to render.
- `tooltipDirection`: `TooltipDirection` — Default `'s'`. Side the tooltip appears on.

## Differences from `@primer/react`

- Continue using `leadingVisual`, `trailingVisual`, `trailingAction`, `loading`, and `characterLimit`.
