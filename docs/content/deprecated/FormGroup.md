---
componentId: form_group
title: FormGroup
status: Deprecated
---

Adds styles for multiple form elements used together.

## Deprecation

Use [FormControl](/FormControl) instead.

## Default example

```jsx live
<>
  <FormGroup>
    <FormGroup.Label htmlFor="example-text">Example text</FormGroup.Label>
    <TextInput id="example-text" value="Example Value" />
  </FormGroup>

  <FormGroup>
    <FormGroup.Label htmlFor="example-text-b">Example text</FormGroup.Label>
    <TextInput id="example-text-b" value="Example Value" />
  </FormGroup>
</>
```

## Component props

### FormGroup

| Name | Type              | Default | Description                          |
| :--- | :---------------- | :-----: | :----------------------------------- |
| as   | String            |  `div`  | Sets the HTML tag for the component  |
| sx   | SystemStyleObject |   {}    | Style to be applied to the component |

### FormGroup.Label

| Name    | Type              | Default | Description                                                                    |
| :------ | :---------------- | :-----: | :----------------------------------------------------------------------------- |
| as      | String            | `label` | Sets the HTML tag for the component                                            |
| htmlFor | String            |         | The value of `htmlFor` needs to be the same as the `id` of the input it labels |
| sx      | SystemStyleObject |   {}    | Style to be applied to the component                                           |
