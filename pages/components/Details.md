
### Details
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
export const meta = {displayName: 'Details'}
