# Autocomplete

`Autocomplete` is a composable Base UI autocomplete for filtering and choosing from a known set of options.

Import: `import {Autocomplete} from '@primer/react-tailwind/Autocomplete'`

Forwards unrecognized props to Base UI's [`Autocomplete.Root`](https://base-ui.com/react/components/autocomplete#root), so it also accepts that part's props.

## Autocomplete.Root

Forwards unrecognized props to Base UI's [`Autocomplete.Root`](https://base-ui.com/react/components/autocomplete#root), so it also accepts that part's props.

## Autocomplete.Input

Forwards unrecognized props to Base UI's [`Autocomplete.Input`](https://base-ui.com/react/components/autocomplete#input), so it also accepts that part's props.

- `block`: `boolean` — Stretches the input to fill the width of its container.
- `leadingVisual`: `TextInputVisual` — Icon or text shown inside the input, before the value.
- `loaderPosition`: `"auto" | "leading" | "trailing"` — Which end the spinner appears at, or `auto` to take the place of an existing visual.
- `loaderText`: `string` — Text announced to assistive technology while the input is loading.
- `loading`: `boolean` — Shows a spinner inside the input while a value is being resolved.
- `monospace`: `boolean` — Renders the value in a monospace face, for code or identifiers.
- `size`: `ControlSize` — Height and text size of the input.
- `trailingAction`: `React.ReactElement` — Interactive control shown at the end of the input, such as a clear button.
- `trailingVisual`: `TextInputVisual` — Icon or text shown inside the input, after the value.
- `validationStatus`: `"error" | "success"` — Marks the value invalid or confirmed, which sets the border colour and `aria-invalid`.

## Autocomplete.Trigger

Forwards unrecognized props to Base UI's [`Autocomplete.Trigger`](https://base-ui.com/react/components/autocomplete#trigger), so it also accepts that part's props.

## Autocomplete.InputGroup

Forwards unrecognized props to Base UI's [`Autocomplete.InputGroup`](https://base-ui.com/react/components/autocomplete#inputgroup), so it also accepts that part's props.

## Autocomplete.Content

Forwards unrecognized props to Base UI's [`Autocomplete.Popup`](https://base-ui.com/react/components/autocomplete#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'bottom'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.

## Autocomplete.Popup

Forwards unrecognized props to Base UI's [`Autocomplete.Popup`](https://base-ui.com/react/components/autocomplete#popup), so it also accepts that part's props.

- `align`: `FloatingAlignment` — Default `'start'`. Alignment of the content along the anchor's edge.
- `alignOffset`: `FloatingOffset` — Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes.
- `anchor`: `FloatingAnchor` — Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere.
- `portal`: `boolean` — Default `true`. Where the content is rendered in the DOM. Set `false` to keep it in place.
- `positionerClassName`: `string` — Classes applied to the element that positions the content.
- `side`: `FloatingSide` — Default `'bottom'`. Side of the anchor the content opens on.
- `sideOffset`: `FloatingOffset` — Default `4`. Distance in pixels between the content and its anchor, or a callback that computes it.

## Autocomplete.Positioner

Forwards unrecognized props to Base UI's [`Autocomplete.Positioner`](https://base-ui.com/react/components/autocomplete#positioner), so it also accepts that part's props.

## Autocomplete.Portal

Forwards unrecognized props to Base UI's [`Autocomplete.Portal`](https://base-ui.com/react/components/autocomplete#portal), so it also accepts that part's props.

## Autocomplete.List

Forwards unrecognized props to Base UI's [`Autocomplete.List`](https://base-ui.com/react/components/autocomplete#list), so it also accepts that part's props.

## Autocomplete.Item

Forwards unrecognized props to Base UI's [`Autocomplete.Item`](https://base-ui.com/react/components/autocomplete#item), so it also accepts that part's props.

## Autocomplete.Group

Forwards unrecognized props to Base UI's [`Autocomplete.Group`](https://base-ui.com/react/components/autocomplete#group), so it also accepts that part's props.

## Autocomplete.GroupLabel

Forwards unrecognized props to Base UI's [`Autocomplete.GroupLabel`](https://base-ui.com/react/components/autocomplete#grouplabel), so it also accepts that part's props.

## Autocomplete.Empty

Forwards unrecognized props to Base UI's [`Autocomplete.Empty`](https://base-ui.com/react/components/autocomplete#empty), so it also accepts that part's props.

## Autocomplete.Status

Forwards unrecognized props to Base UI's [`Autocomplete.Status`](https://base-ui.com/react/components/autocomplete#status), so it also accepts that part's props.

## Autocomplete.useFilter

Forwards unrecognized props to Base UI's [`Autocomplete.useFilter`](https://base-ui.com/react/components/autocomplete#usefilter), so it also accepts that part's props.

## Autocomplete.useFilteredItems

Forwards unrecognized props to Base UI's [`Autocomplete.useFilteredItems`](https://base-ui.com/react/components/autocomplete#usefiltereditems), so it also accepts that part's props.

## Differences from `@primer/react`

- Move legacy token, dialog, and TextInput integrations to composition with their local components.
