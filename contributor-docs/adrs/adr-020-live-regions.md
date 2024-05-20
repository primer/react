# ADR 020: Live Regions

## Status

| Stage    | Status      |
| -------- | ----------- |
| Approved | <!-- ✅ --> |
| Adopted  | <!-- 🚧 --> |

## Context

There are several components in Primer React that make use of live regions.
However, the library does not have a central pattern for making accessible live
region announcements. This ADR documents the decision to use a central pattern
for live region announcements that can be used across Primer and GitHub.

ARIA Live regions fall into several buckets that we may want to use as component
authors:

- [ARIA live region roles](https://www.w3.org/TR/wai-aria-1.2/#live_region_roles), such as `alert`, `log`, or `status`
- [The `aria-live` attribute](https://www.w3.org/TR/wai-aria-1.2/#aria-live) to turn an element into a live region

In components, we see the following scenarios in Primer React:

- Announce the contents of an element when it is rendered or on page load, like when a spinner is displayed or a form is submitted
- Announce the changes to the content of an element, like when the count inside of a
  button is incremented
- Announce a message programmatically, such as the number of results for a query

Currently, contributors may reach for roles such as `alert` or `status` to
achieve these scenarios. They may also add `aria-live` to an element explicitly.
However, both of these approaches do not announce consistently across screen
readers.

### Links & Resources for ARIA Live regions

- https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-1/
- https://www.scottohara.me/blog/2022/02/05/are-we-live.html

## Decision

In order to have a common interop point for live region announcents, Primer React will
make use of a `live-region` custom element from `@primer/live-region-element`.
This package will be included and published from the `primer/react` repo.

The custom element exposes a way to make announcements that can be used
across frameworks. This makes it useful not only for Primer but GitHub as a
whole.

In addition, `@primer/react` will leverage and export the following helpers for
use within Primer React and GitHub:

- `announce()` and `announceFromElement()`, programmatic helpers for making
  announcements
- The `Status` component to correspond with `role="status"`
- The `Alert` component to correspond with `role="alert"`

Within `@primer/react`, we should lint against usage of `aria-live` and the
corresponding roles (if possible) and suggest using these alternatives instead.

### Impact

This decision will impact existing usage of `aria-live`, `role="status"`, and
`role="alert"` for the components listed below. These components will need to be
updated to use the new approach, using one of the following approaches:

- Use `announce()` or `announceFromElement()`
- Use `Status` or `Alert`

#### Instances of `aria-live`

- InlineAutocomplete
- InputValidation
- SelectPanel
- TreeView

### Instances of `role="status"`

- LiveRegion
- TreeView
- ActionList examples

### Instances of `role="alert"`

None

### Instances of `LiveRegion`

- DataTable

## Examples

### Announce on page load

```tsx
import {Status} from '@primer/react'

function ExampleComponent() {
  return <Status>Example page load message</Status>
}
```

### Announce on content change

```tsx
import {Status} from '@primer/react'
import {useState} from 'react'

function ExampleComponent() {
  const [count, setCount] = useState(0)
  return (
    <button
      type="button"
      onClick={() => {
        setCount(count + 1)
      }}
    >
      <Status>Count {count}</Status>
    </button>
  )
}
```

### Announce programmatically

```tsx
import {announce} from '@primer/react'
import {useState} from 'react'

function ExampleComponent() {
  const [results, setResults] = useState(data)

  return (
    <>
      <input
        type="text"
        onChange={event => {
          const filteredResults = data.filter(item => {
            /* ... */
          })
          setResults(filteredResults)
          announce(`${filteredResults.length} results available`)
        }}
      />
      {/* ... */}
    </>
  )
}
```

## Alternatives

## Unresolved questions

- What should happen if a component makes excessive announcements due to a
  component that it renders? Is it possible to "group" announcements?
- For programmatic announcements, how do we interop with existing proposals in
  this space for `ariaNotify`?
- When should something use an ARIA Live region role component versus just using
  the helper functions?

## FAQ
