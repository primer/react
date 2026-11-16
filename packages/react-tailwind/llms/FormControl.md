# FormControl

`FormControl` is a composable field wrapper that provides label, caption, validation, and control association.

Import: `import {FormControl} from '@primer/react-tailwind/FormControl'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## API notes

`FormControlProps` forwards Base UI Field props and adds `layout: 'horizontal' | 'vertical'`, which defaults to `horizontal` for a direct `Checkbox` or `Radio` child. The public composition includes `Label`, `Caption`, `Validation`, `LeadingVisual`, and `Control`; `Validation` requires an `error` or `success` variant.

## Import and composition

```tsx
import {FormControl} from '@primer/react-tailwind/FormControl'
```

Place `Label`, the native input or `Control`, optional `Caption`, and `Validation` in semantic order. Children remain in their authored order; a region prop replaces matching children inside fragments or native DOM wrappers. Region props can also contain parts inside fragments or native wrappers. FormControl cannot inspect custom components, so pass wrapped parts as region props when their metadata is needed. A raw custom input or a `SelectPanel` anchor can sit inside FormControl when it wires its own `id`, `htmlFor`, and `aria-*` references.

For a nonnative label, use `<FormControl.Label id="script-label" render={<span />} nativeLabel={false}>Script</FormControl.Label>` inside a field, and connect the actual editor or trigger with `aria-labelledby="script-label"`. A span has no native `htmlFor` association; that prop is omitted in nonnative mode. A custom editor still owns its input references and focus integration. Do not assume a field ancestor automatically names an arbitrary editor or trigger.

Automatic horizontal layout recognizes direct `Checkbox` and `Radio` children by component identity. For a wrapper around either control, set `layout="horizontal"` explicitly. A wrapper that renders the package control still receives field context because the package control already calls `useFormControlForwardedProps`; use a unique field `id` when the wrapper also supplies an explicit control ID.

The field label names package checkboxes, radios, and switches before and after hydration, including through control wrappers. As with direct controls, that label takes precedence over a separate `aria-label`. To supply a different accessible name, use `aria-labelledby` and include the visible label in the referenced text.

```tsx
<FormControl id="notifications" layout="horizontal">
  <WrappedCheckbox />
  <FormControl.Label>Notifications</FormControl.Label>
  <FormControl.Caption>Receive repository updates.</FormControl.Caption>
</FormControl>
```

For a compatibility wrapper that renders a native radio instead of the package `Radio`, call `useFormControlForwardedProps` and apply the result to the input. This connects the field ID and label, description, required and disabled state, and error state. Explicit control props take precedence over field context.

```tsx
import type {ComponentPropsWithoutRef} from 'react'
import {FormControl, useFormControlForwardedProps} from '@primer/react-tailwind/FormControl'

function NativeRadio(props: Omit<ComponentPropsWithoutRef<'input'>, 'type'>) {
  return <input {...useFormControlForwardedProps(props)} type="radio" />
}

function NotificationPreference() {
  return (
    <fieldset>
      <legend>Notification preference</legend>
      <FormControl id="notify-email" name="notifications" layout="horizontal" required>
        <NativeRadio value="email" />
        <FormControl.Label>Email</FormControl.Label>
        <FormControl.Caption>Receive email updates.</FormControl.Caption>
      </FormControl>
      <FormControl id="notify-web" name="notifications" layout="horizontal">
        <NativeRadio value="web" />
        <FormControl.Label>Web</FormControl.Label>
      </FormControl>
    </fieldset>
  )
}
```

## Controlled and uncontrolled

`FormControl` does not own field values. Control the nested native input with `value`/`onChange`, or use its `defaultValue` for an uncontrolled field.

## Accessibility, forms, and validation

`Label` associates field text, `Caption` provides a description, and error validation uses `Field.Error`; success validation announces with `role="status"`. Package inputs and `FormControl.Control` receive required, validation, and description metadata from the field. A package input composed directly or inside a native DOM wrapper can supply its own `id`; for a custom control wrapper, use the same `id` on `FormControl`, or set `htmlFor` on `Label` explicitly. When a custom region wrapper supplies an `id` or validation `variant`, pass it to both the wrapper and its nested part so FormControl can read it. Plain text and single native elements passed as caption or validation props are associated as descriptions, including inside fragments. Wrap multiple nodes in the corresponding FormControl part or an element with an `id`. Use `Validation` with a `variant` to set the error state or announce success. For a wrapped label on a checkbox, radio, or switch, supply the matching `id` on both elements to establish its accessible name before hydration. Forward `disabled` and `name` through the field or child control. Raw custom inputs must set their own `aria-invalid` when invalid.

Both error and success `Validation` can render without a field ancestor. Errors nested inside `FormControl` or a raw Base UI `Field.Root` retain automatic field description registration. For an external editor or a dialog footer, render the message directly and connect it to the editor explicitly:

```tsx
function InvalidDescription() {
  return (
    <>
      <label htmlFor="description">Description</label>
      <textarea id="description" aria-invalid="true" aria-describedby="description-error" />
      <FormControl.Validation id="description-error" variant="error">
        Enter a description.
      </FormControl.Validation>
    </>
  )
}
```

Add any existing description IDs to `aria-describedby`, and remove the error reference and invalid state when the error is cleared. A standalone message is not associated with the editor automatically. Standalone errors preserve explicit `role` and `aria-live` props without adding an announcement automatically; when an error appears after interaction, provide an appropriate live announcement. Success validation retains `role="status"`.

Use `FormControl required` to apply the required marker and native required state together. An explicit `aria-required` on a child describes its required state to assistive technology but does not, by itself, add the visual marker or native constraint validation.

## Keyboard, events, and state

Nested native controls own keyboard and input events. The root exposes `data-component="FormControl"` and `data-layout`; stable subcomponent selectors include `FormControl.Label`, `FormControl.Caption`, `FormControl.Validation`, and `FormControl.Control`.

Forwards unrecognized props to Base UI's [`Field.Root`](https://base-ui.com/react/components/field#root), so it also accepts that part's props.

## Props

- `caption`: `React.ReactNode` — Supplies the caption region. Takes precedence over a matching `FormControl.Caption` child.
- `className`: `string | ((state: FieldRootState) => string | undefined)`
- `label`: `React.ReactNode` — Supplies the label region. Takes precedence over a matching `FormControl.Label` child.
- `layout`: `"horizontal" | "vertical"` — Whether the label sits above the control or beside it. Defaults to `horizontal` when a direct child is a `Checkbox` or `Radio`, and `vertical` otherwise.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `FormControl.LeadingVisual` child.
- `required`: `boolean` — Default `false`. Marks the field required, which is reflected on the control and shown on the label.
- `validation`: `React.ReactNode` — Supplies the validation region. Takes precedence over a matching `FormControl.Validation` child.

## FormControl.Label

Forwards unrecognized props to Base UI's [`Field.Label`](https://base-ui.com/react/components/field#label), so it also accepts that part's props.

- `className`: `string | ((state: FieldLabelState) => string | undefined)`
- `requiredIndicator`: `boolean` — Default `true`. Shows the required marker. Set `false` to keep the field required without marking it.
- `requiredText`: `string` — Text used for the required marker in place of the default.
- `visuallyHidden`: `boolean` — Hides the label visually while keeping it available to assistive technology.

## FormControl.Caption

Forwards unrecognized props to Base UI's [`Field.Description`](https://base-ui.com/react/components/field#description), so it also accepts that part's props.

- `className`: `string | ((state: FieldDescriptionState) => string | undefined)`

## FormControl.Validation

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `className`: `string`
- `variant` (required): `"error" | "success"` — Whether the message reports a problem or confirms success.

## FormControl.LeadingVisual

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## FormControl.Control

Forwards unrecognized props to Base UI's [`Field.Control`](https://base-ui.com/react/components/field#control), so it also accepts that part's props.

## Differences from `@primer/react`

- `label`, `caption`, `validation`, and `leadingVisual` accept an element for the corresponding region and replace matching children, including parts inside fragments or native DOM wrappers. Other children retain their order and state. A custom control does not need a region prop: `FormControl` distributes `id`, `name`, `required`, `disabled`, and accessibility attributes through context to controls using `useFormControlForwardedProps`.
- Region props also recognize parts inside fragments and native wrappers. Custom wrappers must expose and forward any explicit part ID or validation variant so the field can establish the corresponding relationships.
- Plain text and single native caption or validation props are associated as descriptions, including inside fragments. Wrap multiple nodes in the corresponding FormControl part or an element with an ID. Use `Validation` with a variant to set the error state or announce success.
- **Parity — standalone validation:** both error and success messages work without a field ancestor. An error inside `FormControl` or a raw Base UI `Field.Root` retains field registration and description association. Outside a field, explicitly connect the message's `id` through the external editor's `aria-describedby` and set its `aria-invalid`; no field wrapper is required. Standalone errors preserve explicit `role`/`aria-live` props without adding an announcement automatically; success messages retain `role="status"`.
- Package controls consume FormControl metadata automatically, including when a wrapper renders the package `Radio` or `Checkbox`. A native or custom radio wrapper must apply `useFormControlForwardedProps` to its input to receive the field ID, name, description, required and disabled state, and error state; direct control props take precedence.
- Direct and wrapped package checkboxes, radios, and switches use the field label as their accessible name before and after hydration. The field label takes precedence over a separate `aria-label`; an explicit `aria-labelledby` can supply a different name.
- A package control's explicit `id` takes precedence over the field ID when composed directly or inside a native DOM wrapper. For an unrecognized custom wrapper with its own control ID, supply the same ID to `FormControl` or connect `Label` with `htmlFor`.
- `FormControl.Control` preserves its field ID in server-rendered HTML as well as after hydration. Base UI radio and switch inputs use Base UI's generated ID until hydration, so their labels follow that ID and then the explicit field or control ID.
- `layout` defaults to `horizontal` when a direct child is a `Checkbox` or `Radio`, as upstream infers it. Set `layout` explicitly for a wrapped choice control, which identity matching cannot recognize, or to keep a choice control vertical. Horizontal layout renders a non-choice control exactly once, which a unit test covers; upstream needed a fix for duplicated input there.
- A raw custom input or a `SelectPanel` anchor works inside FormControl by wiring its own `id`, `htmlFor`, and `aria-*` references, as the `WithCustomInput` and `WithSelectPanel` stories show.
- Replace legacy `FormControl.Label as="span"` with `render={<span />}` and `nativeLabel={false}` on the Label part. Both props are required for a non-label element: `render` selects the element, while `nativeLabel` tells Base UI not to treat it as a native label. The part still requires a `FormControl` or Base UI `Field.Root` ancestor; unlike standalone `Validation`, it is not a standalone external-editor label.
  ```tsx
  <FormControl id="script">
    <FormControl.Label id="script-label" render={<span />} nativeLabel={false}>
      Script
    </FormControl.Label>
    <textarea id="script" aria-labelledby="script-label" aria-describedby="script-help" />
    <FormControl.Caption id="script-help">Enter a script</FormControl.Caption>
  </FormControl>
  ```
  Give the label a stable, distinct ID and reference it from the actual editor's accessible input or the menu/select trigger with `aria-labelledby`; combine existing label and description IDs as needed. A span has no native `htmlFor` association. With `nativeLabel={false}`, explicit and field-inferred `htmlFor` values are omitted; do not use that prop to name or target an external editor. `FormControl.Control` and arbitrary native/custom controls must explicitly connect the nonnative label where they do not derive that name themselves. Field context alone does not name an external CodeMirror editor or arbitrary trigger, configure its required/disabled state, or register its focus target. Base UI's virtual-label focus behavior only applies to a control registered in that field; external-editor click-to-focus behavior remains caller-owned. Keep native `Label`/`htmlFor` when a real native label association is intended.
- A disabled control's label and leading visual use the disabled control foreground colour, as upstream does. An enabled leading visual uses the default foreground colour.
- A leading visual's content is at least 16px square, or 24px when the FormControl has a caption, as upstream does, so a default-size icon grows beside a two-line label and caption.
- Vertical layout spaces parts with a top margin, as upstream does, so a part's own inline margin can override it. A `visuallyHidden` label leaves the flow and does not space the control below it.
- In horizontal layout, `Checkbox` and `Radio` sit 2px below the label's top edge, matching upstream's choice-input offset.
- Package text controls receive a success or error validation status from `FormControl.Validation`. An invalid field or exceeded character limit still takes precedence over a control's own status.
- `visuallyHidden` keeps the label available to assistive technology while hiding it visually.
- `sx` and styled-system props are unsupported; use `className`.
