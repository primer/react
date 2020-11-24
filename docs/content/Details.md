---
title: Details
---

`Details` is a styled `details` element for use with the `useDetails` hook. The `useDetails` hook returns the `open` state, a `setOpen` function to manually change the open state, and **`getDetailsProps` which must be spread onto your `Details` element in order for `Details` to get receive the proper behaviors provided by the hook**. See Kent Dodd's article on this pattern [here](https://kentcdodds.com/blog/how-to-give-rendering-control-to-users-with-prop-getters).

The `useDetails` hook also takes a few configuration options as parameters which are noted in the table below.


You must use a `summary` element as your `Details` trigger button. To style your summary element like a [Button](./Button), you can use the `as` prop (see example below).

It's also possible to use the `useDetails` hook with components other than the Primer `Details`, such as a custom `Details` or `Modal` wrapper in your consuming application. All that matters is that the outer element is a `details` and it contains a `summary` for the button that opens and closes the component, and that `getDetailsProps` is properly spread onto the component rendering your `details` element.

```jsx live
<State>
  {([]) => {
    const {getDetailsProps, setOpen, open} = useDetails({closeOnOutsideClick: true})
    return (
      <Details {...getDetailsProps()}>
        <Button as="summary">{open ? 'open' : 'closed'}</Button>
        Are you sure you want to delete this issue?
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <ButtonDanger onClick={() => setOpen(false)}>Delete</ButtonDanger>
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
