# Component adoption

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | ✅     |

## Context

When there is a new component added to the library and it is ready for use, we need a clear path for encouraging the adoption of the new component and discourage the use of the old component, if exists.

For example:

```jsx
// Tooltip v1 is discouraged
import {Tooltip} from '@primer/react'

render(
  <Tooltip aria-label="This cannot be undone">
    <Button>Delete</Button>
  </Tooltip>,
)
```

```jsx
// Tooltip v2 is the recommended component
import {Tooltip} from '@primer/react/next'

render(
  <Tooltip text="This cannot be undone">
    <Button>Delete</Button>
  </Tooltip>,
)
```

## Decision

1. Announcement on Primer changelog.
2. Reach out to teams directly, specifically strategical services.
3. If the component is a replacement of an old component, update the old component's documentation to recommend the new component.
4. Leverage eslint rules to discourage the use of the old component. If the component is a replacement of an component that is not accessible, we should consider adding the eslint rule to the Accessibility scorecards. I.e. the ["use-next-tooltip](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-use-next-tooltip.md)" rule for the new Tooltip. Before adding a new rule to the Accessibility scorecards, the folloing steps should be taken to communicate the rule widely with the teams:
   4.1. Write the rule details and why it is needed in a discussion post to be shared with the teams.
   4.2. Get the discussion post reviewed by Accessibility team.
   4.3. Share the discussion post with the "eng-roundup" label.

<!-- Provide information about the decision made by this ADR -->

### Impact

This ADR doesn't have any impact on the existing components. It only provides a path for encouraging the adoption of a new component.

<!-- Describe the impact of the decision -->
