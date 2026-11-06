---
name: live-regions
description: 'Use when adding, modifying, reviewing, or testing screen reader announcements, including ariaNotify, AriaStatus, AriaAlert, and useAnnounce. Do not use for static accessible names or descriptions, or changes unrelated to dynamic announcements.'
---

# Live Regions

## Choose the announcement API

- Default to `ariaNotify` for imperative announcements in response to user actions.
- If code would otherwise use `role="status"`, use the internal `AriaStatus`
  component instead.
- If code would otherwise use `role="alert"`, use the internal `AriaAlert`
  component instead.
- Use `useAnnounce` to debounce calls to `ariaNotify`. Do not implement another
  announcement timer or queue at the call site.
- Do not use `@primer/live-region-element` or query `<live-region>` elements.

The implementations live in `packages/react/src/live-region/`. Within Primer
React, import the components and hook from the relative `live-region` module.

## Announce in response to an action, not rendering

By default, announcements must not happen on initial page render. Call
`ariaNotify` from an event handler or in response to a user action, including
completion of asynchronous work initiated by that action.

Do not announce merely because a component renders, an effect runs, or props
change. An effect observing the completion of a user-initiated operation can be
appropriate, but mounting alone is not a reason to announce.

If a component appears in response to an action, its appearance can justify an
announcement. Either make the imperative announcement as part of that response
or use `announceOnShow` on `AriaStatus` or `AriaAlert`. Do not announce the same
message through both paths.

For content present on initial page render, explicitly use
`announceOnShow={false}`. `AriaStatus` currently defaults to `false`, but
`AriaAlert` currently defaults to `true`; do not rely on that default when the
alert is present on initial render.

## Import the polyfill

Code calling `ariaNotify`, directly or through `useAnnounce`, must import
`packages/react/src/polyfills/ariaNotify`. For a typical sibling component:

```tsx
import '../polyfills/ariaNotify'
```

Adjust the relative path for the file. The shared module imports
`@github/arianotify-polyfill` and provides the TypeScript declarations. Do not
redeclare the API or assume native browser support.

Use `document.ariaNotify(message, {priority: 'normal'})` for an ordinary status
announcement. Use `priority: 'high'` only for an urgent announcement that
corresponds to assertive behavior. `ariaNotify` takes a string, not a React node.

When an announcement belongs to a particular element or modal, use the relevant
element's `ariaNotify` so the announcement has the appropriate scope.

## Debounce with `useAnnounce`

For results of a user-initiated search:

```tsx
import '../polyfills/ariaNotify'
import {useAnnounce} from '../live-region'

function SearchButton({
  onSearch,
}: {
  onSearch: () => Promise<number>
}) {
  const {announce} = useAnnounce()

  return (
    <button
      type="button"
      onClick={async () => {
        const resultCount = await onSearch()
        announce(`${resultCount} results available`, {
          delayMs: 250,
        })
      }}
    >
      Search
    </button>
  )
}
```

Each hook instance owns its pending announcement. A subsequent call replaces
that instance's pending message, and unmounting cancels it. High-priority
announcements are immediate rather than debounced.

The hook also returns `cancel()`. Call it when the pending message becomes stale,
such as when loading finishes, matching results return, or a panel closes.
Cancellation only affects work not yet handed to the browser; it cannot retract
an announcement already sent through `ariaNotify`.

Keep ownership local. Each component cancels its own stale announcements using
the state it already receives. Do not recreate a global queue or share a
controller through context just to reproduce the old live-region clearing
behavior.

## Test announcements at the API boundary

Follow the [component-testing skill](../component-testing/SKILL.md).

- Spy on `Element.prototype.ariaNotify` for `Announce`, `AriaStatus`, and
  `AriaAlert`; spy on `document.ariaNotify` for `useAnnounce`.
- Give the spy a no-op implementation and restore it after each test. A spy
  without an implementation still calls the browser API or polyfill.
- Assert the message and priority, not live-region DOM or polyfill internals.
  There is no `getMessage` equivalent to inspect.
- Use polling for eventual calls with real timers. For debounce behavior, use
  fake timers advanced inside RTL's `act` and assert before and at the deadline.
- Flush pending work before negative assertions so they do not pass merely
  because the announcement has not fired yet.
- Cover relevant cancellation and StrictMode behavior without expecting duplicate
  mount announcements.
