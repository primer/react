# RadioGroup

`RadioGroup` is a Base UI radio group with roving focus and single-value selection.

Import: `import {RadioGroup} from '@primer/react-tailwind/RadioGroup'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`RadioGroupProps` forwards Base UI group props. Use `value`/`onValueChange` for controlled selection or `defaultValue` for initial-only selection; `name` provides native form semantics.

## Import and composition

```tsx
import {Radio} from '@primer/react-tailwind/Radio'
import {RadioGroup} from '@primer/react-tailwind/RadioGroup'
import {Radio} from '@primer/react-tailwind/Radio'
import {FormControl} from '@primer/react-tailwind/FormControl'
;<RadioGroup name="shipping" defaultValue="standard">
  <RadioGroup.Label>Shipping method</RadioGroup.Label>
  <FormControl layout="horizontal">
    <Radio value="standard" />
    <FormControl.Label>Standard</FormControl.Label>
  </FormControl>
  <FormControl layout="horizontal">
    <Radio value="express" />
    <FormControl.Label>Express</FormControl.Label>
  </FormControl>
</RadioGroup>
```

Place `RadioGroup.Label`, `RadioGroup.Caption`, and `RadioGroup.Validation` directly inside the group, and compose `Radio` children in author order, each in a `FormControl` with its own label.

## Accessibility, forms, and validation

`RadioGroup.Label` names the group, and `RadioGroup.Validation` and `RadioGroup.Caption` describe it. Pass `aria-labelledby` instead when a heading elsewhere names the group; without either, an enclosing `FormControl.Label` names it. `required` sets `aria-required` and marks the label. The selected child submits its value under the group `name`. Disabled groups prevent selection, leave the tab order, and mute the label.

## Keyboard, events, and state

Arrow keys move roving focus and change the selected radio. `onValueChange` receives the next value and Base UI details. The root exposes `data-component="RadioGroup"`; child radios expose `data-checked` and `data-disabled`.

Forwards unrecognized props to Base UI's [`RadioGroup`](https://base-ui.com/react/components/radio-group#api-reference), so it also accepts that part's props.

## Props

- `className`: `string | ((state: RadioGroupState) => string | undefined)`

## RadioGroup.Label

Forwards unrecognized props to Base UI's [`Fieldset.Legend`](https://base-ui.com/react/components/fieldset#legend), so it also accepts that part's props.

- `className`: `string | ((state: FieldsetLegendState) => string | undefined)`
- `visuallyHidden`: `boolean` — Hides the label visually while keeping it available to assistive technology.

## RadioGroup.Caption

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## RadioGroup.Validation

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `variant` (required): `"error" | "success"` — Whether the message reports a problem or confirms success.

## Differences from `@primer/react`

- Use `value`, `defaultValue`, and `onValueChange` for group selection; do not duplicate the primitive's state.
- Use `visuallyHidden` only if another accessible group name is supplied. `Label` is a Base UI `Fieldset.Legend`, so it must stay inside the group.
- `aria-labelledby` on the group takes precedence over `Label`. Without either, an enclosing `FormControl.Label` names the group.
- `required` sets `aria-required` on the radiogroup and `required` on its inputs, and shows a visual `*` on the label. Upstream announces ", required" inside the legend and also exposes the `*`.
- `Caption` renders a `div` rather than a `p`.
- A disabled group (`disabled` on RadioGroup or an enclosing FormControl) leaves the tab order, like native disabled radios, and mutes its label and nested leading visuals. Base UI's roving focus still treats individually disabled radios differently from native radios: if the checked radio is disabled, it remains the group's tab stop, and if every radio is disabled individually, the group stays reachable but inert. Disable the group instead of each radio when no choice is available.
- `sx` and styled-system props are unsupported; use `className`.
