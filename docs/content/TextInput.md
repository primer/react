---
title: TextInput
---

TextInput is a form component to add default styling to the native text input. Don't forget to set `aria-label` to make the TextInput accessible to screen reader users.
## Default example

```jsx live
<TextInput aria-label="Zipcode" name="zipcode" placeholder="Hello there" block variant="small"/>
<TextInput aria-label="Zipcode" name="zipcode" placeholder="Hello there" block />
<TextInput aria-label="Zipcode" name="zipcode" placeholder="Hello there" block variant="large" />
```

## System props

TextInput components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| autocomplete | String | | Allows user to set `autocomplete` attribute on input. See [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocomplete) for attribute documentation. |
| aria-label | String | | Label that describes the input for screen reader users |
| block | Boolean | | Adds `display: block` to element |
| disabled | Boolean | | Sets the `disabled` attribute on the element |
| id | String | | Sets the `id` attribute on the element |
| name | String | | Sets the `name` attribute on the element |
| onChange | Function | | Function to be called when content in Input changes |
| placeholder | String | | Sets the placeholder text |
| required | Boolean | | Sets the `required` attribute on the element |
| variant | String | | Can be either `small` or `large`. Creates a smaller or larger input than the default.
| value | String | | Current value of the Input. |
