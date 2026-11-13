# Label

`Label` marks an item with a short piece of metadata, such as a status or category. It is presentational and does not label form fields; use `FormControl.Label` for that.

Import: `import {Label} from '@primer/react-tailwind/Label'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Label} from '@primer/react-tailwind/Label'
;<Label variant="success">ready for review</Label>
```

## API notes

The default variant is `default` and the default size is `small`.

## Composition

Use labels as inline metadata and choose `as` when the surrounding structure needs a different element. Element-specific props and refs follow the selected element, for example `<Label as="a" href="/issues">Issues</Label>`.

## Accessibility

Include text that communicates the state; color should not be the only cue.

## Data attributes

The rendered element has `data-component="Label"` and `data-variant`, which defaults to `default` and otherwise reflects the `variant` prop. Passing `variant={null}` removes the variant styling and omits the attribute. An explicitly supplied `data-variant` overrides this value, as in `@primer/react`.

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `As` — Default `'span'`. Element to render. Its props and ref follow the selected element.
- `className`: `string`
- `size`: `"large" | "small" | null`
- `variant`: `"accent" | "attention" | "danger" | "default" | "done" | "primary" | "secondary" | "severe" | "sponsors" | "success" | null`

## Differences from `@primer/react`

- Existing `variant`, `size`, and `as` usage can be retained; element-specific props and refs follow the element selected by `as`.
- Use `FormControl.Label` to label a form field.
- Replace `sx`, styled-system props, and selectors targeting `data-size`.
- `data-variant` reflects the supplied variant or `default` when omitted, matching legacy selectors. Passing `variant={null}` disables variant styling and omits the attribute. An explicit `data-variant` takes precedence, matching legacy prop forwarding.
- Package borders use `border-thin` so legacy `@primer/css` does not override variant colors through its important `.border` shorthand. App-authored borders should use `border-thin` too; adding `className="border"` reintroduces the collision. This is not full isolation from other legacy utilities.
