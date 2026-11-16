# Alignment

## From: `@primer/react`

AvatarStack accepts direct avatar or image children and provides `alignRight`, `disableExpand`, `variant`, `shape`, and numeric or responsive `size` props. It selects the smallest child size at each viewport when no stack size is supplied, masks overlap, limits the collapsed view to five children, expands on hover or focus, and makes a non-interactive expanding body keyboard focusable.

## To: `@primer/react-tailwind`

AvatarStack preserves the upstream public API, root and body data attributes, direct-child cloning contract, responsive sizing, overlap geometry, masking, truncation, expansion, link behavior, and focus behavior. It composes the shared `Avatar` and works with the shared `Link` through normal React composition. Static Tailwind v4 utilities and CSS custom properties implement the visual state.

## Migration notes

- Replace the import path with `@primer/react-tailwind/AvatarStack`.
- Keep avatars and link wrappers as direct children.
- A circular stack preserves each avatar's square shape; a square stack forces square on direct avatars and wrappers that forward `square`. Set the avatar's shape directly when it is nested inside a link.
- As in legacy, a circular stack forwards `square: undefined` to a direct child with no `square` prop. Wrappers that set their own `square` before spreading forwarded props lose that default; pass `square` on the wrapper or set it after the spread. Size inference reads the direct child's `size`, not custom aliases such as `avatarSize`; set the stack's `size` explicitly when needed.
- Use `className` instead of styled-system props.
- No intentional AvatarStack behavioral or visual differences are documented. Residual visual-matrix deltas are limited to browser rasterization at circular masked overlap edges; computed styles and geometry match, and single-avatar and square-avatar stories are pixel exact.
