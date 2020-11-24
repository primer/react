---
title: Details & useDetails hook
---

`Details` is a styled `details` element for use with the `useDetails` hook. The `useDetails` hook returns the `open` state, a `setOpen` function to manually change the open state, and **`getDetailsProps` which must be spread onto your `Details` element in order for `Details` to get receive the proper behaviors provided by the hook**. See Kent Dodd's article on this pattern [here](https://kentcdodds.com/blog/how-to-give-rendering-control-to-users-with-prop-getters).

The `useDetails` hook also takes a few configuration options as parameters which are noted in the table below.


You must use a `summary` element as your `Details` trigger button. To style your summary element like a [Button](./Button), you can use the `as` prop (see example below).

It's also possible to use the `useDetails` hook with components other than the Primer `Details`, such as a custom `Details` or `Modal` wrapper in your consuming application. All that matters is that the outer element is a `details` and it contains a `summary` for the button that opens and closes the component, and that `getDetailsProps` is properly spread onto the component rendering your `details` element.

```jsx live
<State>
  {([]) => {
    const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
    return (
      <Details {...getDetailsProps()}>
        <Button as="summary">Hello</Button>
        This is some content
      </Details>
    )
  }}
</State>

```

You can use the `open` state returned from the hook to conditionally render content:
```jsx live
<State>
  {([]) => {
    const {getDetailsProps, open} = useDetails({closeOnOutsideClick: true})
    return (
      <Details {...getDetailsProps()}>
        <Button as="summary">{open ? 'open' : 'close'}</Button>
        This is some content
      </Details>
    )
  }}
</State>

```

You can also manually show/hide the content using the `setOpen` function returned from the hook. This can be useful if you have action items in the content of the component such as confirmation buttons:

```jsx live
<State>
  {([]) => {
    const {getDetailsProps, setOpen} = useDetails({closeOnOutsideClick: true})
    return (
      <Details {...getDetailsProps()}>
        <Button as="summary">Delete item</Button>
        Are you sure?
        <ButtonDanger onClick={() => setOpen(false)}>Yes I'm sure</ButtonDanger>
      </Details>
    )
  }}
</State>

```

In previous versions of Primer React Components, we allowed users to pass in a custom `onToggle` function. You can do this now by overriding the `onToggle` function returned in `getDetailsProps`:


```jsx live
<State>
  {([]) => {
    const {getDetailsProps, setOpen} = useDetails({closeOnOutsideClick: true})
    return (
      <Details {...getDetailsProps()} onToggle={() => window.alert('hi')}>
        <Button as="summary">Delete item</Button>
        Are you sure?
        <ButtonDanger onClick={() => setOpen(false)}>Yes I'm sure</ButtonDanger>
      </Details>
    )
  }}
</State>
```


## `Details` System props

Details components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## `useDetails` hook configuration options

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| defaultOpen | Boolean | | Sets the initial open/closed state |
| closeOnOutsideClick | Boolean | false | Sets whether or not element will close when the user clicks outside of it |
| ref | React ref | | optional ref to pass down to Details component |


### Values returned by the `useDetails` hook
| Name | Type | Description |
| :- | :- | :- |
| open | string | Whether or not Details is currently open |
| setOpen | function | Used to manually change the open state of the Details component |
| getDetailsProps | Object | Contains an `onToggle` function, the `ref` to pass down to `Details` and the `open` attribute. In most cases, you won't need to interact with any of these values directly, but if you'd like to override any of these yourself you may.
