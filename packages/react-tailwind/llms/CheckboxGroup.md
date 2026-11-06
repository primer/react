# CheckboxGroup

`CheckboxGroup` groups checkbox primitives and supplies their shared controlled or uncontrolled state.

Import: `import {CheckboxGroup} from '@primer/react-tailwind/CheckboxGroup'`

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
