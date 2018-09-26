
# Details

Use the Details component for styling of the native `<details>` element found in html.

## Default example

```.jsx
<ExampleHeading>With static children</ExampleHeading>

<Details>
  <summary className="btn">Click me</summary>
  <p>This should show and hide</p>
</Details>


<ExampleHeading>With children as a function</ExampleHeading>

<Details>
  {({open, toggle}) => (
    <React.Fragment>
      <summary className="btn" onClick={toggle}>
        {open ? 'Hide' : 'Show'}
      </summary>
      <p>This should show and hide</p>
    </React.Fragment>
  )}
</Details>

<ExampleHeading>With render prop</ExampleHeading>
<Details render={() => 'hi'} />
```

## System props

Details components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

| Name | Type | Default | Description |
| :- | :- | :-: | :- |
| open | Boolean | | Sets the open/closed state of the Details component |
| render | Function | | Optional render function, to allow you to handle toggling and open/closed state from a container component.

export const meta = {displayName: 'Details'}
