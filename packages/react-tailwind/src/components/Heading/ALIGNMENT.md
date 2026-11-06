# Alignment

## From: `@primer/react`

Legacy `Heading` renders a configurable heading element through `as` and uses `variant` (`large`, `medium`, or `small`) to select its typography. The legacy CSS module also supports the older styled-system surface and shared HTML props. Consumers commonly combine it with `sx` for spacing or color adjustments.

## To: `@primer/react-tailwind`

Tailwind `Heading` keeps semantic `as` rendering and the core heading content/HTML props, but uses `size` (`large`, `medium`, or `small`) as the typography API. It also exposes `display` for display-heading treatment. Typography, color, and spacing use Tailwind utilities and Primer tokens; there is no Base UI behavior. The implementation is React 19-compatible and does not preserve the legacy `variant` alias or styled-system styling.

## Migration notes

- Rename `variant` to `size`.
- Use `display` when migrating display-heading usage.
- Remove `sx` and styled-system props; keep the semantic `as` element.
