---
'@primer/react': major
---
### Button
A new set of `Button` components brings a much needed update. Previously to `v35`, `Button` was a set of seven independent components. In `v35`, we now have common `Button` usage guidelines and more convenient API.
#### Button variants
We now support a variant property which takes values `primary`, `invisible`, `outline` and `danger`
<table>
<tr>
<th> Before (v34)</th> <th> After (v35)</th>
</tr>
<tr>
<td valign="top">
```jsx
<import {
    ButtonPrimary,
    ButtonInvisible,
    ButtonOutline,
    ButtonDanger
} from '@primer/react'
<ButtonPrimary>
    Primary Button
</ButtonPrimary>
<ButtonInvisible>
    Invisible Button
</ButtonInvisible>
<ButtonOutline>
    Outline Button
</ButtonOutline>
<ButtonDanger>
    Danger Button
</ButtonDanger>
```
 </td>
<td valign="top">
```jsx
import {
    Button
} from '@primer/react'
<Button variant="primary">
    Primary Button
</Button>
<Button variant="invisible">
    Invisible Button
</Button>
<Button variant="outline">
    Outline Button
</Button>
<Button variant="danger">
    Danger Button
</Button>
```
</td>
</tr>
</table>
### Leading and Trailing icons
In the previous component, we allowed icon components to be direct children. This results in a lot of custom styling for the icon components.
In the new one, we now have `leadinIcon` and `trailingIcon` properties.
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
### Icon buttons
Icon only buttons are common usages in products. So we now have a component for the specific usecase
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
### Size property
Earlier we used `variant` to mean size property. Now we have a new property called `size` which is more semantically correct.
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
