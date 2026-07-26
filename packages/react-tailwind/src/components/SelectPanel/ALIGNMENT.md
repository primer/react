# Alignment

## From: `@primer/react`

The canonical alpha SelectPanel is a configurable picker over AnchoredOverlay, FilteredActionList, ActionList, and Overlay.

## To: `@primer/react-tailwind`

The Tailwind SelectPanel covers the full non-deprecated surface: anchored, modal, and narrow-screen presentation; controlled or uncontrolled visibility and filtering; external anchors; typed selection identity; groups, dividers, and custom item rendering; loading, message, and notice states; secondary actions and select-all; sizing, collision, and scroll behavior; and built-in virtualization.

It composes Base UI Combobox with Primer Button, TextInput, ActionList item content, Banner, Popover, and Dialog. It deliberately does not export a partial `Root`/`Trigger`/`Content`/`Item` family, because those parts cannot form a valid combobox without their shared context.

## Migration notes

- `onOpenChange(open, gesture)` reports the gesture that caused the change rather than Base UI change details, and `disableFullscreenOnNarrow` stays opt-out where `FilteredActionList` uses the opt-in `fullScreenOnNarrow`. Both keep upstream's contract.

- Use `renderAnchor={null}` with `anchorRef` for an external trigger; this configuration is type-checked.
- Use `overlayProps` for popup and dialog DOM props, positioning, sizing, portal behavior, and a forwarded popup ref.
- Use `onScrollEnd` or `scrollContainerRef` for incremental loading. Set `virtualized` for fixed-row virtualization; variable content such as descriptions, inactive rows, and custom renderers falls back to normal rendering, and grouped lists stay fully rendered to preserve group semantics.
- Use list-level `renderGroup` to wrap every group; `groupMetadata[].renderGroup` wins for an individual group.
- `footer` is excluded because it is deprecated upstream in favor of `secondaryAction`.
- Legacy styled-system and `sx` props are unsupported.
