# Alignment

## From: `@primer/react`

Select is a native `<select>` component with `option` and `optgroup` children, a placeholder option, control sizes, block layout, validation presentation, and browser-owned select behavior.

## To: `@primer/react-tailwind`

Select uses the same native-select contract. `Select.Option` and `Select.OptGroup` are convenience wrappers for native elements that add Primer-owned `data-component` identifiers. Native children work identically. The visible wrapper owns Primer layout and state styling; the ref and all regular DOM attributes apply to the nested native `<select>`.

## Migration notes

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
