# Alignment

## From: `@primer/react`

Legacy IconButton is the icon-only button surface with description and keybinding props and common Tooltip and ActionMenu compositions.

## To: `@primer/react-tailwind`

IconButton is a stable icon-only button with required `icon`, normal button semantics, loading behavior, and valid button DOM props. It does not expose legacy description or keybinding props and does not independently own tooltip or menu behavior. It is implemented as a local Button composition, so Base UI behavior is inherited through that primitive where applicable.

## Migration notes

- Supply an accessible name with `aria-label`; use native `title` only as supplemental text.
- Compose local Tooltip or ActionMenu around the button when needed.
- Keep keybinding presentation as adjacent KeybindingHint or `kbd` content.
- Use `className`, not `sx` or styled-system props.
