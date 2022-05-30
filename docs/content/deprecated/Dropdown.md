---
title: Dropdown
status: Deprecated
---

## Deprecation

Use [ActionMenu](/ActionMenu) instead.

---

The Dropdown component is a lightweight context menu for housing navigation and actions.

Use `Dropdown.Button` as the trigger for the dropdown, or use a custom `summary` element if you would like. **You must use a `summary` tag in order for the dropdown to behave properly!**. You should also add `aria-haspopup="true"` to custom dropdown triggers for accessibility purposes. You can use the `Dropdown.Caret` component to add a caret to a custom dropdown trigger.

Dropdown.Menu wraps your menu content. Be sure to pass a `direction` prop to this component to position the menu in relation to the Dropdown.Button.

## Default example

```jsx live deprecated
<Dropdown>
  <Dropdown.Button>Dropdown</Dropdown.Button>
  <Dropdown.Menu direction="sw">
    <Dropdown.Item>Item 1</Dropdown.Item>
    <Dropdown.Item>Item 2</Dropdown.Item>
    <Dropdown.Item>Item 3</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

## With custom button

```jsx live deprecated
<Dropdown>
  <summary>
    Dropdown
    <Dropdown.Caret />
  </summary>
  <Dropdown.Menu direction="sw">
    <Dropdown.Item>Item 1</Dropdown.Item>
    <Dropdown.Item>Item 2</Dropdown.Item>
    <Dropdown.Item>Item 3</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

## Component props

The Dropdown component is extended from the [`Details`](/Details) component and gets all props that the [`Details`](/Details) component gets.

#### Dropdown.Menu

| Name      | Type              | Default | Description                                                                           |
| :-------- | :---------------- | :-----: | :------------------------------------------------------------------------------------ |
| direction | String            |  'sw'   | Sets the direction of the dropdown menu. Pick from 'ne', 'e', 'se', 's', 'sw', or 'w' |
| sx        | SystemStyleObject |   {}    | Style to be applied to the component                                                  |

#### Dropdown.Button

See https://primer.style/react/Buttons#component-props

#### Dropdown.Caret

| Name | Type              | Default | Description                          |
| :--- | :---------------- | :-----: | :----------------------------------- |
| sx   | SystemStyleObject |   {}    | Style to be applied to the component |

#### Dropdown.Item

| Name | Type              | Default | Description                          |
| :--- | :---------------- | :-----: | :----------------------------------- |
| sx   | SystemStyleObject |   {}    | Style to be applied to the component |
