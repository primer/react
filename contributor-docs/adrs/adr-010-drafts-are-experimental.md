# ADR 010: Merge drafts status into experimental

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | 🚧     |

## Context

`Drafts` were introduced in [ADR-006](./adrs/adr-006-drafts.md) as a way of creating components outside of the root bundle of `@primer/react`. This helps us create, test and maintain multiple versions of the same component in parallel.

Example:

```js
// default version of component exported from root of package
import {UnderlineNav} from '@primer/react'

// new version of component exported from /drafts
import {UnderlineNav} from '@primer/react/drafts'
```

We have also used this method for components that are still a work in progress and we don't want developers to start using them in production without collaborating with us first.

Example:

```js
// this component only exists in drafts and not in the roof of the package
import {TreeView} from '@primer/react/drafts'
```

### Why do we not reuse `experimental` status?

The reason we do not use `experimental` label for these components is because `drafts` conveys a different message than maturity on the [component lifecycle](https://primer.style/contribute/component-lifecycle).

A `draft` component can be further along on the component lifecycle than `experimental`, but still not be the recommended version of the component until the next major release (to plan breaking changes better). For example, at the time of writing, the [new UnderlineNav2 in drafts](https://primer.style/react/drafts/UnderlineNav2) has been reviewed for accessibility and is almost at `Beta` maturity. We can call it a `draft` component with `beta` maturity.

### Problem

This is very confusing. While the above separation is useful for maintainers of primer, it is less useful to consumers.

1. Consumers of primer are often confused to not find `draft` maturity on the component lifecycle.
2. It is similar to `experimental` label in the most important characteristic to consumers - The component is not ready for production usage.

### Decision

We should drop the `draft` label and use `experimental` instead.

While not completely accurate (UnderlineNav2 is much more polished than `experimental` maturity), the lack of confusion makes it a good trade-off.

Fine-grained information about component maturity, useful for maintainers, is also communicated by the [status checklist in the component documentation](https://primer.style/react/drafts/UnderlineNav2#status).

### Side effects

We should create a new parallel import path for `@primer/react/experimental`.

```diff
// new version of component exported from /experimental
- import { UnderlineNav } from '@primer/react/drafts'
+ import { UnderlineNav } from '@primer/react/experimental'
```

We would need to keep `@primer/react/drafts` in the short term as well for backwards compatibility.
