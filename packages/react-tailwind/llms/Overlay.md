# Overlay

`Overlay` is a low-level surface for positioned content.

Import: `import {Overlay} from '@primer/react-tailwind/Overlay'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Overlay} from '@primer/react-tailwind'
;<Overlay aria-label="Preview" role="dialog">
  Overlay content
</Overlay>
```

Select an appropriate role, give dialogs an accessible name, and provide focus management and dismissal when the surface is interactive.

`Overlay` does not open a portal, position itself relative to an anchor, dismiss on Escape or outside interaction, or move focus. Do not pass the legacy behavioral props to it, including through a prop spread. Use `Popover` or `AnchoredOverlay` for an anchored interactive surface, or `Dialog` for a modal dialog; their roots own open state and their popup parts own initial and final focus.

For an anchored surface that needs the `Overlay` appearance, let `Popover` own its behavior and render `Overlay` as its popup:

```tsx
import {Button, Overlay, Popover} from '@primer/react-tailwind'
;<Popover>
  <Popover.Trigger render={<Button>Open settings</Button>} />
  <Popover.Portal>
    <Popover.Positioner>
      <Popover.Popup aria-label="Settings" render={<Overlay className="relative" />}>
        {/* Settings and nested popups */}
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover>
```

In this composition, nested `ActionMenu`, `Popover`, and `Dialog` children can use their normal portals without a separate document-level outside-click listener. Their owner remains open while a child is activated or dismissed. This does not make an arbitrary legacy outside-click listener portal-aware; migrate the owner and verify any custom portal or dismissal behavior separately.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Overlay.Root

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Overlay.Content

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Do not treat Tailwind `Overlay` as a drop-in modal/menu controller.
- Migrate behavioral usage to `Dialog`, or to `Popover`/`AnchoredOverlay` for an anchored surface. Their `Root` exposes controlled `open` and `onOpenChange(open, details)`; distinguish Escape and outside dismissal using `details.reason`. These callbacks and native events are not the legacy `onEscape` and `onClickOutside` contracts.
- A `Popover.Popup` can render `Overlay` as its surface while the Popover owns dismissal. Nested portaled `ActionMenu`, `Popover`, and `Dialog` children remain within that owner for the documented interactions; a separate legacy document-level listener does not inherit that behavior.
- `ignoreClickRefs` has no direct equivalent. A controlled owner can inspect close-request details before changing `open`, but must account for trigger presses, focus-out, portals, and nested overlays rather than assuming identical ignored-click behavior.
- Use popup `initialFocus` and `finalFocus` rather than `initialFocusRef` and `returnFocusRef`; `false` opts out. A final-focus ref or callback targeting a non-tabbable container with tabbable descendants may focus a descendant instead, so verify any exact-container requirement.
- For an explicit portal destination, compose `Portal container={...}` with `Positioner` and `Popup`; `Content` does not accept a named portal container. `Positioner` accepts an anchor, side, alignment, offsets, and collision props, but legacy `inside-*` placements do not map directly.
- Remove legacy behavioral, positioning, animation, and layering props rather than spreading them onto the presentational div. Remove `sx` and styled-system props.
