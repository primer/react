# SplitPageLayout

`SplitPageLayout` is an opinionated full-width `PageLayout` composition for settings and detail pages with a navigation pane and content area.

Import: `import {SplitPageLayout} from '@primer/react-tailwind/SplitPageLayout'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {SplitPageLayout} from '@primer/react-tailwind/SplitPageLayout'
;<SplitPageLayout>
  <SplitPageLayout.Pane aria-label="Settings navigation">Navigation</SplitPageLayout.Pane>
  <SplitPageLayout.Content>
    <h1>General</h1>
  </SplitPageLayout.Content>
</SplitPageLayout>
```

Use `Header`, `Pane` or `Sidebar`, `Content`, and `Footer` as direct children. The pane is sticky by default; opt out with `sticky={false}` when it should participate in normal flow.

The inherited `wrapperClassName` and `contentRowClassName` props style the centered wrapper and its content-and-pane row.

To let a non-resizable `Sidebar` follow a CSS-sized outer rail, set `widthMode="fill"` and size the rail with its `className` or `style`. The pane and divider share that width; the sidebar's pixel `width`, `minWidth`, and `currentWidth` do not determine the visible width in this mode. Switching back to `default` restores the pixel sizing behavior. Fill mode cannot be combined with `resizable`.

An inline `style.width` takes precedence over the `fullscreen` responsive width. Use responsive CSS or classes when the rail should have a different width on narrow viewports.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `columnGap`: `Spacing` — Default `'none'`. Horizontal spacing between the sidebar, content, and pane.
- `containerWidth`: `"full" | "large" | "medium" | "xlarge"` — Default `'full'`. Maximum width of the centered content column.
- `contentRowClassName`: `string` — Classes applied to the row containing the content and pane, not to `PageLayout.Content` itself.
- `footer`: `React.ReactNode`
- `header`: `React.ReactNode`
- `padding`: `Spacing` — Default `'none'`. Spacing between the page container's outer edges and the viewport.
- `rowGap`: `Spacing` — Default `'none'`. Vertical spacing between the header, content, and footer.
- `sidebar`: `React.ReactNode`
- `wrapperClassName`: `string` — Classes applied to the centered wrapper containing the header, content row, and footer.

## SplitPageLayout.Header

Renders a [`<header>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `divider`: `ResponsiveValue<"filled" | "line" | "none">` — Default `'line'`. Divider drawn below the header. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the header. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'normal'`. Inner spacing of the header region.

## SplitPageLayout.Content

Renders a [`<main>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Element to render.
- `hidden`: `ResponsiveValue<boolean>` — Hides the content. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'normal'`. Inner spacing of the content region.
- `width`: `"full" | "large" | "medium" | "xlarge"` — Default `'large'`. Maximum width of the content column.

## SplitPageLayout.Pane

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `currentWidth`: `number` — Controls the pane width in pixels. Supply it with `onResizeEnd` to own the width yourself.
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'line'`. Divider drawn between the pane and the content. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the pane. Accepts a responsive object to hide it only at some viewports.
- `minWidth`: `number` — Default `256`. Smallest width in pixels the pane may be resized to.
- `offsetHeader`: `string | number` — Distance a sticky pane is offset from the top, to clear a fixed header above it.
- `onResizeEnd`: `((width: number) => void)` — Called with the new width when a resize finishes.
- `padding`: `Spacing` — Default `'normal'`. Inner spacing of the pane.
- `position`: `ResponsiveValue<PanePosition>` — Default `'start'`. Which side of the content the pane sits on. Accepts a responsive object to move it per viewport.
- `resizable`: `boolean` — Lets the user drag the pane's edge to resize it.
- `sticky`: `boolean` — Default `true`. Keeps the pane in view as the content scrolls.
- `width`: `PaneWidthValue` — Default `'medium'`. Pane width, either a named size or a custom min/default/max triple.
- `widthStorageKey`: `string` — Key under which a resized width is persisted, so the pane reopens at the user's chosen size.

## SplitPageLayout.Sidebar

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `currentWidth`: `number` — Controls the pane width in pixels. Supply it with `onResizeEnd` to own the width yourself.
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'line'`. Divider drawn between the pane and the content. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the pane. Accepts a responsive object to hide it only at some viewports.
- `minWidth`: `number` — Default `256`. Smallest width in pixels the pane may be resized to.
- `onResizeEnd`: `((width: number) => void)` — Called with the new width when a resize finishes.
- `padding`: `Spacing` — Default `'none'`. Inner spacing of the pane.
- `position`: `ResponsiveValue<PanePosition>` — Default `'start'`. Which side of the content the pane sits on. Accepts a responsive object to move it per viewport.
- `resizable`: `boolean` — Lets the user drag the pane's edge to resize it.
- `responsiveVariant`: `"default" | "fullscreen"` — How the sidebar behaves on narrow viewports: inline by default, or as a fullscreen overlay.
- `sticky`: `boolean` — Keeps the pane in view as the content scrolls.
- `width`: `PaneWidthValue` — Default `'medium'`. Pane width, either a named size or a custom min/default/max triple.
- `widthMode`: `"default" | "fill"` — Fills the sidebar's CSS-sized outer rail instead of applying the pane's pixel width. Fill mode is only supported for non-resizable sidebars.
- `widthStorageKey`: `string` — Key under which a resized width is persisted, so the pane reopens at the user's chosen size.

## SplitPageLayout.Footer

Renders a [`<footer>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `divider`: `ResponsiveValue<"filled" | "line" | "none">` — Default `'line'`. Divider drawn above the footer. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the footer. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'normal'`. Inner spacing of the footer region.

## Differences from `@primer/react`

- Use the local PageLayout-compatible slot and responsive props rather than legacy styling wrappers.
- Sidebar defaults to no internal padding, matching the rendered legacy layout. Explicit `padding` values are applied consistently instead of being accepted but ignored.
- The `fullscreen` responsive variant fills the narrow viewport as documented. The legacy implementation only expands to its content height in the mirrored story.
- Narrow side-by-side layouts retain stable 32px NavList rows rather than allowing labels to collapse into zero-width columns and wrap one character per line. This can make the modern layout shorter than the legacy output when a full-width Sidebar leaves almost no room for the remaining columns.
- **Intentional addition — parent-relative sidebar width:** a non-resizable `Sidebar` can use `widthMode="fill"` to share its CSS-sized outer rail between the pane and divider. Pixel constraints resume when the mode returns to `default`; resizable sidebars continue to use pixel-based widths.
- Keep navigation semantics in Sidebar children.
- `sx` and styled-system props are unsupported; use `className`.
