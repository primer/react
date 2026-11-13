# InlineMessage

`InlineMessage` communicates validation, status, and availability inline with content or a form control.

Import: `import {InlineMessage} from '@primer/react-tailwind/InlineMessage'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {InlineMessage} from '@primer/react-tailwind/InlineMessage'
;<InlineMessage variant="success">Your changes were saved.</InlineMessage>
```

## API notes

`variant` accepts `critical`, `success`, `unavailable`, or `warning`. When omitted, the message uses neutral text and an information icon.

## Composition

Place an inline message next to the field or content it describes. Use `leadingVisual` for a custom visual only when it reinforces the message; links and other inline content can be passed as children.

`leadingVisual` accepts component types, including forwardRef Octicons and memo components, or already-rendered React nodes. Component visuals are decorative; rendered nodes retain their own props and accessibility attributes. Pass `null` to omit the visual.

`size` controls the message typography and the built-in icon, but it does not pass a size to a custom `leadingVisual`. Component types receive `aria-hidden` and a layout class; rendered nodes are passed through unchanged. Size a custom visual yourself, for example `leadingVisual={<BookIcon size={12} aria-hidden="true" />}` for a small message. Keep custom decorative visuals hidden from assistive technology.

## Accessibility

The default icon is decorative. Give the message clear text and connect it to a form control with the consumer's `aria-describedby` when appropriate. `InlineMessage` does not add a live-region or alert role.

## Animation and reduced motion

`InlineMessage` has no animation and does not need reduced-motion handling.

## Theming and Tailwind

Variants use Primer semantic text tokens. Import package styles or compile Tailwind v4 with the package `dist` path in `@source`; use `className` for spacing or typography extensions.

### Data attributes

The root exposes `data-component="InlineMessage"`, `data-size`, and `data-variant` when provided.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `leadingVisual`: `React.ReactNode | React.ElementType` — Replaces the icon the variant would otherwise choose.
- `size`: `"medium" | "small"` — Default `'medium'`. Text size of the message.
- `variant`: `InlineMessageVariant` — Severity of the message, which sets its colour and default icon.

## Differences from `@primer/react`

- Existing variant and content usage can be retained.
- Pass a component such as `leadingVisual={InfoIcon}`, including forwardRef and memo components, or an already-rendered React node such as `leadingVisual={<InfoIcon />}`. Component visuals are decorative; rendered nodes retain their props. `null` omits the visual.
- `size` adjusts the message typography and the built-in visual, but does not pass a size to custom `leadingVisual` components. Component types receive `aria-hidden` and a layout class; rendered nodes keep their own props. Size custom visuals explicitly, for example `<BookIcon size={12} aria-hidden="true" />` for a small message.
- Add any required `role` or live-region behavior at the consumer boundary.
- Remove `sx`, styled-system props, and legacy class selectors.
