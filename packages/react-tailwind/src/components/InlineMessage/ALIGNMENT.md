# Alignment

## From: `@primer/react`

`InlineMessage` is a styled status message with `success`, `error`, and `warning` variants. It renders an icon and message content using the legacy CSS module and Primer color utilities, and accepts shared HTML and styled-system props. The component is presentational; it does not own dismissal, focus, or alert lifecycle behavior.

## To: `@primer/react-tailwind`

Tailwind `InlineMessage` retains the component name, message content, and semantic variants while replacing CSS modules with Tailwind classes and Primer semantic tokens. Its icon and text remain part of the presentational composition, and consumers still own any dismissal or live-region behavior around it. No Base UI primitive is involved. React 19-compatible native props are supported, but legacy styling-system behavior and CSS selectors are intentionally absent.

## Migration notes

- Existing variant and content usage can be retained.
- Add any required `role` or live-region behavior at the consumer boundary.
- Remove `sx`, styled-system props, and legacy class selectors.
