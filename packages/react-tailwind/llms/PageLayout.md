# PageLayout

`PageLayout` composes page headers, navigation panes or sidebars, content, and footers into a responsive layout.

Import: `import {PageLayout, DragHandle} from '@primer/react-tailwind/PageLayout'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {PageLayout} from '@primer/react-tailwind/PageLayout'
;<PageLayout>
  <PageLayout.Pane aria-label="Repository navigation">Navigation</PageLayout.Pane>
  <PageLayout.Content>
    <h1>Overview</h1>
  </PageLayout.Content>
</PageLayout>
```

Use direct compound children and keep navigation before content in the DOM. Give independently scrollable panes an accessible name, and use the public slot props for responsive visibility, dividers, padding, and sticky behavior. If a focused scrollable pane stops overflowing, it keeps its region semantics until focus leaves.

Use `wrapperClassName` to style the centered wrapper around the header, content row, and footer. Use `contentRowClassName` to style the row containing `Content` and `Pane`; `PageLayout.Content`'s own `className` applies to its content element instead. `SplitPageLayout` accepts the same props.

## Parent-sized sidebars

For a non-resizable `PageLayout.Sidebar` or `SplitPageLayout.Sidebar`, use `widthMode="fill"` when the outer sidebar rail is sized by CSS. The inner pane and its divider share that available width rather than applying the pane's pixel width.

```tsx
<PageLayout.Sidebar widthMode="fill" aria-label="Document viewer" style={{width: 'min(1280px, calc(100vw - 48px))'}}>
  Viewer
</PageLayout.Sidebar>
```

The sidebar's `className`, `style`, and ref apply to the outer rail. Size that rail for the surrounding layout; without another width it fills the available parent width. In fill mode, `width`, `minWidth`, and `currentWidth` do not control the visible pane width. Existing values take effect again if the mode changes back to `default`. Fill mode cannot be combined with `resizable`; use the pixel-based width API for a resizable sidebar.

When combining fill mode with `responsiveVariant="fullscreen"`, prefer responsive CSS or `className` for viewport-dependent widths: an inline `style.width` takes precedence over the fullscreen width class.

Resizable sidebars cap custom maximum widths to the available viewport while preserving their minimum width. A controlled width is restored when the viewport allows it again, without calling `onResizeEnd` for viewport changes. Standalone `usePaneWidth` consumers can opt into the same cap with `constrainToViewport`. Named pane widths and resizing limits follow the pane's owning viewport, including in same-origin iframes.

For a controlled pane, resizing previews the new width and calls `onResizeEnd` with that value. When the interaction ends, the pane returns to the supplied `currentWidth` unless the consumer updates it; viewport and minimum constraints still apply. Later updates to `currentWidth` are reflected when they are provided.

When using `usePaneWidth` directly, rerender the component calling the hook if its pane or handle ref changes without rendering that component, including when a pane moves to another document. Changing a ref alone does not notify React.

For a controlled width, `usePaneWidth` recognizes `DragHandle`'s `data-dragging` state to retain the in-progress value during a viewport change. A custom handle can expose the same state or update the controlled value during resizing.

During pointer or keyboard resizing, resizable panes and sidebars mark the resized element and its associated content with `data-dragging="true"`. A standalone `DragHandle` can mark up to two elements by receiving their refs through `dragTargetRef` and `contentWrapperRef`. A keyboard resize ends when the key is released or focus leaves the handle; a pointer resize applies any queued movement on release and ends when its pointer loses capture. The previous attribute values are restored when resizing ends or the handle unmounts. These attributes are styling hooks; they do not add containment styles.

Pointer movement and the left and right arrow keys move the divider in the same physical direction in both left-to-right and right-to-left layouts. The up and down arrow keys retain their existing position-based resize behavior.

The pane's `aria-label` or `aria-labelledby` also names its resize handle, even when the pane does not overflow. Give each resizable pane a distinct label. Without one, the handle uses the default name `Draggable pane splitter`.

Provide a single-pointer alternative that does not require dragging, such as buttons that update a controlled `currentWidth` alongside `onResizeEnd`. Keyboard access alone is not a non-dragging pointer alternative. Verify the handle and nearby controls have sufficient target size or spacing in the composed layout.

Pointer cancellation currently ends the resize and can call `onResizeEnd` with the last previewed width; it does not restore the width from before the gesture.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `columnGap`: `Spacing` — Default `'normal'`. Horizontal spacing between the sidebar, content, and pane.
- `containerWidth`: `"full" | "large" | "medium" | "xlarge"` — Default `'xlarge'`. Maximum width of the centered content column.
- `contentRowClassName`: `string` — Classes applied to the row containing the content and pane, not to `PageLayout.Content` itself.
- `footer`: `React.ReactNode` — Supplies the footer region. Takes precedence over a matching `PageLayout.Footer` child.
- `header`: `React.ReactNode` — Supplies the header region. Takes precedence over a matching `PageLayout.Header` child.
- `padding`: `Spacing` — Default `'normal'`. Spacing between the page container's outer edges and the viewport.
- `rowGap`: `Spacing` — Default `'normal'`. Vertical spacing between the header, content, and footer.
- `sidebar`: `React.ReactNode` — Supplies the sidebar region. Takes precedence over a matching `PageLayout.Sidebar` child.
- `wrapperClassName`: `string` — Classes applied to the centered wrapper containing the header, content row, and footer.

## PageLayout.Header

Renders a [`<header>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `divider`: `ResponsiveValue<"filled" | "line" | "none">` — Default `'none'`. Divider drawn below the header. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the header. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'none'`. Inner spacing of the header region.

## PageLayout.Content

Renders a [`<main>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'main'`. Element to render.
- `hidden`: `ResponsiveValue<boolean>` — Hides the content. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'none'`. Inner spacing of the content region.
- `width`: `"full" | "large" | "medium" | "xlarge"` — Default `'full'`. Maximum width of the content column.

## PageLayout.Pane

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `currentWidth`: `number` — Controls the pane width in pixels. Supply it with `onResizeEnd` to own the width yourself.
- `divider`: `ResponsiveValue<PaneDivider>` — Divider drawn between the pane and the content. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the pane. Accepts a responsive object to hide it only at some viewports.
- `minWidth`: `number` — Default `256`. Smallest width in pixels the pane may be resized to.
- `offsetHeader`: `string | number` — Distance a sticky pane is offset from the top, to clear a fixed header above it.
- `onResizeEnd`: `((width: number) => void)` — Called with the new width when a resize finishes.
- `padding`: `Spacing` — Inner spacing of the pane.
- `position`: `ResponsiveValue<PanePosition>` — Which side of the content the pane sits on. Accepts a responsive object to move it per viewport.
- `resizable`: `boolean` — Lets the user drag the pane's edge to resize it.
- `sticky`: `boolean` — Keeps the pane in view as the content scrolls.
- `width`: `PaneWidthValue` — Default `'medium'`. Pane width, either a named size or a custom min/default/max triple.
- `widthStorageKey`: `string` — Key under which a resized width is persisted, so the pane reopens at the user's chosen size.

## PageLayout.Sidebar

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `currentWidth`: `number` — Controls the pane width in pixels. Supply it with `onResizeEnd` to own the width yourself.
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'none'`. Divider drawn between the pane and the content. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Default `false`. Hides the pane. Accepts a responsive object to hide it only at some viewports.
- `minWidth`: `number` — Default `256`. Smallest width in pixels the pane may be resized to.
- `onResizeEnd`: `((width: number) => void)` — Called with the new width when a resize finishes.
- `padding`: `Spacing` — Default `'none'`. Inner spacing of the pane.
- `position`: `ResponsiveValue<PanePosition>` — Default `'start'`. Which side of the content the pane sits on. Accepts a responsive object to move it per viewport.
- `resizable`: `boolean` — Default `false`. Lets the user drag the pane's edge to resize it.
- `responsiveVariant`: `"default" | "fullscreen"` — Default `'default'`. How the sidebar behaves on narrow viewports: inline by default, or as a fullscreen overlay.
- `sticky`: `boolean` — Default `false`. Keeps the pane in view as the content scrolls.
- `width`: `PaneWidthValue` — Default `'medium'`. Pane width, either a named size or a custom min/default/max triple.
- `widthMode`: `"default" | "fill"` — Default `'default'`. Fills the sidebar's CSS-sized outer rail instead of applying the pane's pixel width. Fill mode is only supported for non-resizable sidebars.
- `widthStorageKey`: `string` — Key under which a resized width is persisted, so the pane reopens at the user's chosen size.

## PageLayout.Footer

Renders a [`<footer>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `divider`: `ResponsiveValue<"filled" | "line" | "none">` — Default `'none'`. Divider drawn above the footer. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the footer. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'none'`. Inner spacing of the footer region.

## DragHandle

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `aria-label`: `string` — Accessible name for the separator, describing what it resizes.
- `aria-labelledby`: `string` — Id of an element naming the separator, as an alternative to `aria-label`.
- `aria-valuemax`: `number` — Largest width the separator can be dragged to, announced by assistive technology.
- `aria-valuemin`: `number` — Smallest width the separator can be dragged to, announced by assistive technology.
- `aria-valuenow`: `number` — Current width of the pane, announced by assistive technology.
- `contentWrapperRef`: `RefObject<HTMLElement | null>` — Additional element marked with `data-dragging="true"` while the handle is being used.
- `dragTargetRef`: `RefObject<HTMLElement | null>` — Element marked with `data-dragging="true"` while the handle is being used.
- `formatValueText`: `((value: number) => string)` — Default `` value => `Pane width ${value} pixels` ``. Turns the current width into the text announced while resizing.
- `handleRef` (required): `RefObject<HTMLDivElement | null>` — Ref to the drag handle element, so the pane can measure and focus it.
- `onDoubleClick`: `MouseEventHandler<HTMLDivElement>` — Called when the handle is double-clicked, conventionally to reset the pane to its default width.
- `onDrag` (required): `(value: number, isKeyboard: boolean) => void` — Called as the handle moves. Pointer positions are batched per frame, with a queued movement delivered on release; an arrow key passes a signed step in pixels and sets `isKeyboard`.
- `onDragEnd` (required): `() => void` — Called when a drag ends, or when an arrow key that moved the handle is released.
- `onDragStart` (required): `(clientX: number) => void` — Called when a pointer starts dragging the handle, with the pointer's horizontal position.

## Differences from `@primer/react`

- `header`, `sidebar`, and `footer` accept an element for the corresponding region and take precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
- Keep bottom sheets and filter/menu controls in application composition.
- Use the documented width storage and resize callback contract; do not assume legacy persistence behavior.
- `Sidebar` adds an opt-in `widthMode="fill"` for a CSS-sized outer rail. It ignores pixel width constraints while active and does not support resizing; default pane and sidebar sizing is unchanged.
- `usePaneWidth` preserves the legacy viewport reservation: 511px below 1280px and 959px at or above 1280px. `constrainToViewport` applies that cap to custom maximums, and resizable `Sidebar` enables it automatically; the configured minimum still takes precedence.
- A controlled pane width is restored when the viewport expands enough to allow it. Viewport-driven adjustments do not call `onResizeEnd`, and an active resize retains its in-progress width.
- Unlike current `@primer/react`, a controlled pane returns to its supplied width after a resize or reset if the consumer does not accept the requested value through `currentWidth`.
- `DragHandle` accepts the legacy `dragTargetRef` and `contentWrapperRef` to mark those elements with `data-dragging="true"` during pointer and keyboard resizing. PageLayout supplies the corresponding pane or sidebar and content refs automatically. The attributes are restored when the interaction ends or the handle unmounts; they do not apply the legacy containment styles. Viewport-driven `usePaneWidth` updates do not set these drag attributes.
- A keyboard resize also ends when the handle loses focus or a pointer resize begins. Pointer and keyboard interactions do not end or update one another, and only the active pointer's lost-capture event ends a pointer resize.
- Pointer and horizontal-arrow movement follows the divider's physical direction in left-to-right and right-to-left layouts. Vertical-arrow behavior is unchanged.
- Unlike current `@primer/react`, a pane's `aria-label` or `aria-labelledby` also names its resize handle. Without a nonblank label, the handle retains the default name.
- Resize direction, responsive position, named pane widths, and viewport limits use the region's owning document. Same-document open shadow roots and same-origin iframe layouts are covered for resizing; other cross-document and shadow-root compositions are not established by that coverage. Direct `usePaneWidth` callers must rerender the component calling the hook if a ref target changes without rendering that component.
- A resizable pane does not provide a built-in non-dragging pointer control; applications can supply one using the controlled width API.
- Pointer cancellation currently ends the resize and reports the last previewed width rather than restoring the original width.
- The handle's `data-component="PageLayout.DragHandle"` is a fixed component identifier rather than a customizable prop. Supply another `data-*` attribute for application-specific selectors.
- Preserve start/end pane and Sidebar ordering across responsive ranges.
- Compose slots in the intended visual order. PageLayout identifies Sidebar as a root-level region without exposing Primer's internal slot marker system.
- Replace legacy wrapper and content-row CSS selectors with `wrapperClassName` and `contentRowClassName`. These props are also available on `SplitPageLayout`.
- `sx` and styled-system props are unsupported; use `className`.
- When the pane content overflows, it becomes a focusable `region` named by the pane's `aria-label` or `aria-labelledby`, matching upstream. If overflow ends while the region is focused, its label and focusability remain until focus leaves.
