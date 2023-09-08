# ADR 011: Snapshot tests

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | 🚧     |

## Context

[Snapshot testing](https://jestjs.io/docs/snapshot-testing) is a strategy that allows a developer to "snapshot" a given value within a test suite. This value could be a primitive within JavaScript, an Array, an object, or the resulting HTML of rendering a component in React. The snapshot of the value is stored within the repo and is then compared against future test runs.

When a change is detected to a snapshot, the test will fail with a diff between the currently stored snapshot and the new snapshot. Within the space of React components, this may happen when a class name changes or the markup of a component changes. Is is then up to the developer to decide if the change is intentional and whether or not to accept this new snapshot as the baseline for future test runs.

A common practice is to snapshot a React component which will capture the HTML output of rendering a component. For example:

```jsx
import renderer from 'react-test-renderer'
import Link from '../Link'

it('renders correctly', () => {
  const tree = renderer.create(<Link page="http://www.facebook.com">Facebook</Link>).toJSON()
  expect(tree).toMatchSnapshot()
})
```

```js
exports[`renders correctly 1`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
`
```

[Source](https://jestjs.io/docs/snapshot-testing#snapshot-testing-with-jest)

As the number of snapshots within a project grows, there are a couple of challenges that emerge:

- Components with wide or deep trees emit large snapshots
- Debugging what change lead to a broken snapshot can be difficult
- It is unclear what the intent may be of a snapshot test when something does fail, in other words it does not always answer the question: what is this testing?

## Decision

- Avoid using "catch-all" snapshot tests for React components
- Snapshots may be used for static objects which have a clear signal as to what to do if they are modified (such as the exports of a package)

<table>
<thead><tr><th>Unpreferred</th><th>Preferred</th></tr></thead>
<tbody>
<tr><td>

```tsx
it('renders correctly', () => {
  const tree = renderer.create(<Link page="http://www.github.com">GitHub</Link>).toJSON()
  expect(tree).toMatchSnapshot()
})
```

</td><td>

```tsx
it('renders an element with role="link"', () => {
  render(<Link page="http://www.github.com">GitHub</Link>)
  expect(screen.getByRole('link', {name: 'GitHub'})).toBeInTheDocument()
})
```

</td></tr>
</tbody></table>

### Impact

This decision will impact our test suite in two ways:

- Tests with calls to `toMatchSnapshot()` may need to be removed if the snapshot
  test is capturing the render tree
- The `behavesAsComponent` helper, which uses `toMatchSnapshot` under-the-hood,
  will need to be updated to no longer include a snapshot test
