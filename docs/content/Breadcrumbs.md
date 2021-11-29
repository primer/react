---
title: Breadcrumbs
status: Alpha
description: Use breadcrumbs to show navigational context on pages that are many levels deep in a site’s hierarchy. Breadcrumbs show and link to parent, grandparent, and sometimes great-grandparent pages.
source: https://github.com/primer/react/blob/main/src/Breadcrumbs.tsx
---

Breadcrumbs are used to show taxonomical context on pages that are many levels deep in a site’s hierarchy. Breadcrumbs show and link to parent, grandparent, and sometimes great-grandparent pages. Breadcrumbs are most appropriate on pages that:

- Are many levels deep on a site
- Do not have a section-level navigation
- May need the ability to quickly go back to the previous (parent) page

To use Breadcrumbs with [react-router](https://github.com/ReactTraining/react-router) or
[react-router-dom](https://www.npmjs.com/package/react-router-dom), pass
`as={NavLink}` and omit the `selected` prop.
This ensures that the NavLink gets `activeClassName='selected'`

## Default example

```jsx live
<Breadcrumbs>
  <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
  <Breadcrumbs.Item href="/about">About</Breadcrumbs.Item>
  <Breadcrumbs.Item href="/about/team" selected>
    Team
  </Breadcrumbs.Item>
</Breadcrumbs>
```

## Props

### Breadcrumbs

| Prop name | Type              | Default | Description                          |
| :-------- | :---------------- | :-----: | :----------------------------------- |
| children  | ReactNode         |         | The `Breadcrumbs.Item`s              |
| className | string            |         |                                      |
| sx        | SystemStyleObject |  `{}`   | Style to be applied to the component |

### Breadcrumbs.Item

| Prop name | Type              | Default | Description                                      |
| :-------- | :---------------- | :-----: | :----------------------------------------------- |
| as        | string            |   `a`   | Sets the HTML tag for the component              |
| href      | string            |         | URL to be used for the Link                      |
| selected  | boolean           | `false` | Used to style the link as selected or unselected |
| sx        | SystemStyleObject |  `{}`   | Style to be applied to the component             |

## Component status

<ComponentChecklist
  items={{
    propsDocumented: true,
    noUnnecessaryDeps: true,
    adaptsToThemes: true,
    adaptsToScreenSizes: false,
    fullTestCoverage: false,
    usedInProduction: true,
    usageExamplesDocumented: true,
    designReviewed: false,
    a11yReviewed: false,
    stableApi: false,
    addressedApiFeedback: false,
    hasDesignGuidelines: false,
    hasFigmaComponent: false
  }}
/>
