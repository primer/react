# ActionMenu

`ActionMenu` is a composable Base UI menu with button and low-level trigger options.

Import: `import {ActionMenu} from '@primer/react-tailwind/ActionMenu'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

The root forwards Base UI Menu props, including controlled `open`/`onOpenChange` and `defaultOpen`. `Button` supports Button props; `Content` owns its portal and positioner, and takes placement, collision, `anchor`, `container`, `portal`, overlay size, and fullscreen `variant` options; `Item` and `SubmenuTrigger` support danger, selected, inactive, and loading states.

Anchored content fits within the available collision width, even when `width` or `maxWidth` specifies a larger size. Its usual minimum also shrinks when the boundary is narrower. With `width="auto"`, the menu sizes to its content within those constraints; inactive reasons occupy their own row and can wrap. A caller-supplied maximum smaller than that minimum does not override it: to apply such a cap, also set an appropriate minimum, for example `style={{maxWidth: 'calc(100vw - 32px)', minWidth: 0}}`. Caller-supplied sizing or positioner layout classes can override the default constraints, so verify that custom sizing does not clip menu items. The narrow fullscreen variant still fills the viewport.

Opening moves focus into the menu. `Content finalFocus` and `preventFocusOnClose` control closing focus only; there is no public `initialFocusRef` or `preventFocusOnOpen` equivalent for retaining trigger focus on opening. The alignment notes describe this legacy migration gap and the distinction from a nonmodal popover.

## Import and composition

```tsx
import {ActionMenu} from '@primer/react-tailwind/ActionMenu'
```

Compose `Button` or `Trigger`, then `Content`/`Overlay`, with `Item`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Group`, `GroupLabel`, and `Divider` as needed. Items accept `LeadingVisual`, `TrailingVisual`, and inline or block `Description` parts that share the ActionList presentation layer. Compose another branded trigger through Base UI's `render` prop and use `className` to supply its visual treatment. Set `id` on `Button` or `Trigger` rather than on the rendered element, because the trigger tracks its open state by its `id`.

When an item opens a dialog, transfer focus ownership explicitly: set a handoff flag in the selection handler, pass it to `Content preventFocusOnClose`, and give `Dialog.Content finalFocus` the stable menu-trigger ref. Reset the flag when the dialog closes so ordinary menu actions keep their default restoration. If opening is deferred, set the flag before scheduling the opening rather than deriving it only from the dialog's open state. `onOpenChangeComplete` reports animation completion, not completion of queued focus restoration; a frame delay is not a focus-completion contract. The alignment notes include a complete composition.

To add a tooltip to a menu trigger, compose both triggers onto the same button instead of rendering a tooltip wrapper inside the menu trigger:

```tsx
import {Button} from '@primer/react-tailwind/Button'
import {Tooltip} from '@primer/react-tailwind/Tooltip'
;<ActionMenu>
  <Tooltip>
    <Tooltip.Trigger render={<ActionMenu.Trigger render={<Button />}>Branches</ActionMenu.Trigger>} />
    <Tooltip.Content>Switch branches</Tooltip.Content>
  </Tooltip>
  <ActionMenu.Content>
    <ActionMenu.Item>main</ActionMenu.Item>
  </ActionMenu.Content>
</ActionMenu>
```

`Tooltip.Trigger render={<ActionMenu.Button>Branches</ActionMenu.Button>}` also works. A custom button must forward its ref, received event and ARIA props, and children to the same native button, so pointer and keyboard activation, positioning, and focus restoration work.

For an icon-only trigger, compose `ActionMenu.Trigger` with `IconButton`. You can share the tooltip text with a separate label that remains available even if the tooltip is disabled or removed, then reference it on the outer trigger and typed icon button:

```tsx
import {GearIcon} from '@primer/octicons-react'
import {ActionMenu, IconButton, Tooltip} from '@primer/react-tailwind'
import {useId} from 'react'

function RepositoryActions() {
  const labelId = useId()
  const label = 'Repository actions'
  return (
    <>
      <span hidden id={labelId}>
        {label}
      </span>
      <ActionMenu>
        <Tooltip type="label">
          <Tooltip.Trigger
            aria-labelledby={labelId}
            render={<ActionMenu.Trigger render={<IconButton aria-labelledby={labelId} icon={<GearIcon />} />} />}
          />
          <Tooltip.Content>{label}</Tooltip.Content>
        </Tooltip>
        <ActionMenu.Content aria-labelledby={labelId}>
          <ActionMenu.Item>Copy</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    </>
  )
}
```

Pass the same reference to `ActionMenu.Content` so the menu is named too. Alternatively, reference the `id` of an enabled, mounted label tooltip on `Tooltip.Trigger`, `IconButton`, and `ActionMenu.Content`. The tooltip supplies its reference text in server-rendered HTML even though the visual popup is portaled. If its content is generated by a custom component or render callback, follow the [Tooltip guidance](./Tooltip.md#aria-references) to make the name available on the server. Both icon components and rendered elements are supported. `ActionMenu.Button` shows a chevron by default; pass `trailingAction={null}` to omit it, or pass a component or rendered element to replace it.

Use `Content showDividers` to draw dividers between items; use `Divider` for an explicit separator. The option applies to the whole menu content rather than an individual group.

When an `ActionMenu.Item` uses `render` with a native button, set `nativeButton` so Base UI applies the correct button behavior. The rendered component must forward its ref and received props, including children and capture handlers, to the same button. It must also respect its disabled state; side effects in its own earlier capture handlers or discarded props cannot be prevented by the menu.

When a custom render replaces an item's children, it must render and associate any inactive reason itself.

For client-side navigation, render a ref-forwarding router link that produces an anchor:

```tsx
<ActionMenu.LinkItem render={<RouterLink to="/projects" />}>Projects</ActionMenu.LinkItem>
```

While `inactiveText` is present, `LinkItem` renders a non-navigable anchor without `href` and forwards its ref to that anchor. A custom `render` is not mounted until the item is available, so a ref attached to that custom element remains unset.

`LinkItem` participates in menu keyboard navigation: both Enter and Space activate it. This differs from a standalone native link, where Space scrolls rather than navigating.

For nested menus, compose `SubmenuTrigger` and `Content` as siblings:

```tsx
<ActionMenu.Submenu>
  <ActionMenu.SubmenuTrigger>Models</ActionMenu.SubmenuTrigger>
  <ActionMenu.Content>
    <ActionMenu.Item>Fast model</ActionMenu.Item>
    <ActionMenu.Item>Detailed model</ActionMenu.Item>
  </ActionMenu.Content>
</ActionMenu.Submenu>
```

`SubmenuTrigger` associates its `Description` parts and `inactiveText` as accessible descriptions. It preserves explicit names and additional description references. Supplied trailing visuals appear alongside the submenu chevron. Inactive and loading triggers cannot open their submenu, including on hover. As with `Item`, a spinner replaces the leading visual, or the trailing visual when there is no leading visual. `loadingText` is included in an inferred accessible name, or associated as a description when an explicit name is supplied.

`selected` draws the current-choice indicator without changing selection on submenu open. It is presentational and does not set a checked state. When a submenu trigger represents the controlled current model in a radio-style menu, pass `role="menuitemradio"` and `aria-checked={selected}` separately. Opening the submenu only opens it; update the model in the tier-selection callback, not in `onOpenChange`.

Do not nest `Content` in `SubmenuTrigger`: doing so interferes with keyboard navigation between submenu levels.

When a custom submenu trigger is named with `aria-labelledby`, pass the same `aria-labelledby` to its `Content` as well. Base UI's default submenu name can otherwise use the trigger's visible or owned content rather than that referenced name.

For a different popup name, pass `aria-label` to `Content`; it overrides the automatic trigger association. An explicit `aria-labelledby` still takes precedence when both are supplied. Without either explicit name, the popup retains Base UI's trigger-derived name.

## Controlled and uncontrolled

Use `open`/`onOpenChange` when application state owns menu visibility, or `defaultOpen` for initial state.

For an asynchronous nested picker, keep its opening item open with `closeOnClick={false}`. Once the picker completes, close a controlled menu by updating `open`, or pass an `actionsRef` to `ActionMenu` and call `actionsRef.current?.close()` on an uncontrolled menu. A controlled menu must still update its state in `onOpenChange`.

## Migrating selectable menus

Replace a legacy `ActionList selectionVariant="single"` with `ActionMenu.RadioGroup` and `RadioItem`. Control the selected value on the group with `value` and `onValueChange`, or use `defaultValue` for an uncontrolled group. Each item reports `role="menuitemradio"` and `aria-checked`.

Replace `selectionVariant="multiple"` with `ActionMenu.CheckboxItem` for each choice. Use `checked` and `onCheckedChange` for controlled state, or `defaultChecked` for uncontrolled state. Each item reports `role="menuitemcheckbox"` and `aria-checked`. Checkbox and radio items close the menu by default; set `closeOnClick={false}` when the menu should stay open.

Legacy `ActionList.Group` can override the list's selection mode. Choose the appropriate parts for each migrated group: `RadioGroup`/`RadioItem` for single selection, `Group`/`CheckboxItem` for multiple selection, and `Item` for ordinary actions. Control separate radio groups with separate state for independent choices, or share state when the groups represent one choice. `ActionMenu.Item selected` only adds a visual checkmark; it does not expose a checked menu-item role.

## Positioning and portals

`Content` accepts `side`, `align`, `sideOffset`, and `alignOffset`; both offsets can be functions of the measured `anchor` and `positioner` dimensions. Use `collisionBoundary`, `collisionPadding`, and `collisionAvoidance` to control how Base UI keeps the positioner in view. `collisionBoundary={[]}` uses the viewport for collision calculations; it does not prevent an ancestor from physically clipping the menu. Use a `container` outside the clipping ancestor when necessary, and `positionMethod="fixed"` when fixed positioning is appropriate.

For a horizontal `side`, the menu tries the requested side and its opposite before falling back to a perpendicular side if neither fits. Base UI prefers below the trigger before above it. Set `collisionAvoidance={{fallbackAxisSide: 'start'}}` to prefer above, or `fallbackAxisSide: 'none'` to disable the perpendicular fallback. A `collisionAvoidance` option that disables side flipping also disables this fallback. The default for vertical sides is unchanged.

Base UI's logical `inline-start` and `inline-end` sides require its `DirectionProvider` to match the page's text direction; an HTML `dir` attribute alone does not set Base UI's direction context. Install a compatible `@base-ui/react` version directly in the application, ensure it resolves to the same instance used by `@primer/react-tailwind`, set `dir="rtl"` on the document's `<html>`, and provide matching context around the menu:

```tsx
import {DirectionProvider} from '@base-ui/react/direction-provider'
import {ActionMenu} from '@primer/react-tailwind'
;<DirectionProvider direction="rtl">
  <ActionMenu>
    <ActionMenu.Button>Options</ActionMenu.Button>
    <ActionMenu.Content side="inline-start">
      <ActionMenu.Item>Copy</ActionMenu.Item>
    </ActionMenu.Content>
  </ActionMenu>
</DirectionProvider>
```

For an RTL subtree within an LTR document, ensure the menu's portal destination also inherits `dir="rtl"`, for example by setting `container` to a suitable element within that subtree.

The default portal inherits its owning Primer Base UI portal when nested, or the nearest `BaseStyles` root otherwise. `container` accepts an element or ref; passing `container={null}` waits for a destination, whereas a ref whose `current` is null can fall back to Base UI's default portal. `portal={false}` renders in place and ignores `container`. An inline submenu stays inside the owning menu's positioner but outside its scrollable popup, so the parent popup itself does not clip the submenu.

When a nonmodal parent uses a raw Base UI portal rather than a Primer portal, give the menu that parent portal element as its container. A separate destination can leave the trigger out of the tab order after the menu closes. Use the portal element, not its potentially clipping popup:

```tsx
import * as React from 'react'
import {Popover as BasePopover} from '@base-ui/react/popover'
import {ActionMenu, Button} from '@primer/react-tailwind'

function PopoverWithMenu() {
  const [portal, setPortal] = React.useState<HTMLDivElement | null>(null)
  return (
    <BasePopover.Root modal={false}>
      <BasePopover.Trigger render={<Button>Open overlay</Button>} />
      <BasePopover.Portal ref={setPortal}>
        <BasePopover.Positioner>
          <BasePopover.Popup aria-label="Overlay actions" role="dialog">
            <ActionMenu>
              <ActionMenu.Button>More actions</ActionMenu.Button>
              <ActionMenu.Content container={portal}>
                <ActionMenu.Item>Copy</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}
```

This composition does not by itself establish compatibility with an additional focus trap. A legacy trap may also need to be suspended synchronously when the menu begins opening, before focus moves into the menu, and resumed after it closes. If the trap tracks outside clicks, it may also need to treat child menu portals as inside boundaries so selecting an item does not discard the parent's return-focus target. Verify the trap's lifecycle and focus restoration in the host.

For menus in a modal `Dialog`, prefer the default portal or an ancestor root that contains the dialog portal. A destination hidden or made inert by the dialog also hides the menu from assistive technology. DOM nesting alone does not provide the dialog's React context: a menu owned elsewhere may default to `document.body` rather than the dialog portal. In Chromium, a nonmodal menu rendered inside the dialog popup, including with `portal={false}`, can return focus to the dialog instead of its trigger after Escape, even with an explicit `finalFocus`. A container inside the popup can also cause the parent to take focus from a newly opened child dialog, even when the menu suppresses its own return focus. When appropriate, `disablePointerDismissal` on the parent avoids the tested races but also disables dismissal by clicking its backdrop. Check the actual host's portal ancestry, clipping, focus containment, Escape, return focus, and modal accessibility.

## Accessibility, disabled behavior, and keyboard

Give a trigger clear visible text or an accessible name. Base UI owns menu roles, focus management, Arrow-key navigation, Enter/Space activation, and Escape close/return-focus behavior. In fullscreen mode the visible close control precedes the menu content in keyboard order, matching its position at the top: keyboard opening and Home focus Close, and End focuses the last content item. At regular widths, the hidden close control is skipped. Tab and Shift+Tab dismiss the menu rather than cycling within it. Pass `preventFocusOnClose` to `Content` when an item moves focus elsewhere and focus should not return to the trigger. Disabled items cannot be activated; checkbox and radio items report their selection semantics.

When open, Base UI normally adds `aria-controls` to the trigger. Applications whose accessibility policy prohibits that attribute can pass `aria-controls={undefined}` to `ActionMenu.Button` or `ActionMenu.Trigger`; apply the same override separately to each `SubmenuTrigger`. This removes the explicit trigger-to-popup ID relationship, not the popup's accessible name. In tested compositions, the top-level trigger still exposes its menu popup type and expanded state, and keyboard navigation and focus return continue to work. A custom `render` element can override the trigger's ARIA props again, so check the final rendered element and your source-level policy tooling. This is a policy-specific composition option, not a universal accessibility recommendation: verify it with the host's supported assistive technologies.

Base UI 1.8 also omits a keyboard-opened submenu trigger's `aria-expanded` on Apple platforms as a VoiceOver-specific behavior; this happens with or without the `aria-controls` override. It detects the platform, not whether VoiceOver is active. The assistive-technology tradeoff requires separate review.

In the current Base UI integration, Shift+Tab from an anchored menu returns to its trigger after an accepted close rather than moving directly to the preceding page control. A further Shift+Tab moves backward. This differs from legacy one-step traversal; a rejected or canceled close can leave the menu open while focus returns to its trigger. The synchronous trigger focus also occurs when `preventFocusOnClose` is set. The alignment notes describe the verified cases and remaining migration gap.

`Item`, `LinkItem`, `CheckboxItem`, and `RadioItem` automatically expose their direct `Description` parts as accessible descriptions rather than including them in the item name. `Item` and `LinkItem` also expose `inactiveText` as a description. Descriptions can be grouped in fragments. An explicit `aria-label` or `aria-labelledby` supplies the name instead; include the visible primary label. Any IDs passed through `aria-describedby` are retained alongside the descriptions:

```tsx
<p id="admin-note">Requires administrator access</p>
<ActionMenu.Item aria-label="Archive repository" aria-describedby="admin-note">
  Archive
  <ActionMenu.Description>Move this repository out of active lists</ActionMenu.Description>
</ActionMenu.Item>
```

`Item` displays its inactive reason and also uses a string reason as a native `title` unless an explicit `title` is supplied. Inactive `LinkItem` follows the same behavior. Native titles are not reliably available to keyboard or touch users; the visible reason does not depend on the title.

`SubmenuTrigger` also associates its direct `Description` parts and inactive reason as descriptions. When its name uses `aria-labelledby`, pass the same reference to the submenu `Content` as described above.

## Events and state attributes

`onOpenChange` receives the next visibility value and Base UI details. Stable selectors include `ActionMenu.Trigger`, `.Button`, `.Content`, `.Positioner`, `.Item`, `.CheckboxItem`, `.RadioItem`, `.SubmenuTrigger`, `.Group`, `.GroupLabel`, and `.Divider`; item states include `data-highlighted`, `data-disabled`, `data-selected`, and danger `data-variant`.

Forwards unrecognized props to Base UI's [`Menu.Root`](https://base-ui.com/react/components/menu#root), so it also accepts that part's props.

## ActionMenu.Root

Forwards unrecognized props to Base UI's [`Menu.Root`](https://base-ui.com/react/components/menu#root), so it also accepts that part's props.

## ActionMenu.Trigger

Forwards unrecognized props to Base UI's [`Menu.Trigger`](https://base-ui.com/react/components/menu#trigger), so it also accepts that part's props.

## ActionMenu.Button

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
- `trailingAction`: `ButtonVisual` — Default `TriangleDownIcon`. Trailing visual for the trigger; pass `null` to remove it.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## ActionMenu.Content

Forwards unrecognized props to Base UI's [`Menu.Popup`](https://base-ui.com/react/components/menu#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `collisionAvoidance`: `CollisionAvoidance` — How the menu avoids collisions on the side and alignment axes. Horizontal menus fall back to the perpendicular axis by default when neither horizontal side fits.
- `collisionBoundary`: `Boundary` — Element or rectangle used to constrain the menu's position.
- `collisionPadding`: `Padding` — Space to keep between the menu and its collision boundary.
- `container`: `HTMLElement | RefObject<HTMLElement | ShadowRoot | null> | ShadowRoot | null` — Portal destination. Pass `null` to wait for a container; ignored when `portal` is false.
- `height`: `OverlayHeight` — Height of the surface.
- `maxHeight`: `OverlayMaxHeight` — Largest height the surface may grow to before its content scrolls.
- `maxWidth`: `OverlayMaxWidth` — Largest width the surface may grow to.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `positionMethod`: `"absolute" | "fixed"` — CSS positioning method for the positioner.
- `preventFocusOnClose`: `boolean` — Default `false`. If true, focus will not be returned to the trigger or `finalFocus` target when the menu closes.
- `showDividers`: `boolean` — Default `false`. Draws a divider between consecutive items.
- `side`: `FloatingSide` — Side of the trigger the menu opens on. Menus open below their trigger, and submenus beside it.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.
- `variant`: `AnchoredOverlayVariant` — Default `'anchored'`. How the menu is presented at each viewport range. `{narrow: 'fullscreen'}` covers narrow viewports and adds a close button.
- `width`: `OverlayWidth` — Width of the surface.

## ActionMenu.Overlay

Forwards unrecognized props to Base UI's [`Menu.Popup`](https://base-ui.com/react/components/menu#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `collisionAvoidance`: `CollisionAvoidance` — How the menu avoids collisions on the side and alignment axes. Horizontal menus fall back to the perpendicular axis by default when neither horizontal side fits.
- `collisionBoundary`: `Boundary` — Element or rectangle used to constrain the menu's position.
- `collisionPadding`: `Padding` — Space to keep between the menu and its collision boundary.
- `container`: `HTMLElement | RefObject<HTMLElement | ShadowRoot | null> | ShadowRoot | null` — Portal destination. Pass `null` to wait for a container; ignored when `portal` is false.
- `height`: `OverlayHeight` — Height of the surface.
- `maxHeight`: `OverlayMaxHeight` — Largest height the surface may grow to before its content scrolls.
- `maxWidth`: `OverlayMaxWidth` — Largest width the surface may grow to.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `positionMethod`: `"absolute" | "fixed"` — CSS positioning method for the positioner.
- `preventFocusOnClose`: `boolean` — Default `false`. If true, focus will not be returned to the trigger or `finalFocus` target when the menu closes.
- `showDividers`: `boolean` — Default `false`. Draws a divider between consecutive items.
- `side`: `FloatingSide` — Side of the trigger the menu opens on. Menus open below their trigger, and submenus beside it.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.
- `variant`: `AnchoredOverlayVariant` — Default `'anchored'`. How the menu is presented at each viewport range. `{narrow: 'fullscreen'}` covers narrow viewports and adds a close button.
- `width`: `OverlayWidth` — Width of the surface.

## ActionMenu.Item

Forwards unrecognized props to Base UI's [`Menu.Item`](https://base-ui.com/react/components/menu#item), so it also accepts that part's props.

- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and explains why.
- `loading`: `boolean` — Default `false`. Shows a spinner in place of the leading visual, or the trailing visual when there is none, and suppresses activation.
- `loadingText`: `string` — Text announced to assistive technology while the item is loading.
- `selected`: `boolean` — Marks the item as the current choice.
- `variant`: `ActionMenuItemVariant` — Default `'default'`. Use `danger` for a destructive action.

## ActionMenu.LinkItem

Forwards unrecognized props to Base UI's [`Menu.LinkItem`](https://base-ui.com/react/components/menu#linkitem), so it also accepts that part's props.

- `closeOnClick`: `boolean` — Default `true`. Whether activating the link closes the menu, as activating any other menu item does.
- `inactiveText`: `React.ReactNode` — Marks the link temporarily unavailable and explains why. The link renders as an inactive item until it is available.
- `variant`: `ActionMenuItemVariant` — Default `'default'`. Use `danger` for a destructive navigation.

## ActionMenu.CheckboxItem

Forwards unrecognized props to Base UI's [`Menu.CheckboxItem`](https://base-ui.com/react/components/menu#checkboxitem), so it also accepts that part's props.

- `closeOnClick`: `boolean` — Default `true`. Whether toggling the item closes the menu, as activating any other menu item does. Set `false` to keep the menu open while several items are toggled.

## ActionMenu.RadioGroup

Forwards unrecognized props to Base UI's [`Menu.RadioGroup`](https://base-ui.com/react/components/menu#radiogroup), so it also accepts that part's props.

## ActionMenu.RadioItem

Forwards unrecognized props to Base UI's [`Menu.RadioItem`](https://base-ui.com/react/components/menu#radioitem), so it also accepts that part's props.

- `closeOnClick`: `boolean` — Default `true`. Whether choosing the item closes the menu, as activating any other menu item does.

## ActionMenu.Group

Forwards unrecognized props to Base UI's [`Menu.Group`](https://base-ui.com/react/components/menu#group), so it also accepts that part's props.

## ActionMenu.GroupLabel

Forwards unrecognized props to Base UI's [`Menu.GroupLabel`](https://base-ui.com/react/components/menu#grouplabel), so it also accepts that part's props.

## ActionMenu.Divider

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionMenu.Submenu

Forwards unrecognized props to Base UI's [`Menu.SubmenuRoot`](https://base-ui.com/react/components/menu#submenuroot), so it also accepts that part's props.

## ActionMenu.SubmenuTrigger

Forwards unrecognized props to Base UI's [`Menu.SubmenuTrigger`](https://base-ui.com/react/components/menu#submenutrigger), so it also accepts that part's props.

- `inactiveText`: `React.ReactNode` — Marks the item temporarily unavailable and explains why.
- `loading`: `boolean` — Default `false`. Shows a spinner in place of the leading visual, or the trailing visual when there is none, and suppresses activation.
- `loadingText`: `string` — Text announced to assistive technology while the item is loading.
- `selected`: `boolean` — Shows the current-choice indicator without changing selection when the submenu opens. Does not set an ARIA checked state.
- `variant`: `ActionMenuItemVariant` — Default `'default'`. Use `danger` for a destructive action.

## ActionMenu.LeadingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionMenu.TrailingVisual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## ActionMenu.Description

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `truncate`: `boolean` — Clips the description to one line instead of wrapping.
- `variant`: `"block" | "inline"` — Default `'inline'`. Whether the description sits beside the label or on its own line.

## Differences from `@primer/react`

- Compose branded triggers with `render`, not `as`, to avoid nested interactive elements. Use `className` when the composed control owns the visual treatment.
- Replace a legacy tooltip inside `ActionMenu.Anchor` with `Tooltip.Trigger` rendered onto `ActionMenu.Button`, or onto `ActionMenu.Trigger` rendered as a ref-forwarding button. Both triggers' props and refs must reach the same native button.
- Replace an icon-only `ActionMenu.Button icon` with `ActionMenu.Trigger render={<IconButton … />}`. Reference either an independent label or an enabled, mounted tooltip's own ID on `Tooltip.Trigger`, `IconButton`, and `ActionMenu.Content`; both provide a name in server-rendered HTML when the referenced text is available to the server. An independent label remains available if the tooltip is disabled or removed. `ActionMenu.Button` retains the default chevron and honors component, element, and `null` `trailingAction` overrides.
- Replace legacy `_PrivateItemWrapper` with `Item render`. Set `nativeButton` when the rendered wrapper produces a native button, and forward its ref and received props.
- Compose router links with `LinkItem render={<RouterLink to="…" />}`; the router component must forward its ref and props to an anchor. While `inactiveText` is present, `LinkItem` renders a non-navigable anchor without `href` and forwards its ref to that anchor; the custom render is not mounted, so its own ref remains unset. As a Base UI menu item, the available link activates on Space as well as Enter. Legacy menu links handle Space as selection and dismissal without clicking the link; a standalone native `ActionList.LinkItem` also does not navigate on Space.
- `ActionList.ContainerContext.afterSelect` is not exported. For an asynchronous nested picker, keep its opening item open with `closeOnClick={false}` and close the owning menu through controlled `open` state or the root's `actionsRef.current?.close()` after selection.
- Move legacy ActionList item content directly into ActionMenu items and use `ActionMenu.LeadingVisual`, `TrailingVisual`, and `Description`; no intermediate ActionList wrapper is required.
- Move a legacy nested `ActionList showDividers` option to `ActionMenu.Content showDividers`. This applies to the whole menu content, so a menu with multiple independently styled legacy lists may need a more specific presentation.
- `Item`, `LinkItem`, `CheckboxItem`, `RadioItem`, and `SubmenuTrigger` automatically associate direct `Description` parts with the item as descriptions; `Item`, `LinkItem`, and `SubmenuTrigger` also associate inactive reasons. Explicit `aria-label`, `aria-labelledby`, and additional `aria-describedby` references are preserved; include the visible primary label in an explicit name.
- **Compatibility exception requiring accessibility review:** `Item` and inactive `LinkItem` retain the canary's native `title` fallback for string inactive reasons, while preserving explicit titles. Current GitHub accessibility guidance prohibits native titles, so this compatibility behavior requires specialist review before release.
- Replace `ActionList selectionVariant="single"` with an `ActionMenu.RadioGroup` and `RadioItem` values, and `selectionVariant="multiple"` with controlled `CheckboxItem` values. `ActionMenu.Item selected` draws a checkmark but remains a `menuitem`; it does not supply checked selection semantics.
- A legacy group's `selectionVariant` can override its list's selection mode. Express that choice explicitly in each new group: use `RadioGroup`/`RadioItem` for single selection, `Group`/`CheckboxItem` for multiple selection, or `Item` for ordinary actions. Separate radio groups own independent selections unless they are controlled by the same state.
- `RadioItem` and `CheckboxItem` close the menu by default; set `closeOnClick={false}` when multiple selections should remain available without reopening it.
- Replace the root's `anchorRef` with `Content`'s `anchor` and controlled `open`. For `displayInViewport`, use `collisionBoundary={[]}` for viewport collision calculations and choose a `container` outside any physically clipping ancestor. `positionMethod`, `collisionPadding`, and `collisionAvoidance` are also available. `onPositionChange` is unsupported.
- Anchored menus constrain their width and minimum width to Base UI's available collision width, including when `maxWidth` is supplied. A custom maximum below the default minimum also needs a minimum override because CSS minimums take precedence. The fullscreen variant still fills the viewport. Custom sizing or positioner layout classes can override this protection; check clipping and item access with the actual collision boundary.
- A horizontal `side` allows perpendicular fallback when neither horizontal side fits, preferring below before above. Explicit `collisionAvoidance.fallbackAxisSide` and side-flipping settings remain authoritative. Vertical-side defaults and fullscreen presentation are unchanged.
- Base UI does not derive its direction context from an HTML `dir` attribute. For correct `inline-start`/`inline-end` placement in RTL, provide a matching Base UI `DirectionProvider` and HTML direction; see the README. This is a package-wide direction integration gap, not an automatic `dir` adapter.
- Replace an `inside-*` placement with a measured `sideOffset` (and, for center, `alignOffset`). The following examples use an 8px inset and `align="start"`; disable collision flipping only when the menu can safely overflow.

  | Legacy placement | `side` | `sideOffset` | `alignOffset` |
  | --- | --- | --- | --- |
  | `inside-top` | `bottom` | `({anchor}) => -anchor.height + 8` | `0` |
  | `inside-bottom` | `bottom` | `({positioner}) => -positioner.height - 8` | `0` |
  | `inside-left` | `right` | `({anchor}) => -anchor.width + 8` | `0` |
  | `inside-right` | `right` | `({positioner}) => -positioner.width - 8` | `0` |
  | `inside-center` | `bottom` | `({anchor, positioner}) => -(anchor.height + positioner.height) / 2` | `({anchor, positioner}) => (anchor.width - positioner.width) / 2` |

- **Nested dialog focus race:** In Chromium with Base UI 1.6 and 1.8, a nonmodal menu rendered inside `Dialog.Content`, including with `portal={false}`, closes on Escape, briefly restores its trigger or explicit `finalFocus`, and then moves focus to the dialog. When a menu item instead opened a nested dialog from a container inside the parent popup, the parent likewise took focus from the child's textarea, even with `preventFocusOnClose` and explicit child `initialFocus`. The child was rendered both inline in the React tree and through an external React portal that preserved context; keyboard and pointer activation showed the same result. In these fixtures the inherited dialog portal kept the menu's return focus and the child's focus, including across two animation frames and through Escape return. Automated WebKit did not reproduce these races; native Safari and assistive technology were not tested. Prefer the inherited dialog portal or an ancestor root containing it, and verify clipping, focus, and that the destination is not hidden or made inert by the modal in the actual host. `disablePointerDismissal` avoids the tested races but also disables backdrop dismissal. A scratch-only Base UI frame guard preserved those return targets and the basic pointerdown-removal recovery, but it is not shipped or a general focus guarantee: rapid close/reopen and focus moved during pointerdown still need upstream work. Removing the frame altogether leaves focus on the document body in the tested pointerdown-removal case.
  - In github-ui's pinned Noodles navigation, the row menu explicitly targets the navigation popup and reproduces the child-dialog race. The consumer reports that omitting the container instead mounts under `document.body`, because the menu does not inherit the dialog's React portal context; explicitly targeting the dialog's ancestor portal places the menu outside the modal popup. Both alternatives were obstructed by the sidebar viewport and failed to return focus to the row after the child closed in the tested Chromium host. Neither is an approved workaround for that composition.
- In a raw nonmodal Base UI portal, pass the parent portal element to `Content container` to preserve the trigger's tab order. An independently portaled menu can leave its trigger untabbable after close. An additional legacy focus trap may also need synchronous suspension while the menu opens, resumption after close, and child portal recognition for outside-click bookkeeping; verify its lifecycle in the host.
- Opening with a pointer or programmatically (with `open` or `defaultOpen`) focuses the menu itself, and opening with the keyboard focuses its first item (Base UI's menu pattern). Upstream focuses the first item either way.
  - **Migration decision:** keep Base UI's opening-modality focus rather than forcing first-item focus after pointer opening. From the focused menu, ArrowDown moves to the first item and ArrowUp to the last; item activation, typeahead, and Escape behave as usual. Tests asserting the legacy pointer-open behavior should expect `role="menu"` focus and then use arrow keys to reach items, instead of expecting `document.activeElement` to be the first menuitem. Do not restore legacy pointer-open focus by focusing an item in an effect, timer, or `onOpenChange` handler; that races the popup's focus management, and the package exposes no opening-focus control (see the trigger-retention gap below). Screen-reader announcements for pointer opening have not been separately verified.
- **Parity gap — reverse Tab traversal:** Legacy menu handling allows Shift+Tab to continue to the preceding page control while requesting close. In Chromium, an anchored menu using Base UI 1.6.0 or 1.8.0 instead closes and focuses its trigger when Shift+Tab is pressed from the pointer-focused menu container or the keyboard-focused first radio item; a second Shift+Tab reaches the preceding control. Tab from the pointer-focused container closes the menu and focuses the next control in the same fixture. These cases were observed with `modal={true}` and `modal={false}`, and both default and inline portals. A github-ui host test also reproduces the pointer-open reverse traversal with the pinned canary. This is inherited Base UI behavior, not a separately established Primer keyboard decision; host flows that require the legacy one-step traversal still need a scoped compatibility adapter.
  - In Chromium with both Base UI versions, ignoring a controlled close request or calling `details.cancel()` keeps the portaled menu open but still focuses the trigger. Root-menu cancellation was observed for controlled and uncontrolled roots after pointer and keyboard opening, with both modal settings; controlled and uncontrolled submenu cancellation was observed after keyboard opening under a nonmodal root. A later accepted close reports `reason: 'focus-out'`. Normally an explicit `Content finalFocus` target is honored, but the synchronous Shift+Tab handler still focuses the trigger when `preventFocusOnClose` is set; if `details.preventUnmountOnClose()` keeps the popup mounted, a custom return target is not focused immediately. Shift+Tab from an open submenu instead closes that submenu and focuses its parent trigger, leaving the parent menu open.
  - A local Base UI 1.8 prototype retained focus after rejected closes by moving return-focus work to the committed close lifecycle, including retained mounts. The same list-navigation hook is used by Base UI Select, and this prototype changes focus timing for other dismissal paths. It is not shipped or established as a safe general fix: transitions, rapid reopen, other compositions, browsers, and assistive technology still need upstream review. Removing the synchronous trigger focus without handling retained mounts lost focus in a tested accepted-close case. A general override must account for rejected closes, nested menus, explicit return targets, and portal ordering; do not assume that requesting close guarantees it occurred.
- **Parity gap:** Legacy `ActionMenu.Overlay initialFocusRef={anchorRef}` and `preventFocusOnOpen` have no supported equivalent on `ActionMenu.Content`/`Overlay`. Base UI 1.8 `Menu.Popup` exposes `finalFocus` but no public opening-focus control, so retaining focus on the trigger while opening is not supported by this menu composition. `finalFocus` and `preventFocusOnClose` apply only when closing; `modal={false}`, controlled `open`, and `onOpenChangeComplete` do not suppress opening focus. Do not map these legacy props to those options, forward them to the popup DOM, or restore trigger focus in a timer or event handler to compete with menu focus management.
- If trigger-retained focus is required, assess whether the UI should instead be a nonmodal `Popover` or `AnchoredOverlay`, whose content exposes `initialFocus={false}` or an explicit initial-focus ref. This is a different interaction pattern, not a drop-in ActionMenu migration: compose appropriate content rather than nesting `ActionMenu.Item` outside its menu root, and verify keyboard access into the popup, activation, Tab/Shift+Tab, Escape, outside dismissal, and repeated openings. In legacy `@primer/react` 38.44.0, a controlled ActionMenu with `ActionList` content still settled on the first menuitem after pointer or Enter opening even with `initialFocusRef={anchorRef}`, because the overlay's focus trap took over afterward. Verify that a caller actually observes trigger-retained focus before treating `initialFocusRef` as a requirement.
- Compose each submenu's `SubmenuTrigger` and `Content` as siblings. Nesting `Content` in the trigger interferes with keyboard navigation between submenu levels.
- Replace a selected legacy `ActionList.Item` anchor with `SubmenuTrigger selected`. This preserves its selection indicator, leading/trailing visuals, block descriptions, and inactive/loading presentation without selecting the item when its submenu opens. `selected` is presentational, as on `Item`; pass `role="menuitemradio"` and controlled `aria-checked` explicitly when representing a current radio choice. Select the current model or tier in the corresponding selection callback, not in `Submenu onOpenChange`.
- Loading text is included in an inferred item name even without a `Description`; when an explicit name is supplied, the loading text is associated as a description instead.
- **Parity gap — disabled-only submenu opening focus:** with Base UI 1.8, a keyboard-opened submenu whose only initial item has `aria-disabled="true"` skips that item during initial focus and leaves focus on the `SubmenuTrigger`. The github-ui host works around this by focusing the item after Base UI's item-registration layout effects have run, only when focus is still on the trigger. Focusing earlier in a layout effect left the active index unset, so the first ArrowDown repeated the current item. Keeping the same keyed item and selection container through loading → loaded avoids losing focus when items arrive. Host Chromium tests cover keyboard loading → current item → ArrowDown/Enter, delayed empty/error states, and a pointer-open case that does not steal focus. This is a scoped host compatibility workaround coordinated with internal timing; Primer has no supported opening-focus or disabled-item registration contract, and screen-reader parity is not established.
- **Policy-specific override:** Base UI connects open menu and submenu triggers to their popups with `aria-controls`, which conflicts with current GitHub accessibility guidance. Pass `aria-controls={undefined}` to each `Button`, `Trigger`, or `SubmenuTrigger` that must omit it; a custom render element can override that prop. This removes the explicit ID relationship and needs accessibility specialist and screen-reader review. Chromium and automated WebKit tests with Base UI 1.6 and 1.8 cover direct, custom-rendered, icon, tooltip, and submenu compositions, not spoken output or every host wrapper. Check host source-level tooling as well as the rendered DOM.
- **Apple submenu state tradeoff:** Base UI 1.8 intentionally omits `aria-expanded` from keyboard-opened submenu triggers on Apple platforms to avoid interrupting VoiceOver's first-item announcement. Its platform check does not detect whether VoiceOver is active. The behavior occurs with and without the `aria-controls` override and requires independent assistive-technology review.
- If a custom submenu trigger uses `aria-labelledby`, also pass the same `aria-labelledby` to its `Content`. Base UI can otherwise name the submenu from the trigger's visible or owned content instead of the referenced label.
- `Content aria-label` overrides Base UI's automatic trigger-derived name for both root menus and submenus. An explicitly supplied `aria-labelledby` still takes precedence; omitting both retains the automatic association.
- In fullscreen, the close control precedes the menu content in DOM and keyboard order, matching its top-of-screen position. Keyboard opening and Home focus Close; End focuses the last content item. The Arrow keys reach all items. At regular widths, the hidden Close control is skipped. Tab and Shift+Tab dismiss the menu rather than cycling between the close control and menu items as in upstream.
- Escape from a fullscreen submenu's Close control dismisses only that submenu and returns focus to its trigger, unless `closeParentOnEsc` is enabled. The Close control's tooltip lets Escape reach the owning popup without suppressing its Base UI handlers. A consumer overriding Tab navigation must call both `event.preventDefault()` and `event.preventBaseUIHandler()` in `Content onKeyDown`; cancel only the handled Tab event, not subsequent Escape events.
- The menu opens when the trigger is pressed rather than on release, so the trigger shows its open colour instead of a separate pressed colour, and it keeps its resting shadow because focus moves into the menu.
- Pass `preventFocusOnClose` to `ActionMenu.Content` when the menu should not return focus to its trigger after closing, for example when an item moves focus elsewhere.
- For a menu-to-dialog handoff, replace a legacy `requestAnimationFrame(() => setDialogOpen(true))` focus-order assumption with explicit ownership. At item selection, set a separate handoff flag and open the dialog; keep the dialog root mounted outside the closing menu. Suppress only the outgoing menu's restoration with `Content preventFocusOnClose={handoffToDialog}`, and return from the dialog to the stable menu trigger with `Dialog.Content finalFocus={menuTriggerRef}` rather than capturing the transient menu item.

  ```tsx
  import {useRef, useState} from 'react'
  import {ActionMenu, Button, Dialog, Textarea} from '@primer/react-tailwind'

  function EditDescriptionAction() {
    const menuTriggerRef = useRef<HTMLButtonElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [handoffToDialog, setHandoffToDialog] = useState(false)

    return (
      <>
        <ActionMenu>
          <ActionMenu.Button ref={menuTriggerRef}>Actions</ActionMenu.Button>
          <ActionMenu.Content preventFocusOnClose={handoffToDialog}>
            <ActionMenu.Item
              onClick={() => {
                setHandoffToDialog(true)
                setDialogOpen(true)
              }}
            >
              Edit description
            </ActionMenu.Item>
            <ActionMenu.Item>Another action</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <Dialog
          open={dialogOpen}
          onOpenChange={open => {
            setDialogOpen(open)
            if (!open) setHandoffToDialog(false)
          }}
        >
          <Dialog.Content initialFocus={textareaRef} finalFocus={menuTriggerRef}>
            <Dialog.Title>Edit description</Dialog.Title>
            <Textarea ref={textareaRef} aria-label="Description" />
            <Dialog.Close render={<Button>Close dialog</Button>} />
          </Dialog.Content>
        </Dialog>
      </>
    )
  }
  ```

  If the consumer still defers opening, set the handoff flag synchronously before scheduling `setDialogOpen(true)` and cancel pending work when its owner unmounts. Reset the flag if the request is cancelled or when the dialog closes; do not disable restoration for every action. Base UI's `onOpenChangeComplete(false)` signals that closing animations completed, not that its queued return-focus callback completed. Neither that callback nor an arbitrary frame delay is a focus-complete barrier. Keep normal menu selection, Escape, intentional outside focus, dialog Tab containment, repeated openings, and final trigger restoration covered in the host. Also cover removal of the return target and late asynchronous completion after dismissal.

- Upstream's fix for passive anchor label updates has no equivalent here, because Base UI owns the trigger's labelling.
- Set `portal={false}` to render the menu in place, for example inside a scrolling container. An inline submenu renders inside the owning menu's positioner but outside its scrollable popup, so it is not clipped by the parent popup itself.
- `sx` and styled-system props are unsupported.
