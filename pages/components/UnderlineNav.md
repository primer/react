### UnderlineNav

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

  To use UnderlineNav with [react-router](https://github.com/ReactTraining/react-router) or
  [react-router-dom](https://www.npmjs.com/package/react-router-dom), pass
  ```is={NavLink}``` and omit the ```selected``` prop.
  This ensures that the NavLink gets ```activeClassName='selected'```


export const meta = {displayName: 'UnderlineNav'}
