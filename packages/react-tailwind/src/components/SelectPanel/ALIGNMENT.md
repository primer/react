# Alignment

## From: `@primer/react`

The canonical alpha SelectPanel is a configurable picker over AnchoredOverlay, FilteredActionList, ActionList, and Overlay.

## To: `@primer/react-tailwind`

The Tailwind SelectPanel covers the full non-deprecated surface: anchored, modal, and narrow-screen presentation; controlled or uncontrolled visibility and filtering; external anchors; typed selection identity; groups, dividers, and custom item rendering; loading, message, and notice states; secondary actions and select-all; sizing, collision, and scroll behavior; and built-in virtualization.

It composes Base UI Combobox with Primer Button, TextInput, ActionList item content, Banner, Popover, and Dialog. For custom compositions, `SelectPanel` also exposes `Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, `Surface`, `Header`, `Title`, `Filter`, `List`, `Item`, `Group`, `GroupLabel`, `Collection`, `Empty`, `Loading`, `Footer`, and `SelectionIndicator`. The configured component uses the same styled parts and retains its existing selection and presentation policies.

The parts API intentionally uses Base UI's `value/defaultValue/onValueChange` and callback details, not the configured API's selection and gesture adapters. A filterable root uses Combobox. `filterable={false}` uses Select for select-style typeahead and option focus; map explicit item children in that mode. `Filter`, `Empty`, and `Collection` are Combobox-only.

Parts do not implicitly supply the configured API's responsive dialog, draft/save behavior, selected-first sorting, select-all, or virtualization. Those remain configured policies, not primitive defaults.

## Migration notes

- `onOpenChange(open, gesture)` reports the gesture that caused the change rather than Base UI change details, and `disableFullscreenOnNarrow` stays opt-out where `FilteredActionList` uses the opt-in `fullScreenOnNarrow`. Both keep upstream's contract.

- Use `renderAnchor={null}` with `anchorRef` for an external trigger; this configuration is type-checked. The default anchor is a `Button` whose `TriangleDownIcon` is a `trailingAction`, matching upstream.
- Use `overlayProps` for popup and dialog DOM props, positioning, sizing, portal behavior, and a forwarded popup ref.
- Use `onScrollEnd` or `scrollContainerRef` for incremental loading. Set `virtualized` for fixed-row virtualization; variable content such as descriptions, inactive rows, and custom renderers falls back to normal rendering, and grouped lists stay fully rendered to preserve group semantics.
- Use list-level `renderGroup` to wrap every group; `groupMetadata[].renderGroup` wins for an individual group.
- `footer` is excluded because it is deprecated upstream in favor of `secondaryAction`.
- The filter input uses the normal input background. Upstream's `primer_react_select_panel_legacy_contrast` flag and the `contrast` input prop it relies on are deprecated, so the `LegacyContrast` story is intentionally not paired.
- The filter input is named when it first receives focus, and `aria-controls` references the list only while the list is rendered, so it is absent for loading and message states. Base UI provides both behaviours.
- Upstream's rendering-performance memoization and its fix for virtualized row measurement warnings have no equivalent here: the React Compiler handles memoization, and Base UI measures virtualized rows.
- Legacy styled-system and `sx` props are unsupported.
