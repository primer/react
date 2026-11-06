# Alignment

## From: `@primer/react`

Legacy `Dialog` is the styled-system modal with `Dialog.Header`, `Dialog.Body`, and `Dialog.Footer` subcomponents. It takes an `onClose` callback whose gesture identifies escape or close-button dismissal, along with title/description, footer buttons, `preventClose`, width/height, position, alignment, and return-focus options. The implementation is CSS-module based and owns legacy overlay positioning and focus behavior.

## To: `@primer/react-tailwind`

Tailwind `Dialog` is a Base UI compound replacement. The root and named parts own open state, focus trapping, escape and outside dismissal, portal layering, positioning, and accessible title and description relationships. Tailwind classes and Primer semantic tokens provide the surface, backdrop, header, body, and footer presentation.

Use `Dialog.Trigger`, `Content`, `Popup`, `Portal`, `Backdrop`, `Viewport`, `Header`, `Title`, `Subtitle`, `Description`, `Body`, `Footer`, `Close`, and `CloseButton` rather than legacy internal DOM. Controlled open state remains compatible. Legacy gesture callbacks and styled-system props do not.

`Dialog.Content` keeps upstream's `width`, `height`, `position`, and `align`. `position` accepts a responsive object such as `{narrow: 'bottom', regular: 'center'}`; `wide` follows `regular`. Set `portal={false}` to render the dialog in place.

## Migration notes

- Migrate custom structure to the Tailwind compound parts.
- Preserve controlled state; map legacy `onClose` gesture handling to the new close/action callbacks.
- Remove `sx`, styled-system props, and legacy CSS selectors.
- `Dialog.CloseButton` is labelled "Close", matching upstream's close button.
- Upstream's `footerButtons` footer moves focus between its buttons with the arrow keys. `Dialog.Footer` holds author-defined content, so it keeps the normal tab order. ConfirmationDialog keeps the arrow-key footer.
- Upstream's `title` and `subtitle` props become `Dialog.Title` and `Dialog.Subtitle` inside `Dialog.Header`, which places the close button beside them. `Title` renders an `h2` (upstream `h1`) and `Subtitle` a `p` (upstream `h2`). Both `Subtitle` and `Description` describe the dialog, so render one of them.
- Escape pressed on a focused close button closes the dialog on the first press, even while the button's tooltip is open, as upstream does since #7915. Every close button in Tailwind popups shares this behavior.
- `Dialog.Trigger` sets `aria-expanded` while the dialog is open (Base UI semantics), so a `Button` trigger shows its active background behind the backdrop. Upstream stories open dialogs from a plain button with no expanded state, so visual comparisons of open dialogs differ only in that blended trigger fill.
