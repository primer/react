# Modular SelectPanel API

This reference describes the compound API on this branch, not a released API guarantee. The existing configured `<SelectPanel items={...} selected={...} />` API and its props remain available and unchanged. See the [composition guide](./modular-select-panel.md) for the opt-in configured adapter and rollback boundaries.

## Imports and composition

```tsx
import {SelectPanel, type SelectPanelValue, type SelectPanelRootProps} from '@primer/react'
```

Parts live on the existing `SelectPanel` namespace. Compose ordinary children; there is no required layout, item-record configuration, or public behavior hook.

```tsx
function LabelPicker() {
  return (
    <SelectPanel.Root selectionMode="multiple">
      <SelectPanel.Trigger>Choose labels</SelectPanel.Trigger>
      <SelectPanel.Overlay>
        <SelectPanel.Content>
          <SelectPanel.Header>
            <SelectPanel.Title>Choose labels</SelectPanel.Title>
            <SelectPanel.CloseButton />
          </SelectPanel.Header>
          <SelectPanel.List aria-label="Available labels">
            <SelectPanel.Item value="bug">Bug</SelectPanel.Item>
            <SelectPanel.Item value="enhancement">Enhancement</SelectPanel.Item>
          </SelectPanel.List>
        </SelectPanel.Content>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}
```

Omit `Trigger` and `Overlay` for an inline collection. Each independent or nested picker needs its own root. A root supports at most one mounted search input and one mounted collection.

## Root state

`Root` renders no DOM wrapper and takes no DOM ref or styling props. `SelectPanelValue` is `string | number`; single and multiple selection both use arrays.

| Props                                                               | Default                         | Contract                                                                                                                |
| ------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `open`, `defaultOpen`, `onOpenChange(open, reason)`                 | Uncontrolled, initially `false` | Controlled consumers must update `open` to accept a request.                                                            |
| `selected`, `defaultSelected`, `onSelectedChange(values)`           | Uncontrolled, initially `[]`    | Stable, unique values; compared with `Object.is`.                                                                       |
| `selectionMode`                                                     | `'single'`                      | `'single'` or `'multiple'`. Single selection allows zero or one value.                                                  |
| `closeOnSelect`                                                     | `false`                         | Requests close after toggling an option.                                                                                |
| `filterValue`, `defaultFilterValue`, `onFilterChange(value, event)` | Uncontrolled, initially `''`    | Applications filter and render children. Clearing search supplies a `null` event.                                       |
| `focusStrategy`                                                     | `'active-descendant'`           | Search keeps DOM focus; `'roving'` moves focus among options. Without enabled search, the collection uses roving focus. |
| `onSubmit(values)`, `onCancel()`, `onDismiss(reason)`               | None                            | Separate synchronous intentions, before requesting close.                                                               |
| `id`                                                                | Generated                       | Base identity for internal relationships, not a wrapper element ID.                                                     |

Activating a selected option deselects it, including in single-selection mode. Filtering does not clear hidden selections. External controlled-state changes do not synthesize user-intent callbacks.

Open-change reasons are `'anchor-click'`, `'anchor-key-press'`, `'click-outside'`, `'escape'`, `'close'`, `'back'`, `'selection'`, `'cancel'`, and `'submit'`. Dismiss reasons are `'anchor-click'`, `'click-outside'`, `'escape'`, `'close'`, and `'back'`. A request matching current open state does not call `onOpenChange`.

There is no implicit draft/commit store, query reset, persistence, asynchronous validation, or rollback. Applications implement transactions through controlled selection and `onSubmit`/`onCancel`/`onDismiss`. Changing presentation alone never introduces Save/Cancel behavior.

## Trigger and native overlay

`Trigger` inherits Primer Button props and forwards a button ref. Its `render(props)` callback supports custom buttons: forward all supplied props and the ref to the actual button. The trigger connects dialog semantics, positioning, and focus return; it does not generate selected-value text. In a `FormControl`, it inherits the control ID, disabled state, and description IDs.

`Overlay` uses native `<dialog>` and `showModal()` by default. The browser supplies top-layer rendering, focus containment, and background inertness for **every** presentation, including anchored panels. React still controls visibility and dismissal. `Trigger` and `CloseButton` use `command` / `commandfor` when browser support is detected; otherwise JavaScript activation drives the same native dialog. No native-dialog or invoker flags are needed.

Normal anchored positioning uses CSS anchors whether the shared `primer_react_css_anchor_positioning` flag is `false` or `true`. Shared JavaScript positioning is a fallback for unsupported CSS anchor capabilities, explicit `cssAnchorPositioningSettings.disable`, or custom legacy positioning settings, not a separate composed overlay implementation. Modal, fullscreen, and bottom-sheet layouts are viewport-positioned. The shared `AnchoredOverlay` flag and behavior remain unchanged.

| Overlay prop                                       | Default                                       | Purpose                                                                                                                     |
| -------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `variant`                                          | `{regular: 'anchored', narrow: 'fullscreen'}` | Regular: `'anchored'` or `'modal'`; narrow: `'anchored'`, `'fullscreen'`, or `'bottom-sheet'`. Omitted fields use defaults. |
| `width`, `height`                                  | Width `'medium'`                              | Existing overlay size presets.                                                                                              |
| `anchorRef`, `renderAnchor`, `anchorId`            | Root trigger integration                      | Advanced anchor integration.                                                                                                |
| `side`, `align`, `anchorOffset`, `alignmentOffset` | Inherited                                     | Anchored placement.                                                                                                         |
| `cssAnchorPositioningSettings`                     | Native anchoring when supported               | Explicit disable or CSS placement fallback strategy.                                                                        |
| `pinPosition`, `onPositionChange`                  | Inherited                                     | Legacy positioning controls that use shared positioning instead of CSS anchors.                                             |
| `displayInViewport`                                | Unset                                         | Explicit `true` or `false` uses shared JavaScript positioning to preserve legacy clamping semantics.                        |
| `focusTrapSettings`                                | Initial focus targets search                  | Advanced initial-focus integration; native modal focus containment remains.                                                 |
| `overlayProps`                                     | Generated dialog attributes                   | Dialog label, ID, class/style, portal container, and ref.                                                                   |
| `displayCloseButton`, `closeButtonProps`           | `false`                                       | Optional responsive narrow-screen close icon.                                                                               |
| `className`                                        | None                                          | Overlay class.                                                                                                              |
| `onOpen`, `onClose`                                | Root transitions                              | Advanced handler overrides; prefer root callbacks.                                                                          |

`renderAs` is not part of the composed overlay API: a separate portal/popover implementation is no longer needed. Regular presentation begins at Primer's 768px breakpoint. Anchored and fullscreen backdrops are transparent; modal and bottom-sheet backdrops are visible. Transparency does not remove modal focus containment, inertness, or outside-click dismissal.

Name the dialog with `Title`, or `overlayProps={{'aria-label': 'Choose labels'}}`. `Description` connects descriptive content. The dialog ref belongs in `overlayProps.ref`; `Overlay` has no top-level forwarded ref. `overlayProps.onEscape` and `overlayProps.onClickOutside` replace default dismissal for those gestures.

## Content, search, and collection

| Part                          | Contract                                                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Content`, `Header`, `Footer` | Styled layout wrappers with native `div` props/refs; insert no other parts.                                                                                  |
| `Title`                       | Primer Heading props, defaults to `h2`; registers the dialog/collection title. Choose the appropriate heading level.                                         |
| `Description`                 | Native `div` props/ref; registers the dialog description.                                                                                                    |
| `SearchInput`                 | TextInput props/ref except `value`/`defaultValue`; query state lives on `Root`. Default placeholder: `'Filter items'`. Provide a contextual accessible name. |
| `List`                        | Native `ul` props/ref, `role="listbox"`, root selection mode, and accessible name. Multiple selection sets `aria-multiselectable`.                           |
| `Item`                        | ActionList item presentation with required stable `value`; derives `role="option"` and `aria-selected` from root state.                                      |
| `Group`                       | ActionList group props plus required `label`; supplies a labeled group and heading.                                                                          |

Typing updates query state only: applications derive filtered children, remove empty groups, and provide result-count announcements. With active-descendant search, options are not additional Tab stops. Do not add a competing focus zone, manage option tab stops yourself, or put independent interactive controls inside options.

`Item` supports `disabled`, `aria-disabled`, `loading`, and `inactiveText` to make options unavailable. Its `onSelect(event)` can call `preventDefault()` to cancel selection. Use noninteractive `ActionList.LeadingVisual`, `TrailingVisual`, and `Description` for rich content, not a separate `selected` prop.

`secondaryActions` accepts readonly `SelectPanelItemAction[]` descriptors. These are supplemental actions with TreeView-style keyboard access, not nested tabbable buttons. Cmd/Ctrl+Shift+U invokes a sole action or opens the supplemental-actions dialog for multiple actions. Escape returns focus to search or the invoking option without closing the picker. See [composition stories](../packages/react/src/SelectPanel/SelectPanel.composition.stories.tsx) for complete descriptors and nested details.

## Explicit actions and status

These controls act on their nearest root and forward button refs. Consumer handlers run before built-in behavior and can call `preventDefault()` to cancel it.

| Part                   | Effect                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `SubmitButton`         | Calls `onSubmit(selected)`, then requests close with `'submit'`. Default text: Save. Pass `variant="primary"` explicitly when wanted. |
| `CancelButton`         | Calls `onCancel()`, then requests close with `'cancel'`. Does not roll back selection itself.                                         |
| `CloseButton`          | Icon button; defaults to accessible name Close. Dismisses with `'close'`.                                                             |
| `BackButton`           | Dismisses with `'back'`; does not choose a navigation destination.                                                                    |
| `ClearSelectionButton` | Clears selection without closing.                                                                                                     |
| `ClearSearchButton`    | Clears the query and focuses mounted search without closing.                                                                          |

`Form` forwards native form props/ref and establishes a native submission boundary. Do not nest forms. Its `onSubmit(event)` may prevent root submission. Otherwise it prevents page navigation and submits root selection. `SubmitButton` uses native form submission/validation only when associated with its own `SelectPanel.Form`; outside that form it invokes root intent directly. Selection is not serialized automatically: supply named inputs or submit selected values yourself.

`Loading` and `Message` forward native `div` props/refs and announce visible content politely. Both support `size="full" | "inline"`; `hidden` suppresses presentation and announcement. `Loading` defaults to “Loading items...”. `Message` requires `variant="empty" | "error" | "warning"` and body children; full messages also require `title`. Optional `icon` and `action` provide application-owned decoration and recovery. These parts do not fetch, retry, filter, disable the root, or replace the collection.

## Keyboard and accessibility

| Location / key                                          | Behavior                                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Closed trigger: click, Enter, Space, ArrowDown, ArrowUp | Opens the overlay.                                                                         |
| Overlay opening                                         | Targets search when present; otherwise uses the dialog's focus fallback.                   |
| Search: ArrowDown / ArrowUp                             | Changes the active result, skips unavailable options, and wraps; search retains DOM focus. |
| Search: Enter                                           | Selects the active result once; prevents implicit form submission.                         |
| Search: Space, Home, End                                | Normal text editing.                                                                       |
| Search: Tab                                             | Leaves the combobox; options are not extra Tab stops.                                      |
| Roving options: ArrowDown / ArrowUp                     | Next/previous available option, wrapping.                                                  |
| Roving options: Home / PageUp, End / PageDown           | First or last available option.                                                            |
| Roving options: Enter / Space                           | Toggles selection.                                                                         |
| Overlay: Escape or outside click                        | Requests dismissal by default.                                                             |

The first available result is initially active while search is focused. Filtering preserves an available active result or activates the first remaining result. Empty results clear `aria-activedescendant`. Navigation does not select. Explicit roving search is a textbox: ArrowDown enters the collection and Enter only prevents implicit submission.

Consumers must provide accessible names, an appropriate heading level, a visible exit workflow, meaningful status feedback, and application-specific commit/rollback behavior. Nested panels should return focus to their invoker, with an application-chosen fallback if it disappears. A non-native overlay portaled outside a modal dialog is not automatically promoted into the top layer.

## Types and implementation boundaries

Public compound types include `SelectPanelValue`, `SelectPanelRootProps`, `SelectPanelTriggerProps`, `SelectPanelOverlayProps`, `SelectPanelSearchInputProps`, `SelectPanelOptionProps`, `SelectPanelItemAction`, `SelectPanelCloseButtonProps`, `SelectPanelFormProps`, `SelectPanelLoadingProps`, `SelectPanelMessageProps`, `SelectPanelOpenChangeReason`, and `SelectPanelDismissReason`. Other part props can be described with `React.ComponentProps<typeof SelectPanel.PartName>`.

`SelectPanelProps`, `SelectPanelItemProps`, `SelectPanelItemInput`, and `SelectPanelGroupedListProps` remain configured-API types. Use **`SelectPanelOptionProps`** for the compound item.

Internal contexts, state hooks, and collection/focus helpers are not public extension points. The fixed-height virtualization adapter is an internal story experiment, not a public `List` API. No Base UI dependency is introduced.

- [Exports and public types](../packages/react/src/SelectPanel/index.ts)
- [State and callbacks](../packages/react/src/SelectPanel/useSelectPanel.ts)
- [Presentational parts](../packages/react/src/SelectPanel/SelectPanelParts.tsx)
- [Overlay contract](../packages/react/src/SelectPanel/SelectPanelOverlay.tsx)
- [Actions and forms](../packages/react/src/SelectPanel/SelectPanelActions.tsx)
- [Messages](../packages/react/src/SelectPanel/SelectPanelMessage.tsx)
