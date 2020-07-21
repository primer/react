---
title: FormGroup
---

Adds styles for multiple form elements used together.

## Default example

```jsx live
<FormGroup>
  <FormGroup.Label htmlFor="example-text">Example text</FormGroup.Label>
  <TextInput id="example-text" width="440px" bg="#fafbfc" value="Example Value" />
</FormGroup>

<FormGroup>
  <FormGroup.Label htmlFor="example-select">Example text</FormGroup.Label>
  <Dropdown id="example-select">
    <Dropdown.Button sx={{fontWeight: '400'}} bg="#fff">Dropdown</Dropdown.Button>
      <Dropdown.Menu direction='se'>
      <Dropdown.Item>Item 1</Dropdown.Item>
      <Dropdown.Item>Item 2</Dropdown.Item>
      <Dropdown.Item>Item 3</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
</FormGroup>

<FormGroup>
  <FormGroup.Label htmlFor="example-textarea">Example text</FormGroup.Label>
  <textarea style={{width: '100%', height: '200px', minHeight: '200px', padding: '8px', marginRight: '5px', border: '1px solid #e1e4e8', backgroundColor: '#fafbfc'}} id="example-textarea"></textarea>
</FormGroup>
```

## System props

FormGroup components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name    | Type   | Default | Description                                                                            |
| :------ | :----- | :-----: | :------------------------------------------------------------------------------------- |
| as      | String |  `div`  | Sets the HTML tag for the component                                                    |
| variant | String | default | Can be one of `input`, `select`, or `textarea` - sets the form type for the Form Group |
