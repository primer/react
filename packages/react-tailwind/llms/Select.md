# Select

`Select` is a styled native `<select>` with Primer control tokens. Native browser behavior owns option menus, keyboard operation, focus, form association, and controlled or uncontrolled values.

Import: `import {Select} from '@primer/react-tailwind/Select'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`Select` accepts native select attributes including `name`, `value`, `defaultValue`, `onChange`, `required`, `disabled`, `multiple`, accessible-name attributes, and DOM event handlers. `block`, `size`, and `validationStatus` apply Primer presentation. The `className` applies to the visible control wrapper; other DOM props and the ref apply to the native `<select>`.

## Import and composition

```tsx
import Select from '@primer/react-tailwind/Select'

// Named imports are also supported.
import {Select} from '@primer/react-tailwind'
```

Use native `option` and `optgroup` elements, or `Select.Option` and `Select.OptGroup` when a stable Primer component identifier is useful. The children remain in authored order.

```tsx
<Select name="branch" placeholder="Choose a branch">
  <Select.OptGroup label="Active">
    <Select.Option value="main">main</Select.Option>
    <Select.Option value="release">release</Select.Option>
  </Select.OptGroup>
</Select>
```

## Controlled and uncontrolled

Use native `value`/`onChange` for controlled selection or `defaultValue` for uncontrolled selection. `multiple` uses the native listbox and submits each selected value under the control name; `placeholder` applies only to the single-select presentation.

## Accessibility, forms, and validation

Give the select an accessible name with a visible `<label>`, `FormControl.Label`, or `aria-label`. `FormControl` forwards its id, required, disabled, name, and description to Select. Set `validationStatus="error"` or `validationStatus="success"` to style an externally validated control; error status also sets `aria-invalid`.

Renders a [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `block`: `boolean` — Default `false`. Makes the visible control fill its container.
- `className`: `string` — Classes applied to the visible control wrapper.
- `placeholder`: `string` — Text rendered as an initially selected empty-value option.
- `size`: `ControlSize` — Primer control height and typography.
- `validationStatus`: `ValidationStatus` — Applies error or success control styling.

## Select.Option

Renders an [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Select.OptGroup

Renders an [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Replace `Select.Trigger`, `Value`, `Portal`, `Positioner`, `Popup`, `List`, `Item`, `Group`, and `GroupLabel` with `Select`, native options, and optgroups.
- Replace Base UI `onValueChange` with native `onChange`; read `event.currentTarget.value`, or `selectedOptions` for `multiple`.
- Use native `value`/`defaultValue`, `name`, `disabled`, `required`, and accessible-name attributes.
- Remove copied `Select.__SLOT__` assignments from custom wrappers; this package exposes no public slot marker and does not require one for FormControl context. A wrapper that renders the package `Select` and forwards its props/ref continues to consume `useFormControlForwardedProps` inside that Select, preserving the field's name, required/disabled state, caption/validation references, and ordinary native-label association. A wrapper around a raw native `<select>` must use the public forwarding hook itself.

  ```tsx
  import {forwardRef, type ComponentPropsWithoutRef} from 'react'
  import {FormControl, Select} from '@primer/react-tailwind'

  const StatusSelect = forwardRef<HTMLSelectElement, ComponentPropsWithoutRef<typeof Select>>(
    function StatusSelect(props, ref) {
      return (
        <Select {...props} ref={ref}>
          <Select.Option value="available">Available</Select.Option>
          <Select.Option value="busy">Busy</Select.Option>
        </Select>
      )
    },
  )

  <FormControl id="status">
    <FormControl.Label>Status</FormControl.Label>
    <StatusSelect defaultValue="available" />
    <FormControl.Caption>Choose your current status</FormControl.Caption>
  </FormControl>
  ```

  An explicit Select `id` overrides the field-generated ID. FormControl cannot discover a different ID hidden inside an arbitrary custom component; use the same explicit ID on FormControl and the rendered Select, or connect a native Label with matching `htmlFor`. Preserve caption/validation IDs and `aria-describedby` when forwarding props. For a nonnative Label, explicitly wire its ID through `aria-labelledby` instead of relying on `htmlFor`. Do not reintroduce a slot marker to work around an ID mismatch.

- `block`, `size`, `validationStatus`, and `placeholder` match the Primer Select API, which omits `contrast`. `multiple` remains available through the native select element and ignores the single-select-only `placeholder`.
- `sx`, styled-system props, Base UI popup/open props, and custom render props are unsupported. Use `className` on the visible wrapper and native DOM props on the select.
