---
'@primer/react': major
---

![FormControl component using a label, text input, validation and hint](https://user-images.githubusercontent.com/13340707/154948443-60d70cc7-4f26-444f-8366-7963336be53c.png)

The `FormControl` component will be used to deprecate the `FormGroup`, `InputField`, and `ChoiceInputField` components. It has the ability to render contextual content with your inputs: labels, validation statuses, captions. It also handles the ARIA attributes that make the form controls accessible to assistive technology.

<table>
<tr>
<th> Before </th> <th> After </th>
</tr>
<tr>
<td valign="top">

```jsx
import {FormControl, Checkbox, TextInput} from "@primer/react"


<FormGroup>
    <FormGroup.Label htmlFor="example-text">Example text</FormGroup.Label>
    <TextInput id="example-text" />
</FormGroup>

OR

<InputField>
    <InputField.Label>Example text</InputField.Label>
    <TextInput />
</InputField>

OR

<ChoiceInputField>
    <ChoiceInputField.Label>Example text</ChoiceInputField.Label>
    <Checkbox />
</ChoiceInputField>

```

</td>
<td valign="top">

```jsx
import {FormGroup, TextInput} from "@primer/react"

<FormControl>
  <FormControl.Label>Example text</FormControl.Label>
  <TextInput />
</FormControl>

OR

<FormControl>
  <FormControl.Label>Example text</FormControl.Label>
  <Checkbox />
</FormControl>

```

</td>
</tr>
<tr>
<td valign="top">

```jsx
import {InputField} from '@primer/react'

<InputField>
  <InputField.Label>Example text</InputField.Label>
  <TextInput />
</InputField>
```

</td>
<td valign="top">

```jsx
import {FormControl} from '@primer/react'

<FormControl>
  <FormControl.Label>Example Text</FormControl.Label>
  <TextInput />
</FormControl>
```

</td>
</tr>
</table>
<table style="display: table">
<tr><th>Migration steps to FormControl</th></tr>
<tr>
<td>

<strong>Upgrade to the new</strong> `FormControl` component by referring to the [examples in our documentation](https://primer.style/react/FormControl).

or

<strong>Continue using the deprecated</strong> `FormGroup`, `ChoiceInputField` or `InputField` :

```js
import {FormGroup, ChoiceInputField, InputField} from '@primer/react/deprecated' // change your import statements
```

</td>
</tr>
</table>
