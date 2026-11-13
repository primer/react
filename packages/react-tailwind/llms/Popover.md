# Popover

`Popover` pairs a trigger with positioned, dismissible content.

Import: `import {Popover} from '@primer/react-tailwind/Popover'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Popover} from '@primer/react-tailwind'
;<Popover>
  <Popover.Button>More information</Popover.Button>
  <Popover.Content>Helpful, non-modal information.</Popover.Content>
</Popover>
```

Give interactive content an appropriate role and label. Keep a visible keyboard focus indicator and a clear close path. Set `id` on `Popover.Button` or `Popover.Trigger` rather than on a rendered element, because the trigger tracks its open state by its `id`.

Forwards unrecognized props to Base UI's [`Popover.Root`](https://base-ui.com/react/components/popover#root), so it also accepts that part's props.

## Popover.Root

Forwards unrecognized props to Base UI's [`Popover.Root`](https://base-ui.com/react/components/popover#root), so it also accepts that part's props.

## Popover.Trigger

Forwards unrecognized props to Base UI's [`Popover.Trigger`](https://base-ui.com/react/components/popover#trigger), so it also accepts that part's props.

## Popover.Button

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `children`: `React.ReactNode`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Loading status text. Set to an empty string when an external announcer communicates loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## Popover.Popup

Forwards unrecognized props to Base UI's [`Popover.Popup`](https://base-ui.com/react/components/popover#popup), so it also accepts that part's props.

## Popover.Content

Forwards unrecognized props to Base UI's [`Popover.Popup`](https://base-ui.com/react/components/popover#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'center'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `height`: `PopoverHeight` — Default `'fit-content'`. Height of the content, on the overlay height token scale.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'bottom'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `8`. Distance in pixels between the content and its anchor, or a callback that computes it.
- `width`: `PopoverWidth` — Default `'small'`. Width of the content, on the overlay width token scale.

## Popover.Positioner

Forwards unrecognized props to Base UI's [`Popover.Positioner`](https://base-ui.com/react/components/popover#positioner), so it also accepts that part's props.

## Popover.Portal

Forwards unrecognized props to Base UI's [`Popover.Portal`](https://base-ui.com/react/components/popover#portal), so it also accepts that part's props.

## Popover.Arrow

Forwards unrecognized props to Base UI's [`Popover.Arrow`](https://base-ui.com/react/components/popover#arrow), so it also accepts that part's props.

## Popover.Backdrop

Forwards unrecognized props to Base UI's [`Popover.Backdrop`](https://base-ui.com/react/components/popover#backdrop), so it also accepts that part's props.

## Popover.Title

Forwards unrecognized props to Base UI's [`Popover.Title`](https://base-ui.com/react/components/popover#title), so it also accepts that part's props.

## Popover.Description

Forwards unrecognized props to Base UI's [`Popover.Description`](https://base-ui.com/react/components/popover#description), so it also accepts that part's props.

## Popover.Close

Forwards unrecognized props to Base UI's [`Popover.Close`](https://base-ui.com/react/components/popover#close), so it also accepts that part's props.

## Popover.Viewport

Forwards unrecognized props to Base UI's [`Popover.Viewport`](https://base-ui.com/react/components/popover#viewport), so it also accepts that part's props.

## Differences from `@primer/react`

- Recompose anchored uses with the compound parts; a legacy statically positioned surface needs a separate compatibility adapter. `Overlay` supplies a presentational surface but not the legacy caret, visibility, or dismissal behavior.
- Use controlled `open` and `onOpenChange(open, details)` to distinguish outside and Escape requests by `details.reason`. These do not reproduce the legacy `onClickOutside` and `onEscape` callbacks, and `ignoreClickRefs` has no direct equivalent. Account for nested portaled content when adapting dismissal.
- **Base UI 1.8 integration gap — canceled focus-out:** Canceling a nonmodal `focus-out` request keeps the popup open, but does not undo Base UI's suppression of subsequent return focus. After reentering the popup, closing can leave focus on the document body even with an explicit `finalFocus` ref or callback. There is no public reset for this suppression; do not assume cancellation rolls back all focus bookkeeping.
- An installed-package Chromium fixture verifies an application-owned alternative using controlled `open`, `Content finalFocus={false}`, and a layout effect on the actual closing commit. Record return intent only for a close that should restore focus, consume that intent once, and focus a connected target only if focus has not intentionally moved outside the popup. Keep cancellation scoped to the legacy ignored-target/custom-dismissal requirement rather than canceling every outside interaction. This transfers closing-focus responsibility to the application for that adapter; it is not an automatic package fix or a timer-based restoration.
- For dialog handoff, clear the popup's return intent before opening the dialog. If the popup closes, let the dialog own final return to the stable popup trigger. If the popup stays open underneath the dialog, let the dialog return to its filter or another valid popup control; a later popup close can then restore the trigger. The Chromium fixture covers both compositions, repeated openings, custom and ordinary Escape, a Close control, intentional outside focus, and StrictMode. Verify those paths, cancellation policy, target removal, transitions, and assistive-technology behavior in the actual host before treating the adapter as complete.
- Set `portal={false}` to render content inside its parent rather than at the end of the document. For a specific portal container, compose `Portal`, `Positioner`, and `Popup`.
- Replace `caret` with `Popover.Arrow`, which follows the resolved side and alignment. The legacy root's `data-caret` and the content's `::before`/`::after` triangles are not rendered; migrate caret colors, offsets, and selectors to the Arrow element or its children.
- `relative` is unsupported because the positioner places content against its anchor. Use `className` for overflow; there is no `overflow` prop.
- Remove legacy placement/style props, `sx`, and styled-system props.
