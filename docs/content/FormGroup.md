---
title: FormGroup
---

Adds styles for multiple form elements used together.

## Default example

```jsx live
<FormGroup>
  <FormGroup.Label htmlFor="example-text">Example text</FormGroup.Label>
  <TextInput id="example-text" value="Example Value" />
</FormGroup>

<FormGroup>
  <FormGroup.Label htmlFor="example-text-b">Example text</FormGroup.Label>
  <TextInput id="example-text-b" value="Example Value" />
</FormGroup>
```

## System props

FormGroup components get `COMMON` system props. FormGroup.Label components get `COMMON` and `TYPOGRAPHY` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

### FormGroup

| Name | Type   | Default | Description                         |
| :--- | :----- | :-----: | :---------------------------------- |
| as   | String |  `div`  | Sets the HTML tag for the component |

### FormGroup.Label

| Name | Type   | Default | Description                         |
| :--- | :----- | :-----: | :---------------------------------- |
| as   | String |  `label`  | Sets the HTML tag for the component |
| htmlFor | String |  | The value of `htmlFor` needs to be the same as the `id` of the input it labels |
