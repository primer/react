# Alignment

## From: `@primer/react`

Legacy ActionMenu wraps an ActionList overlay and supports anchor variants, legacy positioning configuration, context-menu anchors, fullscreen presentation, and menu close callbacks.

## To: `@primer/react-tailwind`

The stable compound API is `ActionMenu`, `Trigger`, `Button`, `Content` (also available as `Overlay`), `Item`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Submenu`, `SubmenuTrigger`, `Group`, `GroupLabel`, `Divider`, `LeadingVisual`, `TrailingVisual`, and `Description`. Content owns its Base UI portal and positioner. Base UI owns menu ARIA, keyboard navigation, focus, dismissal, positioning, nested-menu behavior, and controlled `open`/`defaultOpen`/`onOpenChange` state. Menu items and ActionList items share the same internal content, visual, description, selection, loading, and inactive-state presentation without nesting interactive elements.

## Migration notes

- Compose branded triggers with `render`, not `as`, to avoid nested interactive elements. Use `className` when the composed control owns the visual treatment.
- Move legacy ActionList item content directly into ActionMenu items and use `ActionMenu.LeadingVisual`, `TrailingVisual`, and `Description`; no intermediate ActionList wrapper is required.
- Use physical Base UI placement through the positioner; legacy custom anchors, fullscreen mode, and non-public positioning props are unsupported.
- Keep dialog and menu portal composition explicit.
- `sx` and styled-system props are unsupported.
