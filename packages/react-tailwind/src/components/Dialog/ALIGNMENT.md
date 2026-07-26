# Alignment

## From: `@primer/react`

Legacy `Dialog` is the styled-system modal with `Dialog.Header`, `Dialog.Body`, and `Dialog.Footer` subcomponents. It takes an `onClose` callback whose gesture identifies escape or close-button dismissal, along with title/description, footer buttons, `preventClose`, width/height, position, alignment, and return-focus options. The implementation is CSS-module based and owns legacy overlay positioning and focus behavior.

## To: `@primer/react-tailwind`

Tailwind `Dialog` is a Base UI compound replacement. The root and named parts own open state, focus trapping, escape and outside dismissal, portal layering, positioning, and accessible title and description relationships. Tailwind classes and Primer semantic tokens provide the surface, backdrop, header, body, and footer presentation.

Use `Dialog.Trigger`, `Content`, `Popup`, `Portal`, `Backdrop`, `Viewport`, `Header`, `Title`, `Description`, `Body`, `Footer`, `Close`, and `CloseButton` rather than legacy internal DOM. Controlled open state remains compatible. Legacy gesture callbacks and styled-system props do not.

## Migration notes

- Migrate custom structure to the Tailwind compound parts.
- Preserve controlled state; map legacy `onClose` gesture handling to the new close/action callbacks.
- Remove `sx`, styled-system props, and legacy CSS selectors.
