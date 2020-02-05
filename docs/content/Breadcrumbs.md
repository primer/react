---
title: Breadcrumbs
---

Use the Breadcrumb component for navigation ....

To use Breadcrumb with [react-router](https://github.com/ReactTraining/react-router) or
[react-router-dom](https://www.npmjs.com/package/react-router-dom), pass
`as={NavLink}` and omit the `selected` prop.
This ensures that the NavLink gets `activeClassName='selected'`

**Attention:** Make sure to properly label your `Breadcrumb` with an `aria-label` to provide context about the type of navigation contained in `Breadcrumb`.

## Default example

```jsx live
<Breadcrumb aria-label="Breadcrumbs">
  <Breadcrumb.Item href="#business">Business</Breadcrumb.Item>
  <Breadcrumb.Item href="#customers">Customers</Breadcrumb.Item>
  <Breadcrumb.Item href="#mailchimp" selected>
    MailChimp
  </Breadcrumb.Item>
</Breadcrumb>
```

## System props

Breadcrumb and Breadcrumb.Item components get `COMMON` system props. Read our [System Props](/system-props) doc page for a full list of available props.

## Component props

### Breadcrumb

| Prop name  | Type   | Description                                                    |
| :--------- | :----- | :------------------------------------------------------------- |
| aria-label | String | Used to set the `aria-label` on the top level `<nav>` element. |

### Breadcrumb.Item

| Prop name | Type    | Description                                      |
| :-------- | :------ | :----------------------------------------------- |
| as        | String  | sets the HTML tag for the component              |
| href      | String  | URL to be used for the Link                      |
| selected  | Boolean | Used to style the link as selected or unselected |
