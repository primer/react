---
"@primer/react": major
---

## Button deprecation

The new set of Button components brings a much needed update.
The older version was a set of seven different components. Each variant of the component had a separate component.
The guidelines to put in icons inside the buttons was also vague. With the new components, we now have a great guidance for common button usage.

## Change list

### Button variants

We now support a variant property which takes values `primary`, `invisible`, `outline` and `danger`

#### Before

```jsx
import {ButtonPrimary, ButtonInvisible, ButtonOutline, ButtonDanger} from '@primer/react'
  <ButtonPrimary>Primary Button</ButtonPrimary>
  <ButtonInvisible>Invisible Button</ButtonInvisible>
  <ButtonOutline>Outline Button</ButtonOutline>
  <ButtonDanger>Danger Button</ButtonDanger>
```

#### After

```jsx
import {Button} from '@primer/react'
  <Button variant="primary">Primary Button</Button>
  <Button variant="invisible">Invisible Button</Button>
  <Button variant="outline">Outline Button</Button>
  <Button variant="danger">Danger Button</Button>
```

### Leading and Trailing icons

In the previous component, we allowed icon components to be direct children. This results in a lot of custom styling for the icon components.
In the new one, we now have `leadinIcon` and `trailingIcon` properties.

#### Before

```jsx
<Button>
  <SearchIcon />
  Search
</Button>
```

#### After

```jsx
<Button leadingIcon={SearchIcon}>Search</Button>
```

### Icon buttons

Icon only buttons are common usages in products. So we now have a component for the specific usecase

#### Before

```jsx
<Button>
  <XIcon />
</Button>
```

#### After

```jsx
<IconButton aria-label="Close button" icon={XIcon} />
```

### Size property

Earlier we used `variant` to mean size property. Now we have a new property called `size` which is more semantically correct.

#### Before

```jsx
<Button variant="small">Small button</Button>
```

#### After

```jsx
<Button size="small">Small button</Button>
```
