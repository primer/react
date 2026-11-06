# Alignment

## From: `@primer/react`

The canonical alpha SelectPanel is a configurable picker over AnchoredOverlay, FilteredActionList, ActionList, and Overlay.

## To: `@primer/react-tailwind`

The Tailwind SelectPanel covers anchored, modal, and narrow-screen presentation; controlled or uncontrolled visibility and filtering; external anchors; typed selection identity; groups, dividers, and custom item rendering; loading, message, and notice states; secondary actions and select-all; sizing, collision, and scroll behavior; and built-in virtualization. The focus parity gap below remains unresolved.

It composes Base UI Combobox with Primer Button, TextInput, ActionList item content, Banner, Popover, and Dialog. It deliberately does not export a partial `Root`/`Trigger`/`Content`/`Item` family, because those parts cannot form a valid combobox without their shared context.

## Migration notes

- `onOpenChange(open, gesture)` reports the gesture that caused the change rather than Base UI change details. Narrow-screen fullscreen is gated by `primer_react_select_panel_fullscreen_on_narrow`, which defaults to `false`; `disableFullscreenOnNarrow` opts out when the flag is enabled. This package's `FeatureFlags` provider has a separate context from `@primer/react`, so forward the same flag value when migrating incrementally.

- Use `renderAnchor={null}` with `anchorRef` for an external trigger; this configuration is type-checked. The default anchor is a `Button` whose `TriangleDownIcon` is a `trailingAction`, matching upstream.
- When `renderAnchor` returns a non-button element, set `anchorProps.nativeButton` to `false`. For an `ActionMenu.Item`, also preserve `role: 'menuitem'` on `anchorProps` and use `closeOnClick={false}` on the item.
- Use `overlayProps` for popup and dialog DOM props, sizing, `side`, `alignOffset`, `sideOffset`, collision boundaries, `container` for an explicit portal destination, and `portal={false}` to keep the panel in place. Use `align`, `displayInViewport`, and `cssAnchorPositioningSettings` on SelectPanel for the remaining positioning controls. The configured component does not expose a placement-change callback.
- Resolve named portal registries to a DOM container and pass it as `overlayProps.container`. Without one, the default portal root is the nearest `BaseStyles` portal root, then the first document portal root, then `document.body`.
- The configured panel focuses its filter on open and restores focus to `anchorRef` or the trigger on close. It does not expose independent initial- or final-focus props; compose the lower-level Popover or Dialog when those controls are required.
- Item callbacks receive `SelectPanelItem`, not a consumer generic. Retain a typed lookup of source items by their stable `id` and resolve callback values through that lookup, handling missing IDs explicitly; id-less items use object identity.
- Item `onAction` receives a React click event even for keyboard activation. Inspect the third argument's `sourceEvent` to identify the original `KeyboardEvent`, and call `preventDefault()` on the React event to cancel selection.
- Message presets announce through `status` or `alert` by default. Set `role: 'none'` on a configured message or `role="none"` on `SelectPanel.Message` when a separate live region owns the announcement.
- **Parity gap:** With the default `setInitialFocus={false}`, the first option is not highlighted on open, so the first ArrowDown highlights it instead of the second option. `focusPrependedElements` enables Base UI's filter-change auto-highlighting but does not reliably highlight the first enabled option when items are prepended without changing the filter. Use a focused alternative composition for flows that depend on these behaviors until they are supported.
- Default item descriptions, `ActionList.Description` parts, and inactive reasons are exposed as option descriptions. Arbitrary custom renderers must supply appropriate `aria-label`/`aria-labelledby` and `aria-describedby` references on the item.
- Use `onScrollEnd` or `scrollContainerRef` for incremental loading. Set `virtualized` for fixed-row virtualization; variable content such as descriptions, inactive rows, and custom renderers falls back to normal rendering, and grouped lists stay fully rendered to preserve group semantics.
- Use list-level `renderGroup` to wrap every group; `groupMetadata[].renderGroup` wins for an individual group.
- `footer` is excluded because it is deprecated upstream in favor of `secondaryAction`.
- The filter input uses the normal input background. Upstream's `primer_react_select_panel_legacy_contrast` flag and the `contrast` input prop it relies on are deprecated, so the `LegacyContrast` story is intentionally not paired.
- The filter input is named when it first receives focus, and `aria-controls` references the list only while the list is rendered, so it is absent for loading and message states. Base UI provides both behaviours.
- An enclosing `FormControl` labels and describes an internally rendered trigger and applies its disabled and validation states, not those of independent popup controls. Connect an external anchor to the field yourself. Set the filter's own attributes through `textInputProps`.
- Upstream's rendering-performance memoization and its fix for virtualized row measurement warnings have no equivalent here: the React Compiler handles memoization, and Base UI measures virtualized rows.
- Legacy styled-system and `sx` props are unsupported.
