# Tooltip

`Tooltip` provides supplementary text for a trigger.

Import: `import {Tooltip} from '@primer/react-tailwind/Tooltip'`

Forwards unrecognized props to Base UI's [`Tooltip.Root`](https://base-ui.com/react/components/tooltip#root), so it also accepts that part's props.

## Props

- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown after the tooltip text. Uses the `KeybindingHint` key syntax, such as `Mod+B`. Assistive technology receives the shortcut as plain text in the trigger's description.
- `type`: `TooltipType` — Default `'description'`. How the tooltip relates to its trigger. `description` adds supplementary text through `aria-describedby`. `label` repeats the trigger's accessible name visually, so the trigger must already be named, for example with `aria-label`; the tooltip is then hidden from assistive technology.

## Tooltip.Root

Forwards unrecognized props to Base UI's [`Tooltip.Root`](https://base-ui.com/react/components/tooltip#root), so it also accepts that part's props.

- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown after the tooltip text. Uses the `KeybindingHint` key syntax, such as `Mod+B`. Assistive technology receives the shortcut as plain text in the trigger's description.
- `type`: `TooltipType` — Default `'description'`. How the tooltip relates to its trigger. `description` adds supplementary text through `aria-describedby`. `label` repeats the trigger's accessible name visually, so the trigger must already be named, for example with `aria-label`; the tooltip is then hidden from assistive technology.

## Tooltip.Trigger

Forwards unrecognized props to Base UI's [`Tooltip.Trigger`](https://base-ui.com/react/components/tooltip#trigger), so it also accepts that part's props.

## Tooltip.Content

Forwards unrecognized props to Base UI's [`Tooltip.Popup`](https://base-ui.com/react/components/tooltip#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'center'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `keepMounted`: `boolean` — Keeps the popup in the DOM while closed so `aria-describedby` always resolves. Defaults to `true` when the trigger is described by the tooltip: description tooltips, and label tooltips with a keybinding hint.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'top'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `8`. Distance in pixels between the content and its anchor, or a callback that computes it.

## Tooltip.Popup

Forwards unrecognized props to Base UI's [`Tooltip.Popup`](https://base-ui.com/react/components/tooltip#popup), so it also accepts that part's props.

## Tooltip.Positioner

Forwards unrecognized props to Base UI's [`Tooltip.Positioner`](https://base-ui.com/react/components/tooltip#positioner), so it also accepts that part's props.

## Tooltip.Portal

Forwards unrecognized props to Base UI's [`Tooltip.Portal`](https://base-ui.com/react/components/tooltip#portal), so it also accepts that part's props.

## Tooltip.Provider

Forwards unrecognized props to Base UI's [`Tooltip.Provider`](https://base-ui.com/react/components/tooltip#provider), so it also accepts that part's props.

## Tooltip.Arrow

Forwards unrecognized props to Base UI's [`Tooltip.Arrow`](https://base-ui.com/react/components/tooltip#arrow), so it also accepts that part's props.

## Tooltip.Viewport

Forwards unrecognized props to Base UI's [`Tooltip.Viewport`](https://base-ui.com/react/components/tooltip#viewport), so it also accepts that part's props.

## Differences from `@primer/react`

- Replace `direction` with physical `side` and use `align` where needed.
