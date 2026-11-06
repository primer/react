# Alignment

## From: `@primer/react`

AvatarStack accepts direct avatar or image children and provides `alignRight`, `disableExpand`, `variant`, `shape`, and numeric or responsive `size` props. It selects the smallest child size at each viewport when no stack size is supplied, masks overlap, limits the collapsed view to five children, expands on hover or focus, and makes a non-interactive expanding body keyboard focusable.

## To: `@primer/react-tailwind`

AvatarStack preserves the upstream public API, root and body data attributes, direct-child cloning contract, responsive sizing, overlap geometry, masking, truncation, expansion, link behavior, and focus behavior. It composes the shared `Avatar` and works with the shared `Link` through normal React composition. Static Tailwind v4 utilities and CSS custom properties implement the visual state.

## Migration notes

- Replace the import path with `@primer/react-tailwind/AvatarStack`.
- Keep avatars and link wrappers as direct children.
- Use `className` instead of styled-system props.
- No intentional AvatarStack behavioral or visual differences are documented. Residual visual-matrix deltas are limited to browser rasterization at circular masked overlap edges; computed styles and geometry match, and single-avatar and square-avatar stories are pixel exact.
