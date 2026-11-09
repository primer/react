# AnchoredOverlay

`AnchoredOverlay` positions a dismissible overlay relative to a trigger.

Import: `import {AnchoredOverlay} from '@primer/react-tailwind/AnchoredOverlay'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {AnchoredOverlay} from '@primer/react-tailwind'
;<AnchoredOverlay>
  <AnchoredOverlay.Trigger>Actions</AnchoredOverlay.Trigger>
  <AnchoredOverlay.Content>Overlay content</AnchoredOverlay.Content>
</AnchoredOverlay>
```

Keep the trigger mounted while the overlay is open. Give dialog content a role and accessible name, and retain a keyboard path to dismiss it.

### Informational content

For an informational popup, name both the trigger and the dialog, using `aria-label` or `AnchoredOverlay.Title` for the dialog. By default, `AnchoredOverlay.Trigger` exposes `aria-haspopup="dialog"`; keep that popup type aligned with the content instead of presenting it as a menu.

```tsx
import {AnchoredOverlay, Button} from '@primer/react-tailwind'
;<AnchoredOverlay>
  <AnchoredOverlay.Trigger render={<Button>About billing credits</Button>} />
  <AnchoredOverlay.Content aria-label="Billing credits information" role="dialog">
    <p>Billing credits apply to eligible usage.</p>
    <a href="/billing-help">Learn more</a>
  </AnchoredOverlay.Content>
</AnchoredOverlay>
```

In the default non-modal mode, focus is not trapped. In this example, keyboard opening focuses the link; without a focusable child it focuses the dialog. Tab can move to the next control and dismiss the overlay, and Escape normally closes it and returns focus to the trigger. When the overlay is reopened immediately after a focus-out dismissal, automated Chromium tests have sometimes found focus on the document body after Escape instead; this remains an unresolved Base UI 1.6/1.8 focus-return issue. Custom initial focus, portal placement, content, and modality can also change the sequence, so verify keyboard behavior and assistive-technology announcements in the host.

The canary does not trap focus by default. For a legacy overlay that relied on focus containment while allowing outside pointer interaction, `modal="trap-focus"` with an `AnchoredOverlay.Close` inside `Content` is a possible composition. This does not lock page scrolling or disable outside pointer interactions, but some host policies discourage trapping focus in non-modal UI; check the intended interaction with an accessibility specialist. Full `modal={true}` also blocks outside interaction and scrolling and only enables Base UI's focus trap when a close part is present. In either mode, provide an accessible close control and verify keyboard dismissal and focus return. See the migration notes for controlled overlays and the limits of this mapping.

With `modal="trap-focus"`, Base UI 1.6 and 1.8 can request outside dismissal on mouse-down or touch movement before a gesture finishes. A canceled gesture can therefore dismiss the overlay and discard an uncontrolled draft. If the intended behavior is to keep the overlay open on **all** outside presses, cancel that request synchronously:

```tsx
<AnchoredOverlay
  modal="trap-focus"
  onOpenChange={(_, details) => {
    if (details.reason === 'outside-press') details.cancel()
  }}
>
  <AnchoredOverlay.Trigger>Open editor</AnchoredOverlay.Trigger>
  <AnchoredOverlay.Content aria-label="Editor" role="dialog">
    <label>
      Draft <input />
    </label>
    <AnchoredOverlay.Close>Close</AnchoredOverlay.Close>
  </AnchoredOverlay.Content>
</AnchoredOverlay>
```

This opts out of normal outside-press dismissal; it does not preserve dismissal for completed presses while canceling only interrupted gestures. In a controlled overlay, also avoid updating `open` for the canceled request. Keep an explicit close action and verify the host's pointer, keyboard, and assistive-technology behavior.

Forwards unrecognized props to Base UI's [`Popover.Root`](https://base-ui.com/react/components/popover#root), so it also accepts that part's props.

## AnchoredOverlay.Root

Forwards unrecognized props to Base UI's [`Popover.Root`](https://base-ui.com/react/components/popover#root), so it also accepts that part's props.

## AnchoredOverlay.Trigger

Forwards unrecognized props to Base UI's [`Popover.Trigger`](https://base-ui.com/react/components/popover#trigger), so it also accepts that part's props.

## AnchoredOverlay.Content

Forwards unrecognized props to Base UI's [`Popover.Popup`](https://base-ui.com/react/components/popover#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `closeButtonProps`: `AnchoredOverlayCloseButtonProps` — Props for the close button that the fullscreen variant shows, such as a more specific `aria-label`.
- `displayCloseButton`: `boolean` — Default `true`. Whether the fullscreen variant shows a close button.
- `height`: `OverlayHeight` — Height of the surface.
- `maxHeight`: `OverlayMaxHeight` — Largest height the surface may grow to before its content scrolls.
- `maxWidth`: `OverlayMaxWidth` — Largest width the surface may grow to.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'bottom'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.
- `variant`: `AnchoredOverlayVariant` — Default `'anchored'`. How the content is presented at each viewport range. `{narrow: 'fullscreen'}` covers narrow viewports and adds a close button.
- `width`: `OverlayWidth` — Width of the surface.

## AnchoredOverlay.Popup

Forwards unrecognized props to Base UI's [`Popover.Popup`](https://base-ui.com/react/components/popover#popup), so it also accepts that part's props.

## AnchoredOverlay.Positioner

Forwards unrecognized props to Base UI's [`Popover.Positioner`](https://base-ui.com/react/components/popover#positioner), so it also accepts that part's props.

## AnchoredOverlay.Portal

Forwards unrecognized props to Base UI's [`Popover.Portal`](https://base-ui.com/react/components/popover#portal), so it also accepts that part's props.

## AnchoredOverlay.Arrow

Forwards unrecognized props to Base UI's [`Popover.Arrow`](https://base-ui.com/react/components/popover#arrow), so it also accepts that part's props.

## AnchoredOverlay.Backdrop

Forwards unrecognized props to Base UI's [`Popover.Backdrop`](https://base-ui.com/react/components/popover#backdrop), so it also accepts that part's props.

## AnchoredOverlay.Close

Forwards unrecognized props to Base UI's [`Popover.Close`](https://base-ui.com/react/components/popover#close), so it also accepts that part's props.

## AnchoredOverlay.Title

Forwards unrecognized props to Base UI's [`Popover.Title`](https://base-ui.com/react/components/popover#title), so it also accepts that part's props.

## AnchoredOverlay.Description

Forwards unrecognized props to Base UI's [`Popover.Description`](https://base-ui.com/react/components/popover#description), so it also accepts that part's props.

## Differences from `@primer/react`

- Replace legacy `outside-*` placement names with `side` and `align`, and `anchorOffset`/`alignmentOffset` with `sideOffset`/`alignOffset`.
- Replace `renderAnchor` with `AnchoredOverlay.Trigger`. Use `render` to compose a trigger with an existing element; do not use a polymorphic `as` compatibility layer.
- **Informational overlays:** the trigger declares `aria-haspopup="dialog"` by default rather than a menu. Name the dialog with `aria-label` or `AnchoredOverlay.Title`. The default non-modal mode does not trap focus: in a simple keyboard-opened overlay, focus moves to its link, or to the popup if there are no focusable children; Tab moves to the next control and dismisses it, and Escape normally returns focus to the trigger. Local automated Chromium tests with Base UI 1.6 and 1.8 have intermittently left focus on the document body after Escape when the popup was reopened immediately after focus-out dismissal; this remains unresolved and is not an assistive-technology result. Custom initial focus, portal placement, content, and modality can change the sequence. Choose the appropriate focus behavior and verify the host and assistive technologies rather than assuming legacy parity.
- Replace `renderAnchor={null}` with `anchorRef` by passing the element or ref to `Content`'s `anchor`, controlling `open`, and passing `finalFocus` so focus returns to it on close.
- Replace `onOpen`/`onClose` gestures with `onOpenChange`, whose details report the reason (`trigger-press`, `outside-press`, `escape-key`, or `close-press`).
- **Legacy focus-trap migration:** legacy `AnchoredOverlay` enables its focus trap by default while open and positioned, unless `focusTrapSettings` overrides it. The canary is non-modal by default. `modal="trap-focus"` with an `AnchoredOverlay.Close` inside `Content` is one way to retain keyboard focus containment without locking document scroll or disabling outside pointer interactions; it is not equivalent to full `modal={true}`. Some host policies discourage trapping focus in non-modal UI, so check the intended interaction with an accessibility specialist. Base UI requires a close part to enable trapping in full-modal mode, and recommends one in `trap-focus` mode so touch-screen-reader users can leave. Keep a keyboard-operable dismissal path and verify initial focus, Tab/Shift+Tab containment, Escape or Close, and return focus. Controlled overlays must actually close in `onOpenChange`. The github-ui `DemoNotification` migration reports passing Tab containment, Escape dismissal, and anchor focus restoration; that is scoped host evidence, not a cross-browser or assistive-technology parity claim.
- **Outside dismissal:** with `modal="trap-focus"`, Base UI 1.6 and 1.8 can request dismissal on mouse-down or touch movement before a gesture finishes. A canceled gesture can discard an uncontrolled draft. When an overlay is intended to remain open on every outside press, `onOpenChange` can synchronously cancel the `outside-press` request; controlled state must also remain open. This opts out of normal outside-press dismissal rather than distinguishing completed from canceled gestures. Retain an explicit close action and review pointer and focus behavior with an accessibility specialist.
- Replace `focusZoneSettings` by composing `ActionList` or `ActionBar`, which own arrow-key navigation.
- Replace named portal roots with `portal={false}`, which renders the overlay in place, for example inside a scrolling container.
- `preventOverflow`, `pinPosition`, `displayInViewport`, `onPositionChange`, `inside-*` placements, and the CSS-anchor fallback options are unsupported; Base UI's collision handling replaces them.
- Use `className`, not `sx` or styled-system props.
