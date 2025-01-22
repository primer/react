# Live Regions

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | 🚧     |

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
achieve these scenarios. They may also add `aria-live="assertive"` or `aria-live="polite"` with an an `aria-atomic="true"` to an element explicitly.
However, both of these approaches do not announce consistently across screen
readers. This could be due to live regions being injected dynamically into the document (this includes loading content into the document via React), dynamically changing the visibility of a live region, or some other technique causing an announcement to not be announced.

For more information about the ways in which live regions may not work as
expected, visit: [Why are my live regions not working?](https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/)

### Links & Resources for ARIA Live regions

- https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-1/
- https://www.scottohara.me/blog/2022/02/05/are-we-live.html

## Decision

In order to have a common interop point for live region announcements, Primer React will
make use of a `live-region` custom element from `@primer/live-region-element`.
This package will be included and published from the `primer/react` repo.

The custom element exposes a way to make announcements that can be used
across frameworks. This makes it useful not only for Primer but GitHub as a
whole. The `@primer/live-region-element` exports two helpers to use for making
announcements: `announce()` and `announceFromElement`. Both helpers can be used
when working in Primer and by teams at GitHub.

In addition, `@primer/react` will leverage and export the following helpers for
use within Primer React and GitHub:

- The `AriaStatus` component to correspond with `role="status"`
- The `AriaAlert` component to correspond with `role="alert"`

Within `@primer/react`, we should lint against usage of `aria-live` and the
corresponding roles (if possible) and suggest using these alternatives instead.

> [!NOTE]
> Both `AriaStatus` and `AriaAlert` will trigger an announcement when the component is
> rendered. As a result, they should only be used for dynamically rendered
> content. Otherwise, they will trigger announcements on page load. In cases
> where they should always be present, then the first message passed to the
> component should be an empty string. Changes to the content of the component
> will trigger subsequent announcements.

### Impact

This decision will impact existing usage of `aria-live`, `role="status"`, and
`role="alert"` for the components listed below. These components will need to be
updated to use the new approach, using one of the following approaches:

- Use `announce()` or `announceFromElement()`
- Use `AriaStatus` or `AriaAlert`

In addition, we should make sure that `<live-region>` is successfully included
in GitHub.

#### Instances of `aria-live="polite"`

- InputValidation
- SelectPanel
- TreeView

#### Instances of `aria-live="assertive"`

- InlineAutocomplete

### Instances of `role="status"`

- LiveRegion
- TreeView
- ActionList examples
- Spinner

### Instances of `role="alert"`

None

### Instances of `LiveRegion`

- DataTable

## Examples

### Announce when content is shown

```tsx
import React from 'react'
import {AriaStatus} from '@primer/react'

function ExampleComponent() {
  const [loading, setLoading] = React.useState(true)
  if (loading) {
    return <AriaStatus>Example loading message</AriaStatus>
  }
  return <Page />
}
```

### Announce on content change

```tsx
import {AriaStatus} from '@primer/react'
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
      <AriaStatus>Count {count}</AriaStatus>
    </button>
  )
}
```

### Announce programmatically

```tsx
import {announce} from '@primer/live-region-element'
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

### Use existing live region

The `announce()` and `announceFromElement()` helpers both accept a `from`
argument that allow you to provide a reference from which these helpers should
find an existing live region. This can be useful in contexts like a `dialog`
where a live region must live in the dialog in order for announcements to occur.

```tsx
import {announce} from '@primer/live-region-element'
import React from 'react'

function ExampleComponent() {
  const ref = React.useRef<React.ElementRef<'dialog'>>(null)
  return (
    <dialog ref={ref}>
      <h1>Example content</h1>
      <button
        type="button"
        onClick={() => {
          announce('Announcement', {
            from: ref.current,
          })
        }}
      >
        Example button
      </button>
    </dialog>
  )
}
```

The `AriaStatus` and `AriaAlert` components automatically lookup the closest `dialog` so
there is no need to provide a `from` argument.

```tsx
import React from 'react'
import {AriaStatus} from '@primer/react'

function ExampleComponent() {
  const [loading, setLoading] = React.useState(true)
  return (
    <dialog ref={ref}>
      <h1>Example content</h1>
      {loading ? <AriaStatus>Loading example dialog</AriaStatus> : <DialogContent />}
    </dialog>
  )
}
```

## Unresolved questions

- What should happen if a component makes excessive announcements due to a
  component that it renders? Is it possible to "group" announcements?
- For programmatic announcements, how do we interop with existing proposals in
  this space for `ariaNotify`?
- When should something use an ARIA Live region role component versus just using
  the helper functions?
