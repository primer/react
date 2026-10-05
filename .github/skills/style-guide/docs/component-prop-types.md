# Component Prop Types

Use these conventions when designing or reviewing prop types for Primer React components.

## Prefer accepting React elements for slot-based props

When designing props that fill a content slot, such as `leadingVisual`,
`trailingVisual`, or `icon`, prefer accepting React elements rather than component
types or functions that return elements. Render the supplied element directly.
Use `React.ReactElement` for element-only slots, or `React.ReactNode` when the slot
also supports other renderable content, such as text.

This lets consumers configure the element through its own props without wrapping
it in an inline component. It also allows Server Components to pass JSX through
these props to Client Components, whereas component functions cannot be passed
across that boundary. See [#8450](https://github.com/primer/react/pull/8450) for the
`IconButton` example that motivated this guidance.

<table>
<thead><tr><th>Unpreferred</th><th>Preferred</th></tr></thead>
<tbody>
<tr><td>

```tsx
type Props = {
  leadingVisual?: React.ElementType
  trailingVisual?: React.ElementType
}

function Usage() {
  return <Example leadingVisual={SearchIcon} trailingVisual={() => <ChevronDownIcon size={16} />} />
}
```

</td><td>

```tsx
type Props = {
  leadingVisual?: React.ReactElement
  trailingVisual?: React.ReactElement
}

function Usage() {
  return <Example leadingVisual={<SearchIcon />} trailingVisual={<ChevronDownIcon size={16} />} />
}
```

</td></tr>
</tbody></table>

Reserve render props for cases where the consumer needs state or other values
from the component to determine what to render. When extending an existing
component-type slot API to accept elements, preserve the existing form for
backwards compatibility and prefer the element form in documentation and stories.
