---
'@primer/react': major
---

![NewLabels](https://user-images.githubusercontent.com/2313998/155384037-8a56c943-4cff-4349-925b-dc28247e3491.png)

The Label component has been updated to align with [Primer ViewComponents' Label component](https://primer.style/view-components/components/label). Now the React component is consistent ViewComponents and the intent of the design team.

Major changes in the new Label component:

- No more `medium` size - only `small` and `large`
- Labels are outlined by default, so the `outline` prop has been removed
- Custom text and background colors are discouraged, but still possible via the `sx` prop

If you were using the `Label` component to render issue/PR labels, use the [IssueLabelToken](https://primer.style/react/Token#issuelabeltoken) component instead.

<table>
<tr>
<th> Before </th> <th> After </th>
</tr>
<tr>
<td valign="top">

```jsx
import {Label} from "@primer/react"

<Label outline>default</Label>
<Label variant="small" outline sx={{borderColor: 'danger.emphasis', color: 'danger.fg'}}>danger</Label>
```

 </td>
<td valign="top">

```jsx
import {Label} from "@primer/react"

<Label>default</Label>
<Label size="small" variant="danger">danger</Label>
```

</td>
</tr>
</table>
