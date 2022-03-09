---
'@primer/react': major
---

<br />

### ChoiceFieldset

The `CheckboxGroup` and `RadioGroup` components are replacing the `ChoiceFieldset` component.

`CheckboxGroup` and `RadioGroup` have the ability to render contextual content with your fieldset: labels, validation statuses, captions. They also handle the ARIA attributes that make the form controls accessible to assistive technology.

<table>
<tr>
<th> Before (v34)</th> <th> After (v35)</th>
</tr>
<tr>
<td valign="top">

```jsx
import {ChoiceFieldset} from '@primer/react'

function Example() {
  return (
    <>
      {/* Multi-select */}
      <ChoiceFieldset>
        <ChoiceFieldset.Legend>Preferred Primer component interface</ChoiceFieldset.Legend>
        <ChoiceFieldset.List selectionVariant="multiple">
          <ChoiceFieldset.Item value="figma">Figma library</ChoiceFieldset.Item>
          <ChoiceFieldset.Item value="css">Primer CSS</ChoiceFieldset.Item>
          <ChoiceFieldset.Item value="react">Primer React components</ChoiceFieldset.Item>
          <ChoiceFieldset.Item value="viewcomponents">Primer ViewComponents</ChoiceFieldset.Item>
        </ChoiceFieldset.List>
      </ChoiceFieldset>

      {/* Single select */}
      <ChoiceFieldset>
        <ChoiceFieldset.Legend>Preferred Primer component interface</ChoiceFieldset.Legend>
        <ChoiceFieldset.List>
          <ChoiceFieldset.Item value="figma">Figma library</ChoiceFieldset.Item>
          <ChoiceFieldset.Item value="css">Primer CSS</ChoiceFieldset.Item>
          <ChoiceFieldset.Item value="react">Primer React components</ChoiceFieldset.Item>
          <ChoiceFieldset.Item value="viewcomponents">Primer ViewComponents</ChoiceFieldset.Item>
        </ChoiceFieldset.List>
      </ChoiceFieldset>
    </>
  )
}
```

</td>
<td valign="top">

```jsx
import {CheckboxGroup, RadioGroup, FormControl, Checkbox, Radio} from '@primer/react'

function Example() {
  return (
    <>
      {/* Multi-select */}
      <CheckboxGroup>
        <CheckboxGroup.Label>Preferred Primer component interface</CheckboxGroup.Label>
        <FormControl>
          <Checkbox value="figma" />
          <FormControl.Label>Figma</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="css" />
          <FormControl.Label>CSS</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="react" />
          <FormControl.Label>Primer React components</FormControl.Label>
        </FormControl>
        <FormControl>
          <Checkbox value="viewcomponents" />
          <FormControl.Label>Primer ViewComponents</FormControl.Label>
        </FormControl>
      </CheckboxGroup>

      {/* Single select */}
      <RadioGroup name="preferred-primer">
        <RadioGroup.Label>Preferred Primer component interface</RadioGroup.Label>
        <FormControl>
          <Radio value="figma" />
          <FormControl.Label>Figma</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="css" />
          <FormControl.Label>CSS</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="react" />
          <FormControl.Label>Primer React components</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="viewcomponents" />
          <FormControl.Label>Primer ViewComponents</FormControl.Label>
        </FormControl>
      </RadioGroup>
    </>
  )
}
```

</td>
</tr>
</table>

To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

```js
import {ChoiceFieldset} from '@primer/react/deprecated'
```

You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.
