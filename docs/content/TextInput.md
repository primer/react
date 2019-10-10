---
title: TextInput
---

TextInput is a form component to add default styling to the native text input. Don't forget to set `aria-label` to make the TextInput accessible to screen reader users.
## Default example

```jsx live
<TextInput aria-label="Zipcode" name="zipcode" placeholder="Zipcode" autoComplete="postal-code" />
```

## System props

TextInput components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

Native `input` attributes are forwarded to the underlying React `input` component and are not listed below.

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| block | Boolean | | Adds `display: block` to element |
| variant | String | | Can be either `small` or `large`. Creates a smaller or larger input than the default.