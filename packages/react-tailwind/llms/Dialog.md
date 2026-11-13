# Dialog

`Dialog` provides a modal surface with composable trigger and content parts.

Import: `import {Dialog} from '@primer/react-tailwind/Dialog'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Button, Dialog} from '@primer/react-tailwind'
;<Dialog>
  <Dialog.Trigger>Open dialog</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Dialog title</Dialog.Title>
    <Dialog.Description>Dialog content.</Dialog.Description>
  </Dialog.Content>
</Dialog>
```

Compose `Header`, `Body`, and `Footer` for the full upstream layout. `Subtitle` describes the dialog; use it instead of `Description`.

```tsx
<Dialog>
  <Dialog.Trigger>Open dialog</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Delete repository</Dialog.Title>
      <Dialog.Subtitle>This cannot be undone.</Dialog.Subtitle>
      <Dialog.CloseButton />
    </Dialog.Header>
    <Dialog.Body>Type the repository name to confirm.</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close render={<Button>Cancel</Button>} />
      <Button variant="danger">Delete</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

Provide a title or accessible label, retain the keyboard close path, and return focus to the element that opened the dialog.

`Dialog.Title` renders an `h2` by default. When an `h1` is appropriate for the dialog, use `<Dialog.Title render={<h1 />}>`; the title remains associated with the dialog.

When open, Base UI normally connects `Dialog.Trigger` to the dialog with `aria-controls`. Applications whose accessibility policy prohibits that attribute can pass `aria-controls={undefined}` to `Dialog.Trigger`. This removes the explicit trigger-to-dialog ID relationship. In tested modal compositions, the trigger retains its popup type and expanded state, and initial focus, Tab containment, Escape, and focus return continue to work. A custom `render` element can override the trigger's ARIA props again, so check the final rendered element and your source-level policy tooling. This is a policy-specific composition option, not a universal accessibility recommendation; verify it with the host's supported assistive technologies.

`finalFocus` accepts a ref or callback for the return target. Base UI focuses that element when it is tabbable; for a non-tabbable container with tabbable descendants, it focuses the first tabbable descendant instead. A descendant with `aria-disabled="true"` can still be tabbable. This differs from legacy `returnFocusRef`, which could restore focus to the exact `tabIndex={-1}` container. There is no public `finalFocus` option that forces that exact target while it contains tabbable descendants.

Modal dialogs expose `aria-modal="true"`. When `modal={false}` or `modal="trap-focus"`, outside pointer interactions remain available and the dialog is not exposed as modal.

`Dialog.Content` renders a backdrop by default. With `modal="trap-focus"`, Base UI can leave the dialog open after an outside press even when the press reaches an outside control; a drag released elsewhere outside can still dismiss it. When the backdrop is omitted, Base UI 1.6 and 1.8 can instead dismiss on mouse-down or touch movement before the gesture is canceled, potentially losing an unsaved draft. `disablePointerDismissal` keeps the tested dialogs open during these outside interactions, but also disables focus-out dismissal and changes the expected interaction. Provide an explicit close action, and review the composition and pointer cancellation behavior with an accessibility specialist.

Centered dialogs shrink to fit narrow viewports while retaining their preferred width when space allows. Titles wrap long words, and `Dialog.Body` reserves space for reading. An overflowing header or body becomes keyboard-focusable so its content can be scrolled; pass `tabIndex` to override. The header enters the tab order after focus moves into the dialog, preserving the default initial focus. If a focused header or body stops overflowing, it remains focusable until focus moves away. When the header, body, and footer do not fit together, scroll the dialog to reach its actions. `Button` and `LinkButton` labels wrap by default inside `Dialog.Footer`, including through ordinary wrappers. For non-link variants, pass `labelWrap={false}` to retain a single-line label; the link variant keeps its normal wrapping behavior. Separately portaled controls and custom footer content do not receive this treatment. Verify them at the host's supported viewport sizes and text settings.

For a custom scrollable header or body, provide a meaningful name when adding region semantics, and verify focus order and announcements with assistive technology.

### Short viewports and embedded scrolling

The header, footer, and body padding can leave little or no room for an embedded scrolling list in a short centered dialog. In hosts that load legacy `@primer/css`, its unlayered `!important` `.p-4` can also override the body padding and a normal CSS-module override. If the body is intended to have no padding, use `className="p-0"` on `Dialog.Body`; class merging removes the default `p-4` rather than competing with it. See the package CSS guidance for the broader utility collision.

`position={{narrow: 'fullscreen', regular: 'center'}}` can give the list more room, but it changes the layout at all narrow widths and does not guarantee that long or zoomed content fits. Verify that every result is visible or can be scrolled into view by keyboard and pointer in the actual host, including with larger text and translated content. Automated WebKit currently cannot keyboard-scroll some oversized `FilteredActionList` results; this remains an accessibility-specialist review issue, not a generally resolved composition.

Pass an element or ref to `Dialog.Content container={...}` to place the dialog in a specific portal root, or `null` to wait for the root. `portal={false}` renders it in place and ignores `container`. For custom positioning, compose `Dialog.Portal container={...}`, `Dialog.Backdrop`, `Dialog.Viewport`, and `Dialog.Popup` instead.

### Keyboard command scopes

By default, `Dialog.Content` and `Dialog.Popup` stop Arrow, Home, and End keydown events from bubbling past the dialog popup. This also applies with `portal={false}` and to non-modal and focus-trapping dialogs. The popup does not prevent the keys' default behavior merely by stopping propagation.

Place a dialog-specific command scope inside the popup around its controls, or pass its keyboard handler directly to the popup:

```tsx
<Dialog.Content onKeyDown={handleSearchKeyDown}>
  <Dialog.Title>Search</Dialog.Title>
  <label>
    Search terms
    <input />
  </label>
</Dialog.Content>
```

`handleSearchKeyDown` is supplied by the consumer. Handle only the intended controls and keys, and preserve native text editing and nested widgets' keyboard behavior. A child widget may stop an event before it reaches the scope; separately portaled or independently rooted content may also require its own scope. Verify the composition in the host.

Nested Primer floating surfaces inherit their owning Base UI portal by default. Keep a modal dialog and its nested menus, popovers, and dialogs in that portal rather than explicitly sending a child to an outside root, where the modal can hide it from assistive technology. DOM nesting alone does not provide React context: a child owned elsewhere in the React tree may instead default to the document portal root, even if its parent is physically inside the dialog.

In Chromium, a nonmodal menu rendered inside the parent popup, including with `ActionMenu.Content portal={false}`, can move focus to the dialog instead of returning it to the menu trigger after Escape. A menu targeting a container inside the popup can also move focus from a newly opened child dialog back to the parent even if the menu suppresses its own return focus. Prefer the inherited portal when possible, and verify focus containment, Escape, return focus, clipping, and modal accessibility in the actual host. The ActionMenu alignment notes describe the tested cases and the backdrop-dismissal tradeoff of `disablePointerDismissal`.

When a dialog is opened from another Primer floating surface, its backdrop and viewport use the popover layer; a top-level dialog uses the modal layer. This relies on the host's stacking tokens and nested portal order, and does not guarantee ordering across custom containers or stacking contexts. Raising only `viewportClassName` can leave the backdrop or a nested popover behind. Verify pointer hit testing, focus containment, Escape, and return focus in the actual host.

Forwards unrecognized props to Base UI's [`Dialog.Root`](https://base-ui.com/react/components/dialog#root), so it also accepts that part's props.

## Dialog.Root

Forwards unrecognized props to Base UI's [`Dialog.Root`](https://base-ui.com/react/components/dialog#root), so it also accepts that part's props.

## Dialog.Trigger

Forwards unrecognized props to Base UI's [`Dialog.Trigger`](https://base-ui.com/react/components/dialog#trigger), so it also accepts that part's props.

## Dialog.Content

Forwards unrecognized props to Base UI's [`Dialog.Popup`](https://base-ui.com/react/components/dialog#popup), so it also accepts that part's props.

- `align`: `DialogAlign` — Vertical alignment of the dialog while it is centered.
- `backdrop`: `boolean` — Default `true`. Whether to render a backdrop behind the dialog.
- `backdropClassName`: `string` — Classes applied to the backdrop.
- `container`: `HTMLElement | RefObject<HTMLElement | ShadowRoot | null> | ShadowRoot | null` — Portal destination. Pass `null` to wait for a container; ignored when `portal` is false.
- `height`: `DialogHeight` — Default `'auto'`. Height of the dialog: `small` (480px), `large` (640px), or `auto` to fit its content.
- `portal`: `boolean` — Default `true`. Where the dialog is rendered in the DOM. Set `false` to keep it in place.
- `position`: `DialogPosition` — Default `{narrow: 'center', regular: 'center'}`. Where the dialog sits in the viewport. Pass a responsive object to change it on narrow viewports, for example `{narrow: 'bottom', regular: 'center'}` for a bottom sheet. `wide` follows `regular`.
- `viewportClassName`: `string` — Classes applied to the element that positions the dialog within the viewport.
- `width`: `DialogWidth` — Default `'xlarge'`. Width of the dialog: `small` (296px), `medium` (320px), `large` (480px), `xlarge` (640px), or any CSS width.

## Dialog.Popup

Forwards unrecognized props to Base UI's [`Dialog.Popup`](https://base-ui.com/react/components/dialog#popup), so it also accepts that part's props.

## Dialog.Portal

Forwards unrecognized props to Base UI's [`Dialog.Portal`](https://base-ui.com/react/components/dialog#portal), so it also accepts that part's props.

## Dialog.Backdrop

Forwards unrecognized props to Base UI's [`Dialog.Backdrop`](https://base-ui.com/react/components/dialog#backdrop), so it also accepts that part's props.

## Dialog.Viewport

Forwards unrecognized props to Base UI's [`Dialog.Viewport`](https://base-ui.com/react/components/dialog#viewport), so it also accepts that part's props.

## Dialog.Title

Forwards unrecognized props to Base UI's [`Dialog.Title`](https://base-ui.com/react/components/dialog#title), so it also accepts that part's props.

## Dialog.Subtitle

Forwards unrecognized props to Base UI's [`Dialog.Description`](https://base-ui.com/react/components/dialog#description), so it also accepts that part's props.

## Dialog.Description

Forwards unrecognized props to Base UI's [`Dialog.Description`](https://base-ui.com/react/components/dialog#description), so it also accepts that part's props.

## Dialog.Close

Forwards unrecognized props to Base UI's [`Dialog.Close`](https://base-ui.com/react/components/dialog#close), so it also accepts that part's props.

## Dialog.CloseButton

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `aria-label`: `string` — Default `'Close'`. Accessible name for the close button.
- `aria-labelledby`: `string`
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `description`: `string` — Supplementary text shown in the button's tooltip and exposed as its accessible description. Without it, a supplied `aria-label` is repeated visually as a tooltip.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown in the tooltip, such as `Mod+B` or `['Mod+B', 'Control+B']`. Displays the hint only; the consumer still registers the shortcut.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Loading status text. Set to an empty string when an external announcer communicates loading.
- `notificationIndicator`: `"button" | "icon"` — Shows a dot for new activity on the button boundary or on the icon. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `tooltipDirection`: `TooltipDirection` — Default `'s'`. Side and alignment of the tooltip relative to the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.
- `unsafeDisableTooltip`: `boolean` — Default `false`. Skips the default tooltip. Prefer keeping it; IconButton also skips it automatically inside an existing Tooltip.

## Dialog.Header

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Dialog.Body

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Dialog.Footer

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Migrate custom structure to the Tailwind compound parts.
- Resolve named portal roots to an element or ref and pass it to `Dialog.Content` or `Dialog.Portal`. Nested Primer floating layers inherit the owning Base UI portal by default; overriding a child to an outside root can make it inaccessible while the dialog is modal.
- A dialog portal nested in a Primer floating layer places both its backdrop and viewport on the popover layer, instead of the lower top-level modal layer. `Dialog.Content` can override them separately with `backdropClassName` and `viewportClassName`; their ordering and any further nested popup must still be verified when overriding. This relies on the host providing Primer z-index tokens and does not coordinate arbitrary portal roots, inline clipping, or ancestor stacking contexts.
- A nonmodal menu rendered inside a modal dialog popup, including with `portal={false}`, can cause Base UI's parent focus recovery to steal focus after Escape or from a child dialog opened by a menu item. An explicit menu return target or suppression of its own return focus does not stop that parent recovery. Prefer the inherited portal when compatible, but DOM nesting does not give a different React owner the dialog's portal context. Verify the host's actual portal, focus, clipping, and modal accessibility; see the ActionMenu alignment for evidence and limitations.
- Preserve controlled state; map legacy `onClose` gesture handling to the new close/action callbacks.
- `Dialog.Content` and `Dialog.Popup` stop Arrow, Home, and End key events from bubbling to an ancestor outside the popup, including when `portal={false}`. Put dialog-specific command handlers on the popup or inside it, and account for nested widgets that stop their own events. This isolation does not itself prevent native editing.
- With Base UI 1.6.0 and 1.8.0, Chromium tests also observed a single unhandled Enter key event reaching an outside React bubble handler twice, both through this Dialog and through an unwrapped Base UI Dialog. A handler inside the popup ran once. Do not rely on outside bubbling for dialog commands; the same behavior is not established for all browsers or compositions.
- Replace `returnFocusRef` with `finalFocus` on `Dialog.Content` or `Dialog.Popup`. If the target is not tabbable and has tabbable descendants, Base UI focuses the first descendant rather than the exact target; this includes children marked `aria-disabled`. An exact `tabIndex={-1}` container target cannot be requested through `finalFocus` alone.
- Remove `sx`, styled-system props, and legacy CSS selectors.
- Intentional reflow difference: centered dialogs shrink below their usual minimum width when the viewport is narrower than the dialog and its inset. Long titles wrap, the body reserves reading space, and the dialog can scroll when its parts cannot fit together. This can increase the height of a short dialog. `Button` and `LinkButton` labels wrap by default inside `Dialog.Footer`, including through ordinary wrappers; separately portaled controls do not. For non-link variants, `labelWrap={false}` retains single-line labels. The link variant retains its normal wrapping behavior. The existing viewport-relative `max-width` remains a separate host-policy consideration.
- A short centered dialog can leave an embedded list's results clipped. In a legacy Primer CSS host, `Dialog.Body className="p-0"` removes its default `p-4` class and avoids that particular padding collision; it does not ensure that an oversized result is readable. Narrow fullscreen positioning can provide more space but changes presentation at all narrow widths. Test the actual host and see the FilteredActionList keyboard gap before treating either as a solution.
- A `Dialog` opened from inside a legacy `@primer/behaviors` focus trap, such as a legacy SidePanel, can be pulled back to its trigger by that trap. Primer has no supported cross-portal focus-trap contract; see the Portal alignment for host evidence and the interim migration approach.
- `Dialog.CloseButton` is labelled "Close", matching upstream's close button.
- Upstream's `footerButtons` footer moves focus between its buttons with the arrow keys. `Dialog.Footer` holds author-defined content, so it keeps the normal tab order. ConfirmationDialog keeps the arrow-key footer.
- Upstream's `title` and `subtitle` props become `Dialog.Title` and `Dialog.Subtitle` inside `Dialog.Header`, which places the close button beside them. `Title` renders an `h2` (upstream `h1`) and `Subtitle` a `p` (upstream `h2`). Primer's published Dialog accessibility guidance also specifies an `h1`; callers can use `Dialog.Title render={<h1 />}` while the default-heading difference is reconciled. This difference alone does not establish a WCAG failure. Both `Subtitle` and `Description` describe the dialog, so render one of them.
- Escape pressed on a focused close button closes the dialog on the first press, even while the button's tooltip is open, as upstream does since #7915. Every close button in Tailwind popups shares this behavior.
- `Dialog.Popup` and `Dialog.Content` expose `aria-modal="true"` when the root is modal. The non-modal and `trap-focus` modes do not, because they allow interaction outside the dialog.
- `Dialog.Content` renders a backdrop by default. In `trap-focus` mode, a Base UI backdrop can prevent outside-press dismissal even when the press reaches an outside control, though a drag released elsewhere outside can still dismiss. Without a backdrop, Base UI 1.6 and 1.8 can dismiss on mouse-down or touch movement before cancellation and lose an unsaved draft. `disablePointerDismissal` also disables focus-out dismissal; it changes the interaction rather than preserving outside dismissal. Retain an explicit close action and seek accessibility review.
- `Dialog.Trigger` sets `aria-expanded` while the dialog is open (Base UI semantics), so a `Button` trigger shows its active background behind the backdrop. Upstream stories open dialogs from a plain button with no expanded state, so visual comparisons of open dialogs differ only in that blended trigger fill.
- **Policy-specific override:** Base UI connects an open dialog trigger to its popup with `aria-controls`, which conflicts with current GitHub accessibility guidance. Pass `aria-controls={undefined}` to `Dialog.Trigger` when that relationship must be omitted; a custom render element can override the prop. This removes the explicit ID relationship and needs accessibility specialist and screen-reader review. Chromium and automated WebKit tests with Base UI 1.6 and 1.8 cover native and rendered button triggers in a modal dialog, not spoken output, other modalities, or every host wrapper. Check host source-level tooling as well as the rendered DOM.
- `Dialog.Header` and `Dialog.Body` become keyboard-focusable while their content overflows, so they can be scrolled even when they have no focusable children. The header enters the tab order after focus moves into the dialog, preserving the default initial focus. If overflow stops while either part has focus, its tab stop is retained until focus leaves. Pass `tabIndex` to override.
