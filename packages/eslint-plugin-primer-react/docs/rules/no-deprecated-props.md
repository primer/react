## Rule Details

This rule enforces to use the recommended API (`ActionList.GroupHeading`) component over the deprecated prop (`title` prop on `ActionList.Group`) for ActionList component.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/no-deprecated-props: "error" */
import {ActionList} from '@primer/react'

const App = () => (
  <ActionList>
    <ActionList.Group title="Group heading">
      <ActionList.Item>Item 1</ActionList.Item>
    </ActionList.Group>
  </ActionList>
)
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/no-deprecated-props: "error" */
import {ActionList} from '@primer/react'

const App = () => (
  <ActionList>
    <ActionList.Group>
      <ActionList.GroupHeading as="h2">Group heading</ActionList.GroupHeading>
      <ActionList.Item>Item 1</ActionList.Item>
    </ActionList.Group>
  </ActionList>
)
```

```jsx
/* eslint primer-react/no-deprecated-props: "error" */
import {ActionList} from '@primer/react'

const App = () => (
  <ActionList role="lisbox">
    <ActionList.Group>
      <ActionList.GroupHeading>Group heading</ActionList.GroupHeading>
      <ActionList.Item>Item 1</ActionList.Item>
    </ActionList.Group>
  </ActionList>
)
```
