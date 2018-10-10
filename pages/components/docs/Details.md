
# Details

The Details component is an HTML `<details>` element without native browser styling that optionally uses the [render props pattern](https://reactjs.org/docs/render-props.html) to pass its state to child components.

You are responsible for rendering your own `<summary>`. To style your summary element like a [Button](./Button), you can use the `is` prop:

```jsx
<Button is="summary">Summary text</Button>
```

## With static children
```.jsx
<Details>
  <Button is="summary">Click me</Button>
  <p>This should show and hide</p>
</Details>
```

## With children as a function
The render function gets an object with two keys:

* `open` is a boolean reflecting the `<details>` element's `open` attribute, and can be used to conditionally show or hide content.
* `toggle` is a function that can be assigned to event handlers to trigger toggling of the `open` state.

If you use this form or the render prop (see below), **you must attach the `toggle` prop as an event listener**. If you don't the render function will not be called when the element is toggled by the native browser behavior.

```.jsx
<Details>
  {({open, toggle}) => (
    <>
      <Button is="summary" onClick={toggle}>
        {open ? 'Hide' : 'Show'}
      </Button>
      <p>This should show and hide</p>
    </>
  )}
</Details>
```

## With render prop
The Details component also accepts a `render` function prop.

```.jsx
<Details render={({open, toggle}) => (
  <>
    <Button is="summary" onClick={toggle}>Open? {String(open)}</Button>
    <p>This is the content.</p>
  </>
)} />
```

## System props

Details components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| open | Boolean | | Sets the open/closed state of the Details component |
| render | Function | | Optional render function, to allow you to handle toggling and open/closed state from a container component.

export const meta = {displayName: 'Details'}
