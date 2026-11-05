# Textarea

`Textarea` is a styled native multiline text control.

Import: `import {Textarea} from '@primer/react-tailwind/Textarea'`

Renders a [`<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `autoSize`: `boolean` — Default `false`. Grows the textarea to fit its content, using CSS `field-sizing`.
- `block`: `boolean` — Default `false`. Stretches the textarea to fill the width of its container.
- `characterLimit`: `number` — Shows a remaining-character count and announces when the limit is near.
- `maxHeight`: `number` — Maximum height of the textarea, in pixels.
- `minHeight`: `number` — Minimum height of the textarea, in pixels.
- `resize`: `"both" | "horizontal" | "none" | "vertical"` — Which directions the user can resize the textarea in.
- `validationStatus`: `"error" | "success"` — Applies error or success styling. Going over `characterLimit` always shows the error state.

## Differences from `@primer/react`

- `block`, `autoSize`, `characterLimit`, `minHeight`, `maxHeight`, `resize`, and `validationStatus` keep their Primer meaning; `autoSize` uses CSS `field-sizing: content`.
