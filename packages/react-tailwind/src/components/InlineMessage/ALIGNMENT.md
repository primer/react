# Alignment

## From: `@primer/react`

`InlineMessage` is a styled status message with `success`, `error`, and `warning` variants. It renders an icon and message content using the legacy CSS module and Primer color utilities, and accepts shared HTML and styled-system props. The component is presentational; it does not own dismissal, focus, or alert lifecycle behavior.

## To: `@primer/react-tailwind`

Tailwind `InlineMessage` retains the component name, message content, and semantic variants while replacing CSS modules with Tailwind classes and Primer semantic tokens. Its icon and text remain part of the presentational composition, and consumers still own any dismissal or live-region behavior around it. No Base UI primitive is involved. React 19-compatible native props are supported, but legacy styling-system behavior and CSS selectors are intentionally absent.

## Migration notes

- Existing variant and content usage can be retained.
- Pass a component such as `leadingVisual={InfoIcon}`, including forwardRef and memo components, or an already-rendered React node such as `leadingVisual={<InfoIcon />}`. Component visuals are decorative; rendered nodes retain their props. `null` omits the visual.
- `size` adjusts the message typography and the built-in visual, but does not pass a size to custom `leadingVisual` components. Component types receive `aria-hidden` and a layout class; rendered nodes keep their own props. Size custom visuals explicitly, for example `<BookIcon size={12} aria-hidden="true" />` for a small message.
- Add any required `role` or live-region behavior at the consumer boundary.
- Remove `sx`, styled-system props, and legacy class selectors.
