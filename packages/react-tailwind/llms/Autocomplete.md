# Autocomplete

`Autocomplete` is a composable Base UI autocomplete for filtering and choosing from a known set of options.

Import: `import {Autocomplete} from '@primer/react-tailwind/Autocomplete'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

The root forwards Base UI autocomplete props, including `items`, `value`, `onValueChange`, `defaultValue`, and `mode`. Input, content, list, item, group, empty, and status subcomponents each forward their Base UI props.

## Import and composition

```tsx
import {Autocomplete} from '@primer/react-tailwind/Autocomplete'
;<Autocomplete items={['React', 'TypeScript', 'CSS']}>
  <Autocomplete.Input aria-label="Technology" />
  <Autocomplete.Content>
    <Autocomplete.List>
      {(item: string) => (
        <Autocomplete.Item key={item} value={item}>
          {item}
        </Autocomplete.Item>
      )}
    </Autocomplete.List>
  </Autocomplete.Content>
</Autocomplete>
```

Compose `Input`, `Content`, `List`, and `Item` under the root. `Content` has `align`, `alignOffset`, `side`, `sideOffset`, `anchor`, `portal`, and `positionerClassName` options; set `portal={false}` to render the list in place. Use `Group`, `GroupLabel`, `Empty`, and `Status` for richer lists.

## Accessibility, forms, and validation

Give `Input` an accessible name. Base UI owns combobox and option relationships, filtering, active descendant updates, and disabled option semantics. Use external `FormControl` labels, captions, and validation when the input is part of a form.

With the input outside `Content`, Base UI can temporarily apply `aria-hidden` to sibling dialog controls while suggestions are open, including when `modal={false}` or `portal={false}`. A composition that keeps those controls exposed while preserving the popup's keyboard and selection behavior has not been established; seek accessibility review when that simultaneous access is required.

Use `Autocomplete` to choose values, not as a guaranteed way to present navigable link results. An `Item` rendered as an anchor still has the option role rather than an exposed link role, and its keyboard behavior is owned by the combobox. The [listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) does not provide an accessible interaction model for a list of interactive links. For results that need link semantics, consider an ordinary list of links or a separately reviewed grid or dialog pattern; this package does not currently document an input-owned link-results composition.

## Keyboard, events, and state

Arrow keys navigate options, Enter chooses the active option, and Escape closes the popup. `onValueChange` receives the updated value and details. Stable selectors include `Autocomplete.Input`, `Autocomplete.Content`, `Autocomplete.List`, `Autocomplete.Item`, and `Autocomplete.Positioner`; items expose `data-highlighted` and `data-disabled`.

Forwards unrecognized props to Base UI's [`Autocomplete.Root`](https://base-ui.com/react/components/autocomplete#root), so it also accepts that part's props.

## Autocomplete.Root

Forwards unrecognized props to Base UI's [`Autocomplete.Root`](https://base-ui.com/react/components/autocomplete#root), so it also accepts that part's props.

## Autocomplete.Input

Forwards unrecognized props to Base UI's [`Autocomplete.Input`](https://base-ui.com/react/components/autocomplete#input), so it also accepts that part's props.

- `block`: `boolean` — Stretches the input to fill the width of its container.
- `leadingVisual`: `TextInputVisual` — Icon or text shown inside the input, before the value.
- `loaderPosition`: `"auto" | "leading" | "trailing"` — Which end the spinner appears at, or `auto` to take the place of an existing visual.
- `loaderText`: `string` — Text included in the input's accessible description while loading.
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

## Differences from `@primer/react`

- Move legacy token, dialog, and TextInput integrations to composition with their local components.
- Use the documented value/default-value callback contract rather than legacy overlay state props.
- Set `portal={false}` on `Content` to render the list in place rather than at the end of the document; it still composes its positioner.
- Base UI's popup can hide sibling dialog controls from the accessibility tree while suggestions are open, even when `modal={false}` or `portal={false}`. A popup composition that retains their exposure and equivalent keyboard behavior remains unverified.
- Base UI supplies the input's `aria-autocomplete`, `aria-controls`, and active-descendant relationships. An `Item` rendered as an anchor is still exposed as an option, not a link; native link gestures and the accessibility of input-owned link results are not guaranteed by this composition. Applications with stricter policies or link-result requirements need a separately reviewed interaction pattern.
- `sx` and styled-system props are unsupported.
