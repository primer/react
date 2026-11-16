# Tooltip

`Tooltip` provides supplementary text for a trigger.

Import: `import {Tooltip} from '@primer/react-tailwind/Tooltip'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Button, Tooltip} from '@primer/react-tailwind'
;<Tooltip>
  <Tooltip.Trigger render={<Button>Copy</Button>} />
  <Tooltip.Content>Copy repository URL</Tooltip.Content>
</Tooltip>
```

By default, description tooltips supplement an existing accessible name. A label tooltip can name an otherwise unnamed trigger from its text, including before hydration; provide a separate name when that text is unavailable to server rendering as described below. Do not put essential interactive controls in tooltip content.

`Tooltip.Trigger` adds tooltip behavior to the element passed to `render`, so the trigger stays a single element. A `description` tooltip (the default) adds its text to the trigger's accessible description. A `label` tooltip names a trigger without visible text, such as an icon-only link, through `aria-labelledby`.

The visual tooltip content is hidden from the accessibility tree; the trigger's label or description references its text instead. Keep tooltip content non-interactive.

### Placement and delay

`Tooltip.Content` opens below its trigger, centered, 4px away. Use `side` and `align` to move it; it flips when there isn't room. `delay` on the root sets how long the pointer rests before the tooltip opens: `short` (50ms, the default), `medium` (400ms) or `long` (1200ms). Keyboard focus opens it immediately. `Tooltip.Provider` sets a shared delay for a group of tooltips, and once one is open its neighbors open without a delay.

The visual popup can cover a nearby control and intercept pointer input. Choose a placement with enough room, or adjust the surrounding layout; for an `IconButton`, use `tooltipDirection`. A tooltip can flip at a viewport edge or cover a different control, so verify the actual placement at supported viewport sizes, directions, and zoom levels. If no placement leaves nearby controls usable, show the explanation as persistent inline text associated with the relevant control instead. Avoid disabling popup hoverability or pointer events as a blanket workaround: hover-triggered content must remain available when the pointer moves onto it.

### Composing with other triggers

Render another trigger to give one element both behaviors, such as a menu or dialog trigger with a tooltip.

When a tooltip is opened by hover inside a dialog while focus remains on another control, pressing Escape can dismiss both the tooltip and the dialog. Legacy standalone popovers and overlays with document-level Escape listeners can close on the same key press too. An application that needs the tooltip dismissed first must coordinate dismissal with its other open layers; a blanket Escape guard can incorrectly take precedence over a newer popup. There is no public cross-portal dismissal stack in this package yet.

### Finding the visual popup

For a trigger inside its `Tooltip.Root`, `data-tooltip-trigger` and its `Tooltip.Content` or `Tooltip.Popup` share an opaque token. The same association is available for tooltips created by `IconButton`, `IconLinkButton`, and `SegmentedControl`. Compare the attribute values exactly to find the popup, including when a trigger has its own accessible name or a keyboard shortcut. Do not derive the token from text, treat it as a DOM ID or ARIA reference, or override it in a `render` element. Composed elements must forward the supplied props.

The trigger has the token in server markup and retains it through hydration. The visual popup may not be mounted yet, for example while its portal container is pending or when `keepMounted={false}`. A server-rendered text reference is not the visual popup. A disabled root omits the trigger association. If a root has several triggers, they share the token; Base UI's `data-popup-open` identifies the trigger that opened it.

The token identifies ownership, not visibility: an open popup can still be hidden by CSS or an ancestor. Resolve it in the actual portal container and check its rendered visibility before using it for dismissal decisions. A document-wide selector does not cross shadow roots or documents; use the known portal container or a `Tooltip.Content` ref when available. When independently server-rendering multiple React roots, give each root a distinct `identifierPrefix` and reuse that prefix during hydration. A detached Base UI handle trigger outside the owning Primer root, or a trigger using a different handle than its surrounding root, does not receive this association.

This is not a dismissal stack. A parent coordinating Escape must also account for other, more recently opened layers.

### ARIA references

Pass `aria-labelledby` and the trigger's `id` to `Tooltip.Trigger`; a label takes precedence over the tooltip, and the trigger tracks its open state by its `id`. Descriptions supplied directly to the trigger or its render element or callback result are merged with the tooltip's description. Other props on the rendered element can replace the trigger's, as with any Base UI `render` prop. Set `id` on the root to reference the tooltip text from elsewhere.

For a label tooltip, a non-empty `aria-label` on the trigger or its rendered element is preserved instead of the automatically generated tooltip label. An empty or whitespace-only name does not override the tooltip. When a render callback supplies an `aria-label` and must explicitly reference the tooltip's own ID as well, pass that `aria-labelledby` to `Tooltip.Trigger`: the same ID on the returned element is indistinguishable from the generated reference.

If a custom trigger component sets its own `aria-label` internally, also pass that label to `Tooltip.Trigger`. Otherwise the tooltip reference can replace the component's name after mounting. Similarly, when `keybindingHint` is present and a custom content component sets its own `aria-label` internally, pass that label to `Tooltip.Content` so the trigger receives the intended name or description.

When a label tooltip is visible on a trigger with an existing accessible name, include the tooltip text in that name so speech-input users can activate the trigger by its visible label.

A `disabled` root never opens and stops naming or describing its trigger.

The tooltip's text reference target is rendered in server markup and remains available while its visual popup is waiting for a portal container. The target uses text from composed children; for content generated by a component that does not expose its text through `children`, pass `aria-label` directly to `Tooltip.Content`. If a `Tooltip.Content` render callback supplies its own accessible name, also pass that name as a prop so it is available before the callback runs after hydration. The popup itself remains portalled and hidden from the accessibility tree.

Do not rely on `aria-labelledby` on `Tooltip.Content` to supply the trigger's name or description: Chromium's native accessibility tree can ignore that chained reference, including when a keyboard hint is present. Use the tooltip text or an `aria-label` on the content instead, or reference independent text directly from `Tooltip.Trigger`.

An `aria-label` is a fallback while none of the control's `aria-labelledby` references resolves. If another referenced element supplies a name, that name takes precedence; the tooltip text also contributes in ID-reference order. Referencing a description tooltip for both name and description can repeat its text, and a `keybindingHint` becomes part of that name. For an icon-only control that needs a distinct fallback name, provide a meaningful, non-whitespace `aria-label` directly on the control, including when it is nested inside the tooltip trigger.

Forwards unrecognized props to Base UI's [`Tooltip.Root`](https://base-ui.com/react/components/tooltip#root), so it also accepts that part's props.

## Props

- `delay`: `TooltipDelay` — Default `'short'`. How long the pointer rests on the trigger before the tooltip opens: `short` (50ms), `medium` (400ms) or `long` (1200ms). Keyboard focus opens it straight away. Without a value, the surrounding `Tooltip.Provider` delay applies, falling back to `short`.
- `id`: `string` — Id of the element holding the tooltip text, so other elements can reference it from `aria-labelledby` or `aria-describedby`. Generated when omitted.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown after the tooltip text. Uses the `KeybindingHint` key syntax, such as `Mod+B`. Assistive technology receives the shortcut as plain text in the trigger's description.
- `type`: `TooltipType` — Default `'description'`. How the tooltip relates to its trigger. `description` adds the text to the trigger's accessible description through `aria-describedby`. `label` names the trigger through `aria-labelledby`, for triggers without visible text such as icon-only buttons; an `aria-labelledby` passed to the trigger takes precedence, and an `aria-label` passed to the trigger or its render element is preserved, so the tooltip stays visual.

## Tooltip.Root

Forwards unrecognized props to Base UI's [`Tooltip.Root`](https://base-ui.com/react/components/tooltip#root), so it also accepts that part's props.

- `delay`: `TooltipDelay` — Default `'short'`. How long the pointer rests on the trigger before the tooltip opens: `short` (50ms), `medium` (400ms) or `long` (1200ms). Keyboard focus opens it straight away. Without a value, the surrounding `Tooltip.Provider` delay applies, falling back to `short`.
- `id`: `string` — Id of the element holding the tooltip text, so other elements can reference it from `aria-labelledby` or `aria-describedby`. Generated when omitted.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown after the tooltip text. Uses the `KeybindingHint` key syntax, such as `Mod+B`. Assistive technology receives the shortcut as plain text in the trigger's description.
- `type`: `TooltipType` — Default `'description'`. How the tooltip relates to its trigger. `description` adds the text to the trigger's accessible description through `aria-describedby`. `label` names the trigger through `aria-labelledby`, for triggers without visible text such as icon-only buttons; an `aria-labelledby` passed to the trigger takes precedence, and an `aria-label` passed to the trigger or its render element is preserved, so the tooltip stays visual.

## Tooltip.Trigger

Forwards unrecognized props to Base UI's [`Tooltip.Trigger`](https://base-ui.com/react/components/tooltip#trigger), so it also accepts that part's props.

## Tooltip.Content

Forwards unrecognized props to Base UI's [`Tooltip.Popup`](https://base-ui.com/react/components/tooltip#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'center'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `container`: `HTMLElement | RefObject<HTMLElement | ShadowRoot | null> | ShadowRoot | null` — Portal destination. Defaults to the nearest `Portal.Provider` container, then the shared portal root. Pass `null` to wait for a container; ignored when `portal` is false.
- `keepMounted`: `boolean` — Keeps the visual popup in the DOM while closed after it mounts. Defaults to `true` unless the tooltip is disabled. The text target referenced by the trigger is rendered separately, including on the server.
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
- Pass `aria-labelledby` and the trigger's `id` to `Tooltip.Trigger`. The trigger merges `aria-describedby` supplied directly on itself or its render element or callback result with the tooltip's description. Other render-element props can replace the trigger's, and the trigger tracks its open state by its `id`.
- `Tooltip.Provider` sets a delay for a group of tooltips. Base UI's `disabled` root never opens, and stops naming or describing its trigger.
- An `IconButton` rendered by `Tooltip.Trigger` skips its own tooltip, as it does inside a TooltipV2.
- **Portal container:** `Tooltip.Content container` routes a single tooltip; `null` waits for its target. `Portal.Provider container` sets the default for a subtree, including tooltips that IconButton, IconLinkButton, and SegmentedControl create internally. Neither consumes legacy `PortalContext` or named roots, so resolve the named root in the host first. `Tooltip.Provider` still configures timing only. In the github-ui host's scoped Chromium finding, an artifact-panel Back tooltip appeared in the body outside the panel, and the panel's Escape capture closed the panel instead of dismissing the tooltip. Routing alone does not guarantee that the tooltip handles Escape before an ancestor capture handler.
- **Server-rendered reference text:** A visually hidden target exposes composed tooltip text and keyboard hints before hydration, including when the visual popup is portalled or waiting for its container. Once the popup mounts, it takes over the same ID so custom rendered content names and existing client behavior are preserved without duplicate IDs. If a custom child component does not expose text through its `children`, provide `aria-label` directly on `Tooltip.Content`; a render callback's name is unavailable to server rendering unless also passed as a prop. The target's accessible name and description still need assistive-technology verification.
- **Parity gap — chained content references:** Chromium's native accessibility tree can ignore `aria-labelledby` supplied to `Tooltip.Content` when the trigger references the content. With a shortcut, the native result also differs from Playwright's computed-description matcher. Use text or `aria-label` on the content, or put independent references directly on `Tooltip.Trigger`; arbitrary chained content references remain unresolved.
- **Description tooltip used as a name:** A control may reference a description tooltip's ID in `aria-labelledby`; the server target resolves that reference while preserving independent and mixed ID references. A trigger `aria-label` remains a fallback when no `aria-labelledby` target resolves. If the tooltip ID supplies both name and description, the text is present in both, and a shortcut hint also becomes part of the name. These are markup and browser observations, not screen-reader results.
- **Label precedence:** A non-empty `aria-label` or independent `aria-labelledby` supplied directly to the trigger or its render element remains authoritative after hydration. An explicit reference to the tooltip's own ID resolves to the content's name; a separate trigger `aria-label` serves only as a fallback while that target is missing. Blank or whitespace-only trigger labels and ID references do not provide a name and instead use the server-rendered tooltip reference. With a shortcut, a content `aria-label` can add context to the visible text while the shortcut remains in the trigger's description. When a trigger render callback supplies both an `aria-label` and an explicit reference to the tooltip's own ID, pass the reference on `Tooltip.Trigger`; a returned ID identical to the generated one cannot be distinguished from it.
- **Parity gap — names inside custom render components:** A label trigger cannot detect an `aria-label` added inside a custom component, and the mounted tooltip can override that name; pass the label directly to `Tooltip.Trigger`. With `keybindingHint`, an `aria-label` added inside a custom content component is likewise lost from label and description tooltips; pass it directly to `Tooltip.Content`. Chromium checks cover both workarounds in the current source with Base UI 1.6 and 1.8. The pinned `afdf7e9` canary supports the trigger workaround but not the content workaround; omit the hint or retain a host adapter there. A generic solution remains unresolved, and screen-reader behavior has not been verified.
- **Host evidence — document-level Escape registries:** a second cause of the artifact-panel regression was the host's document-level legacy Escape registry, which closed the panel before Base UI dismissed a hovered, unfocused IconButton tooltip. The host detects an open trigger within the panel scope and prevents the registry's own dismissal in its tested docked and overlay cases. This remains a scoped host workaround, not a Primer dismissal-stack contract.
- **Visual popup association:** `data-tooltip-trigger` and `data-tooltip-popup` carry the same opaque owner token for triggers inside their Primer root and the actual popup, including built-in control tooltips and shortcut hints. The token is independent of ARIA references and is not a DOM ID. An absent, unmounted, CSS-hidden, or shadow-root popup requires the consumer to account for its actual portal and visibility; `data-popup-open` alone does not establish that it is visible. Detached handle triggers and triggers using a different handle from their surrounding root have no association. This is not a cross-portal dismissal stack or a universal decision about which layer consumes Escape.
- The absence of an ARIA ID relationship is expected for a visual label tooltip when the trigger already has `aria-label`; the existing name takes precedence. Description tooltips and otherwise unnamed label tooltips retain their documented ARIA references.
- Keyboard focus opens the tooltip immediately; TooltipV2 shows it only for `:focus-visible`.
- **Unsupported — native popover:** Tooltip does not use the browser top layer. It positions a portaled Base UI popup with `z-popover` and never calls `showPopover()` or `hidePopover()`. Do not forward a legacy `popover` attribute to `Tooltip.Content` or `Tooltip.Popup`: in Chromium, an unopened `[popover]` stays `display: none`, so the popup can be marked `data-open` and still describe its trigger while remaining invisible. There is no public option to combine Base UI floating positioning with native popover display, and native-popover support is not planned for now: Base UI positions and dismisses the popup itself, and Primer `Dialog` is not a top-layer dialog either. The supported way to show a tooltip above a native modal is to keep it in the dialog subtree, as described below. A consumer-managed native-popover adapter must own open/close synchronization and still verify positioning. Native `popover="auto"` also light-dismisses other open auto popovers outside its ancestry: a Chromium check closed an existing host auto popover. Use `manual` if you build such an adapter, and verify it against the host's popover stack.
- **Native modal dialogs:** for a tooltip inside a native `<dialog>` opened with `showModal()`, keep its popup inside the dialog subtree instead of portaling it into the page root. Use `portal={false}` or `container={dialogElement}` on `Tooltip.Content`. To cover IconButton and other internally generated tooltips too, wrap the dialog content in `Portal.Provider container={dialogElement}`. In Chromium, an in-dialog tooltip won hit-testing over a body-portaled fixed element with maximum `z-index`. A top-layer popover shown later from outside the modal subtree remained open, but was not hit-testable at the same point. Primer `Dialog` is not a native top-layer dialog; its nested tooltips inherit the dialog's Base UI portal. Clipping by an `overflow` ancestor, assistive-technology parity, and dismissal ordering are not covered by this check.
- **Host-verified modal-dialog adapter:** the github-ui host Tooltip adapter renders `Tooltip.Content portal={false}` inside an open native modal dialog. A scoped Chromium test showed the tooltip became hit-testable above the modal after this change, kept its trigger's accessible description, and handled Escape in two steps: the first Escape closed the tooltip and returned focus to the trigger without closing the dialog, and the second Escape closed the dialog. This is host-adapter evidence, not a package top-layer contract. Cross-browser behavior and assistive-technology parity remain unverified.
- **Dialog opened after the tooltip:** a static `portal={false}` decision is insufficient when a tooltip is already controlled-open or default-open before its enclosing `<dialog>` calls `showModal()` and focus moves elsewhere; the host popup stayed in the body portal behind the modal. The host adapter now observes ancestor dialog `open` changes while the tooltip is open and moves the popup into the active modal. Scoped Chromium tests pass for that controlled/default-open case, nested native modals, a non-modal dialog, and a clipped trigger wrapper. The package has no built-in dialog observer; this does not establish arbitrary dialog clipping, cross-browser behavior, or assistive-technology parity.
- **Parity gap — dismissal ordering:** A hover-open tooltip inside a dialog, or a legacy standalone popover or overlay, does not reliably dismiss before its owner when focus is elsewhere. Base UI does not currently register that tooltip as a child dismiss layer; consumers needing ordered dismissal must coordinate it with all newer popups. No public cross-portal dismissal stack is available yet.
- **Overlapping controls:** In Chromium with Base UI 1.6 and 1.8, a focus-open tooltip can cover an adjacent control and receive its pointer click. `IconButton tooltipDirection="n"` avoids the overlap in the tested layout when there is space above, but can flip below and cover the control at the viewport edge. A github-ui picker using the pinned canary also found that anchoring above its whole list moved the obstruction to its search input in both LTR and RTL. Disabling pointer events on only the popup still leaves the positioner hit-testable; making the positioner pointer-transparent or disabling hoverability allows the click through but makes the tested hover-open tooltip disappear when the pointer moves onto its content. No general package-level avoidance is provided; persistent inline explanations can avoid relying on an overlay when no safe placement exists.
- **Parity gap — focus after hover dismissal:** In Chromium with Base UI 1.6 and 1.8, dismissing a hover-open tooltip with Escape while its trigger is unfocused can prevent it from reopening when that trigger next receives keyboard focus. A Tooltip-scoped Base UI prototype passed focused dismissal, controlled rejection, nested and multiple triggers, popup focus, shadow-root, and menubar checks, but is not shipped. PreviewCard has a similar separate issue. Other browsers and assistive technologies remain unverified.
- Tooltip content is hidden from the accessibility tree and referenced by its trigger; description content does not use `role="tooltip"`.
- `sx` and styled-system props are unsupported.
