# Alignment

## From: `@primer/react`

Legacy SplitPageLayout is a settings-style page layout with persistent navigation beside content and compound header, content, pane, sidebar, and footer slots.

## To: `@primer/react-tailwind`

SplitPageLayout composes local PageLayout while keeping the familiar `Header`, `Content`, `Pane`, `Sidebar`, and `Footer` API. Pane defaults to sticky while Sidebar remains in normal flow unless `sticky` is enabled. Sidebar owns a structural wrapper for full-height, sticky, fullscreen, and resizable behavior while its inner region retains the public `SplitPageLayout.Sidebar` marker. It does not use Base UI.

## Migration notes

- Use the local PageLayout-compatible slot and responsive props rather than legacy styling wrappers.
- Sidebar defaults to no internal padding, matching the rendered legacy layout. Explicit `padding` values are applied consistently instead of being accepted but ignored.
- The `fullscreen` responsive variant fills the narrow viewport as documented. The legacy implementation only expands to its content height in the mirrored story.
- Narrow side-by-side layouts retain stable 32px NavList rows rather than allowing labels to collapse into zero-width columns and wrap one character per line. This can make the modern layout shorter than the legacy output when a full-width Sidebar leaves almost no room for the remaining columns.
- **Intentional addition — parent-relative sidebar width:** a non-resizable `Sidebar` can use `widthMode="fill"` to share its CSS-sized outer rail between the pane and divider. Pixel constraints resume when the mode returns to `default`; resizable sidebars continue to use pixel-based widths.
- Keep navigation semantics in Sidebar children.
- `sx` and styled-system props are unsupported; use `className`.
