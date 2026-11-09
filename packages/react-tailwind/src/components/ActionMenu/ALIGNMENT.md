# Alignment

## From: `@primer/react`

Legacy ActionMenu wraps an ActionList overlay. It supports an external `anchorRef`, `side`/`align` placement, overlay sizing, a responsive fullscreen `variant`, `displayInViewport`, `onPositionChange`, and menu close callbacks.

## To: `@primer/react-tailwind`

The stable compound API includes `ActionMenu`, `Trigger`, `Button`, `Content` (also available as `Overlay`), `Item`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Submenu`, `SubmenuTrigger`, `Group`, `GroupLabel`, `Divider`, `LeadingVisual`, `TrailingVisual`, and `Description`. Content owns its Base UI portal and positioner. It shares the floating-content props of Popover, Tooltip, AnchoredOverlay, and Autocomplete (`side`, `align`, offsets, `anchor`, and `portal`), the overlay size props (`width`, `height`, `maxHeight`, `maxWidth`), and `variant={{narrow: 'fullscreen'}}`.

Base UI owns menu ARIA, keyboard navigation, focus, dismissal, positioning, nested-menu behavior, and controlled `open`/`defaultOpen`/`onOpenChange` state. Menu and ActionList items share internal content, visuals, descriptions, selection, loading, and inactive-state presentation without nesting interactive elements.

## Migration notes

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
