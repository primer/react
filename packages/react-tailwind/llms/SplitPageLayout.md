# SplitPageLayout

`SplitPageLayout` is an opinionated full-width `PageLayout` composition for settings and detail pages with a navigation pane and content area.

Import: `import {SplitPageLayout} from '@primer/react-tailwind/SplitPageLayout'`

## Props

- `columnGap`: `Spacing` — Default `'none'`. Horizontal spacing between the sidebar, content, and pane.
- `containerWidth`: `"full" | "large" | "medium" | "xlarge"` — Default `'full'`. Maximum width of the centered content column.
- `footer`: `React.ReactNode`
- `header`: `React.ReactNode`
- `padding`: `Spacing` — Default `'none'`. Spacing between the page container's outer edges and the viewport.
- `rowGap`: `Spacing` — Default `'none'`. Vertical spacing between the header, content, and footer.
- `sidebar`: `React.ReactNode`

## Header props

- `divider`: `ResponsiveValue<"filled" | "line" | "none">` — Default `'line'`. Divider drawn below the header. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the header. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'none'`. Inner spacing of the header region.

## Content props

- `as`: `React.ElementType` — Element to render.
- `hidden`: `ResponsiveValue<boolean>` — Hides the content. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'none'`. Inner spacing of the content region.
- `width`: `"full" | "large" | "medium" | "xlarge"` — Default `'large'`. Maximum width of the content column.

## Pane props

- `currentWidth`: `number` — Controls the pane width in pixels. Supply it with `onResizeEnd` to own the width yourself.
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'line'`. Divider drawn between the pane and the content. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the pane. Accepts a responsive object to hide it only at some viewports.
- `minWidth`: `number` — Smallest width in pixels the pane may be resized to.
- `offsetHeader`: `string | number` — Distance a sticky pane is offset from the top, to clear a fixed header above it.
- `onResizeEnd`: `((width: number) => void)` — Called with the new width when a resize finishes.
- `padding`: `Spacing` — Default `'none'`. Inner spacing of the pane.
- `position`: `ResponsiveValue<PanePosition>` — Default `'start'`. Which side of the content the pane sits on. Accepts a responsive object to move it per viewport.
- `resizable`: `boolean` — Lets the user drag the pane's edge to resize it.
- `sticky`: `boolean` — Default `true`. Keeps the pane in view as the content scrolls.
- `width`: `PaneWidthValue` — Default `'large'`. Pane width, either a named size or a custom min/default/max triple.
- `widthStorageKey`: `string` — Key under which a resized width is persisted, so the pane reopens at the user's chosen size.

## Sidebar props

- `currentWidth`: `number` — Controls the pane width in pixels. Supply it with `onResizeEnd` to own the width yourself.
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'line'`. Divider drawn between the pane and the content. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the pane. Accepts a responsive object to hide it only at some viewports.
- `minWidth`: `number` — Smallest width in pixels the pane may be resized to.
- `offsetHeader`: `string | number` — Distance a sticky pane is offset from the top, to clear a fixed header above it.
- `onResizeEnd`: `((width: number) => void)` — Called with the new width when a resize finishes.
- `padding`: `Spacing` — Default `'none'`. Inner spacing of the pane.
- `position`: `ResponsiveValue<PanePosition>` — Default `'start'`. Which side of the content the pane sits on. Accepts a responsive object to move it per viewport.
- `resizable`: `boolean` — Lets the user drag the pane's edge to resize it.
- `responsiveVariant`: `"default" | "fullscreen"` — How the sidebar behaves on narrow viewports: inline by default, or as a fullscreen overlay.
- `sticky`: `boolean` — Default `true`. Keeps the pane in view as the content scrolls.
- `width`: `PaneWidthValue` — Default `'large'`. Pane width, either a named size or a custom min/default/max triple.
- `widthStorageKey`: `string` — Key under which a resized width is persisted, so the pane reopens at the user's chosen size.

## Footer props

- `divider`: `"filled" | "line" | "none"` — Default `'line'`. Divider drawn above the footer. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the footer. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'none'`. Inner spacing of the footer region.

## Differences from `@primer/react`

- Use the local PageLayout-compatible slot and responsive props rather than legacy styling wrappers.
