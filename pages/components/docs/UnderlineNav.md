# UnderlineNav


To use UnderlineNav with [react-router](https://github.com/ReactTraining/react-router) or
[react-router-dom](https://www.npmjs.com/package/react-router-dom), pass
```is={NavLink}``` and omit the ```selected``` prop.
This ensures that the NavLink gets ```activeClassName='selected'```

## Default example

```.jsx
<ExampleHeading>
  Using <Text fontFamily="mono">{'<UnderlineNavLink>'}</Text>
</ExampleHeading>
<UnderlineNav>
  <UnderlineNavLink href="#foo" selected>
    Selected
  </UnderlineNavLink>
  <UnderlineNavLink href="#bar">Bar</UnderlineNavLink>
  <UnderlineNavLink href="#baz">Baz</UnderlineNavLink>
</UnderlineNav>
```

## System props

UnderlineNav and UnderlineNavLink components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.


export const meta = {displayName: 'UnderlineNav'}
