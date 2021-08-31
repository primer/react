---
title: Breadcrumbs
status: Alpha
source: https://github.com/primer/react/blob/main/src/Breadcrumb.tsx
---

Breadcrumbs are used to show taxonomical context on pages that are many levels deep in a site’s hierarchy. Breadcrumbs show and link to parent, grandparent, and sometimes great-grandparent pages. Breadcrumbs are most appropriate on pages that:

- Are many levels deep on a site
- Do not have a section-level navigation
- May need the ability to quickly go back to the previous (parent) page

To use Breadcrumb with [react-router](https://github.com/ReactTraining/react-router) or
[react-router-dom](https://www.npmjs.com/package/react-router-dom), pass
`as={NavLink}` and omit the `selected` prop.
This ensures that the NavLink gets `activeClassName='selected'`

## Default example

```jsx live
<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/about">About</Breadcrumb.Item>
  <Breadcrumb.Item href="/about/team" selected>
    Team
  </Breadcrumb.Item>
</Breadcrumb>
```

## System props

<Note variant="warning">

System props are deprecated in all components except [Box](/Box). Please use the [`sx` prop](/overriding-styles) instead.

</Note>

Breadcrumb and Breadcrumb.Item components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

### Breadcrumb

The `Breadcrumb` component does not receive any additional props besides `COMMON` system props.

### Breadcrumb.Item

| Prop name | Type    | Default | Description                                      |
| :-------- | :------ | :-----: | :----------------------------------------------- |
| as        | String  |   `a`   | Sets the HTML tag for the component              |
| href      | String  |         | URL to be used for the Link                      |
| selected  | Boolean |  false  | Used to style the link as selected or unselected |
