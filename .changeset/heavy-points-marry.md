---
'@primer/react': major
---

<br />

### Label

The Label component's API and visual design have been updated to be consistent with its counterpart in [Primer ViewComponents' Label component](https://primer.style/view-components/components/label).

Major changes in the new Label component:

- No more `medium` size - only `small` and `large`
- Labels are outlined by default, so the `outline` prop has been removed
- Custom text and background colors are discouraged, but still possible via the `sx` prop

If you were using the `Label` component to render issue/PR labels, use the [IssueLabelToken](https://primer.style/react/Token#issuelabeltoken) component instead.

<table>
<tr>
<th> Before (v34) </th> <th> After (v35) </th>
</tr>
<tr>
<td valign="top">

```jsx
import {Label} from '@primer/react'

function Example() {
  return (
    <>
      <Label outline>default</Label>
      <Label variant="small" outline sx={{borderColor: 'danger.emphasis', color: 'danger.fg'}}>
        danger
      </Label>
    </>
  )
}
```

 </td>
<td valign="top">

```jsx
import {Label} from '@primer/react'

function Example() {
  return (
    <>
      <Label>default</Label>
      <Label size="small" variant="danger">
        danger
      </Label>
    </>
  )
}
```

</td>
</tr>
</table>

To continue to use the deprecated API for now, change the import path to `@primer/react/deprecated`:

```js
import {Label} from '@primer/react/deprecated'
```

You can use the [one-time codemod](https://github.com/primer/react-migrate#readme) to change your import statements automatically.
