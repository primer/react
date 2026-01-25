## Rule Details

This rule prevents accessibility issues by ensuring form controls have only one label. When a `FormControl` contains both a `FormControl.Label` and a `TextInput` with an `aria-label`, it creates duplicate labels which can confuse screen readers and other assistive technologies.

👎 Examples of **incorrect** code for this rule:

```jsx
import {FormControl, TextInput} from '@primer/react'

function ExampleComponent() {
  return (
    // TextInput has aria-label when FormControl.Label is present
    <FormControl>
      <FormControl.Label>Form Input Label</FormControl.Label>
      <TextInput aria-label="Form Input Label" />
    </FormControl>
  )
}
```

👍 Examples of **correct** code for this rule:

```jsx
import {FormControl, TextInput} from '@primer/react'

function ExampleComponent() {
  return (
    <>
      {/* TextInput without aria-label when FormControl.Label is present */}
      <FormControl>
        <FormControl.Label>Form Input Label</FormControl.Label>
        <TextInput />
      </FormControl>

      {/* TextInput with aria-label when no FormControl.Label is present */}
      <FormControl>
        <TextInput aria-label="Form Input Label" />
      </FormControl>

      {/* Using visuallyHidden FormControl.Label without aria-label */}
      <FormControl>
        <FormControl.Label visuallyHidden>Form Input Label</FormControl.Label>
        <TextInput />
      </FormControl>
    </>
  )
}
```
