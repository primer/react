---
'@primer/react': major
---

<br />

### FormGroup, InputField, ChoiceInputField

The `FormControl` component is replacing the `FormGroup`, `InputField`, and `ChoiceInputField` components. It has the ability to render contextual content with your inputs: labels, validation statuses, captions. It also handles the ARIA attributes that make the form controls accessible to assistive technology.

<table>
<tr>
<th> Before (v34) </th> <th> After (v35) </th>
</tr>
<tr>
<td valign="top">

```jsx
import {FormControl, Checkbox, TextInput} from '@primer/react'

function Example() {
  return (
    <>
      <FormGroup>
        <FormGroup.Label htmlFor="example-text">Example text</FormGroup.Label>
        <TextInput id="example-text" />
      </FormGroup>
      {/* OR */}
      <InputField>
        <InputField.Label>Example text</InputField.Label>
        <TextInput />
      </InputField>
      {/* OR */}
      <ChoiceInputField>
        <ChoiceInputField.Label>Example text</ChoiceInputField.Label>
        <Checkbox />
      </ChoiceInputField>
    </>
  )
}
```

</td>
<td valign="top">

```jsx
import {FormGroup, TextInput} from '@primer/react'

function Example() {
  return (
    <>
      <FormControl>
        <FormControl.Label>Example text</FormControl.Label>
        <TextInput />
      </FormControl>
      {/* OR */}
      <FormControl>
        <FormControl.Label>Example text</FormControl.Label>
        <Checkbox />
      </FormControl>
    </>
  )
}
```

</td>
</tr>
<tr>
<td valign="top">

```jsx
import {InputField, TextInput} from '@primer/react'

function Example() {
  return (
    <InputField>
      <InputField.Label>Example text</InputField.Label>
      <TextInput />
    </InputField>
  )
}
```

</td>
<td valign="top">

```jsx
import {FormControl, TextInput} from '@primer/react'

function Example() {
  return (
    <FormControl>
      <FormControl.Label>Example text</FormControl.Label>
      <TextInput />
    </FormControl>
  )
}
```

</td>
</tr>
</table>

To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

```js
import {FormGroup, ChoiceInputField, InputField} from '@primer/react/deprecated'
```

You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.
