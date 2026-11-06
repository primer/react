# Alignment

## From: `@primer/react`

Legacy `Overlay` is a positioned floating surface used by older dialogs and menus. It combines placement, portal/layering, width and height constraints, escape and outside-click dismissal, focus behavior, animation, and overlay visual styling. Its public props and CSS-module implementation therefore carry substantially more behavior than a simple surface, along with shared styled-system customization.

## To: `@primer/react-tailwind`

Tailwind `Overlay` is intentionally a reduced, presentational floating surface. It renders the supplied content with Tailwind classes and Primer tokens, but does not own the legacy positioning, portal, focus, escape, outside-click, sizing, or animation behavior. Consumers should compose the appropriate modern behavioral primitive—such as Dialog or Popover—when those semantics are required. Overlay itself is not Base UI-backed.

## Migration notes

- Do not treat Tailwind `Overlay` as a drop-in modal/menu controller.
- Migrate behavioral usage to `Dialog` or `Popover`, as appropriate.
- Remove legacy positioning/layering props, `sx`, and styled-system props.
