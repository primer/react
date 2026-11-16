# SelectPanel

`SelectPanel` is a data-driven, filterable picker built with Base UI Combobox and Primer's Popover and Dialog primitives.

Import: `import {SelectPanel} from '@primer/react-tailwind/SelectPanel'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`SelectPanelProps` requires `items`, `selected`, and `onSelectedChange`. It supports anchored and modal presentation, controlled or uncontrolled visibility and filtering, external anchors, selected-option ordering, grouped items, dividers, inactive or disabled items, loading states, notices, custom messages, secondary actions, select-all, item renderers, virtualization, scroll-end loading, and sizing.

## Import and configuration

```tsx
import {SelectPanel} from '@primer/react-tailwind/SelectPanel'
import type {SelectPanelItem} from '@primer/react-tailwind/SelectPanel'
import {useState} from 'react'

const items: SelectPanelItem[] = [
  {id: 'bug', text: 'Bug'},
  {id: 'enhancement', text: 'Enhancement'},
]

function LabelPicker() {
  const [selected, setSelected] = useState<SelectPanelItem[]>([])
  return (
    <SelectPanel
      items={items}
      selected={selected}
      onSelectedChange={setSelected}
      selectionVariant="multiple"
      title="Labels"
      inputLabel="Filter labels"
      placeholder="Select labels"
    />
  )
}
```

Use the configured component for the supported picker pattern. `SelectPanel` intentionally does not expose partial Popover or Combobox subcomponents: that would leave consumers without the matching Combobox root, input, list, selection, and dismissal context. For a wholly custom composition, use this package's `Popover`, `Dialog`, and `ActionList` with `Combobox` from `@base-ui/react/combobox`.

`SelectPanel.SecondaryActionButton`, `SelectPanel.SecondaryActionLink`, and `SelectPanel.Message` are the supported presentational helpers for the configured API.

## Controlled and uncontrolled

Selection is controlled by `selected` and `onSelectedChange`; visibility uses `open`/`onOpenChange` or `defaultOpen`; search uses `filterValue`/`onFilterChange` or `defaultFilterValue`. When `filterValue` or `onFilterChange` is provided, `items` is the consumer-filtered collection for remote or fuzzy search; otherwise SelectPanel filters simple text locally. Selected values remain selected even when their items are outside the current filtered `items` collection. Item IDs are type-sensitive, so numeric `1` and string `'1'` remain separate; id-less items use object identity.

The shape of `selected` sets the selection mode. A single item or `undefined` is a single selection, and `onSelectedChange` receives one item or `undefined`. An array, including `[]` when nothing is selected, is a multiple selection, and `onSelectedChange` receives an array. `selectionVariant` is optional and must agree with that shape. TypeScript infers your item type from `items` and `selected`, so callbacks and `renderItem` keep custom fields without assertions. When the mode is decided at runtime, pass a mode-specific set of `selected` and `onSelectedChange` props rather than a value that might be either shape.

For a controlled panel, a close request leaves the panel open when the owner retains `open={true}`. A single-select modal keeps its draft until the panel actually closes. `onCancel` and `onOpenChange` report the request, even if the owner declines it.

The forwarded ref and `overlayProps` target the popup or dialog element. `renderAnchor` receives the current label as `children` and an optional `id`; return one trigger element that accepts a ref and forwards its props. The panel attaches its trigger behavior to that element, so a fragment containing multiple elements is not supported. Render extra descriptions alongside the panel and reference them from the trigger with `aria-describedby`. `renderAnchor={null}` requires `anchorRef` and attaches the panel to an external trigger. `renderGroup` wraps every configured group unless that group's `groupMetadata[].renderGroup` overrides it.

For an internally rendered non-button anchor, pass `anchorProps={{nativeButton: false}}`. When the anchor is an `ActionMenu.Item`, also pass `role: 'menuitem'` in `anchorProps` and `closeOnClick={false}` to the item to preserve its menu semantics while the panel is open.

Set `overlayProps.container` to an element or shadow root to portal the panel into a specific location, such as a portal root inside a focus-trapped dialog. Pass `null` while the container is unavailable; `portal: false` renders the panel in place instead.

When a panel opens as a dialog from another Primer floating surface, its backdrop and viewport use the popover layer to stay above the parent in the normal nested portal. The host must provide Primer's stacking tokens. Custom containers, ancestor stacking contexts, and inline rendering can still change stacking or clip the panel; check pointer hit testing, nested overlays, focus, Escape, and return focus in the host. Raising only `overlayProps.positionerClassName` can leave a deeper popover behind the viewport.

On narrow viewports, an anchored panel stays anchored by default. Enable `primer_react_select_panel_fullscreen_on_narrow` through this package's `FeatureFlags` provider to use the fullscreen dialog, and set `disableFullscreenOnNarrow` to opt an individual panel out. The `@primer/react-tailwind` and `@primer/react` providers are separate: when migrating incrementally, pass the same flag value to both providers.

In a fullscreen multi-select, supplying `onCancel` shows separate Cancel and Save buttons; without it, the panel shows Save and close. A fullscreen single-select has a header close button and selects immediately, while `variant="modal"` always has Cancel and Save. Multi-select calls `onSelectedChange` as options change, so the owner must restore its previous selection in `onCancel` if cancellation should undo those changes. `secondaryAction` adds to the footer without replacing these controls.

Selected options stay in their original order by default. Enable `primer_react_select_panel_order_selected_at_top` to show selected options first; `showSelectedOptionsFirst={false}` opts out. The selected-first order is captured when the panel opens, when an empty item collection is populated, and when the filter is cleared, so choosing an option does not move it under the user. Forward this flag to both packages' `FeatureFlags` providers during an incremental migration.

Set `virtualized` for long collections whose items use a string `text` or noninteractive `children`, with an optional leading visual. For custom children, put their searchable text in the children or set `filterValue`; supply an accessible name when the content does not provide one. Use phrasing content such as `<span>` inside a label, keep text visible as it reflows, and hide decorative visuals from assistive technology. Visible rows are measured so labels can wrap. Grouped items, descriptions, inactive states, trailing visuals, item-specific styles, and custom renderers use normal rendering instead. Keep option content noninteractive: virtualization unmounts rows outside the visible window.

Virtualized pickers require accessibility-specialist review and current VoiceOver/Safari and NVDA/Chrome testing before release. Check option counts, active and selected items, filtering, and empty-result announcements; automated ARIA checks do not establish what is announced.

## Accessibility, forms, and keyboard

The trigger has a button name from selected content, placeholder, or title. The filter input uses the normal input background, is named by `inputLabel` or placeholder text, and references the list with `aria-controls` only while the list is rendered. The list uses `actionListProps['aria-label']`, `aria-label`, or the string title. The option name includes its label and trailing visual, with or without a description; leading visuals, including avatar `alt` text, are not part of the name. Item descriptions and inactive reasons are exposed separately as descriptions. Mark decorative visuals as hidden from assistive technology. For custom markup returned by `renderItem`, use an `ActionList.Item` with `ActionList.Description` parts or supply the option's accessible name and description references on the item. Base UI owns active descendants, disabled options, Escape and outside dismissal, focus restoration, portals, collision-aware placement, and option semantics. Arrow keys navigate and Enter selects. When a highlighted option is taller than the list viewport, Page Up and Page Down scroll within it while focus stays on the filter. Modal and fullscreen panels lock document scrolling, focus the filter, provide the actions described above, and restore focus to their trigger. The component is not a native form field; model submitted values in application state.

When a panel is inside `FormControl`, its label, descriptions, validation state, and disabled state apply to an internally rendered trigger. A required field is announced as a trigger description because buttons do not support `aria-required`. When using an external anchor, connect it to the field yourself. Popup controls, including the filter, select-all checkbox, and custom content, do not inherit those field properties. Use `textInputProps` to set the filter's own accessible name, description, or form attributes.

Message presets use `role="status"`, or `role="alert"` for errors. If your application announces results separately, set `role: 'none'` on a configured `message` or `role="none"` on `SelectPanel.Message`. This removes the message's live-region role without hiding its text or actions from assistive technology.

The empty-message preset includes a decorative search icon by default, unlike the legacy icon-free empty message. Omitting `icon` does not hide it. Pass custom React content through `message` for an icon-free presentation, and choose its announcement behavior explicitly. The migration notes include an example.

## Compatibility overlays and inline creation

Create forms and interactive messages belong outside the listbox and its options. The configured `message` replaces the options outside the listbox; a custom adapter must preserve that structure and supply its own form associations and announcement policy.

A consumer using Base UI 1.8 Popover reports that unmounting a focused inline-create form can queue popup fallback focus after a `requestAnimationFrame` filter-focus restoration. Its compatibility layer restores the visible filter in a layout effect after closing the form. This is an integration-specific remedy, not a package-wide focus guarantee; verify keyboard navigation, create/cancel, dismissal, and reopening in the owning application without disabling trapping.

Legacy host `.p-6`, `.px-6`, `.py-8`, and `.gap-2` utilities with `!important` overrode popup/message geometry while package utilities were unprefixed. Package-owned utilities now use the `primer:` prefix, so those selectors no longer match them, but cascade alongside host CSS is not yet verified; mixed installations should keep scoped adapter overrides and computed-style checks. Unprefixed classes you pass through `className` props remain subject to host CSS.

## Custom modal pickers

The configured single-select modal uses a draft and a Save/Cancel footer; `inputLabel` provides an accessible name but not a visible label. It cannot combine instant modal selection, a visible filter label, and different return-focus targets for selection and cancellation. For that pattern, compose a controlled `Dialog` with Base UI `Combobox`, a visibly labelled `TextInput`, and `ActionList` presentation. Keep the dialog open until asynchronous selection succeeds, and choose a tabbable `finalFocus` target based on the action that actually closes it. Base UI may focus a tabbable descendant instead of an exact `tabIndex={-1}` container; see the [Dialog guide](./Dialog.md) before relying on that target.

## Events and state attributes

`onSelectedChange` receives Base UI selection details when an option causes the change. An item's `onAction(item, event, details)` receives the React click event used for activation and `details.sourceEvent`, the original keyboard or click event. Use `event.preventDefault()` to cancel selection; inspect `details.sourceEvent` to distinguish Enter from a click. `onOpenChange` receives a stable SelectPanel gesture (`anchor-click`, `anchor-key-press`, `click-outside`, `escape`, `selection`, or `cancel`); focus leaving the panel is also reported as `click-outside`. In a narrow fullscreen multi-select, Save and Save and close report `click-outside` to match the legacy picker. `onFilterChange` receives Base UI input details. Stable selectors include `SelectPanel`, `.Content`, `.Header`, `.Title`, `.Subtitle`, `.Filter`, `.List`, `.Item`, `.GroupHeading`, `.Notice`, `.Message`, and `.Footer`; options expose Base UI selection, highlight, and disabled state attributes.

## Props

- `actionListProps`: `SelectPanelActionListProps` — Extra props forwarded to the underlying list.
- `align`: `Align` — Default `'start'`. Alignment of the panel along the anchor's edge.
- `anchorId`: `string` — Id of the element the panel is anchored to.
- `anchorProps`: `Pick<Omit<Omit<PopoverTriggerProps, "ref"> & RefAttributes<HTMLElement>, "ref">, "nativeButton" | "role">` — Not supported when the anchor is rendered externally. Configure a custom anchor's element and, when needed, its role inside a composite widget.
- `anchorRef`: `RefObject<HTMLElement | null>` — Ref to your own anchor element, when you render the anchor yourself. Ref to the anchor element the panel renders.
- `aria-label`: `string` — Accessible name for the panel.
- `className`: `string`
- `cssAnchorPositioningSettings`: `{ fallbackStrategy?: "default" | "none" | "opposite-side" | undefined; }` — How the panel falls back when CSS anchor positioning cannot place it.
- `defaultFilterValue`: `string` — Default `''`. Initial filter query when the panel owns its own state.
- `defaultOpen`: `boolean` — Default `false`. Whether the panel starts open when it owns its own state.
- `disableFullscreenOnNarrow`: `boolean` — Default `false`. Keeps the panel anchored on narrow viewports when the fullscreen feature flag is enabled.
- `disableSelectOnHover`: `boolean` — Default `false`. Stops hovering an option from making it the active descendant.
- `displayInViewport`: `boolean` — Default `false`. Keeps the panel within the viewport rather than its nearest scrolling ancestor.
- `filterValue`: `string` — Controls the filter query. Supply it with `onFilterChange` to own the state.
- `focusOutBehavior`: `"start" | "stop" | "wrap"` — Default `'wrap'`. Whether keyboard navigation stops or wraps at the first and last option.
- `focusPrependedElements`: `boolean` — Default `false`. Enables automatic highlighting as the filter changes; it does not re-highlight items prepended to an unchanged filter.
- `groupMetadata`: `readonly SelectPanelGroupMetadata[]` — Group headers, matched to options by their group id.
- `height`: `OverlayHeight` — Height of the panel.
- `id`: `string` — Identifier for the panel, used to associate it with its anchor.
- `initialLoadingType`: `"skeleton" | "spinner"` — Default `'spinner'`. Which affordance the first load shows.
- `inputLabel`: `string` — Accessible name for the filter input.
- `items` (required): `readonly TItem[]` — Options to choose from.
- `loading`: `boolean` — Default `false`. Shows a loading affordance in place of the options.
- `message`: `SelectPanelMessage | React.ReactNode` — Content shown in place of the options, for an error or other terminal state.
- `notice`: `SelectPanelNotice` — Banner shown above the options, for a warning that does not replace them.
- `onActiveDescendantChanged`: `((current: HTMLElement | undefined, previous: HTMLElement | undefined, directlyActivated: boolean) => void)` — Called when keyboard focus moves to a different option.
- `onCancel`: `(() => void) | (() => void)` — Called when the panel is dismissed without a selection. Called when the panel is dismissed without a selection. Required for a modal panel.
- `onFilterChange`: `((filter: string, details: ChangeEventDetails) => void)` — Called with the new query whenever the filter input changes.
- `onOpenChange`: `((open: boolean, gesture: SelectPanelOpenChangeGesture) => void)` — Called when the panel opens or closes, with the gesture that caused it.
- `onScrollEnd`: `(() => void)` — Called when the options are scrolled to the end, for loading another page.
- `onSelectedChange` (required): `((selected: TItem | TSelectedItem | undefined, details?: ChangeEventDetails | undefined) => void) | ((selected: (TItem | TSelectedItem)[], details?: ChangeEventDetails | undefined) => void)` — Called with the new selection: one option or `undefined` for single selection, or an array for multiple selection.
- `open`: `boolean` — Controls whether the panel is open. Supply it with `onOpenChange` to own the state.
- `overlayProps`: `SelectPanelOverlayProps` — Size and positioning of the panel overlay.
- `placeholder`: `string` — Text shown on the anchor when nothing is selected.
- `placeholderText`: `string` — Default `'Filter items'`. Placeholder shown in the filter input.
- `renderAnchor`: `((props: SelectPanelAnchorProps) => React.ReactElement) | null` — Set to null when the anchor is rendered outside the panel and referenced by `anchorRef`. Returns one ref-capable trigger element; the panel attaches its trigger behavior to that element.
- `renderGroup`: `SelectPanelRenderGroup` — Renders each group yourself.
- `renderItem`: `SelectPanelRenderItem<TItem>` — Renders each option yourself.
- `scrollContainerRef`: `Ref<HTMLDivElement>` — Ref to the scrolling options container.
- `secondaryAction`: `React.ReactElement` — Extra control shown in the panel's footer.
- `selected` (required): `TSelectedItem | readonly TSelectedItem[] | undefined` — Currently selected option or options: one option or `undefined` for single selection, or an array (`[]` when empty) for multiple selection.
- `selectionVariant`: `"multiple" | "single"` — Selection mode. Defaults to `'multiple'` when `selected` is an array and `'single'` otherwise; when set, it must match the shape of `selected`.
- `setInitialFocus`: `boolean` — Default `false`. Suppresses filter-change highlighting unless focusPrependedElements is enabled. Initial item highlighting is not yet supported.
- `showItemDividers`: `boolean` — Default `false`. Draws a divider between options.
- `showSelectAll`: `boolean` — Default `false`. Shows a control that selects or clears every option at once.
- `showSelectedOptionsFirst`: `boolean` — Default `true`. Moves selected options to the top when the selected-option ordering feature flag is enabled.
- `subtitle`: `React.ReactNode` — Supporting text shown below the title.
- `textInputProps`: `Partial<Omit<TextInputProps, "defaultValue" | "onChange" | "value">>` — Extra props forwarded to the filter input.
- `title`: `React.ReactNode` — Heading shown at the top of the panel.
- `variant`: `"anchored" | "modal"` — Default `'anchored'`. How the panel presents itself. `anchored` attaches it to its anchor. How the panel presents itself. `modal` presents it over the page and requires `onCancel`.
- `virtualized`: `boolean` — Default `false`. Renders only visible options for supported text or noninteractive label content.
- `width`: `OverlayWidth` — Width of the panel.

## SelectPanel.Message

- `action`: `React.ReactNode`
- `body`: `React.ReactNode`
- `className`: `string`
- `icon`: `React.ElementType`
- `role`: `AriaRole` — Defaults to `status`, or `alert` for errors. Use `none` when announcements are handled separately.
- `title` (required): `React.ReactNode`
- `variant`: `"empty" | "error" | "warning"` — Default `'empty'`.

## SelectPanel.SecondaryActionButton

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Default `true`. Stretches the button to fill the width of its container.
- `children`: `React.ReactNode`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Loading status text. Set to an empty string when an external announcer communicates loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `type`: `"button" | "reset" | "submit"` — Default `'button'`. Native button behavior. Use `submit` to submit a form.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## SelectPanel.SecondaryActionLink

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `alignContent`: `"center" | "start"` — Default `'center'`. Whether the label sits centred or hugs the start edge when visuals are present.
- `children`: `React.ReactNode`
- `count`: `string | number` — Number shown in a trailing counter.
- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Default `false`. Removes the link from the keyboard order and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `href` (required): `string` — URL the secondary action navigates to.
- `inactive`: `boolean` — Marks the link temporarily unavailable while keeping it focusable.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Default `false`. Replaces the leading visual with a spinner and suppresses ordinary click activation. Its `href` remains available to browser actions such as opening the link from a context menu.
- `loadingAnnouncement`: `string` — Default `'Loading'`. Loading status text. Set to an empty string when an external announcer communicates loading.
- `onClick`: `MouseEventHandler<HTMLAnchorElement>` — Called when the link is activated.
- `render`: `RenderProp<LinkButtonState>` — Renders the link as your own element, for a router link that still needs button styling.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the link.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.

## Differences from `@primer/react`

- `onOpenChange(open, gesture)` reports the gesture that caused the change rather than Base UI change details. Narrow-screen fullscreen is gated by `primer_react_select_panel_fullscreen_on_narrow`, which defaults to `false`; `disableFullscreenOnNarrow` opts out when the flag is enabled. This package's `FeatureFlags` provider has a separate context from `@primer/react`, so forward the same flag value when migrating incrementally.
- Selected-first ordering is gated by `primer_react_select_panel_order_selected_at_top`, which also defaults to `false`; forward it to both packages' providers. When enabled, `showSelectedOptionsFirst` snapshots selection on open, when an empty list is populated, and when the filter is cleared.
- Use `renderAnchor={null}` with `anchorRef` for an external trigger; this configuration is type-checked. The default anchor is a `Button` whose `TriangleDownIcon` is a `trailingAction`, matching upstream.
- Replace the legacy no-trigger pattern `renderAnchor={() => <></>}` with `renderAnchor={null}`, keeping `anchorRef` and controlled `open`/`onOpenChange`. An empty fragment is not a trigger: it cannot receive Base UI's props or ref and does not select external-anchor positioning.
- `renderAnchor` must return one ref-capable trigger element that forwards props, not a fragment. Move extra content outside the panel and reference descriptions with `aria-describedby`; the callback receives the label and optional ID, while the panel attaches trigger behavior to the returned element.
- **Composite-anchor migration gap:** legacy `renderAnchor(props)` could return a wrapper containing a button and forward its received behavior/ref to that nested control. The configured Tailwind callback currently receives only `children` and `id`; its returned top-level element becomes the Popover or Dialog trigger through `render={element}`. Returning `<span><button /></span>` therefore targets the span, not the button. Setting `anchorProps.nativeButton={false}` only changes the trigger's element contract; it does not relocate props, focus, or the ref to the nested button.
  - A custom returned component must forward the trigger's injected DOM props and ref to the actual control, not its wrapper. Do not assume a ref-capable wrapper itself meets that contract. The configured callback has no render-function path that hands all merged trigger props/ref directly to the consumer; assess that compatibility API separately, including modal presentation, enclosing FormControl attributes, disabled state, and external positioning refs.
  - In a lower-level compatibility adapter, use the public Base UI Trigger `render` callback to pass its supplied props and ref to the actual control inside the consumer's composite anchor. Preserve Base UI's event, ARIA, and ref composition rather than cloning the callback's wrapper or searching its private DOM for a button. The host reports five issue-metadata suites passing (50 tests), including project single-select, multi-select, iteration selection, and optimistic updates, with this path and a compatible direct-button path. This is host-reported evidence for those adapters, not coverage of every custom anchor or a new capability of the configured SelectPanel.
- When `renderAnchor` returns a non-button element, set `anchorProps.nativeButton` to `false`. For an `ActionMenu.Item`, also preserve `role: 'menuitem'` on `anchorProps` and use `closeOnClick={false}` on the item.
- Use `overlayProps` for popup and dialog DOM props, sizing, `side`, `alignOffset`, `sideOffset`, collision boundaries, `container` for an explicit portal destination, and `portal={false}` to keep the panel in place. Use `align`, `displayInViewport`, and `cssAnchorPositioningSettings` on SelectPanel for the remaining positioning controls. The configured component does not expose a placement-change callback.
- Resolve named portal registries to a DOM container and pass it as `overlayProps.container`. Without one, nested panels inherit the owning Primer Base UI portal; otherwise the default is the nearest `BaseStyles` portal root, then the first document portal root, then `document.body`.
- **Nested dialog stacking:** A fullscreen or modal panel opened inside another Primer floating portal uses the popover layer for both its backdrop and viewport. With standard host stacking tokens and the inherited portal, Chromium checks covered child selection, a deeper popover and modal, Escape, focus return, and both default and named parent roots. The older `afdf7e9` canary lacks this fix; its host adapter reports success assigning the popover layer to both parts. `overlayProps.positionerClassName` affects only the viewport, so raising it alone can put a deeper popover underneath. `portal={false}` can clip a fullscreen child; explicit containers, custom z-indexes, host stacking contexts, and separate focus traps need their own verification. This is not a general overlay-stack guarantee.
- The configured panel focuses its filter on open and restores focus to `anchorRef` or the trigger on close. It does not expose independent initial- or final-focus props; compose the lower-level Popover or Dialog when those controls are required.
- A single-select modal defers selection to Save and always renders a Save/Cancel footer; `inputLabel` names the filter but does not render a visible label. For instant selection, a visible filter label, or distinct selection/cancel return-focus targets, compose the package Dialog or Popover with Base UI Combobox. Base UI's `finalFocus` cannot force an exact non-tabbable container containing tabbable descendants.
- In a controlled panel, keeping `open` true declines a close request and preserves a single-select modal's draft. `onCancel` and `onOpenChange` are request callbacks and can run even when the owner keeps the panel open.
- Item callbacks receive `SelectPanelItem`, not a consumer generic. Retain a typed lookup of source items by their stable `id` and resolve callback values through that lookup, handling missing IDs explicitly; id-less items use object identity.
- Item `onAction` receives a React click event even for keyboard activation. Inspect the third argument's `sourceEvent` to identify the original `KeyboardEvent`, and call `preventDefault()` on the React event to cancel selection.
- Message presets announce through `status` or `alert` by default. Set `role: 'none'` on a configured message or `role="none"` on `SelectPanel.Message` when a separate live region owns the announcement.
- `SelectPanel.Message` accepts its supporting content as `body`, not children: replace `<SelectPanel.Message title="No results">Try another search</SelectPanel.Message>` with `<SelectPanel.Message title="No results" body="Try another search" />`.
- **Parity gap:** With the default `setInitialFocus={false}`, the first option is not highlighted on open, so the first ArrowDown highlights it instead of the second option. `focusPrependedElements` enables Base UI's filter-change auto-highlighting but does not reliably highlight the first enabled option when items are prepended without changing the filter. Base UI does not currently expose an always-highlight mode for Combobox ([upstream issue](https://github.com/mui/base-ui/issues/4188)). Use a focused alternative composition for flows that depend on these behaviors until they are supported.
- Default item descriptions, `ActionList.Description` parts, and inactive reasons are exposed as option descriptions. Arbitrary custom renderers must supply appropriate `aria-label`/`aria-labelledby` and `aria-describedby` references on the item.
- Use `onScrollEnd` or `scrollContainerRef` for incremental loading. Set `virtualized` for string `text` or noninteractive searchable `children`, with an optional leading visual; set `filterValue` when text cannot be derived from the children. Rows are measured so labels can wrap. Descriptions, inactive rows, trailing visuals, item-specific styles, and custom renderers fall back to normal rendering, and grouped lists stay fully rendered to preserve group semantics.
- Automated axe checks can flag `scrollable-region-focusable` on the virtualized list. Focus stays on the combobox; Arrow keys navigate options and Page Up/Down reveal content within a highlighted option taller than the viewport. This interaction still requires assistive-technology and accessibility-specialist review.
- Use list-level `renderGroup` to wrap every group; `groupMetadata[].renderGroup` wins for an individual group.
- `footer` is excluded because it is deprecated upstream in favor of `secondaryAction`.
- **Fullscreen footer migration:** on a narrow fullscreen viewport, anchored multi-select with `onCancel` has separate Cancel and Save controls; without `onCancel`, it has Save and close and no header close icon. Fullscreen single-select uses the header's **Cancel and close** icon and has no automatic footer. `variant="modal"` always has Cancel and Save. Multi-select changes are delivered immediately; the owner must restore the previous selection in `onCancel` if cancellation should undo them. A controlled owner can decline a close request by keeping `open` true.
- **Fullscreen close gesture:** Save and Save and close report `click-outside` through `onOpenChange`, matching the legacy fullscreen buttons. Modal Save reports `selection`. The configured Tailwind picker does not accept the deprecated `footer` prop: unlike a truthy legacy `footer`, `secondaryAction` adds to the footer without replacing its generated controls. Compose the package Dialog or Popover with Base UI Combobox if a fully consumer-owned footer is required.
- The filter input uses the normal input background. Upstream's `primer_react_select_panel_legacy_contrast` flag and the `contrast` input prop it relies on are deprecated, so the `LegacyContrast` story is intentionally not paired.
- The filter input is named when it first receives focus, and `aria-controls` references the list only while the list is rendered, so it is absent for loading and message states. Base UI provides both behaviours.
- **Policy gap:** Base UI's combobox uses `aria-controls` and `aria-autocomplete` as described by the WAI-ARIA combobox pattern, while current GitHub accessibility guidance prohibits both. Resolve the conflict and review assistive-technology support with a specialist before release.
- An enclosing `FormControl` labels and describes an internally rendered trigger and applies its disabled and validation states, not those of independent popup controls. Connect an external anchor to the field yourself. Set the filter's own attributes through `textInputProps`.
- Upstream's rendering-performance memoization and its fix for virtualized row measurement warnings have no direct equivalent here: the React Compiler handles memoization, and the panel measures virtualized rows while Base UI owns collection navigation.
- Legacy styled-system and `sx` props are unsupported.
- **Consumer-owned inline-create focus:** a compatibility picker using Base UI 1.8 Popover can queue popup fallback focus when its focused inline-create form unmounts. A consumer reports that this fallback can run after a `requestAnimationFrame` restoration and steal focus from the filter. Its label and milestone adapters restore the still-visible filter in a layout effect after the form closes, preserving popup trapping and dismissal. This is an adapter-specific result, not a demonstrated regression or universal timing guarantee for this package's configured SelectPanel. Keep the target mounted and visible, and cover create/cancel, keyboard navigation, Escape, and repeated reopening in the actual integration.
- **Compatibility-overlay dismissal gap:** Base UI 1.8 nonmodal Popover can suppress eventual return focus after a canceled `focus-out`, even when the filter is focused again and `finalFocus` is explicit. This is independently reproduced for a lower-level Popover adapter, not established for the configured SelectPanel. The Popover alignment guide describes the tested application-owned closing-focus alternative and separate dialog handoff; legacy `ignoreClickRefs` or custom `onClickOutside` cancellation alone is not a complete focus-restoration contract.
- **Interactive messages:** keep create forms, retry buttons, and other interactive message content outside the listbox and option markup. The configured `message` replaces the options and is rendered outside the listbox; custom compatibility overlays must establish the same separation themselves. The consumer uses a non-live `role="none"` message rather than a status region when announcements are owned elsewhere. Removing a live-region role does not hide controls or resolve announcement policy by itself; retain accessible names, error associations, and explicit application-owned announcements where required.
- **Host CSS collision:** legacy `.p-6`, `.px-6`, `.py-8`, and `.gap-2` rules with `!important` overrode the popup, loading, and message geometry while package utilities were unprefixed. Package-owned utilities now use the `primer:` prefix (for example `primer:p-6`), so these class selectors no longer match them, but the prefixed stylesheet's emission and cascade alongside host CSS are not yet verified. Keep any compatibility overrides scoped to the owning adapter and verify computed insets and gaps in the host application.
- **Intentional difference — empty-message icon:** the empty-message preset adds a decorative search icon when `icon` is omitted; the legacy empty message had no icon unless supplied. The preset does not expose an icon-hiding boolean, and `icon={undefined}` selects the default rather than hiding it. For icon-free legacy presentation, pass custom React content through `message` instead of the preset or `SelectPanel.Message`:

  ```tsx
  const emptyMessage = (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center text-sm">
      <strong>No matching labels</strong>
      <p className="text-muted">Try another search.</p>
    </div>
  )
  ```

  Pass `message={emptyMessage}` when the application chooses to replace the options. This custom content has no automatic announcement role; choose announcement behavior deliberately. Custom classes still need host CSS collision review, and interactive content must remain outside options.
