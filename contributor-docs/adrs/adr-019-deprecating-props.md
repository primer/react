# Deprecating Props

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | 🚧     |

## Context

There are times when a prop is deprecated in favor of a more accessible API or a more flexible prop that can support a wider range of values. In these cases, we want to provide a clear path for authors to migrate from the deprecated prop to the new API.

For
example:

```tsx
// old API
<ActionList>
  <ActionList.Group title="Group title">
    <ActionList.Item>Item 1</ActionList.Item>
    <ActionList.Item>Item 2</ActionList.Item>
  </ActionList.Group>
</ActionList>
```

```tsx
// new API
<ActionList>
  <ActionList.Group>
    <ActionList.GroupHeading as="h2">Group title</ActionList.GroupHeading>
    <ActionList.Item>Item 1</ActionList.Item>
    <ActionList.Item>Item 2</ActionList.Item>
  </ActionList.Group>
</ActionList>
```

## Decision

1. Add the `@deprecated` TS notice, if possible, to the corresponding type
2. Mark the prop as deprecated in the component's documentation
3. Add an eslint rule or extend an existing one to warn against using the deprecated prop
4. Update the `primer/react` eslint plugin at github/github and evaluate the impact of the deprecation
5. If the change is minimal and safe, proceed with the auto fix of the eslint rule and create PRs by codeowners
6. If the change is large, add an eslint disable to each instance of the deprecated prop at github/github and make sure they show up on the accessibility score cards so that we can track the usage of the deprecated prop
7. Enable the eslint rule afterwards in github/github so that the new instances of the deprecated prop are heavily discouraged

### Other options considered

1. Add a warning/error to the console when the deprecated prop is used (Introduces friction to product teams and is not as effective as the linting rule)
