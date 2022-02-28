---
'@primer/react': major
---

The `CheckboxGroup` and `RadioGroup` components will be used to deprecate the `ChoiceFieldset` component. The deprecation of `ChoiceFieldset` also allows us to deprecate `ChoiceInputField`.

`CheckboxGroup` and `RadioGroup` have the ability to render contextual content with your fieldset: labels, validation statuses, captions. It also handles the ARIA attributes that make the form controls accessible to assistive technology.

<table>
<tr>
<th> Before (v34)</th> <th> After (v35)</th>
</tr>
<tr>
<td valign="top">

```jsx
import {ChoiceFieldset} from "@primer/react"

// Multi-select
<ChoiceFieldset>
  <ChoiceFieldset.Legend>
    Preferred Primer component interface
  </ChoiceFieldset.Legend>

  <ChoiceFieldset.List selectionVariant="multiple">
    <ChoiceFieldset.Item value="figma">
      Figma library
    </ChoiceFieldset.Item>
    <ChoiceFieldset.Item value="css">
      Primer CSS
    </ChoiceFieldset.Item>
    <ChoiceFieldset.Item value="react">
      Primer React components
    </ChoiceFieldset.Item>
    <ChoiceFieldset.Item value="viewcomponents">
      Primer ViewComponents
    </ChoiceFieldset.Item>
  </ChoiceFieldset.List>
</ChoiceFieldset>

// Single select
<ChoiceFieldset>
  <ChoiceFieldset.Legend>
    Preferred Primer component interface
  </ChoiceFieldset.Legend>

  <ChoiceFieldset.List>
    <ChoiceFieldset.Item value="figma">
      Figma library
    </ChoiceFieldset.Item>
    <ChoiceFieldset.Item value="css">
      Primer CSS
    </ChoiceFieldset.Item>
    <ChoiceFieldset.Item value="react">
      Primer React components
    </ChoiceFieldset.Item>
    <ChoiceFieldset.Item value="viewcomponents">
      Primer ViewComponents
    </ChoiceFieldset.Item>
  </ChoiceFieldset.List>
</ChoiceFieldset>

```

</td>
<td valign="top">

```jsx
import {FormGroup, Checkbox} from "@primer/react"

// Multi-select
<CheckboxGroup>
  <CheckboxGroup.Label>
    Preferred Primer component interface
  </CheckboxGroup.Label>
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

// Single select
<RadioGroup name="preferred-primer">
  <RadioGroup.Label>
    Preferred Primer component interface
  </RadioGroup.Label>
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
```

</td>
</tr>
</table>
<table style="display: table">
<tr><th>Migration steps to CheckboxGroup and RadioGroup</th></tr>
<tr>
<td>

<strong>Upgrade to the new</strong> `CheckboxGroup` and `RadioGroup` components by referring to the examples in our documentation: [CheckboxGroup](https://primer.style/react/CheckboxGroup), [RadioGroup](https://primer.style/react/RadioGroup).

or

<strong>Continue using the deprecated</strong> `ChoiceFieldset` component :

```js
import {ChoiceFieldset} from '@primer/react/deprecated' // change your import statements
```

ChoiceFieldset codemod: https://github.com/primer/react-migrate/blob/main/src/use-deprecated-choicefieldset.js

</td>
</tr>
</table>
