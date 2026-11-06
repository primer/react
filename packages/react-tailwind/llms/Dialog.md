# Dialog

`Dialog` provides a modal surface with composable trigger and content parts.

Import: `import {Dialog} from '@primer/react-tailwind/Dialog'`

Forwards unrecognized props to Base UI's [`Dialog.Root`](https://base-ui.com/react/components/dialog#root), so it also accepts that part's props.

## Dialog.Root

Forwards unrecognized props to Base UI's [`Dialog.Root`](https://base-ui.com/react/components/dialog#root), so it also accepts that part's props.

## Dialog.Trigger

Forwards unrecognized props to Base UI's [`Dialog.Trigger`](https://base-ui.com/react/components/dialog#trigger), so it also accepts that part's props.

## Dialog.Content

Forwards unrecognized props to Base UI's [`Dialog.Popup`](https://base-ui.com/react/components/dialog#popup), so it also accepts that part's props.

- `align`: `DialogAlign` — Vertical alignment of the dialog while it is centered.
- `backdrop`: `boolean` — Whether to render a backdrop behind the dialog. Modal dialogs render one by default.
- `backdropClassName`: `string` — Classes applied to the backdrop.
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
- `block`: `boolean` — Stretches the button to fill the width of its container.
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `description`: `string` — Supplementary text shown in the button's tooltip and exposed as its accessible description. Without it, the tooltip repeats `aria-label` visually.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `keybindingHint`: `string | string[]` — Keyboard shortcut, or alternative shortcuts, shown in the tooltip, such as `Mod+B` or `['Mod+B', 'Control+B']`. Displays the hint only; the consumer still registers the shortcut.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
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
- Preserve controlled state; map legacy `onClose` gesture handling to the new close/action callbacks.
- Remove `sx`, styled-system props, and legacy CSS selectors.
- `Dialog.CloseButton` is labelled "Close", matching upstream's close button.
- Upstream's `footerButtons` footer moves focus between its buttons with the arrow keys. `Dialog.Footer` holds author-defined content, so it keeps the normal tab order. ConfirmationDialog keeps the arrow-key footer.
- Upstream's `title` and `subtitle` props become `Dialog.Title` and `Dialog.Subtitle` inside `Dialog.Header`, which places the close button beside them. `Title` renders an `h2` (upstream `h1`) and `Subtitle` a `p` (upstream `h2`). Both `Subtitle` and `Description` describe the dialog, so render one of them.
- Escape pressed on a focused close button closes the dialog on the first press, even while the button's tooltip is open, as upstream does since #7915. Every close button in Tailwind popups shares this behavior.
- `Dialog.Trigger` sets `aria-expanded` while the dialog is open (Base UI semantics), so a `Button` trigger shows its active background behind the backdrop. Upstream stories open dialogs from a plain button with no expanded state, so visual comparisons of open dialogs differ only in that blended trigger fill.
- `Dialog.Body` receives `tabIndex={0}` while its content overflows, so keyboard users can scroll it when it has no focusable children. Pass `tabIndex` to override.
