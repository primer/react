# Alignment

## From: `@primer/react`

The canonical alpha SelectPanel is a configurable picker over AnchoredOverlay, FilteredActionList, ActionList, and Overlay.

## To: `@primer/react-tailwind`

The Tailwind SelectPanel provides the complete non-deprecated configured surface: anchored, modal, and narrow-screen presentation; controlled or uncontrolled visibility and filters; external anchors; typed selection identity; single deselection; filtered multi-selection preservation; selected-first ordering; groups and group renderers; dividers; custom item rendering; disabled and inactive items; loading; messages; notices; secondary actions; select-all; height and width controls; viewport collision behavior; scrolling/render-more; built-in virtualization; refs; and popup DOM props.

It composes Base UI Combobox with Primer Button, TextInput, ActionList item-content layers, Banner, Popover, and Dialog. The configured API deliberately does not re-export a partial `Root`/`Trigger`/`Content`/`Item` family because those parts cannot form a valid combobox without their required shared context.

## Migration notes

- Use `renderAnchor={null}` with `anchorRef` for an external trigger; the external-anchor configuration is type-checked.
- Use `overlayProps` for popup or dialog DOM props, positioning options, width, height, max height, portal behavior, and a forwarded popup ref.
- Use `onScrollEnd` or `scrollContainerRef` for incremental loading. Set `virtualized` for built-in fixed-row virtualization; descriptions, inactive rows, custom renderers, and other variable content fall back to normal rendering, and grouped lists stay fully rendered to preserve group semantics.
- Use list-level `renderGroup` to wrap all groups; `groupMetadata[].renderGroup` takes precedence for an individual group.
- `footer` is intentionally excluded. It is the only SelectPanel prop marked `@deprecated` in the canonical source (`packages/react/src/SelectPanel/SelectPanel.tsx`, lines 108–113) and in canonical docs metadata (`SelectPanel.docs.json`, lines 158–163), which direct consumers to `secondaryAction`.
- Legacy styled-system and `sx` props are unsupported.
