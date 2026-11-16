# Alignment

## From: `@primer/react`

`Header` is the legacy global header composition, with `Header.Item` and `Header.Link` subcomponents. It provides the dark header layout, responsive item alignment, and legacy CSS-module styling, while accepting the shared styled-system props inherited by its parts. It is primarily a structural/navigation component rather than a focus or overlay primitive.

## To: `@primer/react-tailwind`

Tailwind preserves `Header.Item` and `Header.Link` and their structural role, but implements the layout with Tailwind utilities and Primer semantic tokens. Links and item content remain ordinary navigation/HTML interactions; no Base UI behavior is added by the header itself. React 19-compatible composition and native element props are preferred, and legacy CSS-module class names and styled-system styling are not part of the new contract.

## Migration notes

- Existing Header subcomponent composition can generally be retained.
- Recheck custom class selectors and responsive overrides.
- Remove `sx` and styled-system props.
