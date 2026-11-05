# Alignment

## From: `@primer/react`

Legacy ActionMenu wraps an ActionList overlay. It supports an external `anchorRef`, `side`/`align` placement, overlay sizing, a responsive fullscreen `variant`, `displayInViewport`, `onPositionChange`, and menu close callbacks.

## To: `@primer/react-tailwind`

The stable compound API includes `ActionMenu`, `Trigger`, `Button`, `Content` (also available as `Overlay`), `Item`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Submenu`, `SubmenuTrigger`, `Group`, `GroupLabel`, `Divider`, `LeadingVisual`, `TrailingVisual`, and `Description`. Content owns its Base UI portal and positioner. It shares the floating-content props of Popover, Tooltip, AnchoredOverlay, and Autocomplete (`side`, `align`, offsets, `anchor`, and `portal`), the overlay size props (`width`, `height`, `maxHeight`, `maxWidth`), and `variant={{narrow: 'fullscreen'}}`.

Base UI owns menu ARIA, keyboard navigation, focus, dismissal, positioning, nested-menu behavior, and controlled `open`/`defaultOpen`/`onOpenChange` state. Menu and ActionList items share internal content, visuals, descriptions, selection, loading, and inactive-state presentation without nesting interactive elements.

## Migration notes

- Compose branded triggers with `render`, not `as`, to avoid nested interactive elements. Use `className` when the composed control owns the visual treatment.
- Move legacy ActionList item content directly into ActionMenu items and use `ActionMenu.LeadingVisual`, `TrailingVisual`, and `Description`; no intermediate ActionList wrapper is required.
- Replace the root's `anchorRef` with `Content`'s `anchor` and controlled `open`. `displayInViewport` and `onPositionChange` are unsupported; Base UI's collision handling keeps the menu in view.
- Opening with a pointer focuses the menu itself, and opening with the keyboard focuses its first item (Base UI's menu pattern). Upstream focuses the first item either way.
- Pass `preventFocusOnClose` to `ActionMenu.Content` when the menu should not return focus to its trigger after closing, for example when an item moves focus elsewhere.
- Upstream's fix for passive anchor label updates has no equivalent here, because Base UI owns the trigger's labelling.
- Set `portal={false}` to render the menu in place, for example inside a scrolling container.
- `sx` and styled-system props are unsupported.
