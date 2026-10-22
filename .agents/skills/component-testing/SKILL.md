---
name: component-testing
description: 'Use when authoring, modifying, reviewing, or debugging Primer React component and hook tests in Vitest browser mode. Do not use for Node/SSR tests, standalone Playwright visual or accessibility tests, or component implementation without test changes.'
---

# Component Testing

Use these conventions for Primer React component and hook tests in Vitest browser
mode. Test observable behavior and the component's public contract rather than
its implementation details.

Read [the testing guide](../../../contributor-docs/testing.md) for strategy,
environment setup, and commands. Keep Node/SSR tests and the separate Playwright
visual and accessibility suites on the APIs available in their own environments.

## Start with RTL rendering and browser interactions

Use React Testing Library (RTL) for `render`, `rerender`, `unmount`, `renderHook`,
cleanup, and manual `act` boundaries. Use `page` and `userEvent` from
`vitest/browser` for browser queries and interactions.

```tsx
import {render} from '@testing-library/react'
import {expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {Button} from '@primer/react'

it('calls onClick', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Submit</Button>)

  const button = page.getByRole('button', {name: 'Submit', exact: true})
  await expect.element(button).toBeVisible()
  await userEvent.click(button)
  expect(onClick).toHaveBeenCalledTimes(1)
})
```

Await browser interactions directly, without wrapping them in `act`.

## Choose assertions based on when the result should be available

| Contract                                  | Assertion                                               |
| :---------------------------------------- | :------------------------------------------------------ |
| Eventual DOM state                        | `await expect.element(locator).toHaveAttribute(...)`    |
| Eventual computed value                   | `await expect.poll(() => readCurrentValue()).toBe(...)` |
| Immediate result or synchronous guarantee | `expect(value).toBe(...)`                               |

Prefer assertions on observable conditions over fixed sleeps. This lets the test
continue as soon as the expected state is available.

```tsx
// Avoid
await new Promise(resolve => setTimeout(resolve, 100))
expect(document.getElementById(announcementId)?.textContent).toBe('Loading')

// Prefer
await expect.poll(() => document.getElementById(announcementId)?.textContent).toBe('Loading')
```

Read the current value inside the polling callback so each attempt checks the
latest state.

Use ordinary `expect` when the result must be available immediately, such as
after synchronous focus redirection, event cancellation, or explicit timer
advancement. Retrying these assertions can hide a regression.

When testing timed behavior, keep fake timers and advance them explicitly inside
RTL's `act`. Assert the state at the required boundaries, including before the
deadline when relevant, so the test verifies when the change occurs rather than
only that it eventually occurs.

## Use RTL's act for manual React updates

Import `act` from `@testing-library/react`, not `react`. Use it for manual updates
that can trigger React work, including programmatic focus, timer advancement,
hook updates, and hydration.

```tsx
import {act} from '@testing-library/react'

const button = page.getByRole('button', {name: 'Submit', exact: true})
act(() => {
  button.element().focus()
})
expect(button.element()).toHaveFocus()
```

RTL scopes the React act environment to the operation. When an act warning
occurs, check that manual updates use RTL's `act` and browser interactions are
awaited directly. Keep that scoped behavior rather than changing
`IS_REACT_ACT_ENVIRONMENT` globally or suppressing the warning.

## Use locators for current DOM state

Prefer role and accessible-name queries. A locator resolves again each time it
is used, so it must stay unambiguous after interactions. For example, expanding a
tree can make a partial name match both a parent and its descendants. Use an
exact accessible name or scope the query to the intended region.

Prefer an exact accessible name or a scoped query over `.first()`. This keeps the
test tied to the intended element when the DOM changes. Use positional selection
when position is part of the behavior being tested.

Use `.element()` when the assertion needs a DOM node, such as for computed
styles, structural relationships, existing snapshots, or node identity. Capture
the node before removal when checking that a particular node was detached:

```tsx
const {rerender} = render(<Button>Submit</Button>)
const originalButton = page.getByRole('button', {name: 'Submit', exact: true}).element()

rerender(<></>)
expect(originalButton).not.toBeInTheDocument()
```

## Assert presence and visibility separately

DOM presence and visibility describe different behavior. Assert removal when a node
must be removed, and visibility when it may remain mounted but hidden.
Role queries normally exclude inaccessible elements, so a missing role match
alone doesn't prove that a hidden node was removed.

For accessibility relationships, check the actual ID reference and the referenced
node's content. A generic text match can select the wrong node, such as a
spinner's "Loading" text instead of the live-region announcement. Precise DOM
access is appropriate when testing that relationship.

## Keep intentional low-level event tests

Use browser interactions for user behavior, but keep synthetic events when
testing disabled-click suppression, event cancellation, or a specific event
payload. Browser actions wait for actionable elements and don't expose the
boolean result of `dispatchEvent`.

If a browser action unexpectedly fails because an element cannot be interacted
with, investigate its visibility, enabled state, and other interaction
requirements before choosing a synthetic event.
