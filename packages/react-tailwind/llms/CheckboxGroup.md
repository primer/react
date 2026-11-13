# CheckboxGroup

`CheckboxGroup` groups checkbox primitives and supplies their shared controlled or uncontrolled state.

Import: `import {CheckboxGroup} from '@primer/react-tailwind/CheckboxGroup'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`CheckboxGroupProps` forwards Base UI group props and adds `required`. Its public value contract is `value`/`onValueChange` or `defaultValue`; `className` accepts a string or group-state callback.

## Import and composition

```tsx
import {Checkbox} from '@primer/react-tailwind/Checkbox'
import {CheckboxGroup} from '@primer/react-tailwind/CheckboxGroup'
import {FormControl} from '@primer/react-tailwind/FormControl'
```

Place `CheckboxGroup.Label`, `CheckboxGroup.Caption`, and `CheckboxGroup.Validation` directly inside the group, and compose `Checkbox` children in author order, each in a `FormControl` with its own label.

## Controlled and uncontrolled

The group owns the checked state of each checkbox with a non-empty `value` (or `name` when no value is supplied). With no `value` or `defaultValue` on the group, that selection starts empty: a child's `checked` or `defaultChecked` does not initialize or control it. Put initial selections in the group's `defaultValue`:

```tsx
<CheckboxGroup defaultValue={['email']}>
  <CheckboxGroup.Label>Notifications</CheckboxGroup.Label>
  <FormControl>
    <Checkbox value="email" />
    <FormControl.Label>Email</FormControl.Label>
  </FormControl>
</CheckboxGroup>
```

For individually controlled values, derive the group `value` from the existing state and update that state in `onValueChange`; do not also control the participating children with `checked`:

```tsx
import React from 'react'

function Notifications() {
  const [email, setEmail] = React.useState(true)
  const [web, setWeb] = React.useState(false)
  const value = [...(email ? ['email'] : []), ...(web ? ['web'] : [])]

  return (
    <CheckboxGroup
      value={value}
      onValueChange={next => {
        setEmail(next.includes('email'))
        setWeb(next.includes('web'))
      }}
    >
      <CheckboxGroup.Label>Notifications</CheckboxGroup.Label>
      <FormControl>
        <Checkbox value="email" />
        <FormControl.Label>Email</FormControl.Label>
      </FormControl>
      <FormControl>
        <Checkbox value="web" />
        <FormControl.Label>Web</FormControl.Label>
      </FormControl>
    </CheckboxGroup>
  )
}
```

## Accessibility, forms, and validation

`CheckboxGroup.Label` names the group, and `CheckboxGroup.Validation` and `CheckboxGroup.Caption` describe it. Pass `aria-labelledby` instead when a heading elsewhere names the group; without either, an enclosing `FormControl.Label` names it. `required` marks the label and describes the group as required, since `role="group"` has no `aria-required`; it does not validate the selection. `disabled` disables every nested checkbox and mutes the label. Child `name` and `value` fields form-submit independently.

## Keyboard, events, and state

Space toggles the focused checkbox. Replace legacy `onChange(selectedValues, event)` with `onValueChange(selectedValues, details)`; `details` is Base UI event details, not the legacy React change event. A root `onChange` is a React change handler for events bubbling from nested inputs and receives an event, not the selected array. The root has `data-component="CheckboxGroup"`; children retain their checkbox `data-checked`, `data-indeterminate`, and `data-disabled` states.

Forwards unrecognized props to Base UI's [`CheckboxGroup`](https://base-ui.com/react/components/checkbox-group#api-reference), so it also accepts that part's props.

## Props

- `className`: `string | ((state: CheckboxGroupState) => string | undefined)`
- `required`: `boolean` — Default `false`. Marks a choice as required: the label shows a required marker and the group is described as required.

## CheckboxGroup.Label

Forwards unrecognized props to Base UI's [`Fieldset.Legend`](https://base-ui.com/react/components/fieldset#legend), so it also accepts that part's props.

- `className`: `string | ((state: FieldsetLegendState) => string | undefined)`
- `visuallyHidden`: `boolean` — Hides the label visually while keeping it available to assistive technology.

## CheckboxGroup.Caption

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## CheckboxGroup.Validation

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `variant` (required): `"error" | "success"` — Whether the message reports a problem or confirms success.

## Differences from `@primer/react`

- Use `Label`, `Caption`, and `Validation` parts for group metadata; set `visuallyHidden` only when another visible label exists. `Label` is a Base UI `Fieldset.Legend`, so it must stay inside the group.
- `aria-labelledby` on the group takes precedence over `Label`. Without either, an enclosing `FormControl.Label` names the group.
- `required` shows a visual `*` on the label and adds a hidden "Required" description, because `role="group"` has no `aria-required`. Upstream announces ", required" inside the legend and also exposes the `*`. Neither validates the selection.
- `disabled` disables every nested checkbox and mutes the label and nested leading visuals.
- `Caption` renders a `div` rather than a `p`.
- Replace legacy `onChange(selectedValues, event)` with `onValueChange(selectedValues, details)`. A root `onChange` receives a bubbling React change event instead of the selected array.
- A checkbox with a non-empty `value` (or a `name` when no value is supplied) takes its checked state from the group. Move child `defaultChecked` values into the group's `defaultValue`, or derive a controlled group `value` from existing per-checkbox state and map `onValueChange` back to that state. Without a group default, the selection starts empty.
- `sx` and styled-system props are unsupported; use `className`.
