---
title: Buttons
---


`Button` is used for actions, like in forms, while `Link` is used for destinations, or moving from one page to another.

In special cases where you'd like to use a `<a>` styled like a Button, use `<Button as='a'>` and provide an `href`.

To create a button group, wrap `Button` elements in the `ButtonGroup` element. `ButtonGroup` gets the same props as `Box`.

## Default examples

```jsx live
<Button>Button</Button>
<ButtonDanger>Button Danger</ButtonDanger>
<ButtonOutline>Button Outline</ButtonOutline>
<ButtonPrimary>Button Primary</ButtonPrimary>

<ButtonGroup display='block' my={2}>
  <Button>Button</Button>
  <Button>Button</Button>
  <Button>Button</Button>
</ButtonGroup>
```

## System props

`Button` and `ButtonGroup` components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

### Button
| Prop name | Type | Default | Description |
| :- | :- | :-: | :- |
| as | String | `button` | sets the HTML tag for the component |
| disabled | Boolean |  | sets the `disabled` attribute on the Button |
| onClick | Function | | function to be called when Button is clicked |
| size | String | | use `sm` for a small Button, or `large` for a large Button

### ButtonGroup
`ButtonGroup` has access to the same props as `Box`
