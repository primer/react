# SelectPanel

`SelectPanel` is a data-driven, filterable picker built with Base UI Combobox and Primer's Popover and Dialog primitives.

Import: `import {SelectPanel} from '@primer/react-tailwind/SelectPanel'`

## Props

- `actionListProps`: `SelectPanelActionListProps` — Extra props forwarded to the underlying list.
- `align`: `Align` — Default `'start'`. Alignment of the panel along the anchor's edge.
- `anchorId`: `string` — Id of the element the panel is anchored to.
- `anchorRef`: `RefObject<HTMLElement | null>` — Ref to your own anchor element, when you render the anchor yourself. Ref to the anchor element the panel renders.
- `aria-label`: `string` — Accessible name for the panel.
- `className`: `string`
- `cssAnchorPositioningSettings`: `{ fallbackStrategy?: "default" | "none" | "opposite-side" | undefined; }` — How the panel falls back when CSS anchor positioning cannot place it.
- `defaultFilterValue`: `string` — Default `''`. Initial filter query when the panel owns its own state.
- `defaultOpen`: `boolean` — Default `false`. Whether the panel starts open when it owns its own state.
- `disableFullscreenOnNarrow`: `boolean` — Default `false`. Keeps the panel anchored on narrow viewports instead of filling the screen.
- `disableSelectOnHover`: `boolean` — Default `false`. Stops hovering an option from making it the active descendant.
- `displayInViewport`: `boolean` — Default `false`. Keeps the panel within the viewport rather than its nearest scrolling ancestor.
- `filterValue`: `string` — Controls the filter query. Supply it with `onFilterChange` to own the state.
- `focusOutBehavior`: `"start" | "stop" | "wrap"` — Default `'wrap'`. Whether keyboard navigation stops or wraps at the first and last option.
- `focusPrependedElements`: `boolean` — Default `false`. Includes elements rendered before the list in the keyboard focus order.
- `groupMetadata`: `readonly SelectPanelGroupMetadata[]` — Group headers, matched to options by their group id.
- `height`: `OverlayHeight` — Height of the panel.
- `id`: `string` — Identifier for the panel, used to associate it with its anchor.
- `initialLoadingType`: `"skeleton" | "spinner"` — Default `'spinner'`. Which affordance the first load shows.
- `inputLabel`: `string` — Accessible name for the filter input.
- `items`: `readonly SelectPanelItem[]` — Options to choose from.
- `loading`: `boolean` — Default `false`. Shows a loading affordance in place of the options.
- `message`: `SelectPanelMessage | React.ReactNode` — Content shown in place of the options, for an error or other terminal state.
- `notice`: `SelectPanelNotice` — Banner shown above the options, for a warning that does not replace them.
- `onActiveDescendantChanged`: `((current: HTMLElement | undefined, previous: HTMLElement | undefined, directlyActivated: boolean) => void)` — Called when keyboard focus moves to a different option.
- `onCancel`: `(() => void) | (() => void)` — Called when the panel is dismissed without a selection. Called when the panel is dismissed without a selection. Required for a modal panel.
- `onFilterChange`: `((filter: string, details: ChangeEventDetails) => void)` — Called with the new query whenever the filter input changes.
- `onOpenChange`: `((open: boolean, gesture: SelectPanelOpenChangeGesture) => void)` — Called when the panel opens or closes, with the gesture that caused it.
- `onScrollEnd`: `(() => void)` — Called when the options are scrolled to the end, for loading another page.
- `onSelectedChange`: `(selected: SelectPanelItem[] | SelectPanelItem | undefined, details?: ChangeEventDetails | undefined) => void` — Called with the new selection whenever it changes.
- `open`: `boolean` — Controls whether the panel is open. Supply it with `onOpenChange` to own the state.
- `overlayProps`: `SelectPanelOverlayProps` — Size and positioning of the panel overlay.
- `placeholder`: `string` — Text shown on the anchor when nothing is selected.
- `placeholderText`: `string` — Default `'Filter items'`. Placeholder shown in the filter input.
- `renderAnchor`: `((props: SelectPanelAnchorProps) => React.ReactElement) | null` — Set to null when the anchor is rendered outside the panel and referenced by `anchorRef`. Renders the anchor yourself, receiving the props that make it control the panel.
- `renderGroup`: `SelectPanelRenderGroup` — Renders each group yourself.
- `renderItem`: `SelectPanelRenderItem` — Renders each option yourself.
- `scrollContainerRef`: `Ref<HTMLDivElement>` — Ref to the scrolling options container.
- `secondaryAction`: `React.ReactElement` — Extra control shown in the panel's footer.
- `selected`: `readonly SelectPanelItem[] | SelectPanelItem | undefined` — Currently selected option or options.
- `selectionVariant`: `"multiple" | "single"` — Whether one option or several may be selected.
- `setInitialFocus`: `boolean` — Default `false`. Moves focus to the filter input when the panel opens.
- `showItemDividers`: `boolean` — Default `false`. Draws a divider between options.
- `showSelectAll`: `boolean` — Default `false`. Shows a control that selects or clears every option at once.
- `showSelectedOptionsFirst`: `boolean` — Default `true`. Moves selected options to the top of the list.
- `subtitle`: `React.ReactNode` — Supporting text shown below the title.
- `textInputProps`: `Partial<Omit<TextInputProps, "defaultValue" | "onChange" | "value">>` — Extra props forwarded to the filter input.
- `title`: `React.ReactNode` — Heading shown at the top of the panel.
- `variant`: `"anchored" | "modal"` — Default `'anchored'`. How the panel presents itself. `anchored` attaches it to its anchor. How the panel presents itself. `modal` presents it over the page and requires `onCancel`.
- `virtualized`: `boolean` — Default `false`. Renders only the visible options, for a long uniform list.
- `width`: `OverlayWidth` — Width of the panel.

## SelectPanel.Message

- `action`: `React.ReactNode`
- `body`: `React.ReactNode`
- `className`: `string`
- `icon`: `React.ElementType`
- `title`: `React.ReactNode`
- `variant`: `"empty" | "error" | "warning"` — Default `'empty'`.

## SelectPanel.SecondaryActionButton

Forwards unrecognized props to Base UI's [`Button`](https://base-ui.com/react/components/button#api-reference), so it also accepts that part's props.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `block`: `boolean` — Default `true`. Stretches the button to fill the width of its container.
- `children`: `React.ReactElement[]`
- `className`: `string`
- `count`: `string | number` — Number shown in a trailing counter, for a button that acts on a known quantity.
- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents activation and removes the button from the keyboard order.
- `inactive`: `boolean` — Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses activation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the button is loading.
- `notificationIndicator`: `"button" | "leadingVisual"` — Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the button.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron for a button that opens something.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.
- `variant`: `"danger" | "default" | "invisible" | "link" | "primary"` — Default `'default'`. Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.

## SelectPanel.SecondaryActionLink

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `alignContent`: `"center" | "start"` — Whether the label sits centred or hugs the start edge when visuals are present.
- `children`: `React.ReactElement[]`
- `count`: `string | number` — Number shown in a trailing counter.
- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `disabled`: `boolean` — Prevents navigation and removes the link from the keyboard order.
- `href`: `string` — URL the secondary action navigates to.
- `inactive`: `boolean` — Marks the link temporarily unavailable while keeping it focusable.
- `labelWrap`: `boolean` — Lets a long label wrap onto more than one line instead of being clipped.
- `leadingVisual`: `ButtonVisual` — Icon shown before the label.
- `loading`: `boolean` — Replaces the leading visual with a spinner and suppresses navigation.
- `loadingAnnouncement`: `string` — Text announced to assistive technology while the link is loading.
- `onClick`: `MouseEventHandler<HTMLAnchorElement>` — Called when the link is activated.
- `render`: `RenderProp<LinkButtonState>` — Renders the link as your own element, for a router link that still needs button styling.
- `size`: `ControlSize` — Default `'medium'`. Height and text size of the link.
- `trailingAction`: `ButtonVisual` — Icon shown at the far end, conventionally a chevron.
- `trailingVisual`: `ButtonVisual` — Icon shown after the label.

## Differences from `@primer/react`

- `onOpenChange(open, gesture)` reports the gesture that caused the change rather than Base UI change details, and `disableFullscreenOnNarrow` stays opt-out where `FilteredActionList` uses the opt-in `fullScreenOnNarrow`. Both keep upstream's contract.
