# UnderlineNav

Use the UnderlineNav component to style navigation with a minimal underlined selected state, typically used for navigation placed at the top of the page.

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


## Component props

### UnderlineNav
| Prop name | Type | Description |
| :- | :- | :- |
| actions | Node | Place another element, such as a button, to the opposite side of the navigation items.|
| align | String | Use `right` to have navigation items aligned right. |
| full | Boolean | Used to make navigation fill the width of the container. |
| label | String | Used to set the `aria-label` on the top level `<nav>` element. |

### UnderlineNavLink
| Prop name | Type | Description |
| :- | :- | :- |
| is | String | sets the HTML tag for the component|
| selected | Boolean | Used to style the link as selected or unselected |

export const meta = {displayName: 'UnderlineNav'}
