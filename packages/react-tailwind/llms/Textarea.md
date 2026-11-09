# Textarea

`Textarea` is a styled native multiline text control.

Import: `import {Textarea} from '@primer/react-tailwind/Textarea'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`TextareaProps` extends native textarea attributes, including `value`, `defaultValue`, `onChange`, `name`, `required`, `rows`, `cols`, `resize`, and `disabled`.

## Import

```tsx
import {Textarea} from '@primer/react-tailwind/Textarea'
import {FormControl} from '@primer/react-tailwind/FormControl'
;<FormControl>
  <FormControl.Label>Description</FormControl.Label>
  <Textarea name="description" rows={4} />
</FormControl>
```

## Accessibility, forms, and validation

Associate a visible `FormControl.Label` or use `aria-label`. Native `name`, `required`, and `disabled` behavior is retained. Pair invalid fields with `aria-invalid` and `FormControl.Validation`; captions come from `FormControl.Caption`.

## Keyboard, events, and state

The native control provides standard text-editing shortcuts and form events; use `onChange` for input updates. The root exposes `data-component="Textarea"` and accepts `className`; native `:disabled`, `:focus-visible`, and `aria-invalid` state styling is supported.

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
- The border sits on the textarea instead of a wrapper, so `minHeight` and `maxHeight` include the 1px border on each edge. This keeps the rendered control the same size as Primer React's bordered wrapper.
- Going over `characterLimit` always applies the error state.
- The deprecated `contrast` prop is omitted; drop it to use the default background.
- Keep controlled values on the native `value`/`defaultValue`/`onChange` contract.
- `sx` and styled-system props are unsupported.
