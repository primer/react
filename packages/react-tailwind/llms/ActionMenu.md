# ActionMenu

`ActionMenu` is a composable Base UI menu with button and low-level trigger options.

Import: `import {ActionMenu} from '@primer/react-tailwind/ActionMenu'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Built-in behaviors

- Composing a trigger with render produces one button element in the DOM and forwards refs from every layer to that button.
- The menu popup automatically inherits its trigger's accessible name across text buttons, IconButtons, and triggers named by a label Tooltip, without hidden label elements.
- Opening the menu hides its trigger's tooltip (even if the pointer rests on the trigger again), and closing the menu does not flash the tooltip back open when focus returns.
- Inactive menu triggers and items with inactiveText stay reachable by keyboard, announce aria-disabled to screen readers, and block activation.
- Pressing Escape dismisses one open layer at a time, closing an open submenu, menu, or hovered tooltip without closing an underlying Dialog.
- Submenus open on click, ArrowRight, or pointer hover, and close back to their parent item on ArrowLeft or Escape while keeping the parent menu open.

## Default behaviors

- Toggling a CheckboxItem keeps the menu open so users can select multiple options in one pass, while RadioItem and Item close the menu immediately. (Override: `CheckboxItem.closeOnClick`)
- When a menu item opens a controlled Dialog, closing that Dialog returns keyboard focus to the menu trigger button automatically. (Override: `Dialog.Content.finalFocus`)

## Usage guidelines

- **Do [Review]:** Attach custom buttons or IconButtons with ActionMenu.Trigger render={<IconButton ... />} (or Tooltip.Trigger render={<ActionMenu.Trigger ... />}) so all behaviors share one button.
- **Do [Review]:** Use RadioGroup and RadioItem for single-choice state, and CheckboxItem for multi-select toggles, so screen readers announce selection state.
- **Do [Review]:** Use ActionMenu.Button inactive (wrapped in Tooltip only while inactive) or ActionMenu.Item inactiveText when users need to know why an action is unavailable.
- **Do [Review]:** Render controlled Dialogs opened from menu items outside ActionMenu.Content so closing the menu does not unmount the open dialog.
- **Don't [Runtime]:** Nest a Button or IconButton as children inside ActionMenu.Button; this creates invalid nested buttons.
- **Don't [Runtime]:** Pass selected to plain ActionMenu.Item for stateful choices; it draws a visual checkmark without announcing selection to screen readers.
- **Don't [Runtime]:** Wrap a native disabled Button in an active Tooltip; disabled buttons are skipped by keyboard Tab, hiding the explanation from keyboard users.
- **Don't [Runtime]:** Nest ActionMenu.Content inside ActionMenu.SubmenuTrigger; render SubmenuTrigger and Content as direct siblings inside ActionMenu.Submenu.
- **Don't [Review]:** Trigger an irreversible danger action (such as deleting data) immediately without a confirmation Dialog or undo path.

## Related component guidelines

- **[Dialog](./Dialog.md) [Built-in]:** Pressing Escape inside an open Dialog closes an open inner menu or hovered tooltip first before dismissing the Dialog itself.

## API notes

The root forwards Base UI Menu props, including controlled `open`/`onOpenChange` and `defaultOpen`. `Button` supports Button props; `Content` owns its portal and positioner, and takes placement, collision, `anchor`, `container`, `portal`, overlay size, and fullscreen `variant` options; `Item` and `SubmenuTrigger` support danger, selected, inactive, and loading states.

Anchored content fits within the available collision width, even when `width` or `maxWidth` specifies a larger size. Its usual minimum also shrinks when the boundary is narrower. With `width="auto"`, the menu sizes to its content within those constraints; inactive reasons occupy their own row and can wrap. A caller-supplied maximum smaller than that minimum does not override it: to apply such a cap, also set an appropriate minimum, for example `style={{maxWidth: 'calc(100vw - 32px)', minWidth: 0}}`. Caller-supplied sizing or positioner layout classes can override the default constraints, so verify that custom sizing does not clip menu items. The narrow fullscreen variant still fills the viewport.

Opening moves focus into the menu. `Content finalFocus` and `preventFocusOnClose` control closing focus only; there is no public `initialFocusRef` or `preventFocusOnOpen` equivalent for retaining trigger focus on opening. The alignment notes describe this legacy migration gap and the distinction from a nonmodal popover.

## Import and composition

```tsx
import {ActionMenu} from '@primer/react-tailwind/ActionMenu'
```

Compose `Button` or `Trigger`, then `Content`/`Overlay`, with `Item`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Group`, `GroupLabel`, and `Divider` as needed. Items accept `LeadingVisual`, `TrailingVisual`, and inline or block `Description` parts that share the ActionList presentation layer. Compose another branded trigger through Base UI's `render` prop and use `className` to supply its visual treatment. Set `id` on `Button` or `Trigger` rather than on the rendered element, because the trigger tracks its open state by its `id`.

Render a controlled `Dialog` opened from a menu item outside `ActionMenu.Content` so closing the menu does not unmount the open dialog; closing that `Dialog` returns focus to the menu trigger automatically by default. Pass `Dialog.Content finalFocus` (and `ActionMenu.Content preventFocusOnClose` when opening is deferred asynchronously) only when overriding the default return target.

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

For an icon-only trigger, compose `ActionMenu.Trigger` with `IconButton`:

```tsx
import {GearIcon} from '@primer/octicons-react'
import {ActionMenu, IconButton} from '@primer/react-tailwind'
;<ActionMenu>
  <ActionMenu.Trigger render={<IconButton aria-label="Repository actions" icon={GearIcon} />} />
  <ActionMenu.Content>
    <ActionMenu.Item>Copy</ActionMenu.Item>
  </ActionMenu.Content>
</ActionMenu>
```

`ActionMenu.Content` automatically inherits its trigger's accessible name across text buttons, `IconButton` triggers, and custom triggers named by `Tooltip type="label"`. If a label tooltip's content is generated by a custom component or render callback, follow the [Tooltip guidance](./Tooltip.md#aria-references) so the name is available on the server. Both icon components and rendered elements are supported. `ActionMenu.Button` shows a chevron by default; pass `trailingAction={null}` to omit it, or pass a component or rendered element to replace it.

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

Replace `selectionVariant="multiple"` with `ActionMenu.CheckboxItem` for each choice. Use `checked` and `onCheckedChange` for controlled state, or `defaultChecked` for uncontrolled state. Each item reports `role="menuitemcheckbox"` and `aria-checked`. `CheckboxItem` keeps the menu open by default so multiple choices can be toggled in one pass (set `closeOnClick` to close on toggle), while `RadioItem` closes the menu by default (set `closeOnClick={false}` to keep it open).

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

- `closeOnClick`: `boolean` — Default `false`. Whether toggling the item closes the menu. Defaults to `false` so several items can be toggled in one pass; set `true` to close the menu when toggled.

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
- Replace an icon-only `ActionMenu.Button icon` with `ActionMenu.Trigger render={<IconButton … />}`. `ActionMenu.Content` inherits its trigger's accessible name automatically across text buttons, `IconButton`, and triggers named by `Tooltip type="label"`. `ActionMenu.Button` retains the default chevron and honors component, element, and `null` `trailingAction` overrides.
- Replace legacy `_PrivateItemWrapper` with `Item render`. Set `nativeButton` when the rendered wrapper produces a native button, and forward its ref and received props.
- Compose router links with `LinkItem render={<RouterLink to="…" />}`; the router component must forward its ref and props to an anchor. While `inactiveText` is present, `LinkItem` renders a non-navigable anchor without `href` and forwards its ref to that anchor; the custom render is not mounted, so its own ref remains unset. As a Base UI menu item, the available link activates on Space as well as Enter.
- Move legacy ActionList item content directly into ActionMenu items and use `ActionMenu.LeadingVisual`, `TrailingVisual`, and `Description`; no intermediate ActionList wrapper is required.
- Move a legacy nested `ActionList showDividers` option to `ActionMenu.Content showDividers`. This applies to the whole menu content.
- Replace `ActionList selectionVariant="single"` with `ActionMenu.RadioGroup` and `RadioItem` values, and `selectionVariant="multiple"` with controlled `CheckboxItem` values. `ActionMenu.Item selected` is visual-only and warns in development when selection semantics are absent.
- `RadioItem` closes the menu by default, while `CheckboxItem` keeps the menu open by default (`closeOnClick={false}`) so multiple selections remain available without reopening it; pass `closeOnClick` to override either default.
- Compose each submenu's `SubmenuTrigger` and `Content` as siblings inside `ActionMenu.Submenu`. Nesting `Content` inside `SubmenuTrigger` warns in development and interferes with keyboard navigation.
- Render a controlled `Dialog` opened from a menu item outside `ActionMenu.Content`. Closing the `Dialog` restores focus to the menu trigger automatically by default; pass `Dialog.Content finalFocus` (and `ActionMenu.Content preventFocusOnClose` when opening is deferred asynchronously) only when overriding the return target.
- Replace the root's `anchorRef` with `Content`'s `anchor` and controlled `open`. Set `portal={false}` to render the menu in place. `sx` and styled-system props are unsupported.
- Replace an `inside-*` placement with a measured `sideOffset` (and, for center, `alignOffset`). The following examples use an 8px inset and `align="start"`; disable collision flipping only when the menu can safely overflow.

  | Legacy placement | `side` | `sideOffset` | `alignOffset` |
  | --- | --- | --- | --- |
  | `inside-top` | `bottom` | `({anchor}) => -anchor.height + 8` | `0` |
  | `inside-bottom` | `bottom` | `({positioner}) => -positioner.height - 8` | `0` |
  | `inside-left` | `right` | `({anchor}) => -anchor.width + 8` | `0` |
  | `inside-right` | `right` | `({positioner}) => -positioner.width - 8` | `0` |
  | `inside-center` | `bottom` | `({anchor, positioner}) => -(anchor.height + positioner.height) / 2` | `({anchor, positioner}) => (anchor.width - positioner.width) / 2` |
