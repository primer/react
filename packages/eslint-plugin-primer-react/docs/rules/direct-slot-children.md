# Enforce direct parent-child relationship of slot components (direct-slot-children)

Some Primer React components use a slots pattern under the hood to render subcomponents in specific places. For example,
the `PageLayout` component renders `PageLayout.Header` in the header area, and `PageLayout.Footer` in the footer area.
These subcomponents must be direct children of the parent component, and cannot be nested inside other components.

## Rule details

This rule enforces that slot components are direct children of their parent component.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/direct-slot-children: "error" */
import {PageLayout} from '@primer/react'

const MyHeader = () => <PageLayout.Header>Header</PageLayout.Header>

const App = () => (
  <PageLayout>
    <MyHeader />
  </PageLayout>
)
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/direct-slot-children: "error" */
import {PageLayout} from '@primer/react'

const MyHeader = () => <div>Header</div>

const App = () => (
  <PageLayout>
    <PageLayout.Header>
      <MyHeader />
    </PageLayout.Header>
  </PageLayout>
)
```

## Options

- `skipImportCheck` (default: `false`)

  By default, the `direct-slot-children` rule will only check for direct slot children in components that are imported
  from `@primer/react`. You can disable this behavior by setting `skipImportCheck` to `true`. This is used for internal
  linting in the [primer/react](https://github.com/prime/react) repository.
