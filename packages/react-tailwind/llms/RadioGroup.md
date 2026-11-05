# RadioGroup

`RadioGroup` is a Base UI radio group with roving focus and single-value selection.

Import: `import {RadioGroup} from '@primer/react-tailwind/RadioGroup'`

Forwards unrecognized props to Base UI's [`RadioGroup`](https://base-ui.com/react/components/radio-group#api-reference), so it also accepts that part's props.

## Props

- `className`: `string | ((state: RadioGroupState) => string | undefined)`

## RadioGroup.Label

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `visuallyHidden`: `boolean` — Hides the label visually while keeping it available to assistive technology.

## RadioGroup.Caption

Renders a [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## RadioGroup.Validation

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `variant`: `"error" | "success"` — Whether the message reports a problem or confirms success.

## Differences from `@primer/react`

- Use `value`, `defaultValue`, and `onValueChange` for group selection; do not duplicate the primitive's state.
