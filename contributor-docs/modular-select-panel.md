# Modular SelectPanel

Compose `SelectPanel.Root` and the parts on the `SelectPanel` namespace when an application needs control over picker content, layout, filtering, or submission. These are presentational components with shared internal behavior, not a second configured API. Use ordinary children and Primer components; internal contexts and hooks are not public extension points.

The existing configured `<SelectPanel items={...} selected={...} />` API remains unchanged. Keep using it when its prescribed layout fits. See the [API reference](./select-panel-api.md) for the compound parts and state contracts.

## Native by default

Composed overlays use native `<dialog>` and `showModal()` for top-layer rendering, focus containment, and background inertness. **Anchored presentation is still modal.** Normal anchored positioning uses CSS anchors independently of the shared `primer_react_css_anchor_positioning` flag. Shared JavaScript positioning is reserved for unsupported browsers, explicit `cssAnchorPositioningSettings.disable`, or custom legacy positioning settings. Modal, fullscreen, and bottom-sheet presentations are viewport-positioned.

`Trigger` and `CloseButton` use browser `command` / `commandfor` activation when supported. Support is detected automatically; unsupported commands use JavaScript activation with the same native dialog. There are no native-dialog or invoker feature flags, and no separate popover experiment to enable.

React remains the source of truth for open state. Escape, backdrop clicks, and close controls request a state change; controlled consumers must update `open` to accept it. Selection, query state, and submit/cancel policies do not change with presentation. Anchored and fullscreen panels do not dim the page; modal and bottom-sheet panels retain their backdrop. All retain native modal focus containment and background inertness.

Provide a title or an explicit accessible dialog name, an accessible collection/search name, and a way to leave the picker. Compose close controls explicitly. Independent or nested pickers need separate roots; non-native overlays portaled outside a modal dialog are not automatically promoted into its top layer.

## Configured adapter and rollback

The only migration flag is the default-off `primer_react_select_panel_composable_adapter`:

```tsx
<FeatureFlags flags={{primer_react_select_panel_composable_adapter: true}}>
  <SelectPanel {...existingSelectPanelProps} />
</FeatureFlags>
```

With the flag **off**, configured calls retain their original selection rules, `AnchoredOverlay` host, `h1` title, collection renderer, and message markup/announcements. This is the rollback boundary. Explicit compositions always use the new parts and native dialog, independently of this flag.

With the flag **on**, configured calls compose the shared input/list/item primitives and selection behavior. Compatible configured pickers use the native host and automatic command detection. Legacy focus opt-outs and incompatible positioning/reflow settings retain the configured legacy host rather than silently changing those contracts. The shared `AnchoredOverlay` component itself is unchanged.

The configured controller still owns filtering, selected-first sorting, modal drafts, Save/Cancel behavior, callback reasons, and responsive defaults. Custom rows, external anchors, and configured virtualization remain supported. Selection identity intentionally follows the shared engine: anchored single selection compares IDs, and modal drafts distinguish different ID-less objects. The collection's identifier becomes `data-component="SelectPanel.Collection"`; existing classes and test IDs remain.

Choose the flag before mounting a picker: changing it while open can reset collection-local focus and scroll state. Both configured renderers still ship; this is not a bundle-size reduction.

## Essential regression stories

- [Configured Adapter](../packages/react/src/SelectPanel/SelectPanel.compatibility.stories.tsx): **Default** enables the adapter with native defaults; **Legacy** disables it; **Messages** compares message behavior; **Modal Transaction** checks Cancel/Save and focus return. The `composable` control resets the example.
- Existing configured **Default**, **Features**, **Examples**, and **Dev** stories remain compatibility contracts. Their consumer JSX is unchanged.
- [Composition](../packages/react/src/SelectPanel/SelectPanel.composition.stories.tsx): custom layouts, app-owned Apply/Cancel, selection tokens, grouped options, nested details, inline collections, responsive presentations, and explicit roving focus. Extend these through supported parts and callbacks rather than internal DOM overrides.
- [Virtualization](../packages/react/src/SelectPanel/SelectPanel.virtualization.stories.tsx): the internal fixed-height collection experiment uses ordinary root/overlay/selection parts and native defaults. It is not a public `List` virtualization API.

Applications own filtering and rendered children, stable string/number selection values, result-count announcements, persistence, and transactional rollback. Search defaults to active-descendant navigation; `focusStrategy="roving"` opts into actual option focus. See the API reference for keyboard behavior and secondary-action constraints.
