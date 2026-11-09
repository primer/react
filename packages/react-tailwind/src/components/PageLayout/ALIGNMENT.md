# Alignment

## From: `@primer/react`

Legacy PageLayout provides responsive slots, sticky and resizable panes, and application examples containing filters, action menus, and bottom sheets.

## To: `@primer/react-tailwind`

PageLayout keeps `Header`, `Content`, `Pane`, `Sidebar`, and `Footer` slots plus container, padding, gap, width, sticky, divider, hidden, responsive pane position, and resize configuration. `Sidebar` is a root-level region while the other regions remain in the content wrapper, matching the legacy responsive structure.

Pane dividers are horizontal at narrow widths and vertical from the regular range. Sticky positioning and resize widths activate from the regular range. Resize uses the local `widthStorageKey`, `currentWidth`, and `onResizeEnd` contract. It does not use Base UI.

## Migration notes

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
