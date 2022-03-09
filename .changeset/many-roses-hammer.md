---
'@primer/react': major
---

<br />

### Button

Before `v35`, `Button` was a set of seven independent components. In `v35`, we've simplified the `Button` API.

#### Button variants

We now support a variant property which takes values `primary`, `invisible`, `outline` and `danger`

<table>
<tr>
<th> Before (v34)</th> <th> After (v35)</th>
</tr>
<tr>
<td valign="top">

```jsx
import {ButtonPrimary, ButtonInvisible, ButtonOutline, ButtonDanger} from '@primer/react'

function Example() {
  return (
    <>
      <ButtonPrimary>Primary Button</ButtonPrimary>
      <ButtonInvisible>Invisible Button</ButtonInvisible>
      <ButtonOutline>Outline Button</ButtonOutline>
      <ButtonDanger>Danger Button</ButtonDanger>
    </>
  )
}
```

 </td>
<td valign="top">

```jsx
import {Button} from '@primer/react'

function Example() {
  return (
    <>
      <Button variant="primary">Primary Button</Button>
      <Button variant="invisible">Invisible Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="danger">Danger Button</Button>
    </>
  )
}
```

</td>
</tr>
</table>

#### Leading and trailing icons

Previously including icons inside buttons required a lot of custom styling. In the new `Button` component, we now support first-class `leadingIcon` and `trailingIcon` props:

<table>
<tr>
<th> Before (v34)</th> <th> After (v35)</th>
</tr>
<tr>
<td valign="top">
    
```jsx
<Button>
  <SearchIcon />
  Search
</Button>
```
    
 </td>
<td valign="top">
    
```jsx
<Button leadingIcon={SearchIcon}>Search</Button>
```
    
</td>
</tr>
</table>

#### Icon buttons

Icon-only buttons are common in many applications. We now have a component designed for this use-case:

<table>
<tr>
<th> Before (v34)</th> <th> After (v35)</th>
</tr>
<tr>
<td valign="top">
    
```jsx
<Button>
  <XIcon />
</Button>
```
    
 </td>
<td valign="top">
    
```jsx
<IconButton aria-label="Close button" icon={XIcon} />
```
    
</td>
</tr>
</table>

#### Size property

Previously, we used a `variant` prop to set the size of buttons. We now have a prop called `size` which is more semantically correct.

<table>
<tr>
<th> Before (v34)</th> <th> After (v35)</th>
</tr>
<tr>
<td valign="top">
    
```jsx
<Button variant="small">Small button</Button>
```
    
 </td>
<td valign="top">
    
```jsx
<Button size="small">Small button</Button>
```
    
</td>
</tr>
</table>
