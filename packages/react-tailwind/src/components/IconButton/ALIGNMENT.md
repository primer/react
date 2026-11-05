# Alignment

## From: `@primer/react`

Legacy IconButton is the icon-only button surface with description and keybinding props and common Tooltip and ActionMenu compositions.

## To: `@primer/react-tailwind`

IconButton is a stable icon-only button with required `icon` (an icon component or a rendered element), normal button semantics, loading behavior, and valid button DOM props. Like upstream, it renders a Tooltip by default: `aria-label` as a visual label tooltip, or `description` as an accessible description, plus optional `keybindingHint` and `tooltipDirection`. It is implemented as a local Button composed into `Tooltip.Trigger`, so Base UI behavior is inherited through those primitives.

## Migration notes

- Supply an accessible name with `aria-label`; it is always kept on the button, so the label tooltip is visual only.
- The default tooltip is skipped when `unsafeDisableTooltip` is set, when `aria-label` is empty, or inside an external Tooltip, and stays closed while disabled or while an attached popup is expanded.
- Compose `ActionMenu.Trigger render={<IconButton … />}` to use it as a menu anchor.
- `notificationIndicator` accepts `button` or `icon`; the dot is visual only, so include the activity in `aria-label` or a description.
- Pass a rendered element such as `icon={<HeartIcon />}` when the icon comes from a Server Component.
- Use `className`, not `sx` or styled-system props.
