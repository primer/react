# TabNav

Use the TabNav component to style navigation with a tab-based selected state, typically used for navigation placed at the top of the page.

To use TabNav with [react-router](https://github.com/ReactTraining/react-router) or
[react-router-dom](https://www.npmjs.com/package/react-router-dom), pass
`as={NavLink}` and omit the `selected` prop.
This ensures that the NavLink gets `activeClassName='selected'`

**Attention:** Make sure to properly label your `TabNav` with an `aria-label` to provide context about the type of navigation contained in `TabNav`.

## Default example

```.jsx
<ExampleHeading>
  Using <Text fontFamily="mono">{'<TabNav.Link>'}</Text>
</ExampleHeading>
<TabNav aria-label="Main">
  <TabNav.Link href="#home" selected>
    Home
  </TabNav.Link>
  <TabNav.Link href="#documentation">Documentation</TabNav.Link>
  <TabNav.Link href="#support">Support</TabNav.Link>
</TabNav>
```

## System props

TabNav and TabNav.Link components get `COMMON` system props. Read our [System Props](/components/docs/system-props) doc page for a full list of available props.

## Component props

### TabNav

| Prop name  | Type   | Description                                                    |
| :--------- | :----- | :------------------------------------------------------------- |
| aria-label | String | Used to set the `aria-label` on the top level `<nav>` element. |

### TabNav.Link

| Prop name | Type    | Description                                      |
| :-------- | :------ | :----------------------------------------------- |
| as        | String  | sets the HTML tag for the component              |
| selected  | Boolean | Used to style the link as selected or unselected |

export const meta = {displayName: 'TabNav'}
