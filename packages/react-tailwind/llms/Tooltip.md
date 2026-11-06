# Tooltip

`Tooltip` provides supplementary text for a trigger.

Import: `import {Tooltip} from '@primer/react-tailwind/Tooltip'`

Forwards unrecognized props to Base UI's [`Tooltip.Root`](https://base-ui.com/react/components/tooltip#root), so it also accepts that part's props.

## Props

- `delay`: `TooltipDelay` — Default `'short'`. How long the pointer rests on the trigger before the tooltip opens: `short` (50ms), `medium` (400ms) or `long` (1200ms). Keyboard focus opens it straight away. Without a value, the surrounding `Tooltip.Provider` delay applies, falling back to `short`.
- `id`: `string` — Id of the element holding the tooltip text, so other elements can reference it from `aria-labelledby` or `aria-describedby`. Generated when omitted.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown after the tooltip text. Uses the `KeybindingHint` key syntax, such as `Mod+B`. Assistive technology receives the shortcut as plain text in the trigger's description.
- `type`: `TooltipType` — Default `'description'`. How the tooltip relates to its trigger. `description` adds the text to the trigger's accessible description through `aria-describedby`. `label` names the trigger through `aria-labelledby`, for triggers without visible text such as icon-only buttons; an `aria-labelledby` passed to the trigger takes precedence, and a trigger that already has an `aria-label` keeps it, so the tooltip stays visual.

## Tooltip.Root

Forwards unrecognized props to Base UI's [`Tooltip.Root`](https://base-ui.com/react/components/tooltip#root), so it also accepts that part's props.

- `delay`: `TooltipDelay` — Default `'short'`. How long the pointer rests on the trigger before the tooltip opens: `short` (50ms), `medium` (400ms) or `long` (1200ms). Keyboard focus opens it straight away. Without a value, the surrounding `Tooltip.Provider` delay applies, falling back to `short`.
- `id`: `string` — Id of the element holding the tooltip text, so other elements can reference it from `aria-labelledby` or `aria-describedby`. Generated when omitted.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown after the tooltip text. Uses the `KeybindingHint` key syntax, such as `Mod+B`. Assistive technology receives the shortcut as plain text in the trigger's description.
- `type`: `TooltipType` — Default `'description'`. How the tooltip relates to its trigger. `description` adds the text to the trigger's accessible description through `aria-describedby`. `label` names the trigger through `aria-labelledby`, for triggers without visible text such as icon-only buttons; an `aria-labelledby` passed to the trigger takes precedence, and a trigger that already has an `aria-label` keeps it, so the tooltip stays visual.

## Tooltip.Trigger

Forwards unrecognized props to Base UI's [`Tooltip.Trigger`](https://base-ui.com/react/components/tooltip#trigger), so it also accepts that part's props.

## Tooltip.Content

Forwards unrecognized props to Base UI's [`Tooltip.Popup`](https://base-ui.com/react/components/tooltip#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'center'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `keepMounted`: `boolean` — Keeps the popup in the DOM while closed so the trigger's `aria-labelledby` or `aria-describedby` always resolves. Defaults to `true` unless the tooltip is disabled.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'bottom'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.

## Tooltip.Popup

Forwards unrecognized props to Base UI's [`Tooltip.Popup`](https://base-ui.com/react/components/tooltip#popup), so it also accepts that part's props.

## Tooltip.Positioner

Forwards unrecognized props to Base UI's [`Tooltip.Positioner`](https://base-ui.com/react/components/tooltip#positioner), so it also accepts that part's props.

## Tooltip.Portal

Forwards unrecognized props to Base UI's [`Tooltip.Portal`](https://base-ui.com/react/components/tooltip#portal), so it also accepts that part's props.

## Tooltip.Provider

Forwards unrecognized props to Base UI's [`Tooltip.Provider`](https://base-ui.com/react/components/tooltip#provider), so it also accepts that part's props.

- `delay`: `TooltipDelay` — Default `'short'`. Open delay for tooltips in this group that don't set their own `delay`: `short` (50ms), `medium` (400ms) or `long` (1200ms). Once one tooltip in the group is open, adjacent tooltips open without a delay.

## Tooltip.Arrow

Forwards unrecognized props to Base UI's [`Tooltip.Arrow`](https://base-ui.com/react/components/tooltip#arrow), so it also accepts that part's props.

## Tooltip.Viewport

Forwards unrecognized props to Base UI's [`Tooltip.Viewport`](https://base-ui.com/react/components/tooltip#viewport), so it also accepts that part's props.

## Differences from `@primer/react`

- Move `text` into `Tooltip.Content`, and wrap the child in `Tooltip.Trigger render={...}` instead of nesting it in `Tooltip`.
- Replace `direction` with `side` and `align`: `n` is `top`, `s` is `bottom`, `e` is `right` and `w` is `left`, all `center`. `ne` and `se` use `start`; `nw` and `sw` use `end`.
- Pass `aria-describedby`, `aria-labelledby`, and the trigger's `id` to `Tooltip.Trigger`. TooltipV2 merges them from the child, but Base UI lets the rendered element's props replace the trigger's, and the trigger tracks its open state by its `id`.
- `Tooltip.Provider` sets a delay for a group of tooltips. Base UI's `disabled` root never opens, and stops naming or describing its trigger.
- An `IconButton` rendered by `Tooltip.Trigger` skips its own tooltip, as it does inside a TooltipV2.
- Keyboard focus opens the tooltip immediately; TooltipV2 shows it only for `:focus-visible`.
- Tooltip content is hidden from the accessibility tree and referenced by its trigger; description content does not use `role="tooltip"`.
- `sx` and styled-system props are unsupported.
