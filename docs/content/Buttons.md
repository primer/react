---
componentId: button
title: Button
status: Alpha
---

`Button` is used for actions, like in forms, while `Link` is used for destinations, or moving from one page to another.

In special cases where you'd like to use a `<a>` styled like a Button, use `<Button as='a'>` and provide an `href`.

To create a button group, wrap `Button` elements in the `ButtonGroup` element. `ButtonGroup` gets the same props as `Box`.

## Default examples

```jsx live
<>
  <Button>Button</Button>
  <ButtonDanger>Button danger</ButtonDanger>
  <ButtonOutline>Button outline</ButtonOutline>
  <ButtonPrimary>Button primary</ButtonPrimary>
  <ButtonInvisible>Button invisible</ButtonInvisible>
  <ButtonClose onClick={() => window.alert('button clicked')} />

  <ButtonGroup display="block" my={2}>
    <Button>Button</Button>
    <Button>Button</Button>
    <Button>Button</Button>
  </ButtonGroup>

  <ButtonTableList>Button table list </ButtonTableList>
</>
```

## Component props

Native `<button>` HTML attributes are forwarded to the underlying React `button` component and are not listed below.

### Button

| Prop name | Type              | Default  | Description                                                                                                                 |
| :-------- | :---------------- | :------: | :-------------------------------------------------------------------------------------------------------------------------- |
| as        | String            | `button` | sets the HTML tag for the component                                                                                         |
| sx        | SystemStyleObject |    {}    | Additional styles                                                                                                           |
| variant   | String            | 'medium' | a value of `small`, `medium`, or `large` results in smaller or larger Button text size; no effect if `fontSize` prop is set |

### ButtonGroup

`ButtonGroup` has access to the same props as `Box`
