# Alignment

## From: `@primer/react`

Legacy `Popover` is primarily a presentational `Popover` plus `Popover.Content` surface with `caret`, `relative`, `open`, width/height, overflow, and manual `onClickOutside`/ignored-ref options. Consumers commonly pair it with manual visibility and portal handling. The legacy CSS module and styled-system props provide placement and appearance, but the component does not expose a modern compound trigger/content lifecycle.

## To: `@primer/react-tailwind`

Tailwind `Popover` is a Base UI compound primitive. It exports named parts including `Trigger`, `Button`, `Popup`, `Content`, `Positioner`, `Portal`, `Arrow`, `Backdrop`, `Title`, `Description`, `Close`, and `Viewport`. Base UI owns controlled state, trigger semantics, focus, dismissal, portal behavior, and positioning; Tailwind classes and Primer tokens own presentation. This is a substantial replacement rather than a DOM-compatible upgrade of the old surface.

`Content` keeps upstream's `width` and `height` on the overlay token scale (defaulting to `small` and `fit-content`). With the standard tokens, `small` is 20rem and `medium` is 30rem; `auto` follows the available content. It shares the floating-content props of Tooltip, AnchoredOverlay, ActionMenu, and Autocomplete: `side`, `align`, offsets, `anchor`, and `portal`.

## Migration notes

- Recompose anchored uses with the compound parts; a legacy statically positioned surface needs a separate compatibility adapter. `Overlay` supplies a presentational surface but not the legacy caret, visibility, or dismissal behavior.
- Use controlled `open` and `onOpenChange(open, details)` to distinguish outside and Escape requests by `details.reason`. These do not reproduce the legacy `onClickOutside` and `onEscape` callbacks, and `ignoreClickRefs` has no direct equivalent. Account for nested portaled content when adapting dismissal.
- **Base UI 1.8 integration gap — canceled focus-out:** Canceling a nonmodal `focus-out` request keeps the popup open, but does not undo Base UI's suppression of subsequent return focus. After reentering the popup, closing can leave focus on the document body even with an explicit `finalFocus` ref or callback. There is no public reset for this suppression; do not assume cancellation rolls back all focus bookkeeping.
- An installed-package Chromium fixture verifies an application-owned alternative using controlled `open`, `Content finalFocus={false}`, and a layout effect on the actual closing commit. Record return intent only for a close that should restore focus, consume that intent once, and focus a connected target only if focus has not intentionally moved outside the popup. Keep cancellation scoped to the legacy ignored-target/custom-dismissal requirement rather than canceling every outside interaction. This transfers closing-focus responsibility to the application for that adapter; it is not an automatic package fix or a timer-based restoration.
- For dialog handoff, clear the popup's return intent before opening the dialog. If the popup closes, let the dialog own final return to the stable popup trigger. If the popup stays open underneath the dialog, let the dialog return to its filter or another valid popup control; a later popup close can then restore the trigger. The Chromium fixture covers both compositions, repeated openings, custom and ordinary Escape, a Close control, intentional outside focus, and StrictMode. Verify those paths, cancellation policy, target removal, transitions, and assistive-technology behavior in the actual host before treating the adapter as complete.
- Set `portal={false}` to render content inside its parent rather than at the end of the document. For a specific portal container, compose `Portal`, `Positioner`, and `Popup`.
- Replace `caret` with `Popover.Arrow`, which follows the resolved side and alignment. The legacy root's `data-caret` and the content's `::before`/`::after` triangles are not rendered; migrate caret colors, offsets, and selectors to the Arrow element or its children.
- `relative` is unsupported because the positioner places content against its anchor. Use `className` for overflow; there is no `overflow` prop.
- Remove legacy placement/style props, `sx`, and styled-system props.
