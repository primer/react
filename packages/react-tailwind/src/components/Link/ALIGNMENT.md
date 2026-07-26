# Alignment

## From: `@primer/react`

Legacy `Link` is a polymorphic anchor component with `muted` and `inline` visual options, plus the deprecated `hoverColor` styling API. It uses Primer CSS-module styles and shared styled-system props, while preserving native anchor behavior when rendered as an anchor. The component itself does not provide navigation, focus management, or menu behavior.

## To: `@primer/react-tailwind`

Tailwind `Link` keeps `muted`, `inline`, polymorphic `as`, children, and native link props, and maps their appearance to Tailwind classes and Primer semantic tokens. It remains a native HTML interaction rather than a Base UI primitive. The deprecated `hoverColor` prop, styled-system customization, and legacy CSS-module selectors are not implemented. React 19-compatible ref and element composition are used by the new package.

## Migration notes

- Preserve `muted`, `inline`, and `as` usage.
- Replace `hoverColor` with supported token/class composition.
- Remove `sx`, styled-system props, and legacy class selectors.
