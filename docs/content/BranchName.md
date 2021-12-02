---
title: BranchName
status: Alpha
source: https://github.com/primer/react/blob/main/src/BranchName.tsx
---

BranchName is a label-type component rendered as an `<a>` tag by default with monospace font.

```jsx live
<BranchName>a_new_feature_branch</BranchName>
```

## Props

| Name | Type              | Default | Description                          |
| :--- | :---------------- | :-----: | :----------------------------------- |
| as   | String            |  `<a>`  | sets the HTML tag for the component  |
| href | String            |         | a URL to link the component to       |
| sx   | SystemStyleObject |   {}    | Style to be applied to the component |

## Component status

<ComponentChecklist
items={{
    propsDocumented: true,
    noUnnecessaryDeps: true,
    adaptsToThemes: true,
    adaptsToScreenSizes: true,
    fullTestCoverage: true,
    usedInProduction: false,
    usageExamplesDocumented: true,
    designReviewed: false,
    a11yReviewed: false,
    stableApi: false,
    addressedApiFeedback: false,
    hasDesignGuidelines: false,
    hasFigmaComponent: false
  }}
/>
